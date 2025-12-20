import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://love-rox.cc';
const LANGUAGES = ['en', 'ja'];
const PROJECT_ROOT = process.cwd();

// Get all markdown files from a directory
function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory() && LANGUAGES.includes(item.name)) {
        // Recursively get files from language directories
        const langFiles = fs.readdirSync(fullPath)
          .filter(file => file.endsWith('.md'))
          .map(file => file.replace('.md', ''));
        files.push(...langFiles);
      }
    }
  } catch {
    // Directory doesn't exist or can't be read, return empty array
    return [];
  }

  return [...new Set(files)]; // Remove duplicates
}

// Generate sitemap XML
function generateSitemap(): string {
  const blogPosts = getMarkdownFiles(path.join(PROJECT_ROOT, 'private/contents/blog'));
  const docPages = getMarkdownFiles(path.join(PROJECT_ROOT, 'private/contents/docs'));

  const urls: string[] = [];

  // Helper to add URL with language alternatives
  const addUrl = (urlPath: string, priority: string, changefreq: string) => {
    const alternates = LANGUAGES.map(lang => {
      let altPath = urlPath;
      if (urlPath === '/') {
        altPath = `/${lang}`;
      } else {
        altPath = urlPath.replace(/\/(en|ja)/, `/${lang}`);
      }
      return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${altPath}" />`;
    });

    // Add x-default for all pages (pointing to the root or the language-neutral version)
    // For now, only the homepage has a clear language-neutral root version (/)
    if (urlPath === '/' || urlPath === '/en' || urlPath === '/ja') {
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`);
    }

    urls.push(`  <url>
    <loc>${SITE_URL}${urlPath}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates.join('\n')}
  </url>`);
  };

  // Homepage (Root/Default)
  addUrl('/', '1.0', 'weekly');

  // Strategy: For each page, we need to add the URL entry for each language, 
  // and EVERY such entry must have alternates for ALL languages (including itself).

  // Homepage (Language specific)
  LANGUAGES.forEach(lang => {
    addUrl(`/${lang}`, '1.0', 'weekly');
  });

  // Static pages
  const staticPages = ['docs', 'blog', 'assets', 'contact'];
  staticPages.forEach(page => {
    LANGUAGES.forEach(lang => {
      addUrl(`/${lang}/${page}`, page === 'docs' ? '0.9' : '0.8', 'weekly');
    });
  });

  // Blog posts
  blogPosts.forEach(slug => {
    LANGUAGES.forEach(lang => {
      addUrl(`/${lang}/blog/${slug}`, '0.7', 'monthly');
    });
  });

  // Doc pages
  docPages.forEach(slug => {
    LANGUAGES.forEach(lang => {
      addUrl(`/${lang}/docs/${slug}`, '0.8', 'weekly');
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

// Generate robots.txt
function generateRobotsTxt(): string {
  return `User-agent: *
Disallow: /RSC/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// Main execution
function main() {
  const publicDir = path.join(PROJECT_ROOT, 'public');

  // Generate sitemap.xml
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('✓ Generated sitemap.xml');

  // Generate robots.txt
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✓ Generated robots.txt');

  console.log('\nSEO files generated successfully!');
}

main();
