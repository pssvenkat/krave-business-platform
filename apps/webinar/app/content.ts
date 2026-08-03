/**
 * Krave Microgreens Webinar – Content Configuration
 *
 * All webinar-specific content lives here. Update this file for each new webinar
 * without touching any component code.
 */

export const WEBINAR = {
  title: "How to Start a Profitable Microgreens Business from Home",
  subtitle: "Turn 10 sq ft of space into ₹30,000+ monthly income",
  date: "September 14, 2026",
  time: "11:00 AM IST",
  duration: "1.5 hours",
  // ISO string for countdown timer
  dateISO: "2026-09-14T05:30:00.000Z", // 11:00 AM IST = 05:30 UTC
  youtubeVideoId: "dQw4w9WgXcQ", // Replace with your YouTube Live ID
  whatsappCommunityUrl: "https://chat.whatsapp.com/krave-community", // Replace with real link
  googleCalendarUrl:
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=Krave+Microgreens+Webinar" +
    "&dates=20260914T053000Z/20260914T080000Z" +
    "&details=How+to+Start+a+Profitable+Microgreens+Business+from+Home" +
    "&location=YouTube+Live",
  registrationDeadline: "September 13, 2026",
  maxSeats: 500,
};

export const SPEAKER = {
  name: "Venkat Srinivasan",
  title: "Founder & Lead Trainer, Krave Microgreens",
  bio: "Venkat started Krave Microgreens in 2021 with just ₹5,000 and a small balcony. Today Krave is one of India's fastest-growing microgreens brands, training over 2,000 home growers across the country. He is passionate about making sustainable farming accessible to everyone.",
  credentials: [
    "2,000+ students trained",
    "Featured in The Hindu & Economic Times",
    "₹12 Cr+ in collective student revenue",
    "Certified Organic Farmer",
  ],
  imageUrl: "/trainer.jpg", // Place your photo at apps/webinar/public/trainer.jpg
};

export const BENEFITS = [
  {
    icon: "🌱",
    title: "Start with Zero Experience",
    description:
      "No farming background needed. Our proven step-by-step system works for complete beginners.",
  },
  {
    icon: "💰",
    title: "Earn ₹25,000–₹50,000/Month",
    description:
      "Learn exactly how to price, sell, and scale to a full income from microgreens.",
  },
  {
    icon: "📦",
    title: "Sell Before You Grow",
    description:
      "Discover our pre-order strategy so you have paying customers before spending a rupee on seeds.",
  },
  {
    icon: "🏠",
    title: "From Any Space",
    description:
      "A balcony, terrace, or spare room is enough. No land, no greenhouse required.",
  },
  {
    icon: "⚡",
    title: "Harvest in 7–14 Days",
    description:
      "Microgreens are the fastest crop on earth. Get your first harvest and sale within 2 weeks.",
  },
  {
    icon: "🎯",
    title: "Live Q&A with Venkat",
    description:
      "Get your specific questions answered live. Walk away with a personalised action plan.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Bengaluru",
    text: "I was skeptical at first, but within 6 weeks of following Venkat's system I had my first ₹18,000 month. The webinar gave me the confidence to start immediately.",
    rating: 5,
    avatar: "PS",
    crop: "Sunflower & Pea shoots",
  },
  {
    name: "Rajesh Mehta",
    location: "Mumbai",
    text: "I attended the webinar in January 2026. By March I had quit my job. Now I earn more than I ever did as an IT professional, and I'm home with my family.",
    rating: 5,
    avatar: "RM",
    crop: "Radish & Broccoli",
  },
  {
    name: "Anita Krishnan",
    location: "Chennai",
    text: "The most actionable webinar I've ever attended. Not just theory — real numbers, real strategies, real results. Completely free and worth every minute.",
    rating: 5,
    avatar: "AK",
    crop: "Wheatgrass & Lentils",
  },
];

export const FAQ = [
  {
    question: "Is the webinar completely free?",
    answer:
      "Yes, 100% free. There is no catch. We run this webinar to share our knowledge and grow the microgreens community in India.",
  },
  {
    question: "Do I need any farming experience?",
    answer:
      "Absolutely not. The webinar is designed for complete beginners. If you can water a plant, you can grow microgreens.",
  },
  {
    question: "What equipment do I need to start?",
    answer:
      "Just trays, a growing medium, seeds, and water. Your starter setup can cost as little as ₹2,000–₹3,000. We'll cover all of this in the webinar.",
  },
  {
    question: "How much space do I need?",
    answer:
      "As little as 10–20 square feet. A small balcony, terrace, or even a shelf inside your home works perfectly.",
  },
  {
    question: "Will the recording be available?",
    answer:
      "We plan to share a replay with registered attendees. However, attending live gives you access to the Q&A session with Venkat.",
  },
  {
    question: "How quickly can I start earning?",
    answer:
      "Microgreens have a 7–14 day grow cycle. With our pre-order strategy, many students make their first sale before their first harvest.",
  },
  {
    question: "Is there a Krave community I can join?",
    answer:
      "Yes! After registering, you'll get access to our WhatsApp community with 5,000+ active growers who share tips, sales channels, and support.",
  },
  {
    question: "What cities does this work in?",
    answer:
      "Microgreens sell in every Indian city. We have active students in Tier 1 cities (Bengaluru, Mumbai, Delhi) and Tier 2 cities (Coimbatore, Nagpur, Jaipur) alike.",
  },
];

export const LEAD_SOURCES = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google Search" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referral", label: "Friend / Referral" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];
