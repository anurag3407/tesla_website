export interface Developer {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  status: string;
  imageUrl: string;
  fallbackInitials?: string;
  bio: string;
  contributions: string[];
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  twitterUrl?: string;
  email?: string;
  accentColor?: 'acid' | 'cyan' | 'amber' | 'emerald';
  badgeCode?: string;
}
