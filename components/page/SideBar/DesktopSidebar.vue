<template>
  <div>
    <div
      v-show="!toggleDrawler"
      class="sidebar-btn--open"
    >
      <v-btn
        icon
        @click="toggleDrawler = true"
      >
        <v-icon
          large
          :color="$config.defaultColor"
        >
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </div>
    <template>
      <VNavigationDrawer
        v-model="toggleDrawler"
        dark
        fixed
        app
        mini-variant-width="56"
        color="#5f616f"
        dense
        z-index="100"
      >
        <div class="sidebar-btn--close">
          <v-btn
            icon
            @click="toggleDrawler = false"
          >
            <v-icon
              large
            >
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </div>
        <v-btn
          text
          color="transparent"
          class="navbar-brand ml-5 mt-5 mb-5"
          style="padding:0;"
          :to="localePath('/')"
        >
          <v-layout
            class="brand-logo"
            align-center
          >
            <v-img
              :src="require('~/assets/images/logo-white.png')"
              width="65px"
            />
            <div class="ml-3 subtitle-1 white--text">
              {{ $t('app_name') }}
            </div>
          </v-layout>
        </v-btn>

        <v-divider
          color="#fff"
          class="ml-3 mr-3"
        />

        <v-layout
          justify-center
          align-center
          mt-3
          mb-3
        >
          <template v-if="$auth.user.full_name!=''">
            <div class="text-dusk white--text text-center">
              {{ $auth.user.full_name }}
            </div>
          </template>

          <template v-else-if="$auth.user.email!=''">
            <v-avatar
              color="#fff"
              class="mr-1"
            >
              <v-icon
                color="#3f4d67"
              >
                mdi-account
              </v-icon>
            </v-avatar>
            <div class="ml-2">
              <div class="text-dusk white--text">
                {{ $auth.user.email }}
              </div>
            </div>
          </template>
        </v-layout>

        <v-divider
          color="#fff"
          class="ml-3 mr-3"
        />

        <SideBarMenu />
      </VNavigationDrawer>
    </template>
  </div>
</template>

<script>
  import SideBarMenu from "./SideBarMenu";

  export default {
    name: "DesktopSidebar",
    components: {
      SideBarMenu,

    },
    data() {
      return {
      };
    },
    computed: {
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
      // console.log(localStorage);
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

<style scoped>
  .sidebar-btn--close {
    position: absolute;
    right: 0;
    z-index: 1;
    height: 100%;
    max-height: 100vh;

    display: flex;
    align-items: center;
  }
  .sidebar-btn--open {
    position: fixed;
    left: 0;
    z-index: 5;
    height: 100%;
    max-height: 100vh;

    display: flex;
    align-items: center;
  }
  @media screen and (max-height: 820px) {
    .sidebar-btn--close {
      right: 20px;
    }
  }
</style>