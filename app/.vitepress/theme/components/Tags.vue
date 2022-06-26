<script setup lang="ts">
import { data as posts } from '../../posts.data'
import { ref, watchEffect } from 'vue'
import type { Post } from '../types'
import PostCard from './PostCard.vue';
const hashPosts = ref<Post[]>([]);
const hash = ref<string | null>(null)

watchEffect(() => {
    console.log("watch effect")
    if(window.location.hash) {
        hash.value = window.location.hash.replace('#', '')
        hashPosts.value = posts
            .slice()
            .filter((el) => el.tags?.includes(hash.value))
    }
})
</script>
<template>
    <div v-if="hashPosts.length > 0" class="posts">
        <h2>#{{ hash }}</h2>
        <div
            v-for="(post, key) in hashPosts"
            :key="key"
            :post="post">
            <PostCard :post="post" />
        </div>
    </div>
    <div v-else>
        <p>Nothing found for that tag.</p>
    </div>
</template>