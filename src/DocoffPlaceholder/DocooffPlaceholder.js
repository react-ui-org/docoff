import { getStyle } from './_helpers/getStyle';

class DocoffPlaceholder extends HTMLElement {
  static get observedAttributes() {
    return ['bordered', 'dark', 'height', 'inline', 'width'];
  }

  async connectedCallback() {
    const attributes = this.getAttributeValues();
    Object.assign(this.style, getStyle(attributes));
  }

  attributeChangedCallback() {
    const attributes = this.getAttributeValues();
    Object.assign(this.style, getStyle(attributes));
  }

  getAttributeValues() {
    return {
      bordered: !!this.attributes.bordered,
      dark: !!this.attributes.dark,
      height: this.attributes.height?.value,
      inline: !!this.attributes.inline,
      width: this.attributes.width?.value,
    };
  }
}

export default DocoffPlaceholder;
