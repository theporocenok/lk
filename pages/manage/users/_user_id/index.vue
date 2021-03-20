<template>
  <div>
    <h2>
      Админская страница профиля пользователя
    </h2>

    <div class="mt-5">
      <UserProfile :user-id="$route.params.user_id" />
    </div>
  </div>
</template>


<script>
    import UserProfile from "../../../../components/page/user/UserProfile";
    export default {
        components: {UserProfile},
        data () {
            return {

            }
        },
        middleware: 'administrator',
    }
</script>

<style scoped>

</style>