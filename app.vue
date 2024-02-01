<template><NuxtPage :config="config"/></template>

<script setup lang="ts">
useSeoMeta({
  title: 'Should I Wear a Coat?',
  ogTitle: 'Should I Wear a Coat?',
  description: 'This site advises you as to whether you should wear a coat or not. It also gives reasons as to why you should/shouldnt :3',
  ogDescription: 'This site advises you as to whether you should wear a coat or not. It also gives reasons as to why you should/shouldnt :3',
})

//TODO: verify this is secure
const config = useRuntimeConfig();
</script>
