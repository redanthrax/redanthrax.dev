<template>
    <div class="toggleTheme" @click="toggle">
        <div class="dark" v-if="isDark">🌙</div>
        <div class="light" v-else>🔆</div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from "vue";
    let isDark = ref(true);
    const toggle = () => {
        const html = document.querySelector("html")!;
        html.classList.toggle("light");
        isDark.value = !isDark.value;
    };
</script>
<style scoped>
    .toggleTheme {
        display: flex;
        cursor: pointer;
        width: 22px;
        margin-left: 15px;
    }
</style>