import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Culinary Canvas',
  description: 'Login | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
