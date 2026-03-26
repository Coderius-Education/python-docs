import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Python Leren Programmeren — Coderius',
  tagline: 'Leer stap voor stap programmeren in Python',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://python.coderius.nl',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Coderius-Education', // Usually your GitHub org/user name.
  projectName: 'python-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl'],
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Leer stap voor stap programmeren in Python. Gratis cursus met interactieve oefeningen direct in je browser.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'python leren, python programmeren beginners, python cursus gratis, python oefeningen online',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'coderius-python',
      logo: {
        alt: 'coderius-python',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/playground', label: 'Playground', position: 'left'},
        {to: '/cheatsheet', label: 'Cheatsheet', position: 'left'},
        {to: '/hulp', label: 'Hulp', position: 'left'},
        {
          href: 'https://github.com/Coderius-Education/python-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Meer van Coderius',
          items: [
            { label: 'Maak games met Python', href: 'https://play.coderius.nl' },
            { label: 'Python als back-end met FastAPI', href: 'https://fullstack.coderius.nl' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Coderius-Education, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
