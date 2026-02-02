import { BlogPost } from '@/types/blog';

export async function getDailyBlogs(): Promise<BlogPost[]> {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

    if (!apiKey) {
        console.error("API Key is missing");
        return [];
    }

    try {
        const res = await fetch(
            `https://api.spoonacular.com/recipes/random?number=3&apiKey=${apiKey}`,
            { next: { revalidate: 86400 } } // 24-hour cache
        );

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();

        return data.recipes.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            excerpt: recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : 'Delicious food...',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            category: recipe.dishTypes?.[0] || 'Gourmet',
            image: recipe.image || '/placeholder.png',
            author: recipe.sourceName || 'Culinary Chef',
            link: recipe.sourceUrl || '#'
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}