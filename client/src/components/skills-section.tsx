import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { IconType } from "react-icons";
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback } from 'react';
import { 
  SiPython, 
  SiJavascript, 
  SiPhp, 
  SiMysql, 
  SiAngular, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiTableau, 
  SiGooglebigquery, 
  SiHtml5, 
  SiCss3, 
  SiBootstrap, 
  SiJquery, 
  SiApachehadoop 
} from "react-icons/si";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const skillIcons: { [key: string]: IconType } = {
  Python: SiPython,
  JavaScript: SiJavascript,
  PHP: SiPhp,
  SQL: SiMysql,
  Angular: SiAngular,
  TailwindCSS: SiTailwindcss,
  "Node.js": SiNodedotjs,
  Tableau: SiTableau,
  BigQuery: SiGooglebigquery,
  HTML: SiHtml5,
  CSS: SiCss3,
  Bootstrap: SiBootstrap,
  jQuery: SiJquery,
  Hadoop: SiApachehadoop
};

const skillCategories = [
  {
    title: "Programming Languages",
    skills: ["Python", "JavaScript", "SQL", "PHP"]
  },
  {
    title: "Frameworks & Tools",
    skills: ["Angular", "TailwindCSS", "Node.js", "Tableau", "BigQuery"]
  },
  {
    title: "Web Development",
    skills: ["HTML", "CSS", "Bootstrap", "jQuery"]
  },
  {
    title: "Data Science & Analytics",
    skills: ["BigQuery", "Tableau", "Hadoop"]
  }
];

const getGradientBySkill = (skill: string) => {
  const gradients: { [key: string]: string } = {
    Python: "from-blue-500 to-yellow-500",
    JavaScript: "from-yellow-400 to-yellow-600",
    PHP: "from-purple-500 to-indigo-600",
    SQL: "from-blue-400 to-cyan-500",
    Angular: "from-red-500 to-pink-500",
    TailwindCSS: "from-cyan-400 to-blue-500",
    "Node.js": "from-green-500 to-emerald-600",
    Tableau: "from-blue-600 to-indigo-600",
    BigQuery: "from-blue-400 to-indigo-500",
    HTML: "from-orange-500 to-red-500",
    CSS: "from-blue-500 to-purple-500",
    Bootstrap: "from-purple-600 to-indigo-600",
    jQuery: "from-blue-400 to-blue-600",
    Hadoop: "from-yellow-500 to-yellow-600"
  };
  return gradients[skill] || "from-gray-500 to-gray-600";
};

export function SkillsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isPrevEnabled, setIsPrevEnabled] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIsPrevEnabled(emblaApi.canScrollPrev());
    setIsNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  const flattenedSkills = skillCategories.reduce<string[]>((acc, category) => [...acc, ...category.skills], []);

  return (
    <section id="skills" className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Skills</h2>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {flattenedSkills.map((skill, index) => {
                  const Icon = skillIcons[skill];
                  return (
                    <motion.div
                      key={skill}
                      className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="h-[300px] cursor-pointer relative overflow-hidden group"
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientBySkill(skill)} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          <Icon className="w-20 h-20 mb-4 text-primary group-hover:scale-110 transition-transform" />
                          <h3 className="text-xl font-semibold mb-2">{skill}</h3>
                          <p className="text-muted-foreground text-center">Click to expand</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-colors"
              disabled={!isPrevEnabled}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-colors"
              disabled={!isNextEnabled}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card rounded-lg shadow-xl max-w-3xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center">
                {skillIcons[selectedSkill] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {React.createElement(skillIcons[selectedSkill], {
                      className: "w-32 h-32 mb-6 text-primary"
                    })}
                  </motion.div>
                )}
                <h2 className="text-2xl font-bold mb-4">{selectedSkill}</h2>
                <p className="text-muted-foreground text-center max-w-xl">
                  {getSkillDescription(selectedSkill)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function getSkillDescription(skill: string): string {
  const descriptions: { [key: string]: string } = {
    Python: "A versatile programming language known for its simplicity and powerful libraries, perfect for data science and web development.",
    JavaScript: "The language of the web, enabling interactive and dynamic content across all modern browsers.",
    PHP: "A server-side scripting language designed for web development and embedded in HTML.",
    SQL: "The standard language for managing and manipulating relational databases.",
    Angular: "A platform for building mobile and desktop web applications using TypeScript.",
    TailwindCSS: "A utility-first CSS framework for rapidly building custom user interfaces.",
    "Node.js": "A JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
    Tableau: "A visual analytics platform transforming the way we use data to solve problems.",
    BigQuery: "Google's fully managed, serverless data warehouse for analyzing data at scale.",
    HTML: "The standard markup language for documents designed to be displayed in a web browser.",
    CSS: "A style sheet language used for describing the presentation of a document written in HTML.",
    Bootstrap: "A popular CSS framework for developing responsive and mobile-first websites.",
    jQuery: "A fast, small, and feature-rich JavaScript library for HTML document manipulation.",
    Hadoop: "An open-source framework for distributed storage and processing of big data."
  };
  return descriptions[skill] || "A powerful tool in modern software development.";
}