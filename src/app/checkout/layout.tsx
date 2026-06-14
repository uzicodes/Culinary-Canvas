import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Culinary Canvas',
  description: 'Checkout | Culinary Canvas page for Culinary Canvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
