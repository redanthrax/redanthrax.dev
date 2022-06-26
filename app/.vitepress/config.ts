import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'en-US',
    title: 'dev blog',
    description: 'Cyberpunk life in the 21st century.',
    themeConfig: {
        logo: '/hero.png',
        nav: [
            {
                text: "Home",
                link: "/"
            },
            {
                text: "Projects",
                link: "/projects"
            },
            {
                text: "Archives",
                link: "/archives"
            }
        ]
    }
})