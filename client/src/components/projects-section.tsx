import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    title: "Data Analysis Dashboard",
    description: "Interactive dashboard for visualizing complex datasets using modern web technologies.",
    image: "https://p1.pxfuel.com/preview/97/32/886/programmer-code-programming-coding-technology-html.jpg",
    demoUrl: "https://your-demo-url.com",
    githubUrl: "https://github.com/EdliraTaipi/dashboard",
    technologies: ["React", "D3.js", "TailwindCSS"]
  },
  {
    title: "Machine Learning Predictor",
    description: "A web application that uses machine learning to make predictions based on user input.",
    image: "https://p1.pxfuel.com/preview/14/432/956/laptop-computer-dark-room.jpg",
    demoUrl: "https://your-demo-url.com",
    githubUrl: "https://github.com/EdliraTaipi/ml-predictor",
    technologies: ["Python", "TensorFlow", "Flask"]
  }
];

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
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="overflow-hidden h-full">
                  <motion.div
                    className="relative h-48 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex gap-4">
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            Code
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}