import { LIVE_PREVIEW_CLASSNAME } from '../../constants';

export const createLivePreview = (cssHref) => {
  const livePreview = document.createElement('div');

  livePreview.dataset.type = 'preview';
  livePreview.setAttribute('aria-hidden', 'true');
  livePreview.classList.add(LIVE_PREVIEW_CLASSNAME);
  livePreview.attachShadow({ mode: 'open' });

  const styles = document.createElement('style');
  styles.innerText = `:host {
    all: initial;
    display: block;
  }`;
  livePreview.shadowRoot.appendChild(styles);

  if (cssHref != null) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = cssHref;
    livePreview.shadowRoot.appendChild(cssLink);
  }

  // We need to add body so styles declared on body take effect
  const contentHtml = document.createElement('html');
  livePreview.shadowRoot.appendChild(contentHtml);
  const contentBody = document.createElement('body');
  contentHtml.appendChild(contentBody);

  // We need to declare inner element as mounting React on `<body>` causes warnings in console
  const contentRoot = document.createElement('div');
  contentBody.appendChild(contentRoot);

  return livePreview;
};
