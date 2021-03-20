<template>
  <div>
    <div class="headline pa-4">
      Уведомления администраторов о новых активациях
    </div>

    <Crud
      :model="$admin.UserAdminNotify"
      :show-title="false"
    >
      <template #item.email="{item}">
        <template v-if="item.email==1">
          Да
        </template>
      </template>
      <template #item.sms="{item}">
        <template v-if="item.sms==1">
          Да
        </template>
      </template>
    </Crud>
  </div>
</template>

<script>
    import Crud from '~/components/CRUD/Index';

    export default {
        components: {
          Crud
        },
        data () {
            return {

            }
        },
        mounted() {
            // this.getUsers();
        },
        methods:{
            // getUsers() {
            //     return true;
            // },
        },
        middleware: 'administrator',
    };
</script>

<style scoped>
.link_nodecor{text-decoration: none;}
</style>