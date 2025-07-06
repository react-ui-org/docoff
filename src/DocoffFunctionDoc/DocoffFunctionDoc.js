import { getFunctionDocTable } from './_helpers/getFunctionDocTable';

class DocoffFunctionDoc extends HTMLElement {
  static get observedAttributes() {
    return ['href'];
  }

  async connectedCallback() {
    const functionUrl = this.getHrefAttributeValue();
    if (functionUrl) {
      try {
        const data = await getFunctionDocTable(functionUrl);
        this.replaceChildren(data);
      } catch (error) {
        const errorEl = document.createElement('div');
        errorEl.style.color = 'red';
        errorEl.textContent = `Error loading function documentation: ${error.message}`;
        this.replaceChildren(errorEl);
      }
    }
  }

  async attributeChangedCallback() {
    const functionUrl = this.getHrefAttributeValue();
    if (functionUrl) {
      try {
        const data = await getFunctionDocTable(functionUrl);
        this.replaceChildren(data);
      } catch (error) {
        const errorEl = document.createElement('div');
        errorEl.style.color = 'red';
        errorEl.textContent = `Error loading function documentation: ${error.message}`;
        this.replaceChildren(errorEl);
      }
    }
  }

  getHrefAttributeValue() {
    return this.attributes.href?.value?.trim();
  }
}

export default DocoffFunctionDoc;
