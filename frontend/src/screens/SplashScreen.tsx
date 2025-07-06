import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Container, Text } from '../components';
import { theme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // アニメーションを開始
    const startAnimation = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimation();

    // 3秒後に画面を終了
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <Container flex centered style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text variant="h1" color={theme.colors.primary} weight="bold">
            M
          </Text>
        </View>
        <Text
          variant="h2"
          color={theme.colors.text.primary}
          weight="bold"
          align="center"
          style={styles.title}
        >
          Morrow
        </Text>
        <Text
          variant="body1"
          color={theme.colors.text.secondary}
          align="center"
          style={styles.tagline}
        >
          Event Countdown Sharing
        </Text>
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    ...theme.shadows.lg,
  },
  title: {
    marginBottom: theme.spacing[2],
  },
  tagline: {
    marginTop: theme.spacing[1],
  },
});

export default SplashScreen;
