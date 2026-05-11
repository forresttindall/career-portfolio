import { readFileSync } from 'fs';
import { join } from 'path';
import { blogPosts } from '../src/blog/posts.js';

export default function handler(req, res) {
  const { slug } = req.query;
  const post = blogPosts.find((p) => p.slug === slug && !p.hidden);

  // Use process.cwd() to find index.html in the root
  const indexPath = join(process.cwd(), 'index.html');
  let html;
  
  try {
    html = readFileSync(indexPath, 'utf8');
  } catch (err) {
    return res.status(500).send('Error reading index.html');
  }

  if (post) {
    const title = `${post.title} | Creationbase`;
    const description = Array.isArray(post.body) ? post.body[0].slice(0, 160).replace(/"/g, '&quot;') : '';
    const image = post.image;
    const url = `https://creationbase.io/blog/${post.slug}`;

    // Helper to replace meta tags regardless of property order
    const replaceMeta = (html, property, content, attrName = 'property') => {
      const regex = new RegExp(`<meta\\s+${attrName}="${property}"\\s+content=".*?"\\s*\\/?>|<meta\\s+content=".*?"\\s+${attrName}="${property}"\\s*\\/?>`, 'g');
      return html.replace(regex, `<meta ${attrName}="${property}" content="${content}" />`);
    };

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${title}" />`);

    // Replace Tags
    html = replaceMeta(html, 'description', description, 'name');
    html = replaceMeta(html, 'og:title', title);
    html = replaceMeta(html, 'og:description', description);
    html = replaceMeta(html, 'og:image', image);
    html = replaceMeta(html, 'og:image:secure_url', image);
    html = replaceMeta(html, 'og:url', url);
    html = replaceMeta(html, 'twitter:title', title, 'name');
    html = replaceMeta(html, 'twitter:description', description, 'name');
    html = replaceMeta(html, 'twitter:image', image, 'name');
    html = replaceMeta(html, 'twitter:url', url, 'name');
  }

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  res.status(200).send(html);
}
