type names = string[];

type Margin = {
  top: number,
  bottom: number,
}

type DisplayOptions = {
  /**
   * Whether to bold the name
   */
  bold: boolean,

  /**
   * The color to use
   */
  color?: string,

  margin?: Margin;
};

interface HtmlHeading {
  /**
   * The level of the heading 1-6
   */
  level: number;

  /**
   * The heading text
   */
  text: string;
}

export type GreetingProps = {
  /**
   * Display options
   */
  displayOptions: DisplayOptions,

  /**
   * The greeting to use
   */
  greeting?: string,

  /**
   * The heading of the component
   */
  heading?: HtmlHeading,

  /**
   * Name to greet
   */
  names: names,
}
