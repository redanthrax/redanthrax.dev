import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: "github-dark",
        },
    },
    integrations: [
        tailwind({
            config: { applyBaseStyles: false }
        }),
    ]
});
