import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container, Text, Button, Card } from '../components';
import { theme } from '../theme';

const HomeScreen = () => {
  const handleCreateEvent = () => {
    console.log('Create event pressed');
  };

  const handleJoinEvent = () => {
    console.log('Join event pressed');
  };

  return (
    <Container flex style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text variant="h2" weight="bold" style={styles.title}>
            Welcome to Morrow!
          </Text>
          <Text
            variant="body1"
            color={theme.colors.text.secondary}
            align="center"
            style={styles.subtitle}
          >
            Create and share countdowns for your special moments
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Card variant="elevated" padding={6} style={styles.actionCard}>
            <Text variant="h6" weight="semibold" style={styles.cardTitle}>
              🎉 Create Event
            </Text>
            <Text
              variant="body2"
              color={theme.colors.text.secondary}
              style={styles.cardDescription}
            >
              Set up a countdown for your special occasion
            </Text>
            <Button
              variant="primary"
              onPress={handleCreateEvent}
              style={styles.actionButton}
            >
              Create New Event
            </Button>
          </Card>

          <Card variant="elevated" padding={6} style={styles.actionCard}>
            <Text variant="h6" weight="semibold" style={styles.cardTitle}>
              🤝 Join Event
            </Text>
            <Text
              variant="body2"
              color={theme.colors.text.secondary}
              style={styles.cardDescription}
            >
              Join friends and family in their celebrations
            </Text>
            <Button
              variant="outline"
              onPress={handleJoinEvent}
              style={styles.actionButton}
            >
              Join Event
            </Button>
          </Card>
        </View>

        {/* Recent Events Section */}
        <View style={styles.section}>
          <Text variant="h5" weight="semibold" style={styles.sectionTitle}>
            Recent Events
          </Text>
          <Card variant="outlined" padding={4} style={styles.emptyCard}>
            <Text
              variant="body2"
              color={theme.colors.text.secondary}
              align="center"
            >
              No events yet. Create your first event to get started!
            </Text>
          </Card>
        </View>

        {/* Features Preview */}
        <View style={styles.section}>
          <Text variant="h5" weight="semibold" style={styles.sectionTitle}>
            What you can do
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text variant="body2" style={styles.featureText}>
                📅 Create countdowns for any event
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="body2" style={styles.featureText}>
                🎨 Customize with themes and colors
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="body2" style={styles.featureText}>
                👥 Share with friends and family
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="body2" style={styles.featureText}>
                🔔 Get notified as events approach
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
  },
  title: {
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  subtitle: {
    lineHeight: 22,
  },
  quickActions: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  actionCard: {
    marginBottom: theme.spacing[4],
  },
  cardTitle: {
    marginBottom: theme.spacing[2],
  },
  cardDescription: {
    marginBottom: theme.spacing[4],
    lineHeight: 20,
  },
  actionButton: {
    marginTop: theme.spacing[2],
  },
  section: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  emptyCard: {
    paddingVertical: theme.spacing[8],
  },
  featureList: {
    gap: theme.spacing[3],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    lineHeight: 20,
  },
});

export default HomeScreen;
