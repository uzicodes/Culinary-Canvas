import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot password | Culinary Canvas',
  description: 'Forgot password | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
