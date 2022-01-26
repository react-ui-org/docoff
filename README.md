# Docoff

This library provides a collection of custom HTML elements that allow easy React
component library documentation.

**The aim is:**

1. to be documentation stack independent
2. to have very little dependencies
3. do not force specific versions of `React`


**Design decisions:**

1. The documentation elements are `<textarea>` based custom element. This is needed so as
    that special HTML characters (`<`, `>` etc.) are not parsed by the browser
    and are accessible to the JS as text.
2. All rendering code is run from within a `<script>` tag inserted into the
    document. This is needed so that the `React` version is not hard coded in
    this library and can be loaded by the user in the desired version. 
3. ShadowDOM is not used because it is not compatible with `<textarea>` (See: 1.)
4. `@babel/standalone` is loaded via CDN because that seems to be the only supported way


## Usage

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


## Development

**Run locally**: `npm start`

**Build**: `npm run build`

**Test**: `npm test`






