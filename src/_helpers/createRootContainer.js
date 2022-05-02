import { ROOT_CLASSNAME } from '../constants';

export const createRootContainer = () => {
  const root = document.createElement('div');
  root.classList.add(ROOT_CLASSNAME);

  return root;
};
