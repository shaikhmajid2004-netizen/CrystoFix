import type { Metadata } from "next";
import CrystoFixLanding from "./components/crystofix-landing";

export const metadata: Metadata = {
  title: "CrystoFix - Premium Automotive Technology Platform",
  description:
    "Book trusted car services, manage your vehicle, track repairs and discover automotive parts with CrystoFix.",
};

export default function Page() {
  return <CrystoFixLanding />;
}