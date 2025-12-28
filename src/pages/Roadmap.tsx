import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Clock, Trophy, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { RoadmapCard } from '@/components/RoadmapCard';
import { ProjectCard } from '@/components/ProjectCard';
import { ChatInterface } from '@/components/ChatInterface';
import { RoadmapData } from '@/types/skillpilot';
import { generateRoadmap } from '@/lib/aiService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Roadmap() {
  const navigate = useNavigate();
  const [skill, setSkill] = useState<string>('');
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressId, setProgressId] = useState<string | null>(null);

  useEffect(() => {
    const storedSkill = localStorage.getItem('skillpilot_skill');
    
    if (!storedSkill) {
      navigate('/');
      return;
    }

    setSkill(storedSkill);
    loadRoadmap(storedSkill);
  }, [navigate]);

  const loadRoadmap = async (skillName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await generateRoadmap(skillName);
      setRoadmap(data);
      
      // Save progress to database
      const { data: progressData, error: progressError } = await supabase
        .from('learning_progress')
        .insert({
          skill: skillName,
          total_steps: data.steps.length,
          current_step: 0,
          completed_steps: [],
          roadmap_data: data as any,
        })
        .select()
        .single();
      
      if (progressData) {
        setProgressId(progressData.id);
      }
      if (progressError) {
        console.error('Error saving progress:', progressError);
      }
    } catch (err) {
      console.error('Roadmap generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStepComplete = async (stepId: number) => {
    if (!roadmap) return;
    
    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    
    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
    });

    // Update database
    const completedStepIds = updatedSteps.filter(s => s.completed).map(s => s.id);
    
    if (progressId) {
      await supabase
        .from('learning_progress')
        .update({
          completed_steps: completedStepIds,
          current_step: completedStepIds.length,
        })
        .eq('id', progressId);
    }
    
    const step = updatedSteps.find(s => s.id === stepId);
    if (step?.completed) {
      toast.success(`Completed: ${step.title}`);
    }
  };

  const handleToggleTask = async (stepId: number, taskId: number) => {
    if (!roadmap) return;
    
    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId
        ? {
            ...step,
            tasks: step.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          }
        : step
    );
    
    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
    });

    // Save completed task
    const step = updatedSteps.find(s => s.id === stepId);
    const task = step?.tasks.find(t => t.id === taskId);
    
    if (task?.completed && skill) {
      await supabase
        .from('completed_tasks')
        .insert({
          skill,
          task_title: task.title,
        });
      toast.success(`Task completed: ${task.title}`);
    }
  };

  const completedSteps = roadmap?.steps.filter(s => s.completed).length || 0;
  const totalSteps = roadmap?.steps.length || 0;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero">
        <Header />
        <div className="container py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6 animate-pulse-soft">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Generating Your Roadmap</h2>
          <p className="text-muted-foreground mb-6">AI is creating a personalized learning path for {skill}...</p>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero">
        <Header />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-destructive">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => loadRoadmap(skill)}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <div className="container py-8">
        {/* Hero Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Your <span className="text-gradient">{roadmap.skill}</span> Roadmap
              </h1>
              <p className="text-muted-foreground">
                Follow this personalized path to master {roadmap.skill}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{roadmap.estimatedTotalTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-accent" />
                <span>{completedSteps}/{totalSteps} complete</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roadmap Steps */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {totalSteps}
              </span>
              Learning Steps
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-4">
                {roadmap.steps.map((step, index) => (
                  <RoadmapCard
                    key={step.id}
                    step={step}
                    index={index}
                    onToggleComplete={handleToggleStepComplete}
                    onToggleTask={handleToggleTask}
                  />
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold mb-4">Suggested Projects</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {roadmap.projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <ChatInterface skill={roadmap.skill} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
