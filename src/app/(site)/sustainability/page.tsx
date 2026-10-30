import type { Metadata } from 'next';
import { SustainabilityPageContent } from '@/components/pages/SustainabilityPageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sustainability',
  description: 'Our commitment to environmental and social responsibility.',
};

export default function SustainabilityPage() {
  return <SustainabilityPageContent />;
}
