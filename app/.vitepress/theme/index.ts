import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'
import Posts from './components/Posts.vue'
import Tags from './components/Tags.vue'
import PostCard from './components/PostCard.vue'
import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app, router, siteData }) {
        app.component('Posts', Posts)
        app.component('Tags', Tags)
        app.component('PostCard', PostCard)
    }
}
