<template>
  <div style="width: 100%;">
    <Register v-if="!$helpers.isMobile()" />
    <AuthMobileForm v-else />
  </div>
</template>

<script>
  import Register from "../../../components/page/Form/auth/Register";
  import AuthMobileForm from "../../../components/page/Form/auth/AuthMobileForm";
  
  export default {
    name: "Index",
    components: {AuthMobileForm, Register},
    layout: 'guest',
    middleware: 'guest'
  };
</script>

<style scoped>

</style>