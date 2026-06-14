import HomeClient from '@/components/HomeClient';
import { getDailyBlogs } from '@/lib/blogService';

export default async function Home() {
  // (Server-Side)
  // runs once per day 
  const blogPosts = await getDailyBlogs();

  // Render the Client Component & pass the data 
  return (
    <main>
      <HomeClient blogPosts={blogPosts} />
    </main>
  );
}
export const metadata = {
  title: 'Culinary Canvas',
  description: 'Culinary Canvas page for Culinary Canvas',
};
