<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../../posts.data'
const route = useRoute()
const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')
</script>

<template>
    <div class="posts">
        <div
            v-for="(post, key) in posts"
            :key="key"
            :post="post">
            <div v-if="isIndex && key < 5 || !isIndex">
                <PostCard :post="post" showTags></PostCard>
            </div>
        </div>
    </div>
</template>