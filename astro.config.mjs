import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Notes',
      social: {
        github: 'https://github.com/josefaidt/gen2-notes',
      },
      sidebar: [
        {
          label: 'Getting Started',
          link: '/getting-started',
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
})
