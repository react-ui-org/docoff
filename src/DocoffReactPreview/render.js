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
  const viewElGetter = `
    codeViewEl = document.currentScript
      .nextSibling
      .shadowRoot
      .querySelector('[data-type=preview]')
      .shadowRoot
      .querySelector('div');
  `;

  let scriptText;
  try {
    const swcTransformOptions = getSwcTransformOptions();
    const baseTransCode = transformSync(baseRawCode, swcTransformOptions).code;

    // We need to wrap the previewRawCode in a function as SWC can prepend inline some helpers functions
    // The `previewCodeGetter` function allows us to execute the desired code
    // Helpers are inserted based on the `target` option, set it to `es5` to see them
    const previewTransCode = transformSync(`const previewCodeGetter = () => ${previewRawCode}`, swcTransformOptions).code;

    scriptText = `
      (() => {
        ${baseTransCode}
        ${viewElGetter}
        try {
          ${previewTransCode};
          ReactDOM.render(previewCodeGetter(), codeViewEl);
        } catch (e) {
          ReactDOM.unmountComponentAtNode(codeViewEl);
          codeViewEl.innerText = e.message;
        }
      })();
    `;
  } catch (e) {
    const errorText = e.message
      ? e.message.replaceAll('`', '\\`')
      : 'Unknown error';

    // The `e.message` can be multiline, so we need to use backticks (`) around `errorText`.
    scriptText = `
      ${viewElGetter}
      ReactDOM.unmountComponentAtNode(codeViewEl);
      codeViewEl.innerText = \`Compilation error: ${errorText}\`;
    `;
  }

  // First we add the script to modify the DOM
  const codeRun = document.createElement('script');
  codeRun.innerHTML = scriptText;
  container.parentNode.insertBefore(codeRun, container);

  // Then we remove the script that already run
  codeRun.remove();
};
