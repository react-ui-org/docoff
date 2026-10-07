import { getPropsTable } from './_helpers/getPropsTable';

class DocoffReactProps extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'src'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  // The table is rendered once, even when the element is connected and its attributes are set at the same time
  render() {
    if (this.isRenderScheduled || !this.isConnected) {
      return;
    }

    this.isRenderScheduled = true;
    queueMicrotask(async () => {
      this.isRenderScheduled = false;
      this.replaceChildren(await getPropsTable(this.getAttribute('src'), this.getAttribute('name')));
    });
  }
}

export default DocoffReactProps;
