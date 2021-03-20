<template>
  <div style="width: 100%;">
    <Login v-if="!$helpers.isMobile()" />
    <AuthMobileForm v-else />
  </div>
</template>

<script>
  import Login from "../../../components/page/Form/auth/Login";
  import AuthMobileForm from "../../../components/page/Form/auth/AuthMobileForm";
  
  export default {
    name: "Index",
    components: {AuthMobileForm, Login},
    layout: 'guest',
    middleware: 'guest'
  };
</script>

<style scoped>

</style>