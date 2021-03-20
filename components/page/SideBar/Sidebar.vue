<template>
  <div>
    <DesktopSidebar v-if="getWindowWidth >= 1000" />
    <MobileSidebar v-else-if="getWindowWidth < 1000" />
  </div>
</template>

<script>
  import MobileSidebar from "./MobileSidebar";
  import DesktopSidebar from "./DesktopSidebar";

  export default {
    components: {
      MobileSidebar,
      DesktopSidebar,
    },
    
    computed: {
      getWindowWidth() {
        return this.$store.state.screenWidth;
      },

    },
    mounted() {
    },
    methods: {
    }
  };
</script>
<style scoped>
</style>
