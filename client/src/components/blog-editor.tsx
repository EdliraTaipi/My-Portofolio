import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X, Loader2, Plus, Code, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Invalid image URL").optional(),
  category: z.enum(["tech-trends", "tutorial", "coding-challenge", "experience"], {
    required_error: "Please select a category",
  }),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  codeSnippets: z.array(z.object({
    language: z.string(),
    code: z.string()
  })).optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  onClose: () => void;
  existingPost?: {
    id: number;
    title: string;
    summary: string;
    content: string;
    coverImage?: string;
    category: string;
    tags: string[];
    difficulty?: string;
    codeSnippets?: Array<{
      language: string;
      code: string;
    }>;
  };
}

export function BlogEditor({ onClose, existingPost }: BlogEditorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(existingPost?.coverImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [codeContent, setCodeContent] = useState("");

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: existingPost?.title || "",
      summary: existingPost?.summary || "",
      content: existingPost?.content || "",
      coverImage: existingPost?.coverImage || "",
      category: existingPost?.category as "tech-trends" | "tutorial" | "coding-challenge" | "experience" || "tech-trends",
      tags: existingPost?.tags || [],
      difficulty: existingPost?.difficulty as "beginner" | "intermediate" | "advanced" | undefined,
      codeSnippets: existingPost?.codeSnippets || [],
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blog${existingPost ? `/${existingPost.id}` : ""}`, {
        method: existingPost ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog post");
      }

      toast({
        title: "Success",
        description: `Article ${existingPost ? "updated" : "created"} successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await response.json();
      setPreviewImage(imageUrl);
      form.setValue('coverImage', imageUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    form.setValue('coverImage', '');
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(newTag.trim())) {
        form.setValue('tags', [...currentTags, newTag.trim()]);
        setNewTag("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const addCodeSnippet = () => {
    if (!codeLanguage.trim() || !codeContent.trim()) return;

    const currentSnippets = form.getValues('codeSnippets') || [];
    form.setValue('codeSnippets', [...currentSnippets, {
      language: codeLanguage.trim(),
      code: codeContent.trim()
    }]);

    setCodeLanguage("");
    setCodeContent("");
  };

  const removeCodeSnippet = (index: number) => {
    const currentSnippets = form.getValues('codeSnippets') || [];
    form.setValue('codeSnippets', currentSnippets.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <ScrollArea className="h-[80vh] px-4 -mx-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3>Basic Information</h3>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a compelling title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief summary to hook your readers"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tech-trends">Tech Trends</SelectItem>
                            <SelectItem value="tutorial">Tutorial</SelectItem>
                            <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                            <SelectItem value="experience">Experience</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
              <Code className="w-5 h-5" />
              <h3>Content & Code</h3>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your article content here..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Code Snippets</FormLabel>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Language (e.g., javascript)"
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCodeSnippet}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add Code
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Paste your code snippet here..."
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="font-mono"
                  />
                  <FormField
                    control={form.control}
                    name="codeSnippets"
                    render={({ field }) => (
                      <AnimatePresence mode="popLayout">
                        <div className="space-y-2">
                          {field.value?.map((snippet, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="relative bg-muted p-4 rounded-lg"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => removeCodeSnippet(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <p className="text-sm font-semibold mb-2">{snippet.language}</p>
                              <pre className="text-sm overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
              <ImagePlus className="w-5 h-5" />
              <h3>Media</h3>
            </div>
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="gap-2"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ImagePlus className="w-4 h-4" />
                            )}
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                          </Button>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          <Input
                            placeholder="Or enter image URL"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPreviewImage(e.target.value);
                            }}
                            disabled={isUploading}
                          />
                        </div>

                        <AnimatePresence>
                          {previewImage && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted"
                            >
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="sticky bottom-0 pt-4 pb-6 bg-background/80 backdrop-blur-sm"
          >
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : existingPost ? (
                  'Update Article'
                ) : (
                  'Create Article'
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </ScrollArea>
    </Form>
  );
}