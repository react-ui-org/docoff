import { LIVE_PREVIEW_CLASSNAME } from '../../constants';

export const createLivePreview = () => {
  const livePreview = document.createElement('div');

  livePreview.dataset.type = 'preview';
  livePreview.setAttribute('aria-hidden', 'true');
  livePreview.classList.add(LIVE_PREVIEW_CLASSNAME);

  return livePreview;
};
