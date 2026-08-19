// @ts-check
import { defineConfig } from 'astro/config';
import { redirects } from './src/data/redirects.js';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import clerk from '@clerk/astro'
import { dark } from "@clerk/themes";
import { esES } from "@clerk/localizations";

import netlify from '@astrojs/netlify';

const redirectMap = Object.fromEntries(
  redirects.map(({ id, url }) => [`/${id}/`, url])
);

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web.b4nned.xyz",
        pathname: "/**",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  redirects: {
    "/es/": "/",
    "/en/": "/",
    "/es/projects/": "/projects/",
    "/en/projects/": "/projects/",
    "/es/staff/": "/staff/",
    "/en/staff/": "/staff/",
    "/es/launcher/": "/launcher/",
    "/en/launcher/": "/launcher/",
    "/es/about/": "/about/",
    "/en/about/": "/about/",
    "/es/contact/": "/contact/",
    "/en/contact/": "/contact/",
    "/es/apply/": "/apply/",
    "/en/apply/": "/apply/",
    "/es/terms/": "/terms/",
    "/en/terms/": "/terms/",
    ...redirectMap
  },

  integrations: [clerk({
    appearance: {
        baseTheme: dark,
      },
      localization: esES,
  })],

  adapter: netlify(),
  output: 'server'
});