<template>
  <div />
</template>

<script>
  import Login from "../../../components/page/Form/auth/Login";
  import AuthMobileForm from "../../../components/page/Form/auth/AuthMobileForm";
  
  export default {
    layout: 'guest',
    middleware: 'guest',
    data() {
      return {
        token: '',
      }
    },
    async mounted(){
      await this.checkToken();
    },
    methods: {
      async redirectLogin(){
        // await this.$router.push(this.localePath('/auth/login/'));
        window.location.href = '/auth/login/';
      },
      async redirectCabinet(){
        // await this.$router.push(this.localePath('/cabinet/'));
        window.location.href = '/cabinet/';
      },
      async checkToken(){
        if(!this.$route.query || !this.$route.query.token){
          return this.redirectLogin();
        }

        this.token = this.$route.query.token;
        if(this.token) {
          // this.$auth.setToken('local', false);
          this.$auth.setToken('local', this.token);
          this.$axios.setHeader('Authorization', this.token);
          //
          const {data} = (await this.$api.Auth.me()).data;
          this.$auth.setUser(data);
          return this.redirectCabinet();
        }
        return this.redirectLogin()
      },

    }
  };
</script>

<style scoped>

</style>