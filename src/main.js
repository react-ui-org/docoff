import { DocoffPlaceholder } from './DocoffPlaceholder';
import { DocoffReactPreview } from './DocoffReactPreview';
import { DocoffReactBase } from './DocoffReactBase';
import { DocoffReactProps } from './DocoffReactProps';
import { DocoffFunctionDoc } from './DocoffFunctionDoc';

customElements.define('docoff-react-preview', DocoffReactPreview, { extends: 'textarea' });
customElements.define('docoff-react-base', DocoffReactBase, { extends: 'textarea' });
customElements.define('docoff-react-props', DocoffReactProps);
customElements.define('docoff-function-doc', DocoffFunctionDoc);
customElements.define('docoff-placeholder', DocoffPlaceholder);

// For comfortable usage in Markdown any `<code>` elements with class `language-docoff-*`
// get replaced by the respective custom elements
document.addEventListener('DOMContentLoaded', () => {
  [
    'docoff-react-base',
    'docoff-react-preview',
  ].forEach((elName) => {
    document.querySelectorAll(`code.language-${elName}`).forEach((el) => {
      const base = document.createElement('textarea', { is: elName });
      const preNode = el.parentNode;

      base.innerHTML = el.innerHTML;
      preNode.parentNode.insertBefore(base, preNode);
      preNode.remove();
    });
  });
});
