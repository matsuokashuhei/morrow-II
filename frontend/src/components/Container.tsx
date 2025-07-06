import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ContainerProps extends ViewProps {
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  centered?: boolean;
  flex?: boolean;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  padding = 4,
  margin = 0,
  centered = false,
  flex = false,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        flex && styles.flex,
        centered && styles.centered,
        {
          padding: theme.spacing[padding],
          margin: theme.spacing[margin],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Container;
