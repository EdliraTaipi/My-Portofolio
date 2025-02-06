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

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  published_at: string;
  tags: string[];
  url: string;
  reading_time_minutes: number;
  body_html: string;
  user: {
    name: string;
  }
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  content?: string;
  url?: string;
  author?: string;
}

// Default blog posts as fallback
const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Web Development",
    date: "February 6, 2025",
    excerpt: "A comprehensive guide to modern web development practices and tools",
    category: "Web Development",
    readTime: "5 min read",
    content: "Welcome to web development! This guide will help you get started...",
    author: "Edlira Taipi"
  },
  {
    id: "2",
    title: "Understanding Data Structures",
    date: "February 5, 2025",
    excerpt: "Learn about fundamental data structures and their implementations",
    category: "Programming",
    readTime: "7 min read",
    content: "Data structures are fundamental to computer science...",
    author: "Edlira Taipi"
  }
];

const fetchDevToPosts = async (): Promise<BlogPost[]> => {
  try {
    // First try with the username
    const response = await fetch('https://dev.to/api/articles?username=edlirataipi');

    if (!response.ok) {
      console.error('Dev.to API error:', await response.text());
      throw new Error('Failed to fetch blog posts');
    }

    const articles: DevToArticle[] = await response.json();

    // If no articles found, try searching for your posts
    if (articles.length === 0) {
      const searchResponse = await fetch('https://dev.to/api/articles/latest?tag=webdev&top=7');
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch featured posts');
      }
      articles.push(...(await searchResponse.json()));
    }

    // If still no articles, return default posts
    if (articles.length === 0) {
      console.log('No articles found, using default posts');
      return defaultPosts;
    }

    return articles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      date: new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      excerpt: article.description || "Click to read more...",
      category: article.tags?.[0] || 'General',
      readTime: `${article.reading_time_minutes || 5} min read`,
      content: article.body_html,
      url: article.url,
      author: article.user?.name || "Edlira Taipi"
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return defaultPosts;
  }
};

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchDevToPosts,
    initialData: defaultPosts
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
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
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
                  <Badge variant="secondary">{selectedPost?.category}</Badge>
                  <span>{selectedPost?.date}</span>
                  <span>·</span>
                  <span>{selectedPost?.readTime}</span>
                  {selectedPost?.author && (
                    <>
                      <span>·</span>
                      <span>By {selectedPost.author}</span>
                    </>
                  )}
                </div>
              </DialogHeader>
              <div className="flex gap-8">
                <div className="flex-1">
                  <div 
                    className="prose prose-neutral dark:prose-invert"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedPost?.content || 'No content available.'
                    }}
                  />
                  {selectedPost?.url && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedPost.url, '_blank')}
                      >
                        Read on Dev.to →
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