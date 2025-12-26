import { Clock, Zap } from 'lucide-react';
import { Project } from '@/types/skillpilot';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const difficulty = difficultyConfig[project.difficulty];

  return (
    <div 
      className="group relative p-6 rounded-xl border bg-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <span className={cn(
            "shrink-0 px-2 py-1 text-xs font-medium rounded-full border",
            difficulty.color
          )}>
            {difficulty.label}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          {project.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {project.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            {project.skills.length} skills
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
