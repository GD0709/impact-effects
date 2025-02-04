<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link class="header_link" to="/">
        <div class="flex_row_center_center align-center">
          <span class="icon ah-meteoroid logo"/>
        <div class="app_bar_header">Impact Effects{{state.visual_settings.is_debug ? ' - Debug Mode' : ''}}</div>
        </div>
      </router-link>

      <v-spacer></v-spacer>

      <!-- <v-btn class="d-none d-sm-flex"
        href="http://isturunt.pythonanywhere.com/"
        target="_blank"
        text
      >
        <span class="mr-2">{{ $t("old version") }}</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
      <!-- <v-btn class="d-none d-sm-flex"
        v-on:click="test"
      >
        <span class="mr-2">test</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
      <v-btn v-if="t.locale.value == 'en'"
        class="d-none d-sm-flex"
        v-on:click="change_language('ru')"
      >
        <v-icon>mdi-translate</v-icon>
        <span class="" style="margin-left: 8px;" >Русская версия</span>
      </v-btn>
      <v-btn v-if="t.locale.value == 'ru'"
        class="d-none d-sm-flex"
        v-on:click="change_language('en')"
      >
        <v-icon>mdi-translate</v-icon>
        <span class="" style="margin-left: 8px;">English version</span>
      </v-btn>
    </v-app-bar>
    <div>locale:    {{ t.locale.value }}</div>
    <!-- <HelloWorld/> -->
    <v-main>
      <router-view />
   
    </v-main>


    <v-footer class="footer"

    >
      <v-card
        flat
        tile
        width="100%"
        color="primary" dark
        class="text-center"
      >
        <v-card-text>

          <div class="flex_col_center_center">
            <div class="flex_row_center_top footer_column">
              <v-btn
              color="white"
              rounded="xl"
              variant="text"
              v-on:click="navigate('/')"
            >
            {{ $t("footer.about") }}
            </v-btn>
            <v-btn
              color="white"
              rounded="xl"
              variant="text"
              v-on:click="navigate('calc')"
            >
            {{ $t("footer.calculator") }}
            </v-btn>            
            <v-btn
              color="white"
              rounded="xl"
              variant="text"
              v-on:click="navigate('articles')"
            >
            {{ $t("footer.articles") }}
            </v-btn>
              
            </div>
            <div class="flex_row_center_top footer_column">
              <v-btn                
              color="white"
              rounded="xl"
              variant="text" 
              v-on:click="change_language('ru')">Русский</v-btn>
              <v-btn                
              color="white"
              rounded="xl"
              variant="text" 
              v-on:click="change_language('en')">English</v-btn>
            </div>
            <div class="flex_row_center_top footer_column">
              <a href="mailto:achidg@yandex.ru?subject=Impact Effects Calculator" class="email">{{$t("footer.email")}}: achidg@yandex.ru</a>
            </div>
          </div>
          



        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text flex_col_center_center">
          <DebugSwitcher>{{ new Date().getFullYear() }} — {{$t("footer.footer_text")}}</DebugSwitcher>
          <div><a class="footer_link" href="https://idg.ras.ru/">{{$t("footer.organization")}}</a></div>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import State from "./model/state"
import {ref} from "vue"

const state = ref(State.state)

import { useI18n } from "vue-i18n";
const t = useI18n();

import router from './router'

function change_language(lng: string) {
  t.locale.value = lng;
}


  function is_debug() {
    return true;
  }
  function navigate(page: string) {
    router.push(page)
  }
</script>

<style scoped lang="scss">
  header {
    padding: 0px 16px;
  }
  .header_link{
    text-decoration: none;
    color:white;
  }
  .app_bar_header{
    font-weight: 400;
    font-size: 28px;

  }
  .logo{
    color:white;
    font-size: 36px;
    margin-top: -10px;
    margin-right: 10px;
  }
  .footer {
    padding: 0px;
    display: flex;
    flex-grow: 0;

  }
  .footer_column{
    margin-right:50px; 
    margin-left:50px; 
  }
  .footer_caption{
    font-size: 18px;
    margin-bottom: 16px;
  }
  footer a {
    color:white;
    text-decoration: unset;
    &:hover{
      text-decoration: underline;
    }
  }
</style>