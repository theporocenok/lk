<template>
  <div>
    <UserPersonals
      :dialog="dialog_personals"
      :user.sync="user"
      @hideDialog="closeUserPersonalsDialog"
    />

    <UserCardNotifies
      :dialog="dialog_notifies"
      :user-id.sync="userId ? userId : user.id"
      @hideDialog="closeUserCardNotifiesDialog"
    />

    <ChangePassword
      :user-id.sync="user.id"
      :show-window="dialog_changepass"
      @hideDialog="dialog_changepass = false"
    />

    <v-layout
      justify-space-between
    >
      <v-flex class="">
        <v-card
          class="pa-5"
        >
          <v-card-text>
            <v-layout
              justify-space-between
              align-center
            >
              <div>
                <div :class="`${$helpers.isMobile() ? 'd-flex flex-column' : ''}`">
                  <span class="display-1 text--primary">
                    {{ user.full_name ? user.full_name : '' }}
                  </span>
                  <span :class="`${$helpers.isMobile() ? 'mt-2' : 'ml-5'}`">
                    {{ user.phone }}
                  </span>
                  <span :class="`${$helpers.isMobile() ? 'mt-2' : 'ml-5'}`">
                    {{ user.email }}
                  </span>
                  <span v-if="false">
                    <span v-if="user.role_id==1">Администратор</span>
                    <span v-else-if="user.role_id==2">Пользователь</span>
                  </span>
                </div>
                <template v-if="user.id">
                  <template v-if="user.first_name==null || user.last_name==null || user.patronymic_name==null">
                    <v-alert
                      class="ma-0 mt-5 pa-2"
                      type="error"
                    >
                      Некоторые обязательные данные пользователя не указаны
                    </v-alert>
                  </template>
                </template>
              </div>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      color="teal darken-3"

                      v-on="on"
                      @click="dialog_personals = true"
                    >
                      <v-icon>mdi-account-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Изменить личные данные</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      color="teal darken-3"
                      icon
                      v-on="on"
                      @click="dialog_changepass = true"
                    >
                      <v-icon>mdi-lock-open</v-icon>
                    </v-btn>
                  </template>
                  <span>Изменить пароль</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      color="teal darken-3"
                      icon
                      v-on="on"
                      @click="dialog_notifies = true"
                    >
                      <v-icon>mdi-bell-ring</v-icon>
                    </v-btn>
                  </template>
                  <span>Уведомления</span>
                </v-tooltip>
              </div>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
    import UserCardNotifies from "./UserCardNotifies";
    import ChangePassword from "../Form/ChangePassword";
    import UserPersonals from "./UserPersonals";

    export default {
        name: "UserProfileTop",
        components: {
            UserPersonals,
            UserCardNotifies, ChangePassword},
        props: {
            userId: {
                type: [Number, String],
                required: false,
            }
        },
        data () {
            return {
                // диалоговое пароль
                dialog_changepass: false,
                dialog_notifies: false,
                dialog_personals: false,
                user: {},
            }
        },
        // computed: {
        //   user(){
        //       return this.$auth.user;
        //   }
        // },
        mounted() {
            this.loadData();
        },
        methods: {

            closeUserPersonalsDialog(){
                this.dialog_personals = false;
                this.loadData();
            },
            closeUserCardNotifiesDialog(){
                this.dialog_notifies = false;
                this.loadData();
            },
            async loadData(){
                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }
                let {data} = (await this.$api.User.profile(userId)).data;
                this.user = data.user;
            }
        }
    }
</script>

<style scoped>

</style>