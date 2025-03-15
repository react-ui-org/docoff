import { transformSync } from '@swc/wasm-web';
import Prism from 'prismjs';
import { getSwcTransformOptions } from './getSwcTransformOptions';

export const render = (container, previewRawCode, baseRawCode) => {
  // Update the text overlay content
  // eslint-disable-next-line no-param-reassign
  container.shadowRoot.querySelector('[data-type=textOverlay]').innerHTML = Prism.highlight(
    previewRawCode,
    Prism.languages.jsx,
    'jsx',
  );

  // We need to be able to get a reference to the element where react is to be mounted.
  const codeViewParentElCode = `
    codeViewParentEl = document.currentScript
      .nextSibling
      .shadowRoot
      .querySelector('[data-type=preview]')
      .shadowRoot
      .querySelector('body');
  `;

  let scriptText;
  try {
    const swcTransformOptions = getSwcTransformOptions();
    const baseTransCode = transformSync(baseRawCode, swcTransformOptions).code;

    // We need to transform the preview code to be able to execute it.
    // It needs to be transformed in isolation so that in case of errors the message is clear and does not contain code
    // not written by the user.
    const previewTransformedCode = transformSync(previewRawCode, swcTransformOptions).code;

    // We need to wrap the previewRawCode in a function as SWC can prepend inline some helpers functions
    // The `previewCodeGetter` function allows us to execute the desired code
    // Helpers are inserted based on the `target` option, set it to `es5` to see them
    const previewTransCode = `const previewCodeGetter = () => ${previewTransformedCode}`;

    scriptText = `
      (() => {
        ${baseTransCode}
        ${codeViewParentElCode}
        // Remove existing element for cases that this a rerender.
        // There is no way to pass React root between rerenders since we do not want to keep global state. So the only
        // way is to always create the element and React root anew.
        codeViewParentEl.querySelector('#react-root')?.remove();

        // Remove errors from previous renders
        codeViewParentEl.querySelector('#error-root')?.remove();

        // We need to declare inner element as mounting React on <body> is not allowed
        const reactRootEl = document.createElement('div');
        reactRootEl.id = 'react-root';

        codeViewParentEl.appendChild(reactRootEl);
        reactRoot = ReactDOM.createRoot(reactRootEl);

        ${previewTransCode};
        reactRoot.render(previewCodeGetter());
      })();
    `;
  } catch (e) {
    const errorText = e

      // We need to escape backticks (`) as they are used to wrap the string
      .replaceAll('`', '\\`')

      // We need to remove ANSI escape codes (console formatting such as colors) from the error message
      // eslint-disable-next-line no-control-regex
      .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

    // The `e.message` can be multiline, so we need to use backticks (`) around `errorText`.
    scriptText = `
      ${codeViewParentElCode}
      // way is to always create the element and React root anew.
      codeViewParentEl.querySelector('#react-root')?.remove();

      // Remove errors from previous renders
      codeViewParentEl.querySelector('#error-root')?.remove();

      const errorMessageEl = document.createElement('div');
      errorMessageEl.innerText = \`${errorText}\`;
      errorMessageEl.id = 'error-root';
      codeViewParentEl.appendChild(errorMessageEl);
    `;
  }

  // First we add the script to modify the DOM
  const codeRun = document.createElement('script');
  codeRun.innerHTML = scriptText;
  container.parentNode.insertBefore(codeRun, container);

  // Then we remove the script that already run
  codeRun.remove();
};
