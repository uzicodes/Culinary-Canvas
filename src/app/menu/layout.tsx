import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu | Culinary Canvas',
  description: 'Menu | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
