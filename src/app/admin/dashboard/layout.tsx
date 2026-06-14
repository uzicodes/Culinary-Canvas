import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Culinary Canvas',
  description: 'Dashboard | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
