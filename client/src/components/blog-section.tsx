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
import { MessageCircle, Plus } from "lucide-react";
import { BlogChat } from "./blog-chat";
import { BlogEditor } from "./blog-editor";
import { useQuery } from "@tanstack/react-query";
import type { SelectBlogPost } from "@db/schema";

interface BlogPost extends SelectBlogPost {
  author: {
    username: string;
  };
}

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog');
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  return response.json();
};

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    refetchInterval: 1000 * 60, // Refetch every minute
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Blog Posts</h2>
            <Button onClick={() => setIsEditorOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
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
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">Blog</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">By {post.author.username}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
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

          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
              </DialogHeader>
              <BlogEditor onClose={() => setIsEditorOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={Boolean(selectedPost)} onOpenChange={(open) => {
            if (!open) {
              setSelectedPost(null);
              setIsChatOpen(false);
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              {selectedPost && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">
                      {selectedPost.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Badge variant="secondary">Blog</Badge>
                      <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>By {selectedPost.author.username}</span>
                    </div>
                  </DialogHeader>
                  <div className="flex gap-8">
                    <div className="flex-1">
                      {selectedPost.coverImage && (
                        <img
                          src={selectedPost.coverImage}
                          alt={selectedPost.title}
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                      )}
                      <div className="prose prose-sm dark:prose-invert">
                        <p className="text-muted-foreground mb-4">{selectedPost.content}</p>
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
                      <BlogChat
                        postId={selectedPost.id.toString()}
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