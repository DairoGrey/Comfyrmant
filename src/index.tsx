import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '_shell/App';

import 'reactflow/dist/base.css';

const root = createRoot(document.body.appendChild(document.createElement('div')));

root.render(<App />);
