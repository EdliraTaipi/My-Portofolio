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
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { BlogChat } from "./blog-chat";
import { useQuery } from "@tanstack/react-query";
import Parser from 'rss-parser';

interface BlogPost {
  id: string;
  title: string;
  link: string;
  content: string;
  date: string;
  categories: string[];
  author: string;
}

const parser = new Parser();

const fetchGitHubBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('/api/github-blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const xmlData = await response.text();
    const feed = await parser.parseString(xmlData);

    return feed.items.map((item, index) => ({
      id: item.guid || String(index),
      title: item.title || 'Untitled',
      link: item.link || '',
      content: item.content || item['content:encoded'] || '',
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      categories: item.categories || [],
      author: item.creator || 'GitHub Blog'
    }));
  } catch (error) {
    console.error('Error fetching GitHub blog posts:', error);
    return [];
  }
};

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['github-blog'],
    queryFn: fetchGitHubBlogPosts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
          <h2 className="text-3xl font-bold mb-8 text-center">Latest from GitHub Blog</h2>

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
              {blogPosts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        {post.categories?.[0] && (
                          <Badge variant="secondary">{post.categories[0]}</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">By {post.author}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories?.slice(1).map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-semibold hover:text-primary transition-colors"
                          onClick={() => setSelectedPost(post)}
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
                  {selectedPost?.title}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  {selectedPost?.categories?.[0] && (
                    <Badge variant="secondary">{selectedPost.categories[0]}</Badge>
                  )}
                  <span>{selectedPost?.date}</span>
                  <span>·</span>
                  <span>By {selectedPost?.author}</span>
                </div>
              </DialogHeader>
              <div className="flex gap-8">
                <div className="flex-1">
                  <div 
                    className="prose prose-neutral dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: selectedPost?.content || '' }}
                  />
                  {selectedPost?.link && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedPost.link, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read on GitHub Blog
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
                  {selectedPost && (
                    <BlogChat
                      postId={selectedPost.id}
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