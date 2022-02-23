import Prism from 'prismjs';

export const render = (container, previewRawCode, baseRawCode) => {
    // Update the text overlay content
    container.querySelector('[data-type=textOverlay]').innerHTML = Prism.highlight(
        previewRawCode,
        Prism.languages.jsx,
        'jsx'
    );

    const viewElGetter = `codeViewEl = document.currentScript.parentNode.querySelector('[data-type=preview]')`;

    let scriptText;
    try {
        // Babel is provided by @babel/standalone loaded via CDN
        const baseTransCode = Babel.transform(baseRawCode, { presets: ['react'] })
            .code;

        // Babel is provided by @babel/standalone loaded via CDN
        // If no code is entered we return an empty React.Fragment to prevent an error
        // `previewTransCode` includes ';' at the end, we let JS strip it
        const previewTransCode = Babel.transform(previewRawCode || '<></>', { presets: ['react'] })
            .code
            .slice(0, -1);

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
}
