import type { Metadata } from "next";
import { StudentAcademyPlayer } from "./student-academy-player";

export const metadata: Metadata = {
  title: "Krave Academy — Microgreens Masterclass",
  description: "Watch video lessons, track your progress, and earn your certified microgreens grower certificate.",
};

export default function StudentAcademyPage() {
  return <StudentAcademyPlayer />;
}
