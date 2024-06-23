// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ['@nuxt/ui', '@nuxtjs/i18n'],
    css: ['~/assets/css/style.css'],
    devServer: {
        port: 3001,
    },
    routeRules: {
        '/': {
            prerender: true,
        }
    },
    app: {
        head: {
            title: 'NitWikit AI 在线',
            meta: [
                {
                    name: 'keywords',
                    content: 'NitWikit AI 在线, AI, Cloudflare Workers AI'
                },
                {
                    name: 'description',
                    content: 'Integrated web platform supporting Cloudflare Workers AI Jazee6'
                }
            ],
            link: [
                {
                    rel: 'manifest',
                    href: '/manifest.json'
                }
            ]
        }
    },
    i18n: {
        vueI18n: './i18n.config.ts',
        strategy: 'no_prefix',
        defaultLocale: 'zh',
    }
    // nitro: {
    //     vercel: {
    //         regions: ["sin1", "syd1", "sfo1", "iad1", "pdx1", "cle1"]
    //     }
    // }
})
