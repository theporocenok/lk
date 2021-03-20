<template>
  <div />
</template>

<script>
  import Login from "../../../components/page/Form/auth/Login";
  import AuthMobileForm from "../../../components/page/Form/auth/AuthMobileForm";
  
  export default {
    /*layout: 'guest',
    middleware: 'guest',*/
    data() {
      return {
        token: '',
      }
    },
    async mounted(){
      this.$api.Auth.logout();
      this.$auth.logout();
      return this.redirectLogin();
    },
    methods: {
      async redirectLogin(){
        // await this.$router.push(this.localePath('/auth/login/'));
        window.location.href = '/auth/login/';
      },

    }
  };
</script>

<style scoped>

</style>