import type { Metadata } from 'next';
import { SurfacesGuide } from '@/components/foundations/surfaces';

export const metadata: Metadata = { title: 'Surfaces' };

export default function ColorSurfacesPage() {
  return <SurfacesGuide />;
}
