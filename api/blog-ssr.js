import { readFileSync } from 'fs';
import { join } from 'path';
import { blogPosts } from '../src/blog/posts.js';

export default function handler(req, res) {
  const { slug } = req.query;
  const post = blogPosts.find(p => p.slug === slug);

  // Path to the index.html file
  const indexPath = join(process.cwd(), 'index.html');
  let html = readFileSync(indexPath, 'utf8');

  if (post) {
    const title = `${post.title} | Creationbase`;
    const description = Array.isArray(post.body) ? post.body[0].slice(0, 160) : '';
    const image = post.image;
    const url = `https://creationbase.io/blog/${post.slug}`;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${title}" />`);

    // Replace Description
    html = html.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${description}" />`);

    // Replace Open Graph
    html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${image}" />`);
    html = html.replace(/<meta property="og:image:secure_url" content=".*?" \/>/g, `<meta property="og:image:secure_url" content="${image}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${url}" />`);

    // Replace Twitter
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${image}" />`);
    html = html.replace(/<meta name="twitter:url" content=".*?" \/>/g, `<meta name="twitter:url" content="${url}" />`);
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
