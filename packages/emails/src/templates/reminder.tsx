import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WebinarReminderProps {
  firstName: string;
  webinarTitle: string;
  webinarDate: string;
  webinarTime: string;
  speakerName: string;
  webinarUrl: string;
  reminderType: "1day" | "1hour" | "10min";
}

const REMINDER_COPY = {
  "1day": {
    preview: "Tomorrow's the day! 🌱 Your webinar is tomorrow",
    badge: "TOMORROW",
    badgeColor: "#3b82f6",
    headline: "See You Tomorrow! 🌱",
    subheadline: "Your webinar starts tomorrow. Here's a quick reminder.",
    urgency:
      "Make sure you've added this to your calendar and blocked out the time.",
  },
  "1hour": {
    preview: "Starting in 1 hour! 🎯 Get ready for your webinar",
    badge: "IN 1 HOUR",
    badgeColor: "#f59e0b",
    headline: "Starting in 1 Hour! 🎯",
    subheadline:
      "The webinar is almost here. Find a quiet spot and get ready.",
    urgency: "Click the button below a few minutes early to join.",
  },
  "10min": {
    preview: "Starting in 10 minutes! 🚀 Join now",
    badge: "STARTING SOON",
    badgeColor: "#ef4444",
    headline: "Starting in 10 Minutes! 🚀",
    subheadline: "The webinar is about to begin. Join now!",
    urgency: "Click the button below right now to secure your spot.",
  },
};

/**
 * Webinar Reminder Email
 *
 * Sent at 1 day, 1 hour, and 10 minutes before the webinar starts.
 * Uses the same template with different copy based on reminderType.
 */
export const WebinarReminder = ({
  firstName,
  webinarTitle,
  webinarDate,
  webinarTime,
  speakerName,
  webinarUrl,
  reminderType,
}: WebinarReminderProps) => {
  const copy = REMINDER_COPY[reminderType];

  return (
    <Html>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>🌱 Krave Microgreens</Text>
            <Text
              style={{ ...styles.badge, backgroundColor: copy.badgeColor }}
            >
              {copy.badge}
            </Text>
          </Section>

          {/* Hero */}
          <Section style={styles.hero}>
            <Heading style={styles.heading}>{copy.headline}</Heading>
            <Text style={styles.subheading}>
              Hi {firstName}, {copy.subheadline}
            </Text>
          </Section>

          {/* Webinar Details */}
          <Section style={styles.detailsCard}>
            <Heading as="h2" style={styles.cardTitle}>
              📅 Webinar Details
            </Heading>
            <Text style={styles.detailRow}>
              <strong>Topic:</strong> {webinarTitle}
            </Text>
            <Text style={styles.detailRow}>
              <strong>Speaker:</strong> {speakerName}
            </Text>
            <Text style={styles.detailRow}>
              <strong>Date:</strong> {webinarDate}
            </Text>
            <Text style={styles.detailRow}>
              <strong>Time:</strong> {webinarTime}
            </Text>
          </Section>

          {/* Urgency Text */}
          <Section style={{ padding: "24px 40px 0" }}>
            <Text style={styles.urgencyText}>{copy.urgency}</Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Button href={webinarUrl} style={styles.joinButton}>
              🎬 Join the Webinar
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 Krave Microgreens. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://kravemicrogreens.in" style={styles.link}>
                kravemicrogreens.in
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WebinarReminder;

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = {
  body: {
    backgroundColor: "#f5f5f0",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    maxWidth: "600px",
    borderRadius: "12px",
    overflow: "hidden",
    marginTop: "24px",
    marginBottom: "24px",
  },
  header: {
    backgroundColor: "#1a3c2e",
    padding: "24px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoText: {
    color: "#a3d9a5",
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
  },
  badge: {
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.1em",
    padding: "4px 10px",
    borderRadius: "4px",
    display: "inline-block",
    margin: 0,
  },
  hero: {
    backgroundColor: "#1a3c2e",
    padding: "0 40px 40px",
  },
  heading: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "800",
    margin: 0,
    lineHeight: "1.2",
  },
  subheading: {
    color: "#a3d9a5",
    fontSize: "16px",
    margin: "12px 0 0",
  },
  detailsCard: {
    backgroundColor: "#f9fdf9",
    margin: "32px 40px 0",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #e8f5e9",
  },
  cardTitle: {
    color: "#1a3c2e",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 16px",
  },
  detailRow: {
    color: "#374151",
    fontSize: "15px",
    margin: "8px 0",
    lineHeight: "1.5",
  },
  urgencyText: {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },
  ctaSection: {
    padding: "24px 40px 32px",
    textAlign: "center" as const,
  },
  joinButton: {
    backgroundColor: "#22c55e",
    borderRadius: "8px",
    color: "#ffffff",
    display: "block",
    fontSize: "18px",
    fontWeight: "800",
    padding: "16px 40px",
    textDecoration: "none",
    textAlign: "center" as const,
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "0 40px",
  },
  footer: {
    padding: "24px 40px",
    textAlign: "center" as const,
  },
  footerText: {
    color: "#9ca3af",
    fontSize: "13px",
    margin: "4px 0",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
  },
};
