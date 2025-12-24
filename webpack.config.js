const dotenv = require('dotenv');
const { cleanEnv, str } = require('envalid');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const package = require('./package.json');

/**
 *
 * @param {boolean} isProduction
 * @returns {Record<string, string>}
 */
const getEnv = (isProduction) => {
  const DOTENV_SUFFIX = isProduction ? '.production' : '';

  const processEnv = {};
  dotenv.config({ path: path.resolve(__dirname, `.env${DOTENV_SUFFIX}`), processEnv, quiet: true });

  const env = cleanEnv(processEnv, {
    LOG_LEVEL: str({ default: 'full' }),
    CHANGES: str({ default: 'off' })
  });

  return env;
};

/**
 *
 * @param {Record<string, string>} env
 * @returns {Record<string, string>}
 */
const envToSafe = (env) => {
  return Object.entries(env).reduce((result, [key, value]) => {
    return { ...result, [key]: typeof value === 'string' ? value : JSON.stringify(value) };
  }, {});
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const processEnv = getEnv(isProduction);

  return {
    mode: argv.mode,
    entry: {
      app: {
        import: path.resolve(__dirname, 'src/index.tsx'),
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts'],
      },
      alias: {
        _api: path.resolve(__dirname, './src/api'),
        _components: path.resolve(__dirname, './src/components'),
        _intl: path.resolve(__dirname, './src/intl'),
        _page: path.resolve(__dirname, './src/page'),
        _shell: path.resolve(__dirname, './src/shell'),
        _state: path.resolve(__dirname, './src/state'),
        _routes: path.resolve(__dirname, './src/routes.ts'),
        _theme: path.resolve(__dirname, './src/theme.tsx'),
        _eventBus: path.resolve(__dirname, './src/eventBus.ts'),
      },
    },
    module: {
      rules: [
        {
          test: /\.([cm]?tsx?)$/,
          exclude: /node_modules/,
          use: [{
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [!isProduction && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: !isProduction,
            },
          }]
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      hot: true,
      port: 8189,
      host: '192.168.56.1',
      proxy: [
        {
          context: ['/'],
          target: 'http://192.168.56.1:8188',
        },
        {
          context: ['/ws'],
          target: 'http://192.168.56.1:8188',
          ws: true,
        }
      ],
      webSocketServer: {
        options: {
          path: '/hmr',
        },
      },
      client: {
        webSocketURL: {
          pathname: '/hmr',
        },
      },
    },
    plugins: [
      !isProduction && new ReactRefreshWebpackPlugin(),
      new webpack.EnvironmentPlugin(envToSafe(processEnv)),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.template.html'),
        filename: 'index.html',
      }),
    ].filter(Boolean),
  };
};
