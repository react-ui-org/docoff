export const createStyle = () => {
  const styles = document.createTextNode(`
    .docoff-LivePreview {
      position: relative;
      z-index: 2;
      border: 1px solid var(--docoff-preview-border-color);
      border-radius: var(--docoff-preview-border-radius);
      border-bottom-style: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      overflow: hidden;
    }

    [class*="language-"].docoff-Code__syntaxHighlighter {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `);
  const style = document.createElement('style');
  style.appendChild(styles);

  return style;
};
