import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";

interface Repository {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  language: string;
}

const octokit = new Octokit();

export function ProjectsSection() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['github-projects'],
    queryFn: async () => {
      const response = await octokit.repos.listForUser({
        username: 'EdliraTaipi',
        sort: 'updated',
        per_page: 6
      });
      return response.data;
    }
  });

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
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-48 bg-muted" />
                  <CardContent className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects?.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="overflow-hidden h-full">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.language && (
                          <Badge variant="secondary">
                            {project.language}
                          </Badge>
                        )}
                        {project.topics?.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.homepage && (
                          <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" size="sm" className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Live Demo
                            </Button>
                          </a>
                        )}
                        <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            View Code
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}