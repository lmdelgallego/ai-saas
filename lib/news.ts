

export type Article = {
    title: string;
    url: string;
    description: string;
    publishedAt: string;
    urlToImage: string;
}

export async function fetchArticles(categories: string[]): Promise<Array<Article>> {

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 

    const promises = categories.map( async (category) => {

        try {

            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&from=${since}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`)
    
            if(!response.ok) {
                console.error("Failed fetching for this category", category);
                return []
            }
    
            const data = await response.json()
            return data.articles.slice(0,5).map((article: Article) => ({
                title: article.title || 'No title',
                url: article.url || "#",
                description: article.description || "No description available",
                publishedAt: article.publishedAt || "#",
                urlToImage: article.urlToImage || "#"
            }));
        } catch (error) {
            console.error("Error fetching articles:", error);
            return []
        }
    });

    const results = await Promise.all(promises)

    return results.flat()
}