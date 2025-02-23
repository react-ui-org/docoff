# Docoff

This library provides a collection of custom HTML elements that allow easy React
component library documentation.

**The aim is:**

1. to be documentation stack independent
2. to have very little dependencies
3. to not force a specific version of `React`


## `docoff-react-base` / `docoff-react-preview`

These components allow to create a live editable JSX component demo in browser.

**Design decisions:**

1. The documentation elements are `<textarea>` based custom element. This is needed so as
    that special HTML characters (`<`, `>` etc.) are not parsed by the browser
    and are accessible to JS as text.
2. All rendering code is run from within a `<script>` tag inserted into the
    document. This is needed so that the `React` version is not hard-coded in
    this library and can be loaded by the user in the desired version.
3. `@babel/standalone` is loaded via CDN because that seems to be the only
    supported way.
4. Components preview are completely isolated inside a shadowDom from the page CSS styles.


### Usage

See [index.html](./public/index.html) for a basic working example.

In short, you need to:

1. Include dependencies from CDN:
    ```html
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    ```
2. Include code from this package:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="/main.css" />
    ```
3. Optionally define `docoff-react-base` elements with code that is to be common for all `docoff-react-preview` elements on the given page.
    ```html
        <textarea is="docoff-react-base">
            const MyHello = ({name}) => <strong>Hello, {name}</strong>;
        </textarea>
    ```
   ⚠ All `docoff-react-base` elements must be defined before any `docoff-react-preview` element.
4. Define `docoff-react-preview` element with code that renders the JSX:
    ```html
        <textarea is="docoff-react-preview">
            <MyHello name="Igor" />
        </textarea>
    ```
    The content always needs to be a single React element. To achieve that we either wrap the content in `React.Fragment`:
    ```html
        <textarea is="docoff-react-preview">
            <>
                <MyHello name="Igor" />
                <MyHello name="Uwe" />
            </>
        </textarea>
    ```
    or we explicitly create the React element (useful for hooks):
    ```html
        React.createElement(() => {
            const [isActive, setIsActive] = React.useState(false);
            return (
               <MyButton
                   label={isActive ? 'On' : 'Off'}
                   onClick={() => setIsActive(!isActive)}
               />
            );
       });
    ```

## `docoff-react-props`

This element renders a React component prop definition table.

**Design decisions:**

1. The aim was to strike a balance between sane API, technical possibilities and ease of use. Some solutions (e.g. the [fake component](./src/DocoffReactProps/_helpers/getFakeComponentSrc.js)) are not elegant, but they make this component more useful.
2. It is opinionated as there was no way to make it useful without it. See the inheritance rules in the [Inheritance Rules](#inheritance-rules) section.
3. Everything happens in browser to eliminate the need for a build pipe.

### Usage

See [index.html](./public/index.html) for a basic working example.

#### Single Component Props

To render props of a single React.Component:

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use component the `<docoff-react-props>` element:
    ```html
    <docoff-react-props data-src="https://raw.githubusercontent.com/react-ui-org/react-ui/master/src/components/CheckboxField/CheckboxField.jsx"></docoff-react-props>
    ```

#### Props with Inheritance

This element also provides some shortcuts to cascade prop type definitions. It allows using *prop definition files* separate from component definition. It is useful to avoid huge files or to have one prop definition used on several places.

The props are presented alphabetically sorted regardless of the source of the definition.

Beware, that some React related eslint rules do not always work with the more complicated inheritance constructs.

#####  Files

The files that are parsed for prop definition need to be of the following types:

1. `React.Component` that can be parsed by [react-docgen](https://github.com/reactjs/react-docgen) - in short, this file must import and depend on `React`. It must:
   1. Use the `*.js` or `*.jsx` suffix
   2. Define only one component per file
2. A *prop definition file* - it must not create a `React.Component` as it only defines `propTypes` and `defaultProps`. It must:
   1. Use the `*.props.js` suffix
   2. Define constant `defaultProps` (even when empty)
   3. Define constant `propTypes` (even when empty)

Parsing of the *prop definition file* is not too elegant. As [react-docgen](https://github.com/reactjs/react-docgen) only supports parsing components, a fake component is created around these definitions. It is not a robust solution. If you run into problems, see the [source code](./src/DocoffReactProps/DocoffReactProps.js) to see what is going on.

#####  Inheritance Rules

Typically, there should be only one `React.Component` definition as the last file in the cascade. All files preceding it should be *prop definition files*.

There is no clean way to achieve full inheritance so for things to work the following rules must be observed:

1. The props are overloaded one at a time in the sequence as defined.
2. The component must define all `propTypes` and `defaultProps`, that it uses. However, they can be references to definitions in a *prop definition file*. **Destructuring is not supported.**
3. If prop type has a docblock description its definition and description will be used. Otherwise, the definition and description from the referenced *prop definition file* will be used.

#### Usage

To use this component:

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use component:
    ```html
    <docoff-react-props data-src="/exampleJS/common.props.js|/exampleJS/BaseGreeting.jsx|/exampleJS/MyGreeting.jsx"></docoff-react-props>
    ```

## Development

### Native

**Run locally:** `npm start`

**Build:** `npm run build`

**Test:** `npm test`

### Using Docker

**Run locally:** `docker compose up dev_server`

**Open shell (access to `npm` etc.):** `docker compose run --rm node_shell`



