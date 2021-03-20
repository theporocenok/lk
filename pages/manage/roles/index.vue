<template>
  <div>
    <Crud :model="$admin.Role" />
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