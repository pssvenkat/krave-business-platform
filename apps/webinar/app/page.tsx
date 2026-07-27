import type { Metadata } from "next";
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Benefits } from "./components/benefits";
import { Trainer } from "./components/trainer";
import { Testimonials } from "./components/testimonials";
import { FaqSection } from "./components/faq";
import { FooterCta } from "./components/footer-cta";
import { StickyCta } from "./components/sticky-cta";
import { getLatestWebinar } from "./lib/get-webinar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const webinar = await getLatestWebinar();

  return {
    title: `${webinar.title} | Krave Microgreens Free Webinar`,
    description: `Join ${webinar.speakerName} live on ${webinar.date} at ${webinar.time}. ${webinar.subtitle}. 100% free — limited seats.`,
    openGraph: {
      title: webinar.title,
      description: webinar.subtitle,
      url: "https://webinar.kravemicrogreens.in",
      siteName: "Krave Microgreens",
      type: "website",
      images: [
        {
          url: "https://webinar.kravemicrogreens.in/og-image.jpg",
          width: 1200,
          height: 630,
          alt: webinar.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: webinar.title,
      description: webinar.subtitle,
    },
  };
}

export default async function HomePage() {
  const webinar = await getLatestWebinar();

  return (
    <>
      <Navbar webinar={webinar} />
      <main>
        <Hero webinar={webinar} />
        <Benefits />
        <Trainer webinar={webinar} />
        <Testimonials />
        <FaqSection />
        <FooterCta webinar={webinar} />
      </main>
      <StickyCta />
    </>
  );
}
