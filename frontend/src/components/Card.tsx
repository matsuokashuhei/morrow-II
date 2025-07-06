import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof theme.spacing;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 4,
  style,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border.medium,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.gray[50],
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        { padding: theme.spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
  },
});

export default Card;
