# Docoff

This library provides a collection of custom HTML elements that allow easy React
component library documentation.

**The aim is:**

1. to be documentation stack independent
2. to have very little dependencies
3. to not force a specific version of `React`


## `docoff-react-base` / `docoff-react-preview`

These components allow to create a live editable TSX/JSX component demo in browser.

**Design decisions:**

1. The documentation elements are `<textarea>` based custom element. This is needed so as
    that special HTML characters (`<`, `>` etc.) are not parsed by the browser
    and are accessible to JS as text.
2. All rendering code is run from within a `<script>` tag inserted into the
    document. This is needed so that the `React` version is not hard-coded in
    this library and can be loaded by the user in the desired version.
3. The preview code is transpiled in browser by [Sucrase](https://github.com/alangpierce/sucrase)
    See [Limitations](#limitations).
4. Components preview are completely isolated inside a shadowDom from the page CSS styles.

### Limitations

The preview code is transpiled by [Sucrase](https://github.com/alangpierce/sucrase)
which only strips TypeScript types and transforms JSX. This means:

1. The syntax is not transpiled to older ECMAScript versions, so the browser
    must natively support all the syntax used in the preview code.
2. TypeScript types are not checked, they are only stripped.
3. `namespace` declarations are silently removed, so accessing their members
    fails at runtime.

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

This element renders a table of props of a React component written in TypeScript.

**Design decisions:**

1. Everything happens in browser to eliminate the need for a build pipe. The props are read directly from the TypeScript source files by [react-docgen](https://github.com/reactjs/react-docgen), the types are neither checked nor compiled.
2. It is opinionated as there was no way to make it useful without it. The types are evaluated, so that the reader sees what a type consists of instead of how it is written. See [Type Evaluation](#type-evaluation).

### Usage

See [index.html](./public/index.html) for a basic working example.

1. Include package dependencies:
    ```html
    <script src="/generated/bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="main.css" />
    ```
2. Use the `<docoff-react-props>` element:
    ```html
    <docoff-react-props src="/components/Button/Button.tsx" name="Button"></docoff-react-props>
    ```

Both attributes are required:

* `src` is the URL of a TypeScript file (`*.ts` or `*.tsx`).
* `name` is the name of what the table is rendered for. It is either:
  * a component defined in the file. Its props are read from the type of its props, their default values from the default values of the parameters of the component.
  * a type exported from the file, e.g. `<docoff-react-props src="/components/Button/Button.types.ts" name="ButtonProps">`, or `default` for the type exported by default. Its properties are presented as props, without default values.

### Imported Types

The type of the props can be defined in a separate file. Types imported using relative imports are resolved, the imported files are downloaded from URL relative to the file that imports them. When the import does not specify file extension, `.ts` and `.tsx` files are tried, first as a file, then as an `index` file in a directory.

The requests for the tried files that do not exist fail. They can be avoided by reading the type of the props from a single file that has no relative imports, e.g. bundled type declarations (`*.d.ts`) of a library. Such a file contains no component, so `name` must be the type of the props, and the props are presented without default values.

Types imported from packages are not resolved, only their name is presented, unless the package is listed in the `resolvePackages` option. The option defines where the types of the package are placed, which is either:

* a folder. The path that follows the name of the package in the import is appended to its URL, e.g. `@scope/package/src/components/Button` is downloaded from `https://example.com/package/src/components/Button`, the same way relative imports are.
* a file (`*.ts`, `*.tsx`, `*.d.ts`), e.g. the bundled type declarations of the package. The types are looked up by their names among the exports of the file, regardless of the path they are imported from.

```html
<script>
  window.docoffConfig = {
    reactProps: {
      resolvePackages: {
        '@scope/package': 'https://example.com/package',
        '@scope/another-package': 'https://example.com/another-package.d.ts',
      },
    },
  };
</script>
```

Beware, that:

1. All the imported files must be available for download just as the file in the `src` attribute is.
2. Interfaces are resolved the same way as types are, but an interface declared more than once is not merged.

### Type Evaluation

Types are evaluated before they are presented. Types that cannot be evaluated are presented as they are written, with the types they consist of evaluated, e.g. `Promise<Direction>` is presented as `Promise<'asc' | 'desc'>`.

| What is evaluated | Example | Presented as |
|---|---|---|
| Types listed in `evaluateTypes` | `Partial<Record<'top' \| 'bottom', number>>` | object with optional `top` and `bottom` properties |
| Functions (`expandFunctionSignatures`) | `(direction: Direction) => void` | `(direction: 'asc' \| 'desc') => void` |
| Unions consisting only of unions of literals (`mergeLiteralUnions`) | `ActionColor \| FeedbackColor` | single union of all the values |
| Intersections of objects (`mergeObjectIntersections`) | `Position & Size` | single object with properties of both |

Besides the utility types, `evaluateTypes` lists `keyof` for the `keyof` operator, e.g. `keyof Props`, and `indexedAccess` for indexed access types, e.g. `Props['size']`. An optional property read by indexed access type can be `undefined`, the same way as in TypeScript.

Functions whose parameters cannot be matched to their types, e.g. generic functions, are presented as they are written. Unions that contain other types than literals are kept as they are, so that the values stay grouped. When more objects of an intersection define the same property, the property is of the intersection of the types of its definitions, e.g. `ReactNode & string`, and it is required when any of its definitions is required. The same types are presented only once.

The props themselves are the properties of the evaluated type of the props, so the type can be composed, e.g. `Omit<LibraryButtonProps, 'label'> & { label: string }`. The parts of the type that cannot be resolved, e.g. HTML attributes defined by React, are left out.

### Configuration

The element is configured by the `reactProps` option of the `window.docoffConfig` object. When it is not defined, the following default configuration is used. For the `basePath` option, see [Base Path](#base-path).

```js
window.docoffConfig = {
  basePath: undefined,
  reactProps: {
    evaluateTypes: {
      Awaited: true,
      Capitalize: true,
      Exclude: true,
      Extract: true,
      Lowercase: true,
      NoInfer: true,
      NonNullable: true,
      Omit: true,
      Partial: true,
      Pick: true,
      PropsWithChildren: true,
      Readonly: true,
      ReadonlyArray: true,
      Record: true,
      Required: true,
      Uncapitalize: true,
      Uppercase: true,
      indexedAccess: true,
      keyof: true,
    },
    expandFunctionSignatures: true,
    mergeLiteralUnions: true,
    mergeObjectIntersections: true,
    resolvePackages: {},
  },
};
```

To change the configuration, define `window.docoffConfig` **before** the Docoff bundle is loaded. Only the options that differ from the default configuration need to be defined:

```html
<script>
  window.docoffConfig = {
    reactProps: {
      evaluateTypes: {
        // Do not evaluate the type, only its type arguments
        Omit: false,
        // Evaluate the type using a custom function
        Partial: (tsType) => tsType.elements[0],
        // Evaluate a type that is not evaluated by default
        ReactNode: () => ({ name: 'node' }),
      },
      mergeLiteralUnions: false,
    },
  };
</script>
```

The key in `evaluateTypes` is the name of the type, the value is one of:

* `true` to evaluate the type the default way. It only has an effect for the types of the default configuration.
* `false` to present the type as it is written, with its type arguments evaluated, e.g. `Omit<{ top: number; bottom?: number }, 'bottom'>`.
* A function to evaluate the type the custom way. It gets the type as described by [react-docgen](https://github.com/reactjs/react-docgen), with its type arguments (`elements`) already evaluated, and it returns the type to present in the same format. When it returns nothing, the type is presented the same way as with `false`.

### Type Overriding

When a type cannot be evaluated, or the way it is written is of no use to the reader, the type to present can be defined by the `@docoffOverrideType` tag. The tag can be used in the comment of a type alias, so that it applies to all props of that type, or in the comment of a prop:

```ts
/**
 * Either one of the predefined values or any valid CSS width.
 *
 * @docoffOverrideType PredefinedWidth | string
 */
export type Width = PredefinedWidth | (string & NonNullable<unknown>);
```

The tag is followed by a type that is evaluated instead of the original one, so it can refer to other types available in the file. What is not a valid type, e.g. `@docoffOverrideType any HTML element`, is presented as it is written. The tag is not shown in the description of the prop.

## Base Path

When the site is not deployed at the root of the domain, URLs starting with a slash do not point to the site. The `basePath` option defines the path the site is deployed at. The following URLs are resolved against it when they start with a slash:

* the CSS file of live previews defined by the `--docoff-preview-css` custom property,
* the `src` attribute of the `docoff-react-props` element,
* the URLs in its `resolvePackages` option.

Define `window.docoffConfig` **before** the Docoff bundle is loaded:

```html
<script>
  window.docoffConfig = {
    basePath: '/docs/',
  };
</script>
```

## Development

### Native

**Run locally:** `npm start`

**Build:** `npm run build`

**Test:** `npm test`

### Using Docker

The project ships a Dockerized development environment with the `devcontainer`,
`node` and `playwright` services.

**Set up (once, on the host):** `bash ./setup.sh`

**Run locally:** `docker compose up` — the dev server is served on
`COMPOSE_START_PORT` (`8080` by default).

**Open shell (access to `npm` etc.):** `docker compose exec devcontainer bash`

See [docs/dev-environment.md](./docs/dev-environment.md) for the full setup and
configuration reference, and [docs/ai-integration.md](./docs/ai-integration.md)
for the bundled AI coding assistants and the Chrome-host MCP bridge.
