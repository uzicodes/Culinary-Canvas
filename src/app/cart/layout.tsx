import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart | Culinary Canvas',
  description: 'Cart | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
