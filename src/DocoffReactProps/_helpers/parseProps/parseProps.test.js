import { evaluateTSType } from '../evaluateTSType';
import { getTSTypeText } from '../getTSTypeText';
import { getTypeProperties } from '../getTypeProperties';
import { parseProps } from './parseProps';

const files = {
  'http://localhost/components/Box/Box.tsx': `
    import React, { PropsWithChildren } from 'react';

    type BoxProps = {
      /**
       * Padding of the box.
       */
      padding?: number;
    };

    export const Box = ({ children, padding = 0 }: PropsWithChildren<BoxProps>) => (
      <div style={{ padding }}>{children}</div>
    );

    export const Panel: React.FC<React.PropsWithChildren<BoxProps>> = ({ children }) => <div>{children}</div>;

    export const Label = ({ children }: PropsWithChildren<{ children: string }>) => <span>{children}</span>;

    type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
      /**
       * Target of the link.
       */
      href: string;
    };

    export const Link = ({ children, href }: PropsWithChildren<LinkProps>) => <a href={href}>{children}</a>;
  `,
  'http://localhost/components/Button/Button.tsx': `
    import React from 'react';
    import type { ButtonProps } from './Button.types';

    const renderLabel = (label: string) => (<span>{label}</span>);

    export const Button = ({ color = 'primary', icon, label, size }: ButtonProps) => (
      <button className={color + size}>
        {icon}
        {renderLabel(label)}
      </button>
    );
  `,
  'http://localhost/components/Button/Button.types.ts': `
    import type { ButtonHTMLAttributes } from 'react';
    import type { Color, Size } from '../../types';

    export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
      /**
       * Color variant.
       */
      color?: Color;
      /**
       * Icon of the button.
       */
      icon?: React.ReactNode;
      /**
       * Button label.
       */
      label: string;
      /**
       * Size of the button.
       */
      size?: Size;
    };
  `,
  'http://localhost/components/Card/Card.tsx': `
    import type { CardProps } from './index';

    export const Card = ({ title }: CardProps) => (<h2>{title}</h2>);
  `,
  'http://localhost/components/Card/Card.types.ts': `
    export type Props = {
      /**
       * Title of the card.
       */
      title: string;
    };
  `,
  'http://localhost/components/Card/index.ts': `
    export * from './Card.types';
    export type { Props as CardProps } from './Card.types';
  `,
  'http://localhost/components/FormLayout/FormLayout.types.ts': `
    type Margin = { top: number; bottom?: number };

    type Spacing = Margin & { start?: number };

    const gaps = { small: 4, 'x-large': 16 };

    type Theme = { colors: { primary: string; secondary: string } };

    type FieldWidth = 'auto' | 'full';

    /**
     * Either a predefined value or any valid CSS width.
     *
     * @docoffOverrideType FieldWidth | string
     */
    export type HelpTextWidth = FieldWidth | (string & NonNullable<unknown>);

    export type FormLayoutProps = {
      /**
       * Element the layout is rendered into.
       *
       * @docoffOverrideType any HTML element
       */
      container?: HTMLElement | null;
      /**
       * Width of the fields.
       *
       * @docoffOverrideType FieldWidth | number
       */
      fieldWidth?: FieldWidth | (number & NonNullable<unknown>);
      /**
       * Width of the help texts.
       */
      helpTextWidth?: HelpTextWidth;
      /**
       * Width of the labels.
       */
      labelWidth?: 'auto' | (string & NonNullable<unknown>);
      /**
       * Margin of the layout.
       *
       * @docoffOverrideType Omit<Margin, 'bottom'> | Exclude<FieldWidth, 'full'>
       */
      margin?: unknown;
      /**
       * Names of the fields.
       */
      names?: readonly string[];
      /**
       * Called when the layout is resized.
       */
      onResize?(width: number, ...heights: number[]): void;
      /**
       * Side of the label.
       */
      side?: keyof Margin;
      /**
       * Gap between the fields.
       */
      gap?: keyof typeof gaps;
      /**
       * Gap between the rows.
       */
      rowGap?: keyof (typeof gaps);
      /**
       * Color of the theme.
       */
      colorName?: keyof Theme['colors'];
      /**
       * Edge of the layout.
       */
      edge?: keyof (Margin & { start: number });
      /**
       * Space before the layout.
       */
      start?: Spacing['start'];
      /**
       * Tag to render.
       */
      tag?: keyof HTMLElementTagNameMap;
      /**
       * Space above the layout.
       */
      top?: Spacing['top'];
    };
  `,
  'http://localhost/components/Grid/Grid.types.ts': `
    type Breakpoint = 'xs' | 'sm';

    type Responsive<Value> = Value | Partial<Record<Breakpoint, Value>>;

    type Tree<Value> = { children?: Tree<Value>[]; value: Value };

    export type GridProps = {
      /**
       * Number of columns.
       */
      columns?: Responsive<string>;
      /**
       * Gap between columns.
       */
      gap?: Responsive<0 | 1>;
      /**
       * Items of the grid.
       */
      items?: Tree<string>;
    };
  `,
  'http://localhost/components/Header/Header.types.ts': `
    export default interface HeaderProps {
      /**
       * Size of the header.
       */
      size?: number;
    }
  `,
  'http://localhost/components/Heading/Heading.tsx': `
    import React from 'react';

    interface BaseProps {
      /**
       * ID of the element.
       */
      id?: string;
    }

    interface Icon {
      name: string;
      size?: number;
    }

    interface HeadingProps extends BaseProps {
      /**
       * Icon of the heading.
       */
      icon?: Icon;
      /**
       * Level of the heading.
       */
      level: 1 | 2;
    }

    export const Heading: React.FC<HeadingProps> = ({ icon, id, level = 1 }) => (
      <h1 id={id}>{level}{icon?.name}</h1>
    );
  `,
  'http://localhost/components/Switch/Switch.tsx': `
    import React from 'react';
    import type { ToggleProps } from '../Toggle';

    export const Switch = ({ disabled = false, label }: ToggleProps) => <label>{label}</label>;
  `,
  'http://localhost/components/Switch/Switch.types.ts': `
    import type { ToggleLabelPosition } from '../Toggle';

    export type SwitchProps = {
      /**
       * Side of the label.
       */
      labelPosition?: ToggleLabelPosition;
    };
  `,
  'http://localhost/components/Toggle/Toggle.types.ts': `
    import type { ToggleProps as LibraryToggleProps } from '@library/ui/src/components/Toggle';

    export type { ToggleLabelPosition } from '@library/ui/src/components/Toggle';

    export type ToggleProps = Omit<LibraryToggleProps, 'label'> & {
      /**
       * Toggle label.
       */
      label: string;
    };
  `,
  'http://localhost/types/colors.ts': `
    type ActionColor = 'primary' | 'secondary';

    export type Color = ActionColor | 'light';
  `,
  'http://localhost/types/index.ts': `
    export type { Color } from './colors';
    export * from './sizes';
  `,
  'http://localhost/types/sizes.ts': `
    type Size = 'small' | 'large';

    export type { Size };
  `,
  'https://cdn.test/library.d.ts': `
    import * as React$1 from 'react';

    export type ToggleLabelPosition = "before" | "after";
    export type ToggleProps = Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "type"> & {
      /**
       * If \`true\`, the input will be disabled.
       */
      disabled?: boolean;
      /**
       * Label of the input.
       */
      label: React$1.ReactNode;
      /**
       * Placement of the label.
       */
      labelPosition?: ToggleLabelPosition;
    };

    declare const avatarSizes: {
      small: number;
      large: number;
    };
    export type AvatarSize = keyof typeof avatarSizes;
    export type AvatarProps = {
      /**
       * Size of the avatar.
       */
      size?: AvatarSize;
    };

    export {};
  `,
  'https://cdn.test/library/src/components/Toggle/Toggle.types.ts': `
    import type { InputHTMLAttributes, ReactNode } from 'react';

    export type ToggleLabelPosition = 'before' | 'after';

    export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
      /**
       * If \`true\`, the input will be disabled.
       */
      disabled?: boolean;
      /**
       * Label of the input.
       */
      label: ReactNode;
      /**
       * Placement of the label.
       */
      labelPosition?: ToggleLabelPosition;
    };
  `,
  'https://cdn.test/library/src/components/Toggle/index.ts': `
    export type { ToggleLabelPosition, ToggleProps } from './Toggle.types';
  `,
};

