import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface RegistrationConfirmationProps {
  firstName: string;
  webinarTitle: string;
  webinarDate: string; // Human-readable: "27 July 2026"
  webinarTime: string; // Human-readable: "7:00 PM IST"
  speakerName: string;
  calendarUrl?: string;
  whatsappCommunityUrl?: string;
}

/**
 * Registration Confirmation Email
 *
 * Sent immediately after a user registers for a webinar.
 * Includes webinar details, calendar link, and WhatsApp community invite.
 */
export const RegistrationConfirmation = ({
  firstName,
  webinarTitle,
  webinarDate,
  webinarTime,
  speakerName,
  calendarUrl,
  whatsappCommunityUrl,
}: RegistrationConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You&apos;re registered! 🌱 {webinarTitle} on {webinarDate}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>🌱 Krave Microgreens</Text>
          </Section>

          {/* Hero */}
          <Section style={styles.hero}>
            <Heading style={styles.heading}>
              You&apos;re In! 🎉
            </Heading>
            <Text style={styles.subheading}>
              Hi {firstName}, your spot is confirmed.
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

          {/* CTA Buttons */}
          <Section style={styles.ctaSection}>
            {calendarUrl && (
              <Button href={calendarUrl} style={styles.primaryButton}>
                Add to Google Calendar
              </Button>
            )}
            {whatsappCommunityUrl && (
              <Button href={whatsappCommunityUrl} style={styles.secondaryButton}>
                Join WhatsApp Community
              </Button>
            )}
          </Section>

          {/* Reminder Notice */}
          <Section style={styles.reminderSection}>
            <Text style={styles.reminderText}>
              📬 We&apos;ll send you reminders 1 day, 1 hour, and 10 minutes before
              the webinar starts. Keep an eye on your inbox!
            </Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions? Reply to this email – we&apos;re happy to help.
            </Text>
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

export default RegistrationConfirmation;

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
  },
  logoText: {
    color: "#a3d9a5",
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
  },
  hero: {
    backgroundColor: "#1a3c2e",
    padding: "0 40px 40px",
  },
  heading: {
    color: "#ffffff",
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
    lineHeight: "1.2",
  },
  subheading: {
    color: "#a3d9a5",
    fontSize: "18px",
    margin: "12px 0 0",
  },
  detailsCard: {
    backgroundColor: "#f9fdf9",
    margin: "0 40px",
    marginTop: "32px",
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
  ctaSection: {
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    borderRadius: "8px",
    color: "#ffffff",
    display: "block",
    fontSize: "16px",
    fontWeight: "700",
    padding: "14px 28px",
    textDecoration: "none",
    textAlign: "center" as const,
    marginBottom: "12px",
  },
  secondaryButton: {
    backgroundColor: "#25d366",
    borderRadius: "8px",
    color: "#ffffff",
    display: "block",
    fontSize: "16px",
    fontWeight: "700",
    padding: "14px 28px",
    textDecoration: "none",
    textAlign: "center" as const,
  },
  reminderSection: {
    backgroundColor: "#fffbeb",
    margin: "0 40px",
    padding: "16px 20px",
    borderRadius: "8px",
    border: "1px solid #fef3c7",
    marginBottom: "32px",
  },
  reminderText: {
    color: "#92400e",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
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
    lineHeight: "1.5",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
  },
};
