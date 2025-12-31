-- Add DELETE policy for learning_progress
CREATE POLICY "Allow public delete access to learning_progress"
ON public.learning_progress
FOR DELETE
USING (true);

-- Add DELETE policy for completed_tasks
CREATE POLICY "Allow public delete access to completed_tasks"
ON public.completed_tasks
FOR DELETE
USING (true);