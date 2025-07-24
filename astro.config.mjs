// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/lib/remark.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://baz.sh',
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'gruvbox-dark-medium',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
      service: {
        entrypoint: 'astro/assets/services/sharp',
        config: {
          limitInputPixels: 268402689, // Increase pixel limit (default is ~268M pixels)
          // or set to false to disable the limit entirely (use with caution)
          // limitInputPixels: false
        }
      }
    },
  integrations: [
    react(),
    sitemap(),
    mdx({
      optimize: true,
      syntaxHighlight: 'shiki',
    }),
  ],
  experimental: {
    fonts: [
      {
        name: 'Zilla Slab',
        cssVariable: '--font-zilla-slab',
        provider: 'local',
        variants: [
          {
            src: ['./src/assets/fonts/ZillaSlab-Light.ttf'],
            style: 'normal',
            weight: 300,
          },
          {
            src: ['./src/assets/fonts/ZillaSlab-Regular.ttf'],
            style: 'normal',
            weight: 400,
          },
          {
            src: ['./src/assets/fonts/ZillaSlab-Medium.ttf'],
            style: 'normal',
            weight: 500,
          },
          {
            src: ['./src/assets/fonts/ZillaSlab-SemiBold.ttf'],
            style: 'normal',
            weight: 600,
          },
          {
            src: ['./src/assets/fonts/ZillaSlab-Bold.ttf'],
            style: 'normal',
            weight: 700,
          },
        ],
      },
    ],
  },
});
