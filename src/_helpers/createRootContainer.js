import { ROOT_CLASSNAME } from '../constants';
import { createCodeSyntaxHighlighter } from './createCodeSyntaxHighlighter';

export const createRootContainer = () => {
  const codeSyntaxHighlighter = createCodeSyntaxHighlighter();
  const root = document.createElement('div');

  root.classList.add(ROOT_CLASSNAME);
  root.appendChild(codeSyntaxHighlighter);

  return root;
};
