<template>
    <iframe class="w-full h-400px" :src="src" frameborder="0" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

/**
 * @file
 */
// defineOptions({
//     name: '',
// });
const props = defineProps<{
    src: string;
}>();
</script>

<style lang="scss" scoped>
</style>
