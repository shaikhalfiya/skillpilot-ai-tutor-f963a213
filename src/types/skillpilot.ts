// SkillPilot Type Definitions

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  resources: Resource[];
  tasks: Task[];
  completed: boolean;
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'documentation' | 'course';
  free: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RoadmapData {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  steps: RoadmapStep[];
  projects: Project[];
  estimatedTotalTime: string;
}
