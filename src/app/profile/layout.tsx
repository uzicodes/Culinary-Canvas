import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Culinary Canvas',
  description: 'Profile | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
