<template>
  <v-app>
    <Header />
    <v-container
      fluid
      fill-height
      class="pa-0 grey lighten-4"
    >
      <v-fade-transition mode="out-in">
        <!-- Page content-->

        <Nuxt />
      </v-fade-transition>
    </v-container>
    <SnackBar />
  </v-app>
</template>

<script>
  import SnackBar from "../components/SnackBar";
  import Header from "../components/page/Header";
  export default {
    components: {
      Header,
        SnackBar
    },
    mounted() {
    
    },
    layout: 'guest',
  };
</script>
