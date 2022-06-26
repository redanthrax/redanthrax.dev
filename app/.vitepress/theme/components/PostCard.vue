<script setup lang="ts">
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import type { Post } from '../types'

defineProps({
    post: {
        type: Object as PropType<Post>,
        required: true
    },
    showTags: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
    <div class="postcard">
        <a class="post-title" :href="post.href">{{ post.title }}</a>
        <div class="post-excerpt" v-html='post.excerpt'></div>
        <div v-if="showTags">
            <a class="post-tags" v-for="(tag, i) in post.tags" :key="i" :href="`/tags.html#${tag}`">
                #{{ tag }}
            </a>
        </div>
    </div>
</template>
