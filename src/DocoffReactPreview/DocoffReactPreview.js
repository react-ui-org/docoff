import { CODE_EDITOR_CLASSNAME } from '../constants';
import { createCodeSyntaxHighlighter } from '../_helpers/createCodeSyntaxHighlighter';
import { createLivePreview } from '../_helpers/createLivePreview';
import { createRootContainer } from '../_helpers/createRootContainer';
import { render } from './render';

class DocoffReactPreview extends HTMLTextAreaElement {
  connectedCallback() {
    // We need to ensure that this Element will get initiated only once even if we move it around
    if (this.initiated) {
      return;
    }
    this.initiated = true;

    this.classList.add(CODE_EDITOR_CLASSNAME);

    this.autocapitalize = 'none';
    this.autocomplete = 'off';
    this.setAttribute('autocorrect', 'off');
    this.setAttribute('data-gramm', 'false');
    this.setAttribute('spell-check', 'false');

    const container = createRootContainer();
    const livePreview = createLivePreview();
    const codeSyntaxHighlighter = createCodeSyntaxHighlighter();

    container.appendChild(codeSyntaxHighlighter);
    container.appendChild(livePreview);
    this.parentNode.insertBefore(container, this);

    codeSyntaxHighlighter.appendChild(this);

    // Loop through all `docoff-react-base` elements on page.
    // They must be placed before any `docoff-react-preview` elements otherwise they would not be parsed yet.
    const baseRawCode = Array.prototype.reduce.call(
      document.querySelectorAll('textarea[is=docoff-react-base]'),
      (agg, content) => `${agg}${content.value.trim()}`,
      '',
    );

    // Ensures that the size of `<textarea>` and `textOverlay` is the same and correct
    const setHeight = () => {
      const textOverlay = container.querySelector('[data-type=textOverlay]');

      // First shrink it
      this.style.height = 'auto';
      textOverlay.style.height = 'auto';

      // Then set correct height
      const heightStyle = `${this.scrollHeight}px`;
      this.style.height = heightStyle;
      textOverlay.style.height = heightStyle;
    };

    // Removes white space, renders and adjusts height
    // No content can mean the HTML has not been parsed yet and we must not update anything in such case
    const initialRender = () => {
      const previewRawCode = this.value.trim();
      if (previewRawCode) {
        this.value = previewRawCode;
        render(container, previewRawCode, baseRawCode);
        setHeight();
      }
    };

    // Update container when child elements are parsed
    const observer = new MutationObserver(initialRender);
    observer.observe(this, { childList: true });

    // Update container when the polyfill is loaded
    initialRender();

    // Update container when user changes the `value` attribute
    this.addEventListener('input', () => {
      render(container, this.value, baseRawCode);
      setHeight();
    });
  }
}

export default DocoffReactPreview;
