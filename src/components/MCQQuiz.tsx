import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ExternalLink, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MCQData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  resource: {
    title: string;
    url: string;
    type: string;
  };
}

interface MCQQuizProps {
  concept: string;
  skill: string;
  onComplete?: (correct: boolean) => void;
}

export function MCQQuiz({ concept, skill, onComplete }: MCQQuizProps) {
  const [mcq, setMcq] = useState<MCQData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateMCQ = async () => {
    setIsLoading(true);
    setSelectedIndex(null);
    setShowResult(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-mcq', {
        body: { concept, skill }
      });
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setMcq(data);
      setHasGenerated(true);
    } catch (err) {
      console.error('MCQ generation error:', err);
      toast.error('Failed to generate question. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedIndex(index);
  };

  const submitAnswer = () => {
    if (selectedIndex === null || !mcq) return;
    setShowResult(true);
    const isCorrect = selectedIndex === mcq.correctIndex;
    onComplete?.(isCorrect);
  };

  const isCorrect = selectedIndex === mcq?.correctIndex;

  if (!hasGenerated) {
    return (
      <Card className="glass-card border-primary/20">
        <CardContent className="p-4 text-center">
          <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Test your understanding of this concept!
          </p>
          <Button 
            onClick={generateMCQ} 
            disabled={isLoading}
            size="sm"
            className="gradient-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Take Quiz'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Creating question...</p>
        </CardContent>
      </Card>
    );
  }

  if (!mcq) return null;

  return (
    <Card className="glass-card border-primary/20 animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Quick Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-sm">{mcq.question}</p>
        
        <div className="space-y-2">
          {mcq.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectOption = index === mcq.correctIndex;
            
            let optionClass = "border-border hover:border-primary/50 cursor-pointer";
            if (showResult) {
              if (isCorrectOption) {
                optionClass = "border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrectOption) {
                optionClass = "border-destructive bg-destructive/10";
              }
            } else if (isSelected) {
              optionClass = "border-primary bg-primary/10";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cn(
                  "w-full p-3 rounded-lg border text-left text-sm transition-all flex items-center gap-3",
                  optionClass
                )}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {!showResult && selectedIndex !== null && (
          <Button onClick={submitAnswer} className="w-full gradient-primary">
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg space-y-3",
            isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"
          )}>
            {isCorrect ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    🎉 Excellent work!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've got it! Keep up the great learning!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    Almost there!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mcq.explanation}
                  </p>
                </div>
              </div>
            )}
            
            {!isCorrect && mcq.resource && (
              <a
                href={mcq.resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
              >
                <ExternalLink className="h-4 w-4" />
                Learn more: {mcq.resource.title}
              </a>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateMCQ}
              className="mt-2"
            >
              Try Another Question
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
