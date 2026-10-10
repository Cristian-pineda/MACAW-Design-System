import type { Metadata } from 'next';
import { SurfacesGuide } from '@/components/foundations/surfaces';

export const metadata: Metadata = { title: 'Elevation surfaces' };

export default function ElevationSurfacesPage() {
  return <SurfacesGuide />;
}
