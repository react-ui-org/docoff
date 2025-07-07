/**
 * Custom element for displaying function documentation
 * Shows a warning when not processed by the webpack plugin
 */
export class DocoffFunctionDoc extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get src() {
    return this.getAttribute('src');
  }

  render() {
    if (!this.src) {
      this.innerHTML = '<div style="color: red;">Error: src attribute is required</div>';
      return;
    }

    // If this element is still present, it means the webpack plugin didn't process it
    this.innerHTML = `
      <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; color: #856404;">
        <strong>Warning:</strong> This file needs to be processed through the build system first.
        <br>Function documentation for <code>${this.src}</code> will be generated during build.
      </div>
    `;
  }
}