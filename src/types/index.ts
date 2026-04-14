export interface ComponentDefinition {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  icon: string;
  description: string;
  bullets: string[];
  image?: string;
  image2?: string;
  layout?: 'side' | 'stacked';
  autoplaySeconds?: number;
  demoUrl?: string;
  demoLabel?: string;
  demoStatus: 'live' | 'video' | 'coming-soon';
  relationships: string[];
}
