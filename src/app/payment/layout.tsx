import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment | Culinary Canvas',
  description: 'Payment | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
