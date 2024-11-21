<template>
    <div class="flex_row_center_top">

        <div class="flex_col_top_left" style="max-width: 900px;">
            <h1>{{ $t("articles.articles") }}</h1>
            <div class="article_full_reference" v-for="(publ, i) in publications" :key="i">
                <Publication :publication="publ" :small="false" :large="true" :links="true"/>
            </div>
        </div>
    </div> 
</template>

<script lang="ts" setup>

import { publications } from "@/model/articles"

</script>

<style scoped lang="scss">
  .article_full_reference{
        margin-top: 15px;
        margin-bottom: 15px;
    }
   
</style>