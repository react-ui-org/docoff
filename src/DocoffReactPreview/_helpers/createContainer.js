import { createGeneratedContainer } from '../../createGeneratedContainer';

export const createContainer = () => {
  const container = createGeneratedContainer();

  // This is the preview area where the rendered component is shown
  const preview = document.createElement('div');
  preview.dataset.type = 'preview';
  container.prepend(preview);

  return container;
};
