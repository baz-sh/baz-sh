import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

export async function GET(context) {
  const posts = await getCollection('posts');
  const parser = new MarkdownIt();
  
  return rss({
    title: 'baz.sh',
    description: 'Baz\'s Personal blog and thoughts',
    site: context.site,
    items: posts.map((post) => {
      let content = parser.render(post.body);
      
      // Convert relative image paths to absolute URLs
      content = content.replace(
        /src="\.\/([^"]+)"/g,
        `src="${context.site}writing/${post.id}/$1"`
      );
      
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.seo.description,
        link: `/writing/${post.id}/`,
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height'],
            pre: ['class'],
            code: ['class'],
          },
        }),
      };
    }),
  });
}
