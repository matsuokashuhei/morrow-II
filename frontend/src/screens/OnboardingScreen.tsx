import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Container, Text, Button, Card } from '../components';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Morrow',
    description: 'Create and share countdowns for your special events with friends and family.',
    icon: '🎉',
  },
  {
    title: 'Create Events',
    description: 'Set up countdowns for birthdays, anniversaries, holidays, and any special moments.',
    icon: '📅',
  },
  {
    title: 'Share with Others',
    description: 'Invite friends and family to join your events and build excitement together.',
    icon: '🤝',
  },
  {
    title: 'Get Notified',
    description: 'Receive reminders and updates so you never miss an important moment.',
    icon: '🔔',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const step = Math.round(offsetX / width);
    setCurrentStep(step);
  };

  return (
    <Container flex style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button variant="text" onPress={handleSkip}>
          Skip
        </Button>
      </View>

      {/* Content */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: currentStep * width, y: 0 }}
        style={styles.scrollView}
      >
        {onboardingSteps.map((step, index) => (
          <View key={index} style={styles.slide}>
            <Container flex centered>
              <Card variant="elevated" padding={8} style={styles.card}>
                <Text variant="h1" align="center" style={styles.icon}>
                  {step.icon}
                </Text>
                <Text
                  variant="h3"
                  weight="bold"
                  align="center"
                  style={styles.title}
                >
                  {step.title}
                </Text>
                <Text
                  variant="body1"
                  color={theme.colors.text.secondary}
                  align="center"
                  style={styles.description}
                >
                  {step.description}
                </Text>
              </Card>
            </Container>
          </View>
        ))}
      </ScrollView>

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentStep
                    ? theme.colors.primary
                    : theme.colors.gray[300],
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Button
          variant="text"
          onPress={handlePrevious}
          disabled={currentStep === 0}
          style={styles.navButton}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onPress={handleNext}
          style={styles.navButton}
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: theme.spacing[4],
  },
  card: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing[6],
  },
  title: {
    marginBottom: theme.spacing[4],
  },
  description: {
    lineHeight: 24,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: theme.spacing[1],
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  navButton: {
    minWidth: 100,
  },
});

export default OnboardingScreen;
