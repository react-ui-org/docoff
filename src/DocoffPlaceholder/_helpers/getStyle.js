export const getStyle = (attributes) => {
  const styles = {
    'background-color': attributes.dark
      ? window.getComputedStyle(document.body).getPropertyValue('--docoff-placeholder-background-dark')
      : window.getComputedStyle(document.body).getPropertyValue('--docoff-placeholder-background-light'),
    height: attributes.height || 'auto',
    padding: '0.75rem',
    width: attributes.width || 'auto',
  };

  if (attributes.bordered) {
    const borderColor = window.getComputedStyle(document.body).getPropertyValue('--docoff-placeholder-border-color');
    const borderWidth = window.getComputedStyle(document.body).getPropertyValue('--docoff-placeholder-border-width');
    styles.border = `${borderWidth} dashed ${borderColor}`;
  }

  styles.display = 'block';
  if (attributes.inline) {
    styles.display = 'inline-flex';
    styles['vertical-align'] = ['middle'];
  }

  return styles;
};
