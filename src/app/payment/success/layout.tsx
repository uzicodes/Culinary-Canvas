import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success | Culinary Canvas',
  description: 'Success | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
