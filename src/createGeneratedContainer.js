export const createGeneratedContainer = () => {
    const container = document.createElement('div');

    // This is the text overlay covering the text area to allow syntax highlighting
    const textOverlayDiv = document.createElement('div');
    const textOverlayPre = document.createElement('pre');
    const textOverlayCode = document.createElement('code');
    textOverlayCode.dataset.type = 'textOverlay';
    textOverlayCode.classList.add('language-jsx');
    textOverlayPre.append(textOverlayCode)
    textOverlayDiv.append(textOverlayPre);
    container.prepend(textOverlayDiv);

    return container;
}
