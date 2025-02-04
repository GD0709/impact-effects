<template>
    <div>
        <div v-if="small">{{ publication.to_short_link_output() }}</div>
        <div v-if="large">{{ publication.to_long_styled_output() }}</div>
        <span v-if="links" 
            v-for="(link, i) in publication.links" :key="i"
            class="link">
            <span class="link_prefix">{{ link.prefix }}</span>
            <a :href="link.url" target="_blank">{{ link.display_name }}</a>
        </span>
    </div>
  </template>
  
<script setup lang="ts">
import {Publication} from '@/model/articles'


defineProps<{
    publication: Publication
    small: boolean
    large: boolean
    links: boolean
}>()
</script>
  

<style scoped lang="scss">
.link{
    margin-right: 16px;
    .link_prefix{

    }
    .link_prefix::after{
        content:": ";
    }
}
</style>