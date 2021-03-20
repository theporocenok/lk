<template>
  <div>
    <template>
      <VNavigationDrawer
        v-model="toggleDrawler"
        fixed
        clipped
        width="100%"
        temporary
        :color="$config.defaultColor"
        dense
        :dark="true"
        z-index="100"
      >
        <v-list-item
          class="mt-1 pr-1"
        >
          <v-list-item-avatar>
            <v-avatar color="white">
              <v-icon
                color="#3f4d67"
              >
                mdi-account
              </v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-btn
              text
              tile
              class="px-0 justify-start profile-btn"
              @click="profileShow = !profileShow"
            >
              <div class="text-dusk white--text">
                {{ $auth.user.first_name }} {{ $auth.user.last_name }}
                <template v-if="!profileShow">
                  <v-icon class="mb-1">
                    mdi-chevron-down
                  </v-icon>
                </template>
                <template v-else>
                  <v-icon class="mb-1">
                    mdi-chevron-up
                  </v-icon>
                </template>
              </div>
            </v-btn>
          </v-list-item-content>

          <v-spacer v-if="false" />

          <v-btn
            v-if="false"
            float
            icon
            text
            class="pa-0 mr-n1 black--text"
            @click="toggleDrawler = false, showNotificationsDialog = true"
          >
            <v-icon color="white">
              mdi-bell-outline
            </v-icon>
          </v-btn>
          <v-btn
            float
            icon
            text
            class="pa-0 black--text"
            @click="toggleDrawler = false"
          >
            <v-icon
              color="white"
              size="30"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </v-list-item>
        <v-list-group
          v-model="profileShow"
          class="profile__btns grey-line--top"
        >
          <v-btn
            text
            class="mt-3 mb-2"
            :to="localePath('/cabinet/')"
            @click="toggleDrawler = false, dialog_personals = true"
          >
            <div class="d-flex flex-column align-center">
              <v-icon large>
                mdi-account-edit
              </v-icon>
              <div class="my-2 caption font-weight-regular text-none font-family--rubik text-center">
                Редактировать <br> профиль
              </div>
            </div>
          </v-btn>
          <v-btn
            text
            class="mt-3 mb-2"
            :to="localePath('/cabinet/')"
            @click="toggleDrawler = false, dialog_changepass = true"
          >
            <div class="d-flex flex-column align-center">
              <v-icon large>
                mdi-lock-outline
              </v-icon>
              <div class="my-2 caption font-weight-regular text-none font-family--rubik text-center">
                Изменить пароль
              </div>
            </div>
          </v-btn>
          <v-btn
            text
            class="mt-3 mb-2"
            :to="localePath('/cabinet/')"
            @click="toggleDrawler = false, dialog_notifies = true"
          >
            <div class="d-flex flex-column align-center">
              <v-icon large>
                mdi-bell-outline
              </v-icon>
              <div class="my-2 caption font-weight-regular text-none font-family--rubik text-center">
                Настройка <br> уведомлений
              </div>
            </div>
          </v-btn>
        </v-list-group>
        <div
          class="mb-3 grey-line--top"
          style="width: 100%;"
        />

        <template v-if="navigMenu == 0">
          <SideBarMenu />
        </template>
        <template v-else-if="navigMenu == 1">
          пока пусто
        </template>
      </VNavigationDrawer>
    </template>
    <NotificationsDialog
      :dialog="showNotificationsDialog"
      @close-dialog="showNotificationsDialog = false"
    />
    <UserPersonals
      :dialog="dialog_personals"
      :user.sync="$auth.user"
      @hideDialog="dialog_personals = false"
    />
    <UserCardNotifies
      :dialog="dialog_notifies"
      :user-id.sync="$auth.user.id"
      @hideDialog="dialog_notifies = false"
    />
    <ChangePassword
      :user-id.sync="$auth.user.id"
      :show-window="dialog_changepass"
      @hideDialog="dialog_changepass = false"
    />
  </div>
</template>

<script>
  import SideBarMenu from "./SideBarMenu";
  import NotificationsDialog from "../Dialogs/NotificationsDialog";
  import ChangePassword from "../Form/ChangePassword";
  import UserCardNotifies from "../user/UserCardNotifies";
  import UserPersonals from "../user/UserPersonals";

  export default {
    name: "MobileSidebar",
    components: {
      UserPersonals,
      UserCardNotifies,
      ChangePassword,
      NotificationsDialog,
      SideBarMenu,

    },
    data() {
      return {
        navigMenu: 0,
        profileShow: false,
        showNotificationsDialog: false,

        dialog_personals: false,
        dialog_notifies: false,
        dialog_changepass: false,
      };
    },
    computed: {
      getWindowWidth() {
        return this.$store.state.screenWidth;
      },
      toggleDrawler: {
        get() {
          return this.$store.state.showDrawler;
        },
        set(v) {
          this.$store.commit('setShowDrawler', v);
        }
      },
    },
    mounted() {
    },
    methods: {
      logout() {
        this.toggleDrawler = false;
        this.$api.Auth.logout();
        return this.$auth.logout();
      },
    }
  };
</script>

<style>

  .profile__btns .v-list-group__header {
    display: none !important;
  }
  .profile__btns .v-list-group__items {
    display: flex;
    justify-content: space-around;
    align-items: baseline;
  }
  .profile__btns .v-list-group__items .v-btn {
    height: unset !important;
  }
  .profile__btns .v-list-group__items .v-btn:before {
    opacity: 0 !important;
  }
</style>

<style scoped>
  .profile-btn:before {
    opacity: 0 !important;
  }
  .grey-line--top {
    border-top: 1px solid rgba(255,255,255,.1);
  }
</style>