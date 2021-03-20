<template>
  <div>
    <Crud :model="$admin.City" />
  </div>
</template>

<script>
  import Crud from '~/components/CRUD/Index';
  
  export default {
    components: {
      Crud
    },
    middleware: 'administrator',
  };
</script>

<style scoped>

</style>