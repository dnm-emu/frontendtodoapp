<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h2 text-primary">404</div>
      <div class="text-h6 q-mt-sm">Такой страницы нет</div>
      <q-btn class="q-mt-lg" unelevated color="primary" label="К доске" :to="{ name: 'board' }" />
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
