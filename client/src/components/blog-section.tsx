import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { BlogChat } from "./blog-chat";
import { useQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";

interface Repository {
  id: number;
  name: string;
  description: string;
  created_at: string;
  topics: string[];
  html_url: string;
  homepage: string;
  language: string;
  readme?: string;
}

const octokit = new Octokit();

const fetchGitHubRepositories = async (): Promise<Repository[]> => {
  try {
    // Fetch repositories
    const { data: repos } = await octokit.repos.listForUser({
      username: 'EdliraTaipi',
      sort: 'updated',
      per_page: 9
    });

    // Fetch README content for each repository
    const reposWithReadme = await Promise.all(
      repos.map(async (repo) => {
        try {
          const { data: readme } = await octokit.repos.getReadme({
            owner: 'EdliraTaipi',
            repo: repo.name,
          });

          const readmeContent = Buffer.from(readme.content, 'base64').toString('utf-8');
          return { ...repo, readme: readmeContent };
        } catch (error) {
          console.log(`No README found for ${repo.name}`);
          return repo;
        }
      })
    );

    return reposWithReadme;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<Repository | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ['github-blogs'],
    queryFn: fetchGitHubRepositories
  });

  return (
    <section id="blog" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Projects & Articles</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {repositories?.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{repo.language || 'Project'}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(repo.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight mb-2">{repo.name}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{repo.description || 'Click to read more...'}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics?.map((topic) => (
                          <Badge key={topic} variant="outline">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-semibold hover:text-primary transition-colors"
                          onClick={() => setSelectedPost(repo)}
                        >
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <Dialog open={!!selectedPost} onOpenChange={() => {
            setSelectedPost(null);
            setIsChatOpen(false);
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">
                  {selectedPost?.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Badge variant="secondary">{selectedPost?.language || 'Project'}</Badge>
                  <span>
                    {selectedPost && new Date(selectedPost.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </DialogHeader>
              <div className="flex gap-8">
                <div className="flex-1">
                  <div className="prose prose-neutral dark:prose-invert">
                    {selectedPost?.readme ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedPost.readme }} />
                    ) : (
                      <p>{selectedPost?.description || 'No description available.'}</p>
                    )}
                  </div>
                  {selectedPost?.html_url && (
                    <div className="mt-4 space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedPost.html_url, '_blank')}
                      >
                        View on GitHub →
                      </Button>
                      {selectedPost.homepage && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(selectedPost.homepage, '_blank')}
                        >
                          View Live Demo →
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-80 flex flex-col">
                  <Button
                    variant="outline"
                    className="mb-4 gap-2"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {isChatOpen ? 'Close Chat' : 'Join Discussion'}
                  </Button>
                  {selectedPost && (
                    <BlogChat
                      postId={selectedPost.id.toString()}
                      isOpen={isChatOpen}
                    />
                  )}
                </div>
              </div>
              <Button
                className="absolute right-4 top-4"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedPost(null);
                  setIsChatOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}