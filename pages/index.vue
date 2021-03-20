<template>
  <div>
    <NewsList class="mb-5" />
    <template v-if="role == 1">
      <AdminUserRequests />
    </template>
    <template v-else-if="role == 2">
      <UserProfile />
    </template>
  </div>
</template>

<script>
  import UserProfile from "../components/page/user/UserProfile";
  import AdminUserRequests from "./manage/userrequests/index";
  import NewsList from "../components/page/News/NewsList";
  export default {
      components: {
          AdminUserRequests,
          UserProfile,
          NewsList
      },
      data() {
          return {
              role: ''
          }
      },
      computed: {},
      mounted() {
          this.role = this.$auth.user.role_id;
      },
      middleware: 'authenticated'
  };
</script>
