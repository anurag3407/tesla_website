import { Metadata } from 'next';
import { DevelopersClient } from './DevelopersClient';

export const metadata: Metadata = {
  title: 'Developers | TESLA Technical Club',
  description:
    'Meet the student software engineers, UI/UX designers, and systems architects who designed and built the TESLA web platform.',
  openGraph: {
    title: 'Developers | TESLA Technical Club',
    description:
      'Meet the student software engineers, UI/UX designers, and systems architects who designed and built the TESLA web platform.',
  },
};

export default function DevelopersPage() {
  return <DevelopersClient />;
}
