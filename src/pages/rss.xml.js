import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  return rss({
    title: 'baz.sh',
    description: 'Baz\'s Personal blog and thoughts',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.seo.description,
      link: `/writing/${post.id}/`,
      content: post.body,
    })),
  });
}
