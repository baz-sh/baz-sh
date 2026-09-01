import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// The feed renders post.body, the raw markdown, so it never sees the hashed
// filenames that astro:assets generates for the site. It points at the copies in
// public/writing/<slug>/ instead, which are served verbatim.
//
// Nothing links those copies to src/content/posts, so a new post with a new image
// gives you a correct-looking site and a feed full of broken images. Check here and
// stop the build instead.
const PUBLIC_WRITING = join(process.cwd(), 'public', 'writing');

const resolveFeedImage = (postId, file) => {
  if (!existsSync(join(PUBLIC_WRITING, postId, file))) {
    throw new Error(
      `rss.xml: post "${postId}" uses the image "${file}", but ` +
        `public/writing/${postId}/${file} is missing, so the feed would link to a 404. ` +
        `Copy it across: cp src/content/posts/${postId}/${file} public/writing/${postId}/`
    );
  }

  return `writing/${postId}/${file}`;
};

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
        (_match, file) => `src="${context.site}${resolveFeedImage(post.id, file)}"`
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
