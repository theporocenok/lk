<template>
  <div>
    <Map />
  </div>
</template>

<script>
  import Map from "../../components/page/Map/Map";
  
  export default {
    components: {
      Map,
    },
    middleware: 'administrator',
  };
</script>

<style scoped>

</style>