const BUTTON_URL = 'http://localhost/components/Button/Button.tsx';
const BUTTON_TYPES_URL = 'http://localhost/components/Button/Button.types.ts';
const FORM_LAYOUT_TYPES_URL = 'http://localhost/components/FormLayout/FormLayout.types.ts';
const TOGGLE_TYPES_URL = 'http://localhost/components/Toggle/Toggle.types.ts';

// Presents the props the way they are presented in the table
const getProps = async (url, name, resolvePackages, resolveRelativeImports) => {
  const props = await parseProps(files[url], url, name, resolvePackages, resolveRelativeImports);
  const properties = getTypeProperties(props.types.map((tsType) => evaluateTSType(tsType)));

  return Object.fromEntries(properties.map((property) => [
    property.key,
    {
      defaultValue: props.defaultValues[property.key],
      description: property.description,
      required: property.value.required,
      type: getTSTypeText(property.value),
    },
  ]));
};

// Query string and fragment do not change the file that is downloaded
const getFile = (url) => files[url.replace(/[?#].*$/, '')];

const getFetchedUrls = () => global.fetch.mock.calls
  .map(([url]) => url)
  .filter((url) => getFile(url) !== undefined)
  .sort();

describe('functionality', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (url) => (
      getFile(url) !== undefined
        ? new Response(getFile(url))
        : new Response('<html></html>', {
          headers: { 'content-type': 'text/html' },
          status: url.endsWith('.tsx') ? 200 : 404,
        })
    ));
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('reads props of the component of the given name', async () => {
    expect(await getProps(BUTTON_URL, 'Button')).toEqual({
      color: {
        defaultValue: '\'primary\'',
        description: 'Color variant.',
        required: false,
        type: '\'primary\' | \'secondary\' | \'light\'',
      },
      icon: {
        defaultValue: undefined,
        description: 'Icon of the button.',
        required: false,
        type: 'ReactNode',
      },
      label: {
        defaultValue: undefined,
        description: 'Button label.',
        required: true,
        type: 'string',
      },
      size: {
        defaultValue: undefined,
        description: 'Size of the button.',
        required: false,
        type: '\'small\' | \'large\'',
      },
    });
  });

  it('downloads each imported file only once', async () => {
    await getProps(BUTTON_URL, 'Button');

    expect(getFetchedUrls()).toEqual([
      BUTTON_TYPES_URL,
      'http://localhost/types/colors.ts',
      'http://localhost/types/index.ts',
      'http://localhost/types/sizes.ts',
    ]);
  });

  it('reads the type of the given name', async () => {
    const props = await getProps(BUTTON_TYPES_URL, 'ButtonProps');

    expect(Object.keys(props)).toEqual(['color', 'icon', 'label', 'size']);
    expect(props.color).toEqual({
      defaultValue: undefined,
      description: 'Color variant.',
      required: false,
      type: '\'primary\' | \'secondary\' | \'light\'',
    });
    // The file with the type is not downloaded again
    expect(getFetchedUrls()).not.toContain(BUTTON_TYPES_URL);
  });

  it('reads the type exported by default', async () => {
    expect(await getProps('http://localhost/components/Header/Header.types.ts', 'default')).toEqual({
      size: {
        defaultValue: undefined,
        description: 'Size of the header.',
        required: false,
        type: 'number',
      },
    });
  });

  it('reads no props when nothing of the given name is exported', async () => {
    expect(await getProps(BUTTON_URL, 'Unknown')).toEqual({});
    // Files downloaded when a component is looked for are not downloaded again when a type is looked for
    expect(getFetchedUrls()).toEqual([...new Set(getFetchedUrls())]);
    expect(await getProps(BUTTON_URL, 'renderLabel')).toEqual({});
  });

  it('does not resolve types of packages by default', async () => {
    expect(Object.keys(await getProps(TOGGLE_TYPES_URL, 'ToggleProps'))).toEqual(['label']);
  });

  it.each([
    ['folder', 'https://cdn.test/library', [
      'https://cdn.test/library/src/components/Toggle/Toggle.types.ts',
      'https://cdn.test/library/src/components/Toggle/index.ts',
    ]],
    ['folder with trailing slash', 'https://cdn.test/library/', [
      'https://cdn.test/library/src/components/Toggle/Toggle.types.ts',
      'https://cdn.test/library/src/components/Toggle/index.ts',
    ]],
    ['file', 'https://cdn.test/library.d.ts', ['https://cdn.test/library.d.ts']],
    ['file with query string', 'https://cdn.test/library.d.ts?v=1', ['https://cdn.test/library.d.ts?v=1']],
  ])('resolves types of the package placed in a %s', async (placement, packageUrl, expectedFetchedUrls) => {
    // The type wraps a type of the package that has the same name
    expect(await getProps(TOGGLE_TYPES_URL, 'ToggleProps', { '@library/ui': packageUrl })).toEqual({
      disabled: {
        defaultValue: undefined,
        description: 'If `true`, the input will be disabled.',
        required: false,
        type: 'boolean',
      },
      label: {
        defaultValue: undefined,
        description: 'Toggle label.',
        required: true,
        type: 'string',
      },
      labelPosition: {
        defaultValue: undefined,
        description: 'Placement of the label.',
        required: false,
        type: '\'before\' | \'after\'',
      },
    });
    expect(getFetchedUrls()).toEqual(expectedFetchedUrls);
  });

  it('reads a type passed on under another name from a file that is passed on as a whole too', async () => {
    expect(await getProps('http://localhost/components/Card/Card.tsx', 'Card')).toEqual({
      title: {
        defaultValue: undefined,
        description: 'Title of the card.',
        required: true,
        type: 'string',
      },
    });
  });

  it('reads a type that is only passed on from a package', async () => {
    const { types } = await parseProps(
      files[TOGGLE_TYPES_URL],
      TOGGLE_TYPES_URL,
      'ToggleLabelPosition',
      { '@library/ui': 'https://cdn.test/library.d.ts' },
    );

    expect(types.map(getTSTypeText)).toEqual(['\'before\' | \'after\'']);
  });

  it('reads a type from bundled type declarations without downloading any file', async () => {
    expect(Object.keys(await getProps('https://cdn.test/library.d.ts', 'ToggleProps')))
      .toEqual(['disabled', 'label', 'labelPosition']);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('evaluates `keyof typeof` of value declared without initial value in type declarations', async () => {
    expect(await getProps('https://cdn.test/library.d.ts', 'AvatarProps')).toEqual({
      size: {
        defaultValue: undefined,
        description: 'Size of the avatar.',
        required: false,
        type: '\'small\' | \'large\'',
      },
    });
  });

  it('looks up relative imports of the component in the given file instead of downloading them', async () => {
    expect(await getProps(
      'http://localhost/components/Switch/Switch.tsx',
      'Switch',
      {},
      'https://cdn.test/library.d.ts',
    )).toEqual({
      disabled: {
        defaultValue: 'false',
        description: 'If `true`, the input will be disabled.',
        required: false,
        type: 'boolean',
      },
      label: {
        defaultValue: undefined,
        description: 'Label of the input.',
        required: true,
        type: 'ReactNode',
      },
      labelPosition: {
        defaultValue: undefined,
        description: 'Placement of the label.',
        required: false,
        type: '\'before\' | \'after\'',
      },
    });
    expect(global.fetch.mock.calls.map(([url]) => url)).toEqual(['https://cdn.test/library.d.ts']);
  });

  it('downloads relative imports when the given file cannot be downloaded', async () => {
    expect(Object.keys(await getProps(BUTTON_URL, 'Button', {}, 'https://cdn.test/missing.d.ts')))
      .toEqual(['color', 'icon', 'label', 'size']);
    expect(getFetchedUrls()).toContain(BUTTON_TYPES_URL);
  });

  it('looks up relative imports of the file with the type in the given file', async () => {
    expect(await getProps(
      'http://localhost/components/Switch/Switch.types.ts',
      'SwitchProps',
      {},
      'https://cdn.test/library.d.ts',
    )).toEqual({
      labelPosition: {
        defaultValue: undefined,
        description: 'Side of the label.',
        required: false,
        type: '\'before\' | \'after\'',
      },
    });
    expect(global.fetch.mock.calls.map(([url]) => url)).toEqual(['https://cdn.test/library.d.ts']);
  });

  it('resolves types that `react-docgen` does not recognize', async () => {
    const props = await getProps(FORM_LAYOUT_TYPES_URL, 'FormLayoutProps');

    // Parenthesized type
    expect(props.labelWidth.type).toEqual('\'auto\' | string & NonNullable<unknown>');
    // Read-only type
    expect(props.names.type).toEqual('string[]');
    // Types with `keyof` operator
    expect(props.side.type).toEqual('\'top\' | \'bottom\'');
    expect(props.tag.type).toEqual('keyof HTMLElementTagNameMap');
    expect(props.gap.type).toEqual('\'small\' | \'x-large\'');
    expect(props.rowGap.type).toEqual('\'small\' | \'x-large\'');
    expect(props.colorName.type).toEqual('\'primary\' | \'secondary\'');
    expect(props.edge.type).toEqual('\'top\' | \'bottom\' | \'start\'');
    // Method
    expect(props.onResize).toEqual({
      defaultValue: undefined,
      description: 'Called when the layout is resized.',
      required: false,
      type: '(width: number, ...heights: number[]) => void',
    });
    // Indexed access types
    expect(props.start.type).toEqual('number | undefined');
    expect(props.top.type).toEqual('number');
  });

  it('resolves generic types for each use of them', async () => {
    const props = await getProps('http://localhost/components/Grid/Grid.types.ts', 'GridProps');

    expect(props.columns.type).toEqual('string | { xs?: string; sm?: string }');
    expect(props.gap.type).toEqual('0 | 1 | { xs?: 0 | 1; sm?: 0 | 1 }');
    // Generic type that refers to itself does not cause an endless loop
    expect(props.items.type).toEqual('{ children?: Tree[]; value: string }');
  });

  it('reads children added by `PropsWithChildren` to props of the component', async () => {
    const url = 'http://localhost/components/Box/Box.tsx';

    expect(await getProps(url, 'Box')).toEqual({
      children: {
        defaultValue: undefined,
        description: undefined,
        required: false,
        type: 'ReactNode',
      },
      padding: {
        defaultValue: '0',
        description: 'Padding of the box.',
        required: false,
        type: 'number',
      },
    });
    expect(Object.keys(await getProps(url, 'Panel'))).toEqual(['children', 'padding']);
    // Props that are an intersection with types that cannot be resolved
    expect(Object.keys(await getProps(url, 'Link'))).toEqual(['children', 'href']);
    // Children that are already defined are kept
    expect((await getProps(url, 'Label')).children).toEqual({
      defaultValue: undefined,
      description: undefined,
      required: true,
      type: 'string',
    });
  });

  it('resolves interfaces', async () => {
    const url = 'http://localhost/components/Heading/Heading.tsx';

    expect(await getProps(url, 'Heading')).toEqual({
      icon: {
        defaultValue: undefined,
        description: 'Icon of the heading.',
        required: false,
        type: '{ name: string; size?: number }',
      },
      id: {
        defaultValue: undefined,
        description: 'ID of the element.',
        required: false,
        type: 'string',
      },
      level: {
        defaultValue: '1',
        description: 'Level of the heading.',
        required: true,
        type: '1 | 2',
      },
    });
  });

  it('uses type defined by the `@docoffOverrideType` tag', async () => {
    const props = await getProps(FORM_LAYOUT_TYPES_URL, 'FormLayoutProps');

    // Tag of the property, it is not a part of the description
    expect(props.fieldWidth).toEqual({
      defaultValue: undefined,
      description: 'Width of the fields.',
      required: false,
      type: '\'auto\' | \'full\' | number',
    });
    // Tag of the type alias
    expect(props.helpTextWidth.type).toEqual('\'auto\' | \'full\' | string');
    // Tag with types that are evaluated
    expect(props.margin.type).toEqual('{ top: number } | \'auto\'');
    // Tag that is not a valid type
    expect(props.container.type).toEqual('any HTML element');
  });
});
