// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.js',
      },
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales/'
  },
  head: {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1'
  }
});
