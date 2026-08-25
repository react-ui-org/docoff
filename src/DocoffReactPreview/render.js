import Prism from 'prismjs';
import { transform } from 'sucrase';

const TRANSFORM_OPTIONS = {
  production: true,
  transforms: ['jsx', 'typescript'],
};

const transformPreviewCode = (previewRawCode) => {
  try {
    // If multiple elements are entered we wrap the code in `React.Fragment` to prevent an error
    // If it fails to parse (e.g. the content isn't plain JSX, e.g. React.createElement(() => {…})),
    // fall back to the raw code.
    return transform(`<>${previewRawCode}</>`, TRANSFORM_OPTIONS).code;
  } catch (e) {
    // If the code entered is not JSX we must attempt rendering without `React.Fragment`
    return transform(previewRawCode, TRANSFORM_OPTIONS).code;
  }
};

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
    const baseTransCode = transform(baseRawCode, TRANSFORM_OPTIONS).code;

    // We need to transform the preview code to be able to execute it.
    // It needs to be transformed in isolation so that in case of errors the message is clear and does not contain code
    // not written by the user.
    const previewTransformedCode = transformPreviewCode(previewRawCode);

    // The `previewCodeGetter` function allows us to execute the desired code
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
    const errorText = e.message

      // We need to escape backticks (`) as they are used to wrap the string
      .replaceAll('`', '\\`')

      // We need to remove ANSI escape codes (console formatting such as colors) from the error message
      // eslint-disable-next-line no-control-regex
      .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

    // The `e.message` can be multiline, so we need to use backticks (`) around `errorText`.
    scriptText = `
      (() => {
        ${codeViewParentElCode}
        // way is to always create the element and React root anew.
        codeViewParentEl.querySelector('#react-root')?.remove();

        // Remove errors from previous renders
        codeViewParentEl.querySelector('#error-root')?.remove();

        const errorMessageEl = document.createElement('div');
        errorMessageEl.innerText = \`${errorText}\`;
        errorMessageEl.id = 'error-root';
        codeViewParentEl.appendChild(errorMessageEl);
      })();
    `;
  }

  // First we add the script to modify the DOM
  const codeRun = document.createElement('script');
  codeRun.innerHTML = scriptText;
  container.parentNode.insertBefore(codeRun, container);

  // Then we remove the script that already run
  codeRun.remove();
};
