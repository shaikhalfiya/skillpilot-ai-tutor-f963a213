import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ExternalLink, Clock, BookOpen, Code } from 'lucide-react';
import { RoadmapStep, Resource, Task } from '@/types/skillpilot';
import { Button } from '@/components/ui/button';
import { MCQQuiz } from '@/components/MCQQuiz';
import { cn } from '@/lib/utils';

interface RoadmapCardProps {
  step: RoadmapStep;
  index: number;
  skill: string;
  onToggleComplete: (stepId: number) => void;
  onToggleTask: (stepId: number, taskId: number) => void;
}

const resourceTypeIcon: Record<Resource['type'], string> = {
  video: '🎥',
  article: '📄',
  documentation: '📚',
  course: '🎓',
};

const difficultyColor: Record<Task['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export function RoadmapCard({ step, index, skill, onToggleComplete, onToggleTask }: RoadmapCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const completedTasks = step.tasks.filter(t => t.completed).length;
  const progress = step.tasks.length > 0 ? (completedTasks / step.tasks.length) * 100 : 0;

  return (
    <div 
      className={cn(
        "relative rounded-xl border transition-all duration-300",
        step.completed 
          ? "bg-accent/30 border-accent" 
          : "bg-card border-border shadow-card hover:shadow-hover",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Step Number Indicator */}
      <div className={cn(
        "absolute -left-3 top-6 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-soft",
        step.completed 
          ? "gradient-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground"
      )}>
        {step.completed ? <Check className="h-5 w-5" /> : index + 1}
      </div>

      <div className="p-6 pl-10">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-start justify-between gap-4 text-left"
        >
          <div className="flex-1">
            <h3 className={cn(
              "text-xl font-semibold",
              step.completed && "text-muted-foreground line-through"
            )}>
              {step.title}
            </h3>
            <p className="text-muted-foreground mt-1">{step.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {step.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {step.resources.length} resources
              </span>
              <span className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                {completedTasks}/{step.tasks.length} tasks
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="hidden sm:block w-24 h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Resources */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Free Resources
              </h4>
              <div className="grid gap-2">
                {step.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <span className="text-lg">{resourceTypeIcon[resource.type]}</span>
                    <span className="flex-1 font-medium group-hover:text-primary transition-colors">
                      {resource.title}
                    </span>
                    {resource.free && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        FREE
                      </span>
                    )}
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4 text-accent" />
                Practice Tasks
              </h4>
              <div className="grid gap-2">
                {step.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onToggleTask(step.id, task.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                      task.completed 
                        ? "bg-accent/20" 
                        : "bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.completed 
                        ? "bg-accent border-accent text-accent-foreground" 
                        : "border-muted-foreground"
                    )}>
                      {task.completed && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize",
                          difficultyColor[task.difficulty]
                        )}>
                          {task.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* MCQ Quiz */}
            <MCQQuiz concept={step.title} skill={skill} />

            {/* Mark Complete Button */}
            <Button
              onClick={() => onToggleComplete(step.id)}
              variant={step.completed ? "outline" : "default"}
              className="w-full"
            >
              {step.completed ? "Mark as Incomplete" : "Mark Step as Complete"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
