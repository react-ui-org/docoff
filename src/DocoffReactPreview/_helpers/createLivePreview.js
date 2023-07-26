import { LIVE_PREVIEW_CLASSNAME } from '../../constants';

export const createLivePreview = () => {
  const livePreview = document.createElement('div');

  livePreview.dataset.type = 'preview';
  livePreview.setAttribute('aria-hidden', 'true');
  livePreview.classList.add(LIVE_PREVIEW_CLASSNAME);
  livePreview.attachShadow({ mode: 'open' });

  const styles = document.createElement('style');
  styles.innerText = `
    /* Reset all styles coming from parent DOM */
    :host {
      all: initial;
      display: block;
    }

    /* Configure live preview presentation */
    body {
      margin: 0;
    }
    body > div {
      padding: var(--docoff-preview-padding);
    }
    body > div > * {
      margin: var(--docoff-preview-children-margin);
    }
  `;
  livePreview.shadowRoot.appendChild(styles);

  // Add custom preview CSS link
  const previewCss = window.getComputedStyle(document.body).getPropertyValue('--docoff-preview-css');
  if (previewCss) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = previewCss;
    livePreview.shadowRoot.appendChild(cssLink);
  }

  // Add <html> and <body> so that might be declared on them in custom preview CSS can take effect
  const contentHtml = document.createElement('html');
  livePreview.shadowRoot.appendChild(contentHtml);
  const contentBody = document.createElement('body');
  contentHtml.appendChild(contentBody);

  // We need to declare inner element as mounting React on `<body>` causes warnings in console
  const contentRoot = document.createElement('div');
  contentBody.appendChild(contentRoot);

  // Prevent keyDown events from bubbling when editing text (e.g. in an `<input>` field)
  livePreview.addEventListener('keydown', (e) => e.stopPropagation());
  livePreview.addEventListener('keyup', (e) => e.stopPropagation());

  return livePreview;
};
