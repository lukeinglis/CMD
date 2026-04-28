export interface ComponentDefinition {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  icon: string;
  iconPath: string;
  description: string;
  bullets: string[];
  videoSrc?: string;
  demoUrl?: string;
  demoLabel?: string;
  demoStatus: 'live' | 'video' | 'coming-soon';
  isAnchor?: boolean;
  stats?: { label: string; value: string }[];
  relationships: string[];
}
