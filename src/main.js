import { DocoffPlaceholder } from './DocoffPlaceholder';
import { DocoffReactPreview } from './DocoffReactPreview';
import { DocoffReactBase } from './DocoffReactBase';
import { DocoffReactProps } from './DocoffReactProps';

customElements.define('docoff-react-preview', DocoffReactPreview, { extends: 'textarea' });
customElements.define('docoff-react-base', DocoffReactBase, { extends: 'textarea' });
customElements.define('docoff-react-props', DocoffReactProps);
customElements.define('docoff-placeholder', DocoffPlaceholder);
