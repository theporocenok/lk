<template>
  <div style="width: 100%;">
    <RestorePhone v-if="!$helpers.isMobile()" />
    <RestorePasswordMobileForm v-else />
  </div>
</template>

<script>
  import RestorePhone from "../../../../components/page/Form/auth/RestorePhone";
  import RestorePasswordMobileForm from "../../../../components/page/Form/auth/RestorePasswordMobileForm";
  
  export default {
    name: "Index",
    components: {RestorePasswordMobileForm, RestorePhone},
    layout: 'guest',
    middleware: 'guest'
  };
</script>

<style scoped>

</style>