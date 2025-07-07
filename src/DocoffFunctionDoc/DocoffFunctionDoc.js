import { getFunctionDocTable } from './_helpers/getFunctionDocTable';

class DocoffFunctionDoc extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  async connectedCallback() {
    await this.render();
  }

  async attributeChangedCallback() {
    await this.render();
  }

  async render() {
    const functionUrl = this.getSrcAttributeValue();
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

  getSrcAttributeValue() {
    return this.attributes.src?.value?.trim();
  }
}

export default DocoffFunctionDoc;
