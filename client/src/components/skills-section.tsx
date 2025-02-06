import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { IconType } from "react-icons";
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

export function SkillsSection() {
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

  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-primary">
                      {category.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => {
                      const Icon = skillIcons[skill];
                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: categoryIndex * 0.1 + skillIndex * 0.05,
                            duration: 0.3
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="text-sm px-3 py-1 flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {skill}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}