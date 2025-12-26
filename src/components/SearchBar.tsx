import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  size?: 'default' | 'large';
  placeholder?: string;
}

export function SearchBar({ size = 'default', placeholder = 'What do you want to learn today?' }: SearchBarProps) {
  const [skill, setSkill] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skill.trim()) {
      localStorage.setItem('skillpilot_skill', skill.trim());
      navigate('/roadmap');
    }
  };

  const popularSkills = ['Frontend', 'DSA', 'AI/ML', 'Software Engineering'];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center gap-3 ${size === 'large' ? 'flex-col sm:flex-row' : ''}`}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder={placeholder}
            className={`pl-12 pr-4 ${
              size === 'large' 
                ? 'h-14 text-lg rounded-xl shadow-card focus:shadow-hover' 
                : 'h-12'
            } border-2 border-transparent focus:border-primary/20`}
          />
        </div>
        <Button 
          type="submit" 
          variant="hero"
          size={size === 'large' ? 'xl' : 'lg'}
          className={size === 'large' ? 'w-full sm:w-auto' : ''}
        >
          <Sparkles className="h-5 w-5" />
          Generate Roadmap
        </Button>
      </div>

      {size === 'large' && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popularSkills.map((popularSkill) => (
            <button
              key={popularSkill}
              type="button"
              onClick={() => setSkill(popularSkill)}
              className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {popularSkill}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
