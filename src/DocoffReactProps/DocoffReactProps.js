import { getPropsTable } from './_helpers/getPropsTable';

class DocoffReactProps extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  async connectedCallback() {
    const componentUrls = this.getSrcAttributeValues();
    const data = await getPropsTable(componentUrls);
    this.replaceChildren(data);
  }

  async attributeChangedCallback() {
    const componentUrls = this.getSrcAttributeValues();
    const data = await getPropsTable(componentUrls);
    this.replaceChildren(data);
  }

  getSrcAttributeValues() {
    return this.attributes.src?.value
      .split('|')
      .map((url) => url.trim());
  }
}

export default DocoffReactProps;
