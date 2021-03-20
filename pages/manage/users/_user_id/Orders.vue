<template>
  <div>
    <h2>
      Договоры пользователя
    </h2>

    <div class="mt-5">
      <UserOrders :user-id="this.$route.params.user_id" />
    </div>
  </div>
</template>


<script>
    import UserOrders from "../../../../components/page/user/UserOrders";
    export default {
        components: {UserOrders},
        data () {
            return {

            }
        },
        middleware: 'administrator',
    }
</script>

<style scoped>

</style>