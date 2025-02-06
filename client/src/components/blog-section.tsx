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

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  content?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Data Visualization Techniques",
    date: "January 25, 2025",
    excerpt: "Exploring modern approaches to data visualization and their impact on decision-making processes...",
    category: "Data Science",
    readTime: "5 min read",
    content: `Data visualization is a crucial aspect of data analysis and presentation. In this article, we'll explore various techniques and best practices for creating effective data visualizations that communicate insights clearly and effectively.

    Key topics we'll cover:
    1. Choosing the right chart type
    2. Color theory in data visualization
    3. Interactive visualization techniques
    4. Common pitfalls to avoid

    Stay tuned for more updates and insights!`
  },
  {
    id: "2",
    title: "The Future of Web Development",
    date: "January 20, 2025",
    excerpt: "Discussing emerging trends in web development and how they're shaping the digital landscape...",
    category: "Web Development",
    readTime: "4 min read",
    content: `The web development landscape is constantly evolving. This post explores upcoming trends and technologies that will shape the future of web development.

    Topics covered:
    1. Web Assembly and its impact
    2. AI-driven development tools
    3. The rise of micro-frontends
    4. Performance optimization techniques

    More detailed insights coming soon!`
  },
  {
    id: "3",
    title: "Machine Learning in Practice",
    date: "January 15, 2025",
    excerpt: "Real-world applications of machine learning algorithms and their practical implementations...",
    category: "Machine Learning",
    readTime: "6 min read",
    content: `Machine learning is transforming various industries. Let's look at practical applications and implementation strategies.

    Key aspects:
    1. Model selection criteria
    2. Data preparation techniques
    3. Deployment strategies
    4. Performance monitoring

    Check back for the complete article!`
  }
];

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
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
                </div>
              </DialogHeader>
              <div className="flex gap-8">
                <div className="flex-1">
                  <div className="prose prose-neutral dark:prose-invert">
                    {selectedPost?.content?.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
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