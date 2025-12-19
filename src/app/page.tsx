import NavBar from "@/components/navbar";
import Image from "next/image";
import Hero from "./_components/hero-section";
import WrapperSection from "./_components/wrapper-section";
import FeatureSection from "./_components/feature-section";
import Footer from "./_components/footer";
import SubscriptionSection from "./_components/subscription-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white gap-0">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className=" max-w">
        <Hero />
        <WrapperSection />
        <FeatureSection />
        <SubscriptionSection />
        <Footer />
      </div>
    </div>
  );
}
