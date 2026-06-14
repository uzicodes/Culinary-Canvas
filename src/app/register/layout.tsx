import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Culinary Canvas',
  description: 'Register | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
