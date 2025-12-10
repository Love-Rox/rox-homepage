import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { remarkAlert } from 'remark-github-blockquote-alert';
import remarkMermaid from 'remark-mermaidjs';


export interface MarkdownMetadata {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  [key: string]: any;
}

export interface MarkdownContent {
  metadata: MarkdownMetadata;
  content: string;
  html: string;
}

/**
 * Load and parse a Markdown file
 * @param filePath - Absolute path to the Markdown file
 * @returns Parsed Markdown content with metadata and HTML
 */
export async function loadMarkdown(filePath: string): Promise<MarkdownContent> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Convert Markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkMermaid, {
      mermaidConfig: {
        theme: 'base',
        themeVariables: {
          primaryColor: '#ff5b11',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#ff5b11',
          lineColor: '#64748b',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#fff7ed',
          nodeTextColor: '#1e293b',
          clusterBkg: '#fff7ed',
          clusterBorder: '#ff5b11',
          edgeLabelBackground: '#ffffff',
        },
      },
    })
    .use(remarkHtml, { sanitize: false })
    .process(content);

  const html = processedContent.toString();

  return {
    metadata: data as MarkdownMetadata,
    content,
    html,
  };
}

/**
 * Get all Markdown files in a directory
 * @param dirPath - Absolute path to the directory
 * @returns Array of file names (without extension)
 */
export async function getMarkdownFiles(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

/**
 * Load Markdown content by slug and locale
 * @param type - Content type ('docs' or 'blog')
 * @param slug - Content slug
 * @param locale - Locale ('en' or 'ja')
 * @returns Parsed Markdown content
 */
export async function loadMarkdownBySlug(
  type: 'docs' | 'blog',
  slug: string,
  locale: 'en' | 'ja'
): Promise<MarkdownContent | null> {
  const filePath = path.join(
    process.cwd(),
    'private',
    'contents',
    type,
    locale,
    `${slug}.md`
  );

  try {
    return await loadMarkdown(filePath);
  } catch {
    return null;
  }
}

/**
 * Get all content slugs for a given type and locale
 * @param type - Content type ('docs' or 'blog')
 * @param locale - Locale ('en' or 'ja')
 * @returns Array of slugs
 */
export async function getAllSlugs(
  type: 'docs' | 'blog',
  locale: 'en' | 'ja'
): Promise<string[]> {
  const dirPath = path.join(process.cwd(), 'private', 'contents', type, locale);
  return await getMarkdownFiles(dirPath);
}
