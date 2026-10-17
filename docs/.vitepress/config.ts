import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TypeScript Tutorial',
  description: 'Practical TypeScript basics with interview-ready frontend examples',
  base: '/lab/ts-tutorial/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/intro' },
      { text: 'React', link: '/react/' },
      { text: 'Vue', link: '/vue/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/intro' },
          { text: 'Setup', link: '/guide/setup' },
          { text: 'Primitives & objects', link: '/guide/primitives-and-objects' },
          { text: 'Unions & narrowing', link: '/guide/unions-narrowing' },
          { text: 'Interfaces vs types', link: '/guide/interfaces-vs-types' },
          { text: 'Functions', link: '/guide/functions' },
          { text: 'Generics', link: '/guide/generics' },
          { text: 'Async & APIs', link: '/guide/async-and-apis' },
          { text: 'Utility types', link: '/guide/utility-types' },
          { text: 'Type guards', link: '/guide/type-guards' },
          { text: 'Interview drills', link: '/guide/interview-drills' },
        ],
      },
      {
        text: 'React (light)',
        items: [
          { text: 'Overview', link: '/react/' },
          { text: 'Props & events', link: '/react/props-and-events' },
          { text: 'Hooks typing', link: '/react/hooks-typing' },
        ],
      },
      {
        text: 'Vue (full)',
        items: [
          { text: 'Overview', link: '/vue/' },
          { text: 'Props, emits & slots', link: '/vue/props-emits-slots' },
          { text: 'Composables & refs', link: '/vue/composables-and-refs' },
          { text: 'Component patterns', link: '/vue/component-patterns' },
        ],
      },
    ],
    socialLinks: [],
    outline: { level: [2, 3] },
  },
})
