import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  linkLabel?: string;
  index?: number;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  linkLabel = "Explore",
  index = 0 
}: FeatureCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link.startsWith('/')) {
      navigate(link);
    } else if (link.startsWith('#')) {
      const element = document.querySelector(link);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "group p-6 rounded-xl bg-card border shadow-card",
        "hover:shadow-hover hover:border-primary/30 hover:-translate-y-1",
        "transition-all duration-300 cursor-pointer animate-fade-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        {linkLabel}
        <svg 
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}
