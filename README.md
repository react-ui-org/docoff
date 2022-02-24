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

#### Props with No Inheritance

To render props of a single React.Component:

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use component the `<docoff-react-props>` element:
    ```html
    <docoff-react-props data-src="https://raw.githubusercontent.com/react-ui-org/react-ui/master/src/lib/components/CheckboxField/CheckboxField.jsx"></docoff-react-props>
    ```

#### Props with Inheritance

This element provides some shortcuts to cascade prop type definitions. The aim is to make it easier to:

 * wrap base `React.Components` and tweak their API
 * allow using *prop definition file*s separate from component definition (useful to avoid huge files or to have one prop definition used on several places)

Beware, that some React related eslint rules do not always work with the more complicated inheritance constructs.

#####  Files

The files that are parsed for prop definition need to be of the following types:

1. `React.Component` that can be parsed by [react-docgen](https://github.com/reactjs/react-docgen). In short, it must import and depend on `React`. These files must:
   1. Use the `*.js` or `*.jsx` suffix
   2. There can be only one component per file.
2. A wrapper of a `React.Component`. This file must not create a `React.Component` as it only wraps the component on the JS level (e.g. `const MyGreeting = (props) => BaseGreeting({ ...props });`). These files must:
   1. Define constant `defaultProps` (even when empty)
   2. Define constant `propTypes` (even when empty)
   3. There can be only one component wrapper per file
   4. It must not import `React`,  we check
3. A *prop definition file*. This file must not create a `React.Component` as it only defines `propTypes` and `defaultProps`. These files must:
   1. Use the `*.props.js suffix
   2. Define constant `defaultProps` (even when empty)
   3. Define constant `propTypes` (even when empty)

Parsing of files describe in point 2) and 3) is not too elegant. As [react-docgen](https://github.com/reactjs/react-docgen) only supports parsing components, a fake component is created around these definitions. It is not a robust solution. If you run into problems, see the [source code](.src/DocoffReactProps/DocoffReactProps.js) to see what is going on.

#####  Inheritance Rules

There is no clean way to achieve full inheritance so for things to work the following rules must be observed:

1. The props are overloaded one at a time. The result of one merge is used as the base for the next merge.
2. Derived component must define all `propTypes` and `defaultProps`, that it uses. However, they can be references to their respective values in the base component. **Destructuring is not supported.** If a component (not a *prop definition file*) does not define a `propType`, it will not show in the table even if the base element did define it.

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
    <docoff-react-props data-src="/exampleJS/common.props.js|/exampleJS/BaseGreeting.jsx|/exampleJS/MyGreeting.jsx"></docoff-react-props>
    ```


## Development

**Run locally**: `npm start`

**Build**: `npm run build`

**Test**: `npm test`






