import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TextType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "span"
  | "normal"
  | "small"
  | "large"
  | "strong"
  | "link"
  | "postTitle";

type TagType = keyof Pick<HTMLElementTagNameMap, "h1" | "h2" | "h3" | "h4" | "p" | "span">;

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag?: TagType;
  type?: TextType;
  children: ReactNode;
  muted?: boolean;
}

function getTag(type: TextType) {
  switch (type) {
    case "h1":
      return "h1" as TagType;
    case "h2":
      return "h2" as TagType;
    case "h3":
      return "h3" as TagType;
    case "h4":
      return "h4" as TagType;
    case "span":
      return "span" as TagType;
    default:
      return "p" as TagType;
  }
}

const typeStylesLookup: Record<TextType, string> = {
  h1: "text-4xl sm:text-6xl font-bold leading-[1.1] sm:leading-[1.1] antialiased",
  h2: "text-3xl sm:text-5xl font-bold leading-[1.1] sm:leading-[1.1] antialiased",
  h3: "text-2xl font-bold antialiased",
  h4: "text-xl font-bold",
  normal: "text-base",
  span: "text-base",
  small: "text-sm",
  large: "text-xl sm:text-2xl",
  strong: "text-base font-semibold",
  link: "text-sm hover:text-foreground font-semibold inline-block hover:underline",
  postTitle: "text-sm sm:text-base font-semibold uppercase",
};

/**
 * A versatile text component that applies consistent styling based on text type.
 *
 * @component
 * @param {TagType} [tag] - HTML tag to override default tag selection ('h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span')
 * @param {TextType} [type='normal'] - Predefined text style variant
 *   ('h1' | 'h2' | 'h3' | 'h4' | 'normal' | 'small' | 'large' | 'strong' | 'link' | 'postTitle')
 * @param {string} [className] - Additional CSS classes to apply
 * @param {ReactNode} children - Content to be rendered within the text component
 *
 * @example
 * // Heading with default h1 tag
 * <Text type="h1">Hello World</Text>
 *
 * @example
 * // Custom tag with predefined style
 * <Text tag="span" type="large">Custom text</Text>
 *
 * @returns {JSX.Element} Styled text component
 */
export const Text: React.FC<TextProps> = ({
  tag = null,
  className,
  type = "normal",
  children,
  muted = false,
}) => {
  const Component = tag ? tag : getTag(type);
  const baseStyles = "block";
  const typeStyles = `${typeStylesLookup[type]}`;
  const mutedStyles = muted ? "text-muted" : "";

  return (
    <Component className={cn(baseStyles, typeStyles, mutedStyles, className)}>{children}</Component>
  );
};
