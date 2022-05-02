import Prism from 'prismjs';
import { createCodeSyntaxHighlighter } from '../_helpers/createCodeSyntaxHighlighter';
import { createRootContainer } from '../_helpers/createRootContainer';
import { CODE_EDITOR_CLASSNAME } from '../constants';

class DocoffReactBase extends HTMLTextAreaElement {
  connectedCallback() {
    this.readOnly = true;
    this.classList.add(CODE_EDITOR_CLASSNAME);

    const container = createRootContainer();
    const codeSyntaxHighlighter = createCodeSyntaxHighlighter();
    container.appendChild(codeSyntaxHighlighter);
    this.parentNode.insertBefore(container, this);

    const initialRender = () => {
      const baseRawCode = this.value.trim();

      // Remove white space if there is any content.
      // No content can mean the HTML was not parsed yet and we must not update anything in such case
      if (baseRawCode) {
        this.value = baseRawCode;
        container.querySelector('[data-type=textOverlay]').innerHTML = Prism.highlight(
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
  }
}

export default DocoffReactBase;
