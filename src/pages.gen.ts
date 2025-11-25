// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_BaseAbout_getConfig } from './pages/(base)/about';
// prettier-ignore
import type { getConfig as File_BaseIndex_getConfig } from './pages/(base)/index';
// prettier-ignore
import type { getConfig as File_LocaleLangBlogSlug_getConfig } from './pages/(locale)/[lang]/blog/[slug]';
// prettier-ignore
import type { getConfig as File_LocaleLangBlogIndex_getConfig } from './pages/(locale)/[lang]/blog/index';
// prettier-ignore
import type { getConfig as File_LocaleLangDocsSlug_getConfig } from './pages/(locale)/[lang]/docs/[slug]';
// prettier-ignore
import type { getConfig as File_LocaleLangDocsIndex_getConfig } from './pages/(locale)/[lang]/docs/index';
// prettier-ignore
import type { getConfig as File_LocaleLangIndex_getConfig } from './pages/(locale)/[lang]/index';

// prettier-ignore
type Page =
| ({ path: '/about' } & GetConfigResponse<typeof File_BaseAbout_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_BaseIndex_getConfig>)
| ({ path: '/[lang]/blog/[slug]' } & GetConfigResponse<typeof File_LocaleLangBlogSlug_getConfig>)
| ({ path: '/[lang]/blog' } & GetConfigResponse<typeof File_LocaleLangBlogIndex_getConfig>)
| ({ path: '/[lang]/docs/[slug]' } & GetConfigResponse<typeof File_LocaleLangDocsSlug_getConfig>)
| ({ path: '/[lang]/docs' } & GetConfigResponse<typeof File_LocaleLangDocsIndex_getConfig>)
| ({ path: '/[lang]' } & GetConfigResponse<typeof File_LocaleLangIndex_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
