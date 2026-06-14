import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All items | Culinary Canvas',
  description: 'All items | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
