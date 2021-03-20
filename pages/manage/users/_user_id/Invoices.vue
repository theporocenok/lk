<template>
  <div>
    <h2>
      Счета пользователя
    </h2>

    <div class="mt-5">
      <UserInvoices :user-id="this.$route.params.user_id" />
    </div>
  </div>
</template>


<script>
    import UserInvoices from "../../../../components/page/user/UserInvoices";
    export default {
        components: {UserInvoices},
        data () {
            return {

            }
        },
        middleware: 'administrator',
    }
</script>

<style scoped>

</style>