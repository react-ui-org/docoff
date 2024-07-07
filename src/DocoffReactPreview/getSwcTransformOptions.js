export const getSwcTransformOptions = () => {
  const esTarget = window.getComputedStyle(document.body).getPropertyValue('--docoff-preview-es-target');

  return {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      target: (esTarget != null && esTarget !== '') ? esTarget : 'es6',
    },
  };
};
