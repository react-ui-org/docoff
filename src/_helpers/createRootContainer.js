import { ROOT_CLASSNAME } from '../constants';

export const createRootContainer = () => {
  const container = document.createElement('div');
  container.classList.add(ROOT_CLASSNAME);
  container.attachShadow({ mode: 'open' });

  // Add Prism CSS
  const prismCss = document.createElement('link');
  prismCss.rel = 'stylesheet';
  prismCss.type = 'text/css';
  prismCss.href = window.getComputedStyle(document.body).getPropertyValue('--docoff-code-prism-css');
  container.shadowRoot.appendChild(prismCss);

  // Add Component styling
  const styles = document.createTextNode(`
    :host {
      all: initial;
      display: block;
    }

    .docoff-Code {
      position: relative;
      font-family: var(--docoff-code-font-family);
      font-size: var(--docoff-code-font-size);
      line-height: var(--docoff-code-line-height);
      color: lightblue;
    }

    .docoff-Code__editor {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 1em;
      border: none;
      background-color: transparent;
      font: inherit;
      color: inherit;
      resize: none;
      -webkit-text-fill-color: transparent;
      white-space: pre;
    }

    .docoff-Code__editor:focus {
      outline: none;
    }

    [class*="language-"].docoff-Code__syntaxHighlighter {
      position: relative;
      z-index: 1;
      margin-block: 0;
      border: none;
      border-radius: var(--docoff-preview-border-radius);
      font: inherit;
      pointer-events: none;
      overflow: hidden;
    }
  `);
  const style = document.createElement('style');
  style.appendChild(styles);
  container.shadowRoot.appendChild(style);

  return container;
};
