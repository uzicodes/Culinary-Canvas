import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password | Culinary Canvas',
  description: 'Reset password | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
