import {
  CODE_SYNTAX_HIGHLIGHTER_CLASSNAME,
  CODE_WRAPPER_CLASSNAME,
} from '../constants';

export const createCodeSyntaxHighlighter = () => {
  const codeSyntaxHighlighterDiv = document.createElement('div');
  const codeSyntaxHighlighterPre = document.createElement('pre');
  const codeSyntaxHighlighterCode = document.createElement('code');

  codeSyntaxHighlighterCode.dataset.type = 'textOverlay';
  codeSyntaxHighlighterCode.classList.add('language-jsx');
  codeSyntaxHighlighterPre.append(codeSyntaxHighlighterCode);
  codeSyntaxHighlighterPre.classList.add('language-jsx');
  codeSyntaxHighlighterPre.classList.add(CODE_SYNTAX_HIGHLIGHTER_CLASSNAME);
  codeSyntaxHighlighterDiv.append(codeSyntaxHighlighterPre);
  codeSyntaxHighlighterDiv.classList.add(CODE_WRAPPER_CLASSNAME);

  return codeSyntaxHighlighterDiv;
};
