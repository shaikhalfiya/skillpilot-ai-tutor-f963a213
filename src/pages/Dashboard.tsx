import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  Clock, 
  Target, 
  Trophy, 
  TrendingUp,
  CheckCircle,
  Play,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LearningProgress {
  id: string;
  skill: string;
  current_step: number;
  total_steps: number;
  completed_steps: number[];
  started_at: string;
  last_activity: string;
}

interface CompletedTask {
  id: string;
  skill: string;
  task_title: string;
  completed_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load learning progress
      const { data: progressData } = await supabase
        .from('learning_progress')
        .select('*')
        .order('last_activity', { ascending: false });

      // Load completed tasks
      const { data: tasksData } = await supabase
        .from('completed_tasks')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(10);

      setLearningProgress(progressData || []);
      setCompletedTasks(tasksData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSkills = learningProgress.length;
  const totalTasksCompleted = completedTasks.length;
  const totalStepsCompleted = learningProgress.reduce(
    (acc, p) => acc + (p.completed_steps?.length || 0), 
    0
  );
  const averageProgress = totalSkills > 0 
    ? Math.round(learningProgress.reduce((acc, p) => 
        acc + ((p.completed_steps?.length || 0) / (p.total_steps || 1)) * 100, 0
      ) / totalSkills)
    : 0;

  const stats = [
    { label: 'Skills Learning', value: totalSkills, icon: BookOpen, color: 'text-primary' },
    { label: 'Tasks Completed', value: totalTasksCompleted, icon: CheckCircle, color: 'text-accent' },
    { label: 'Steps Finished', value: totalStepsCompleted, icon: Target, color: 'text-secondary-foreground' },
    { label: 'Avg Progress', value: `${averageProgress}%`, icon: TrendingUp, color: 'text-primary' },
  ];

  const continueSkill = (skill: string) => {
    localStorage.setItem('skillpilot_skill', skill);
    navigate('/roadmap');
  };

  const clearDashboard = async () => {
    if (!confirm('Are you sure you want to clear all your learning progress and completed tasks?')) {
      return;
    }
    
    try {
      await supabase.from('learning_progress').delete().neq('id', '');
      await supabase.from('completed_tasks').delete().neq('id', '');
      setLearningProgress([]);
      setCompletedTasks([]);
      toast.success('Dashboard cleared successfully!');
    } catch (error) {
      console.error('Error clearing dashboard:', error);
      toast.error('Failed to clear dashboard');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getProgressPercent = (progress: LearningProgress) => {
    if (!progress.total_steps) return 0;
    return Math.round((progress.completed_steps?.length || 0) / progress.total_steps * 100);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your <span className="text-gradient">Learning Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Track your progress and continue where you left off
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div 
              key={stat.label}
              className="p-6 rounded-xl bg-card border shadow-card animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={cn("w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Learning Paths */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Active Learning Paths
              </h2>
              <div className="flex gap-2">
                {(learningProgress.length > 0 || completedTasks.length > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearDashboard}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Start New
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border animate-pulse">
                    <div className="h-6 bg-secondary rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-secondary rounded w-full mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : learningProgress.length > 0 ? (
              <div className="space-y-4">
                {learningProgress.map((progress, i) => (
                  <div 
                    key={progress.id}
                    className="p-6 rounded-xl bg-card border shadow-card hover:shadow-hover transition-all cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={() => continueSkill(progress.skill)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{progress.skill}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Started {formatDate(progress.started_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last active {formatDate(progress.last_activity)}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{getProgressPercent(progress)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full gradient-primary transition-all duration-700"
                            style={{ width: `${getProgressPercent(progress)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {progress.completed_steps?.length || 0}/{progress.total_steps}
                        </div>
                        <div className="text-xs text-muted-foreground">steps</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-card border text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Start Your Learning Journey</h3>
                <p className="text-muted-foreground mb-6">
                  Enter a skill on the homepage to generate your personalized roadmap
                </p>
                <Button onClick={() => navigate('/')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Recent Achievements
            </h2>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-card border animate-pulse">
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : completedTasks.length > 0 ? (
              <div className="space-y-3">
                {completedTasks.map((task, i) => (
                  <div 
                    key={task.id}
                    className="p-4 rounded-lg bg-card border shadow-sm animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{task.task_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.skill} • {formatDate(task.completed_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-card border text-center">
                <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Complete tasks to see your achievements here!
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="p-6 rounded-xl bg-card border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Learning Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-medium">{totalTasksCompleted} tasks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Paths</span>
                  <span className="font-medium">{totalSkills} skills</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{averageProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
