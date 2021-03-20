<template>
  <div style="width: 100%;">
    <Restore v-if="!$helpers.isMobile()" />
    <RestorePasswordMobileForm v-else />
  </div>
</template>

<script>
  import Restore from "../../../components/page/Form/auth/Restore";
  import RestorePasswordMobileForm from "../../../components/page/Form/auth/RestorePasswordMobileForm";
  
  export default {
    name: "Index",
    components: {RestorePasswordMobileForm, Restore},
    layout: 'guest',
    middleware: 'guest'
  };
</script>

<style scoped>

</style>