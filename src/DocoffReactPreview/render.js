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
        // Remove errors from previous renders
        codeViewParentEl.querySelector('#error-root')?.remove();

        // Reuse the element and React root from the previous render so that React can update the preview in place
        // instead of remounting it, which would make the preview flicker on every change.
        let reactRootEl = codeViewParentEl.querySelector('#react-root');
        if (reactRootEl) {
          // Show the preview again in case it was hidden by an error
          reactRootEl.style.display = '';
        } else {
          // We need to declare inner element as mounting React on <body> is not allowed
          reactRootEl = document.createElement('div');
          reactRootEl.id = 'react-root';

          codeViewParentEl.appendChild(reactRootEl);

          // Each render runs in a fresh script element which is removed right away, so no variable survives until
          // the next render. The element does survive, so the React root is stored on it to be found by the next
          // render.
          reactRootEl.reactRoot = ReactDOM.createRoot(reactRootEl);
        }

        ${previewTransCode};
        reactRootEl.reactRoot.render(previewCodeGetter());
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
        // The preview from the last successful render is only hidden, not removed, so that React can update it in
        // place once the code is valid again. Removing it would remount the preview and make it flicker while typing.
        const reactRootEl = codeViewParentEl.querySelector('#react-root');
        if (reactRootEl) {
          reactRootEl.style.display = 'none';
        }

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
