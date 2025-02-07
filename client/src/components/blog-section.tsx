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
import { MessageCircle, ExternalLink } from "lucide-react";
import { BlogChat } from "./blog-chat";
import { useQuery } from "@tanstack/react-query";

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  tags: string[];
  user: {
    name: string;
  };
  cover_image: string;
}

const fetchDevToArticles = async (): Promise<DevToArticle[]> => {
  try {
    const response = await fetch('/api/dev-articles');
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching DEV.to articles:', error);
    return [];
  }
};

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<DevToArticle | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['dev-articles'],
    queryFn: fetchDevToArticles,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
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
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>

          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              These are featured articles from DEV.to. To show your own articles:
            </p>
            <ol className="mt-4 inline-block text-left">
              <li className="mb-2">1. Create an account on <a href="https://dev.to" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DEV.to</a></li>
              <li className="mb-2">2. Write and publish your articles</li>
              <li>3. Update the username in the API endpoint to match your DEV.to profile</li>
            </ol>
          </div>

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
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No articles found. Start writing on DEV.to to see your posts here!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">DEV.to</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">By {article.user.name}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{article.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-semibold hover:text-primary transition-colors"
                          onClick={() => setSelectedArticle(article)}
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

          <Dialog open={Boolean(selectedArticle)} onOpenChange={(open) => {
            if (!open) {
              setSelectedArticle(null);
              setIsChatOpen(false);
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              {selectedArticle && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">
                      {selectedArticle.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Badge variant="secondary">DEV.to</Badge>
                      <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>By {selectedArticle.user.name}</span>
                    </div>
                  </DialogHeader>
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-4">{selectedArticle.description}</p>
                      {selectedArticle.url && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => window.open(selectedArticle.url, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Read on DEV.to
                          </Button>
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
                      <BlogChat
                        postId={selectedArticle.id.toString()}
                        isOpen={isChatOpen}
                      />
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}