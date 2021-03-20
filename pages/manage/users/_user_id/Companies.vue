<template>
  <div>
    <div class="headline">
      Компании пользователя
    </div>

    <UserCompanies
      :show-admin="true"
      :user-id="this.$route.params.user_id"
    />
  </div>
</template>>

<script>
    import UserCompanies from "../../../../components/page/user/UserCompanies";
    export default {
        name: "Index",
        components: {UserCompanies},
        middleware: 'administrator',
    }
</script>

<style scoped>

</style>