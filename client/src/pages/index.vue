<template>
  <div class="home">
    <div class="line_primary">{{$t("home.intro_1")}}</div>
    <div class="line_second">{{$t("home.intro_2")}}</div>
    <div class="line_primary">{{$t("home.intro_3")}}</div>
    <div class="line_second">{{$t("home.intro_4")}}</div>
    <div class="line_primary">{{$t("home.intro_5")}}</div>


  <div class="get_started_button">
    <v-btn
      color="primary"
      size="x-large"
      v-on:click="navigate('calc')"
    >
    {{ $t("home.start_button") }}
    </v-btn>
  </div> 

  <div>
</div>
  </div>
</template>

<script lang="ts" setup>
import router from './../router'
function navigate(page: string) {
    router.push(page)
  }
  //
</script>
<style scoped lang="scss">
  .home{
    min-height: 100%;
    justify-self: center;
    align-self: center;
    padding-bottom: 25px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .get_started_button{
      margin: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
    }
    .line_primary {
        font-size: 26px;
        text-align: center;
        font-weight: 400;
    }
    .line_second {
        font-size: 20px;
        font-style: italic;
        text-align: center;
        font-weight: 300;
        
        margin-top:50px;
        margin-bottom: 50px;
    }
  }  
</style>