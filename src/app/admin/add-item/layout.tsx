import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add item | Culinary Canvas',
  description: 'Add item | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
