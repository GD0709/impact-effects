<template>
  <v-btn icon="mdi-help-circle-outline" size="small" variant="text" color="primary" @click="dialog = true" style="margin-top: -14px; margin-bottom: -10px;"></v-btn>
  <v-dialog
      v-model="dialog"
      width="auto"
    >


    <v-card
        max-width="800"
      >
      <v-card-title v-html="help_title" style="padding-left: 24px; padding-right: 24px;">
            </v-card-title>

      <v-card-text >
                <span v-html="help_text"></span>
                <slot></slot>
            </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            :text="$t('system.close_text')"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialog = ref(false)

  defineProps<{
    help_text?: string
    help_title?: string
  }>()
</script>
