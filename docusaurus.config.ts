import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'StreamGive',
  tagline: 'Recurring, streaming donations for verified NGOs on Stellar',
  favicon: 'img/favicon.svg',

  // Standard GitHub Pages project-site URLs. If a custom domain gets set
  // up later, update both of these (and add a static/CNAME file).
  url: 'https://streamgive.github.io',
  baseUrl: '/streamgive-docs/',

  organizationName: 'streamgive',
  projectName: 'streamgive-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/streamgive/streamgive-docs/edit/main/',
          // Docs-only site, no blog — mount them at the site root instead
          // of under /docs/.
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'StreamGive',
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
        {
          href: 'https://github.com/streamgive',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Repositories',
          items: [
            { label: 'Contracts', href: 'https://github.com/streamgive/streamgive-contracts' },
            { label: 'Backend', href: 'https://github.com/streamgive/streamgive-backend' },
            { label: 'Frontend', href: 'https://github.com/streamgive/streamgive-frontend' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StreamGive contributors.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
