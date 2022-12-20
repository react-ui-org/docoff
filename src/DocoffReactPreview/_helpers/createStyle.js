export const createStyle = () => {
  const styles = document.createTextNode(`
    .docoff-LivePreview {
      border: 1px solid var(--docoff-border-color);
      border-bottom-style: none;
      border-radius: var(--docoff-border-radius);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background-color: var(--docoff-background-color);
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
