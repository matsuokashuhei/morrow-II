import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: keyof typeof theme.colors.text | string;
  weight?: keyof typeof theme.typography.fontWeights;
  align?: 'left' | 'center' | 'right' | 'justify';
}

const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'h4':
        return styles.h4;
      case 'h5':
        return styles.h5;
      case 'h6':
        return styles.h6;
      case 'body1':
        return styles.body1;
      case 'body2':
        return styles.body2;
      case 'caption':
        return styles.caption;
      case 'overline':
        return styles.overline;
      default:
        return styles.body1;
    }
  };

  const getColorValue = () => {
    if (color in theme.colors.text) {
      return theme.colors.text[color as keyof typeof theme.colors.text];
    }
    return color;
  };

  return (
    <RNText
      style={[
        getVariantStyles(),
        {
          color: getColorValue(),
          fontWeight: theme.typography.fontWeights[weight],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: theme.typography.fontSizes['6xl'],
    lineHeight: theme.typography.lineHeights['6xl'],
    fontWeight: theme.typography.fontWeights.bold,
  },
  h2: {
    fontSize: theme.typography.fontSizes['5xl'],
    lineHeight: theme.typography.lineHeights['5xl'],
    fontWeight: theme.typography.fontWeights.bold,
  },
  h3: {
    fontSize: theme.typography.fontSizes['4xl'],
    lineHeight: theme.typography.lineHeights['4xl'],
    fontWeight: theme.typography.fontWeights.semibold,
  },
  h4: {
    fontSize: theme.typography.fontSizes['3xl'],
    lineHeight: theme.typography.lineHeights['3xl'],
    fontWeight: theme.typography.fontWeights.semibold,
  },
  h5: {
    fontSize: theme.typography.fontSizes['2xl'],
    lineHeight: theme.typography.lineHeights['2xl'],
    fontWeight: theme.typography.fontWeights.medium,
  },
  h6: {
    fontSize: theme.typography.fontSizes.xl,
    lineHeight: theme.typography.lineHeights.xl,
    fontWeight: theme.typography.fontWeights.medium,
  },
  body1: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.lineHeights.md,
    fontWeight: theme.typography.fontWeights.regular,
  },
  body2: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.sm,
    fontWeight: theme.typography.fontWeights.regular,
  },
  caption: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.xs,
    fontWeight: theme.typography.fontWeights.regular,
  },
  overline: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.xs,
    fontWeight: theme.typography.fontWeights.medium,
    letterSpacing: theme.typography.letterSpacings.wide,
    textTransform: 'uppercase',
  },
});

export default Text;
