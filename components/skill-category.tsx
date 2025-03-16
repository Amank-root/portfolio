import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Skill {
  name: string
  level: number
}

interface SkillCategoryProps {
  category: {
    name: string
    skills: Skill[]
  }
}

export function SkillCategory({ category }: SkillCategoryProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-accent">{category.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {category.skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

