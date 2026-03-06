import HeroSection from "@/components/three/HeroSection";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import PersonalProjectsPreview from "@/components/home/PersonalProjectsPreview";

export default function Home() {
  return (
    <main className="relative">
      <div className="relative">
        <HeroSection />
        <ScrollIndicator />
      </div>
      <ProjectsPreview />
      <PersonalProjectsPreview />
    </main>
  );
}
