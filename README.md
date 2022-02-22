# Docoff

This library provides a collection of custom HTML elements that allow easy React
component library documentation.

**The aim is:**

1. to be documentation stack independent
2. to have very little dependencies
3. to not force a specific versions of `React`


## `docoff-react-base` / `docoff-react-preview`

These components allow to create a live editable JSX component demo in browser.

**Design decisions:**

1. The documentation elements are `<textarea>` based custom element. This is needed so as
    that special HTML characters (`<`, `>` etc.) are not parsed by the browser
    and are accessible to the JS as text.
2. All rendering code is run from within a `<script>` tag inserted into the
    document. This is needed so that the `React` version is not hard coded in
    this library and can be loaded by the user in the desired version. 
3. `@babel/standalone` is loaded via CDN because that seems to be the only supported way


### Usage

See [index.html](./public/index.html) for a basic working example.

In short, you need to:

1. Include dependencies from CDN:
    ```html
    <script crossorigin src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    ```
2. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
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

1. The aim was to strike a balance between sane API, technical possibilities and ease of use. Some solutions (e.g. the fake component) are not elegant, but they make this component more useful.
2. It is opinionated as there was no way to make it useful without it. See the inheritance rules in the [Inheritance Rules](#inheritance-rules) section.
3. Everything happens in browser to eliminate the need for a build pipe.

### Usage

See [index.html](./public/index.html) for a basic working example.

#### Simple component

For simple non-derived component usage:

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use component:
    ```html
    <docoff-react-props data-src="https://raw.githubusercontent.com/react-ui-org/react-ui/master/src/lib/components/CheckboxField/CheckboxField.jsx"></docoff-react-props>
    ```

#### Derived Component

This element provide some shortcuts to render prop type definitions for elements that are derived from other components. The aim is to make it easier to:

 * wrap base components and tweak their API
 * allow using prop definition files separate from component definition (useful to avoid huge files or to have one prop definition shared by many components)

#####  Inheritance Rules

For the inheritance to work these rules must be observed:

1. The prop definition files must define and export constants `propTypes` and `defaultProps`. They must contain nothing else. A fake component is created around these definitions, so this is definitely not a robust solution. If you run into problems, see the source code to see what is going on [there](.src/DocoffReactProps/DocoffReactProps.js). 

   *Reason: [react-docgen](https://github.com/reactjs/react-docgen) only supports parsing components.*
2. Derived component must define all `propTypes` and `defaultProps`, that it uses. However, they can be references to their respective values in the base component. **Destructuring is not supported.** If a component does not define a `propType`, it will not show in the table even if the base element did define it.

   *Reason: This is needed for cases when the derived component needs to tighten the API.*
3. Only prop types definition with docblock description are used in the rendered table. Therefore, if a derived component defines a propType, but does not provide a description, the definition from the base component is used.

   *Reason: This allows the derived component do inherit the prop type definition.*
4. If the derived component defines a concrete default prop value that is not a reference elsewhere this new values is used. This happens independently of the prop type definition inheritance defined in rule 3).

   *Reason: This allows the derived element to change default values of props.*

#### Usage

To use this component:

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use component:
    ```html
    <docoff-react-props data-src="/exampleJS/common.propTypes.js|/exampleJS/BaseGreeting.jsx|/exampleJS/MyGreeting.jsx"></docoff-react-props>
    ```


## Development

**Run locally**: `npm start`

**Build**: `npm run build`

**Test**: `npm test`






