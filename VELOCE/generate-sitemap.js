import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gyxjytykxzivbtmymtek.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi';
const SITE_URL = 'https://velocewear.shop';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
  try {
    console.log("Generating sitemap...");
    
    // Read static routes
    const staticRoutes = [
      '',
      '/shop',
      '/shop/football',
      '/shop/f1',
      '/shop/basketball',
      '/shop/cricket',
      '/shop/accessories',
      '/shop/retro',
      '/shop/worldcup',
      '/search',
      '/info/about-us',
      '/info/privacy-policy',
      '/info/terms-and-conditions',
      '/info/contact',
      '/info/returns-and-refunds',
      '/info/shipping-policy',
      '/info/faqs',
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static routes
    for (const route of staticRoutes) {
      sitemap += `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    // Fetch LIVE products from Supabase
    console.log("Fetching live products from Supabase database...");
    const { data: products, error } = await supabase.from('products').select('id, name, category');
    
    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    
    console.log(`Found ${products.length} live products.`);

    const slugify = (text) => text.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

    for (const product of products) {
      const slug = slugify(product.name);
      sitemap += `  <url>\n    <loc>${SITE_URL}/${product.category}/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    sitemap += `</urlset>`;

    await fs.writeFile('./public/sitemap.xml', sitemap);
    console.log("Sitemap generated successfully at public/sitemap.xml");

    // Generate robots.txt
    const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nDisallow: /profile\nDisallow: /login\nDisallow: /wishlist\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    await fs.writeFile('./public/robots.txt', robotsTxt);
    console.log("robots.txt generated successfully at public/robots.txt");

  } catch (err) {
    console.error("Error generating sitemap:", err);
  }
}

generateSitemap();
