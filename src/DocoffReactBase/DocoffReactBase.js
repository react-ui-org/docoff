import Prism from 'prismjs';
import { createCodeSyntaxHighlighter } from '../_helpers/createCodeSyntaxHighlighter';
import { createRootContainer } from '../_helpers/createRootContainer';
import { CODE_EDITOR_CLASSNAME } from '../constants';

class DocoffReactBase extends HTMLTextAreaElement {
  connectedCallback() {
    // Ensure that this Element will get initiated only once even if we reattach it to DOM multiple times
    if (this.initiated) {
      return;
    }
    this.initiated = true;

    this.readOnly = true;
    this.classList.add(CODE_EDITOR_CLASSNAME);

    const container = createRootContainer();

    // Add data- attribute to allow DocoffReactPreview to query all base elements
    container.dataset.type = 'reactBase';

    this.parentNode.insertBefore(container, this);

    const codeSyntaxHighlighter = createCodeSyntaxHighlighter();
    container.shadowRoot.appendChild(codeSyntaxHighlighter);
    codeSyntaxHighlighter.appendChild(this);

    const initialRender = () => {
      // Remove white space if there is any content.
      const baseRawCode = this.value.trim();

      // No content can mean the HTML was not parsed yet, and we must not update anything in such case
      if (baseRawCode) {
        this.value = baseRawCode;
        container.shadowRoot.querySelector('[data-type=textOverlay]').innerHTML = Prism.highlight(
          baseRawCode,
          Prism.languages.javascript,
          'javascript',
        );

        // Ensure the size is correct
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      }
    };

    // Run when child elements are parsed
    const observer = new MutationObserver(initialRender);
    observer.observe(this, { childList: true });

    // Run when the polyfill is loaded
    initialRender();

    // Synchronize horizontal scrolling between textarea and syntaxHighlighter
    this.addEventListener('scroll', () => {
      codeSyntaxHighlighter.firstChild.scrollLeft = this.scrollLeft;
    });
  }
}

export default DocoffReactBase;
