<template>
  <div>
    <NewsList class="mb-5" />
    <UserProfile />
  </div>
</template>


<script>
    import UserProfile from "../../components/page/user/UserProfile";
    import NewsList from "../../components/page/News/NewsList";
    export default {
        name: "Index",
        components: {NewsList, UserProfile},
        data () {
            return {

            }
        }
    }
</script>

<style scoped>

</style>