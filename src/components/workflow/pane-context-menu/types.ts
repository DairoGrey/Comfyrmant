export type TreeNode<T> = {
  // @ts-expect-error Complex typing
  __id__: string;
  // @ts-expect-error Complex typing
  __root__: T[];
  [k: string]: TreeNode<T>;
};

export type Tree<T> = {
  [k: string]: TreeNode<T>;
};

export type NodeOption = {
  label: string;
  type: string;
  category: string;
};
