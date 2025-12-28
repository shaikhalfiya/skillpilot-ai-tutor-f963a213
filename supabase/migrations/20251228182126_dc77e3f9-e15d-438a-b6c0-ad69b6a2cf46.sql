-- Create tables for SkillPilot learning tracking

-- Learning progress table
CREATE TABLE public.learning_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  roadmap_data JSONB
);

-- Completed tasks table
CREATE TABLE public.completed_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  task_title TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat history table
CREATE TABLE public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_progress (allow public access for MVP without auth)
CREATE POLICY "Allow public read access to learning_progress" 
ON public.learning_progress 
FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to learning_progress" 
ON public.learning_progress 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to learning_progress" 
ON public.learning_progress 
FOR UPDATE USING (true);

-- RLS Policies for completed_tasks
CREATE POLICY "Allow public read access to completed_tasks" 
ON public.completed_tasks 
FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to completed_tasks" 
ON public.completed_tasks 
FOR INSERT WITH CHECK (true);

-- RLS Policies for chat_history
CREATE POLICY "Allow public read access to chat_history" 
ON public.chat_history 
FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to chat_history" 
ON public.chat_history 
FOR INSERT WITH CHECK (true);

-- Function to update last_activity timestamp
CREATE OR REPLACE FUNCTION public.update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for auto-updating last_activity
CREATE TRIGGER update_learning_progress_activity
BEFORE UPDATE ON public.learning_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_last_activity();