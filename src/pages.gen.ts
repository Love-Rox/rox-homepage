// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_BaseAbout_getConfig } from './pages/(base)/about';
// prettier-ignore
import type { getConfig as File_BaseBlogSlug_getConfig } from './pages/(base)/blog/[slug]';
// prettier-ignore
import type { getConfig as File_BaseDocsSlug_getConfig } from './pages/(base)/docs/[slug]';
// prettier-ignore
import type { getConfig as File_BasePackagesTateChuYokoDemo_getConfig } from './pages/(base)/packages/tate-chu-yoko/demo';
// prettier-ignore
import type { getConfig as File_BasePackagesTateChuYokoIndex_getConfig } from './pages/(base)/packages/tate-chu-yoko/index';
// prettier-ignore
import type { getConfig as File_LocaleLang404_getConfig } from './pages/(locale)/[lang]/404';
// prettier-ignore
import type { getConfig as File_LocaleLangAssets_getConfig } from './pages/(locale)/[lang]/assets';
// prettier-ignore
import type { getConfig as File_LocaleLangBlogSlug_getConfig } from './pages/(locale)/[lang]/blog/[slug]';
// prettier-ignore
import type { getConfig as File_LocaleLangBlogIndex_getConfig } from './pages/(locale)/[lang]/blog/index';
// prettier-ignore
import type { getConfig as File_LocaleLangContact_getConfig } from './pages/(locale)/[lang]/contact';
// prettier-ignore
import type { getConfig as File_LocaleLangDocsSlug_getConfig } from './pages/(locale)/[lang]/docs/[slug]';
// prettier-ignore
import type { getConfig as File_LocaleLangDocsIndex_getConfig } from './pages/(locale)/[lang]/docs/index';
// prettier-ignore
import type { getConfig as File_LocaleLangIndex_getConfig } from './pages/(locale)/[lang]/index';
// prettier-ignore
import type { getConfig as File_LocaleLangPackagesTateChuYokoDemo_getConfig } from './pages/(locale)/[lang]/packages/tate-chu-yoko/demo';
// prettier-ignore
import type { getConfig as File_LocaleLangPackagesTateChuYokoIndex_getConfig } from './pages/(locale)/[lang]/packages/tate-chu-yoko/index';
// prettier-ignore
import type { getConfig as File_ApiApiOg_getConfig } from './pages/_api/api/og';
// prettier-ignore
import type { getConfig as File_ApiApiReleases_getConfig } from './pages/_api/api/releases';
// prettier-ignore
import type { getConfig as File_ApiApiSubmit_getConfig } from './pages/_api/api/submit';

// prettier-ignore
type Page =
| ({ path: '/about' } & GetConfigResponse<typeof File_BaseAbout_getConfig>)
| { path: '/assets'; render: 'static' }
| ({ path: '/blog/[slug]' } & GetConfigResponse<typeof File_BaseBlogSlug_getConfig>)
| { path: '/blog'; render: 'static' }
| { path: '/contact'; render: 'static' }
| ({ path: '/docs/[slug]' } & GetConfigResponse<typeof File_BaseDocsSlug_getConfig>)
| { path: '/docs'; render: 'static' }
| { path: '/'; render: 'static' }
| ({ path: '/packages/tate-chu-yoko/demo' } & GetConfigResponse<typeof File_BasePackagesTateChuYokoDemo_getConfig>)
| ({ path: '/packages/tate-chu-yoko' } & GetConfigResponse<typeof File_BasePackagesTateChuYokoIndex_getConfig>)
| ({ path: '/[lang]/404' } & GetConfigResponse<typeof File_LocaleLang404_getConfig>)
| ({ path: '/[lang]/assets' } & GetConfigResponse<typeof File_LocaleLangAssets_getConfig>)
| ({ path: '/[lang]/blog/[slug]' } & GetConfigResponse<typeof File_LocaleLangBlogSlug_getConfig>)
| ({ path: '/[lang]/blog' } & GetConfigResponse<typeof File_LocaleLangBlogIndex_getConfig>)
| ({ path: '/[lang]/contact' } & GetConfigResponse<typeof File_LocaleLangContact_getConfig>)
| ({ path: '/[lang]/docs/[slug]' } & GetConfigResponse<typeof File_LocaleLangDocsSlug_getConfig>)
| ({ path: '/[lang]/docs' } & GetConfigResponse<typeof File_LocaleLangDocsIndex_getConfig>)
| ({ path: '/[lang]' } & GetConfigResponse<typeof File_LocaleLangIndex_getConfig>)
| ({ path: '/[lang]/packages/tate-chu-yoko/demo' } & GetConfigResponse<typeof File_LocaleLangPackagesTateChuYokoDemo_getConfig>)
| ({ path: '/[lang]/packages/tate-chu-yoko' } & GetConfigResponse<typeof File_LocaleLangPackagesTateChuYokoIndex_getConfig>)
| ({ path: '/_api/api/og' } & GetConfigResponse<typeof File_ApiApiOg_getConfig>)
| ({ path: '/_api/api/releases' } & GetConfigResponse<typeof File_ApiApiReleases_getConfig>)
| ({ path: '/_api/api/submit' } & GetConfigResponse<typeof File_ApiApiSubmit_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
