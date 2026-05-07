import { NextResponse } from 'next/server';

// List of common bot user agents
const BOTS = [
  'Twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'outbrain',
  'pinterest/0.',
  'slackbot',
  'vkShare',
  'W3C_Validator',
  'whatsapp',
  'TelegramBot',
  'Discordbot'
];

export function middleware(req) {
  const url = req.nextUrl;
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = BOTS.some(bot => userAgent.includes(bot));

  // Only run this logic for blog post routes and only for bots
  if (url.pathname.startsWith('/blog/') && isBot) {
    const slug = url.pathname.split('/').pop();
    
    // We rewrite to our metadata API which will serve the bot-optimized HTML
    return NextResponse.rewrite(new URL(`/api/blog-ssr?slug=${slug}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/blog/:slug*',
};
