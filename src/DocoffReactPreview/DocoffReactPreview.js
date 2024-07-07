import initSwc from '@swc/wasm-web';
import { CODE_EDITOR_CLASSNAME } from '../constants';
import { createCodeSyntaxHighlighter } from '../_helpers/createCodeSyntaxHighlighter';
import { createRootContainer } from '../_helpers/createRootContainer';
import { createLivePreview } from './_helpers/createLivePreview';
import { createStyle } from './_helpers/createStyle';
import { render } from './render';

class DocoffReactPreview extends HTMLTextAreaElement {
  connectedCallback() {
    // Ensure that this Element will get initiated only once even if we reattach it to DOM multiple times
    if (this.initiated) {
      return;
    }
    this.initiated = true;

    // Read attributes
    this.classList.add(CODE_EDITOR_CLASSNAME);
    this.setAttribute('autocomplete', 'off');
    this.setAttribute('autocapitalize', 'off');
    this.setAttribute('spellcheck', 'false');

    // Prepare DOM
    const container = createRootContainer();
    this.parentNode.insertBefore(container, this);

    const livePreview = createLivePreview();
    container.shadowRoot.appendChild(livePreview);

    const codeSyntaxHighlighter = createCodeSyntaxHighlighter();
    container.shadowRoot.appendChild(codeSyntaxHighlighter);
    codeSyntaxHighlighter.appendChild(this);

    const style = createStyle();
    container.shadowRoot.appendChild(style);

    // Loop through all `docoff-react-base` elements on page.
    // They must be placed before any `docoff-react-preview` elements otherwise they would not be parsed yet.
    const baseRawCode = Array.prototype.reduce.call(
      document.querySelectorAll('[data-type="reactBase"]'),
      (agg, reactBaseEl) => {
        const code = reactBaseEl
          .shadowRoot
          .querySelector('textarea')
          .value
          .trim();
        return `${agg}${code}`;
      },
      '',
    );

    // Ensures that the size of `<textarea>` and `textOverlay` is the same and correct
    const setHeight = () => {
      const textOverlay = container.shadowRoot.querySelector('[data-type=textOverlay]');

      // First shrink it
      this.style.height = 'auto';
      textOverlay.style.height = 'auto';

      // Then set correct height
      const heightStyle = `${this.scrollHeight}px`;
      this.style.height = heightStyle;
      textOverlay.style.height = heightStyle;
    };

    // Update container when user changes the `value` attribute
    this.addEventListener('input', () => {
      render(container, this.value, baseRawCode);
      setHeight();
    });

    // Synchronize horizontal scrolling between textarea and syntaxHighlighter
    this.addEventListener('scroll', () => {
      codeSyntaxHighlighter.firstChild.scrollLeft = this.scrollLeft;
    });

    // Prevent keyDown events from bubbling when editing source code
    this.addEventListener('keydown', (e) => e.stopPropagation());
    this.addEventListener('keyup', (e) => e.stopPropagation());

    // Initialize SWC
    // A single SWC instance is shared between all instances of `docoff-react-preview`
    if (window.swcInitPromise == null) {
      window.swcInitPromise = initSwc(window.getComputedStyle(document.body).getPropertyValue('--docoff-preview-wasm-path'));
    }

    // Once SWC was initialized we can start rendering
    window.swcInitPromise.then(() => {
      // Removes white space, renders and adjusts height
      const initialRender = () => {
        const previewRawCode = this.value.trim();
        // No content can mean the HTML has not been parsed yet, and we must not update anything in such case
        if (previewRawCode) {
          this.value = previewRawCode;
          render(container, previewRawCode, baseRawCode);
          setHeight();
        }
      };

      // Update container when SWC is initialized
      initialRender();
      // Update container when child elements are parsed in case they were not yet parsed when SWC was initialized
      const observer = new MutationObserver(initialRender);
      observer.observe(this, { childList: true });

      return undefined;
    });
  }
}

export default DocoffReactPreview;
