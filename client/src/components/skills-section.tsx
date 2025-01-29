import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
      skills: ["HTML", "CSS", "Bootstrap", "jQuery", "DOM Manipulation"]
    },
    {
      title: "Data Science & Analytics",
      skills: ["Data visualization", "Machine learning", "BigQuery", "Tableau", "PowerQuery", "PowerPivot", "SQL Server", "Hadoop"]
    },
    {
      title: "Digital Marketing & Finance",
      skills: ["Financial analysis", "Data-driven marketing strategies"]
    },
    {
      title: "Soft Skills",
      skills: [
        "Problem-Solving & Strategic Thinking",
        "Professional Communication & Leadership",
        "Resume Writing & LinkedIn Optimization",
        "Job Search Strategies"
      ]
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
                    {category.skills.map((skill, skillIndex) => (
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
                          className="text-sm px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
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