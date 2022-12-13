class DocoffPlaceholder extends HTMLElement {
  async connectedCallback() {
    // Parse attributes
    const bordered = !!this.attributes.bordered;
    const dark = !!this.attributes.dark;
    const height = this.attributes.height?.value;
    const inline = !!this.attributes.inline;
    const width = this.attributes.width?.value;

    // Render the output
    const rootEl = this;
    if (bordered) {
      rootEl.style.border = '2px dashed #ccc';
    }
    rootEl.style.display = 'block';
    rootEl.style['background-color'] = dark ? '#4d4d4d' : '#fff';
    rootEl.style.height = height || 'auto';
    rootEl.style.padding = '0.75rem';
    if (inline) {
      rootEl.style.display = 'inline-flex';
      rootEl.style['vertical-align'] = ['middle'];
    }
    rootEl.style.width = width || 'auto';
  }
}

export default DocoffPlaceholder;
