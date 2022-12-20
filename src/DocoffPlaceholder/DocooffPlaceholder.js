class DocoffPlaceholder extends HTMLElement {
  async connectedCallback() {
    // Parse attributes
    const bordered = !!this.attributes.bordered;
    const dark = !!this.attributes.dark;
    const height = this.attributes.height?.value;
    const inline = !!this.attributes.inline;
    const width = this.attributes.width?.value;

    // Render the output
    if (bordered) {
      this.style.border = '2px dashed #ccc';
    }
    this.style.display = 'block';
    this.style['background-color'] = dark ? '#4d4d4d' : '#fff';
    this.style.height = height || 'auto';
    this.style.padding = '0.75rem';
    if (inline) {
      this.style.display = 'inline-flex';
      this.style['vertical-align'] = ['middle'];
    }
    this.style.width = width || 'auto';
  }
}

export default DocoffPlaceholder;
