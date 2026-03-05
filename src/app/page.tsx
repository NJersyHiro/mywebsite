import HeroSection from "@/components/three/HeroSection";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import ProjectsPreview from "@/components/home/ProjectsPreview";

export default function Home() {
  return (
    <main className="relative">
      <div className="relative">
        <HeroSection />
        <ScrollIndicator />
      </div>
      <ProjectsPreview />
    </main>
  );
}
