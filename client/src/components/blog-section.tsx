import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Data Visualization Techniques",
    date: "January 25, 2025",
    excerpt: "Exploring modern approaches to data visualization and their impact on decision-making processes...",
    category: "Data Science",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "The Future of Web Development",
    date: "January 20, 2025",
    excerpt: "Discussing emerging trends in web development and how they're shaping the digital landscape...",
    category: "Web Development",
    readTime: "4 min read"
  },
  {
    id: "3",
    title: "Machine Learning in Practice",
    date: "January 15, 2025",
    excerpt: "Real-world applications of machine learning algorithms and their practical implementations...",
    category: "Machine Learning",
    readTime: "6 min read"
  }
];

export function BlogSection() {
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
                    <Button variant="link" className="p-0 h-auto font-semibold">
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" size="lg">
              View All Posts
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
