import { ThemeToggle } from "@/components/theme-toggle";
import { NavigationBar } from "@/components/navigation-bar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { BlogSection } from "@/components/blog-section";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { FloatingGithubButton } from "@/components/floating-github-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <NavigationBar />
      <FloatingGithubButton />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}