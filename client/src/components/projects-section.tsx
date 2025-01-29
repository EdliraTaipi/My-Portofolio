import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GithubButton } from "./github-button";
import { motion } from "framer-motion";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-semibold">Check Out My Work</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-muted-foreground mb-6">
                Visit my GitHub profile to see my latest projects and contributions
              </p>
              <GithubButton />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
