import Prism from 'prismjs';

// Babel is provided by @babel/standalone loaded via CDN
// eslint-disable-next-line no-undef
const transformCode = (rawCode) => Babel.transform(rawCode, { presets: ['react'] })
  .code
  // `previewTransCode` includes ';' at the end, we let JS strip it
  .slice(0, -1);

export const render = (container, previewRawCode, baseRawCode) => {
  // Update the text overlay content
  // eslint-disable-next-line no-param-reassign
  container.querySelector('[data-type=textOverlay]').innerHTML = Prism.highlight(
    previewRawCode,
    Prism.languages.jsx,
    'jsx',
  );

  const viewElGetter = `codeViewEl = document.currentScript
    .parentNode
    .querySelector('[data-type=preview]')
    .shadowRoot
    .querySelector('div')`;

  let scriptText;
  try {
    // Babel is provided by @babel/standalone loaded via CDN
    // eslint-disable-next-line no-undef
    const baseTransCode = Babel.transform(baseRawCode, { presets: ['react'] })
      .code;

    let previewTransCode;
    try {
      // If no code or multiple elements are entered we wrap code in `React.Fragment` to prevent an error
      previewTransCode = transformCode(`<>${previewRawCode}</>`);
    } catch (e) {
      // If the code entered is not JSX we must attempt rendering without `React.Fragment`
      previewTransCode = transformCode(previewRawCode);
    }

    // We need to wrap the code in an anonymous function to scope constants/variables and
    // prevent variable redeclaration errors
    scriptText = `
      (() => {
        ${baseTransCode}
        ${viewElGetter}
        try {
          ReactDOM.render(${previewTransCode}, codeViewEl);
        } catch (e) {
          ReactDOM.unmountComponentAtNode(codeViewEl);
          codeViewEl.innerText = e.message;
        }
      })();
    `;
  } catch (e) {
    // The `e.message` can be multiline, so we need to use backticks (`).
    scriptText = `
      ${viewElGetter}
      ReactDOM.unmountComponentAtNode(codeViewEl);
      codeViewEl.innerText = \`${e.message}\`;
    `;
  }

  // First we add the script to modify the DOM
  const codeRun = document.createElement('script');
  codeRun.innerHTML = scriptText;
  container.append(codeRun);

  // Then we remove the script that already run
  codeRun.remove();
};
