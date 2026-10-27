<template>
  <div v-if="text" class="text-negative text-caption q-mt-xs" role="alert">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>
