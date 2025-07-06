import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Text from './Text';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  children,
  ...props
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.colors.gray[300] : theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? theme.colors.gray[300] : theme.colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.gray[300] : theme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          minHeight: 36,
        };
      case 'md':
        return {
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          minHeight: 44,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing[6],
          paddingVertical: theme.spacing[4],
          minHeight: 52,
        };
      default:
        return {
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          minHeight: 44,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.disabled;

    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text.inverse;
      case 'outline':
        return theme.colors.primary;
      case 'text':
        return theme.colors.primary;
      default:
        return theme.colors.text.inverse;
    }
  };

  const getTextVariant = (): 'body1' | 'body2' => {
    switch (size) {
      case 'sm':
        return 'body2';
      case 'md':
        return 'body1';
      case 'lg':
        return 'body1';
      default:
        return 'body1';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} testID="activity-indicator" />
      ) : (
        <Text
          variant={getTextVariant()}
          color={getTextColor()}
          weight="medium"
          align="center"
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
