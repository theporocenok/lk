<template>
  <header
    v-if="$helpers.isMobile()"
    class="topnavbar-wrapper"
  >
    <v-app-bar
      app
      fixed
      clipped-left
      flat
      dense
      :color="$config.defaultColor"
      z-index="99"
    >
      <v-toolbar-title>
        <n-link
          :to="localePath('/')"
        >
          <v-img
            :src="require('~/assets/images/white-logo.svg')"
            min-height="25px"
            min-width="130px"
          />
        </n-link>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="$auth.loggedIn">
        <v-badge
          :content="$store.state.userEvents"
          :value="$store.state.userEvents"
          color="#5F616F"
          overlap
          offset-x="20"
          offset-y="18"
          class="filter-badge"
        >
          <v-btn
            float
            icon
            text
            class="pa-0 mr-n1 black--text"
            @click="showNotificationsDialog = true"
          >
            <v-icon
              color="white"
              size="28"
            >
              mdi-bell-outline
            </v-icon>
          </v-btn>
        </v-badge>

        <v-btn
          float
          icon
          text
          class="pa-0 black--text"
          @click="toggleDrawler"
        >
          <v-icon
            color="white"
            size="30"
          >
            mdi-menu
          </v-icon>
        </v-btn>
      </template>
      <template v-else>
        <n-link
          :to="localePath('/auth/login')"
          class="text-decoration-none"
        >
          <span
            class="pa-0 white--text caption font-weight-bold text-uppercase"
          >
            Кабинет пользователя
          </span>
        </n-link>
      </template>

      <v-layout
        v-if="$auth.loggedIn && false"
        v-show="getWindowWidth >= 1000"
        justify-space-between
      >
        <div>
          <v-layout align-center>
            <!--  <v-btn
                text
                class="text-dusk mr-3"
                color="transparent"
                style="height:100%;padding: 0"
                @click.stop="openNotificationDialog()"
              >
                <v-badge color="#ee4e74">
                  <template v-slot:badge>
                    <span v-if="countNotifications > 0">{{ countNotifications }}</span>
                  </template>
                  <v-icon color="#3f4d67">
                    mdi-bell-ring
                  </v-icon>
                </v-badge>
                <v-icon
                  color="#3f4d67"
                  class="ml-4"
                >
                  mdi-chevron-down
                </v-icon>
              </v-btn>-->
            <v-menu
              v-model="userMenu"
              :min-width="150"
              :close-on-content-click="true"
              :nudge-width="150"
              offset-y
              offset-x
              dense
              z-index="130"
            />
          </v-layout>
        </div>
      </v-layout>
    </v-app-bar>

    <NotificationsDialog
      :dialog="showNotificationsDialog"
      @close-dialog="showNotificationsDialog = false"
    />
  </header>
</template>

<script>
  
  import NotificationsDialog from "./Dialogs/NotificationsDialog";
  export default {
    name: 'Header',
    components: {NotificationsDialog},
    data: () => ({
      miniNav: false,
      mobileMenuCloseClick: false,
      mobileMenuCloseContentClick: false,
      userMenu: false,
      showNotificationsDialog: false,
    }),
    computed: {
      
      sidebarState() {
        return this.$store.state.showDrawler;
      },
      getWindowWidth() {
        return this.$store.state.screenWidth;
      },
      getUser() {
        return this.$auth.user;
      },
    },
    mounted() {
      this.$store.commit('setShowDrawler', localStorage.getItem('showDrawler') != 'false');
    },
    methods: {
      toggleDrawler() {
        this.$store.commit('setShowDrawler', !this.sidebarState);
      },
      logout() {
        this.$api.Auth.logout();
        return this.$auth.logout();
      },
    },
  };
</script>

<style scoped>
  .lk-btn {
    width: unset !important;
  }
  .lk-btn:before {
    opacity: 0 !important;
  }
  .navbar__fixed{
    min-width: 256px;
    max-width: 256px;
    color: #000;
  }
  .navbar__fixed.dark{
    background: #3f4d67;
    color: #fff;
  }
  .navbar__button{
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  @media screen and (min-width: 1264px) {
    .topnavbar-wrapper {
      display: none;
    }
  }
</style>
