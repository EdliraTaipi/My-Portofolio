import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MessageCircle, Plus, Clock, ArrowRight, Tag } from "lucide-react";
import { BlogChat } from "./blog-chat";
import { BlogEditor } from "./blog-editor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SelectBlogPost } from "@db/schema";
import { cn } from "@/lib/utils";

interface BlogPost extends SelectBlogPost {
  author: {
    username: string;
  };
}

const categoryColors = {
  'tech-trends': 'bg-blue-500',
  'tutorial': 'bg-green-500',
  'coding-challenge': 'bg-purple-500',
  'experience': 'bg-orange-500',
} as const;

const difficultyColors = {
  'beginner': 'bg-green-400',
  'intermediate': 'bg-yellow-400',
  'advanced': 'bg-red-400',
} as const;

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', selectedCategory],
    queryFn: fetchBlogPosts,
    refetchInterval: 1000 * 60,
  });

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const handlePostCreated = () => {
    setIsEditorOpen(false);
    queryClient.invalidateQueries(['blog-posts']);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.section
      id="blog"
      className="py-20 bg-muted/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold">Blog & Articles</h2>
              <p className="text-muted-foreground mt-2">
                Discover tech trends, coding challenges, tutorials, and personal experiences
              </p>
            </div>
            <Button 
              onClick={() => setIsEditorOpen(true)} 
              className="gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              New Article
            </Button>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {['tech-trends', 'tutorial', 'coding-challenge', 'experience'].map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-sm whitespace-nowrap capitalize"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category.replace('-', ' ')}
              </Badge>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
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
              </motion.div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground">
                  {selectedCategory 
                    ? `No articles found in ${selectedCategory.replace('-', ' ')} category.`
                    : 'No articles yet. Create your first article!'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="posts"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    layout
                  >
                    <article className="h-full">
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          {post.coverImage && (
                            <motion.div
                              className="relative aspect-video mb-4 overflow-hidden rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                              />
                              <Badge 
                                className={cn(
                                  "absolute top-2 right-2",
                                  categoryColors[post.category as keyof typeof categoryColors]
                                )}
                              >
                                {post.category.replace('-', ' ')}
                              </Badge>
                            </motion.div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{post.readingTime} min read</span>
                              {post.difficulty && (
                                <Badge 
                                  variant="secondary"
                                  className={cn(
                                    difficultyColors[post.difficulty as keyof typeof difficultyColors]
                                  )}
                                >
                                  {post.difficulty}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold leading-tight hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">By {post.author.username}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Button
                              variant="link"
                              className="p-0 h-auto font-semibold hover:text-primary transition-colors gap-2"
                              onClick={() => setSelectedPost(post)}
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </article>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
              </DialogHeader>
              <BlogEditor onClose={handlePostCreated} />
            </DialogContent>
          </Dialog>

          <Dialog 
            open={Boolean(selectedPost)} 
            onOpenChange={(open) => {
              if (!open) {
                setSelectedPost(null);
                setIsChatOpen(false);
              }
            }}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {selectedPost && (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge 
                          className={cn(
                            categoryColors[selectedPost.category as keyof typeof categoryColors]
                          )}
                        >
                          {selectedPost.category.replace('-', ' ')}
                        </Badge>
                        {selectedPost.difficulty && (
                          <Badge 
                            variant="secondary"
                            className={cn(
                              difficultyColors[selectedPost.difficulty as keyof typeof difficultyColors]
                            )}
                          >
                            {selectedPost.difficulty}
                          </Badge>
                        )}
                      </div>
                      <DialogTitle className="text-2xl font-bold mb-2">
                        {selectedPost.title}
                      </DialogTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <Clock className="w-4 h-4" />
                        <span>{selectedPost.readingTime} min read</span>
                        <span>·</span>
                        <span>By {selectedPost.author.username}</span>
                      </div>
                    </DialogHeader>
                    <div className="flex flex-col lg:flex-row gap-8 mt-6">
                      <div className="flex-1">
                        {selectedPost.coverImage && (
                          <motion.img
                            src={selectedPost.coverImage}
                            alt={selectedPost.title}
                            className="w-full rounded-lg mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <motion.div 
                          className="prose prose-sm dark:prose-invert max-w-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {selectedPost.codeSnippets?.map((snippet, index) => (
                            <pre key={index} className="bg-muted p-4 rounded-lg mb-4">
                              <code>{JSON.stringify(snippet, null, 2)}</code>
                            </pre>
                          ))}
                          <div 
                            className="mt-4"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                          />
                        </motion.div>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {selectedPost.tags?.map((tag) => (
                            <Badge key={tag} variant="outline">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="lg:w-80 flex flex-col">
                        <Button
                          variant="outline"
                          className="mb-4 gap-2"
                          onClick={() => setIsChatOpen(!isChatOpen)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {isChatOpen ? 'Close Discussion' : 'Join Discussion'}
                        </Button>
                        <BlogChat
                          postId={selectedPost.id.toString()}
                          isOpen={isChatOpen}
                        />
                      </div>
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </motion.section>
  );
}