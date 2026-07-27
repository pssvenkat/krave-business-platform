import type { Metadata } from "next";
import { WEBINAR, SPEAKER } from "./content";
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Benefits } from "./components/benefits";
import { Trainer } from "./components/trainer";
import { Testimonials } from "./components/testimonials";
import { FaqSection } from "./components/faq";
import { FooterCta } from "./components/footer-cta";
import { StickyCta } from "./components/sticky-cta";

export const metadata: Metadata = {
  title: `${WEBINAR.title} | Krave Microgreens Free Webinar`,
  description: `Join ${SPEAKER.name} live on ${WEBINAR.date} at ${WEBINAR.time}. Learn how to start a profitable microgreens business from home. 100% free — limited seats.`,
  openGraph: {
    title: WEBINAR.title,
    description: WEBINAR.subtitle,
    url: "https://webinar.kravemicrogreens.in",
    siteName: "Krave Microgreens",
    type: "website",
    images: [
      {
        url: "https://webinar.kravemicrogreens.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: WEBINAR.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WEBINAR.title,
    description: WEBINAR.subtitle,
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Trainer />
        <Testimonials />
        <FaqSection />
        <FooterCta />
      </main>
      <StickyCta />
    </>
  );
}
