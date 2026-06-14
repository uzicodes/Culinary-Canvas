import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Culinary Canvas',
  description: 'Analytics | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
