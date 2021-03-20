<template>
  <v-app>
    <Header />
    
    <Sidebar v-if="$auth.loggedIn" />
    
    <v-content>
      <v-container
        class="1"
        fluid
      >
        <template
          v-if="this.check_user"
        >
          <template
            v-if="checkShow"
          >
            <v-alert
              dense
              outlined
              type="error"
              class="mt-4"
            >
              Ваша учетная запись не подтверждена. Функционал ограничен.
              <a
                href="#"
                @click.prevent="openRequestDialog"
              >
                Отправьте заявку
              </a> на привязку к компании
            </v-alert>
          </template>
        </template>

        <v-fade-transition mode="out-in">
          <!-- Page content-->


          <div
            :class="$helpers.isMobile() ? 'd-flex flex-column justify-space-between pt-4' : ''"
            :style="$helpers.isMobile() ? 'min-height: calc(100vh - 49px)' : 'margin-bottom: 25px;'"
          >
            <Nuxt :style="$helpers.isMobile() ? 'margin-bottom: 10px;' : ''" />
            <div
              v-if="$helpers.isMobile()"
              style="border-top: 1px solid #E5E5E5"
            >
              <v-layout
                justify-center
                align-center
                column
                class="tcsm-dialog__edge px-4 body-2"
                style="color: #b1b1b1;"
              >
                <n-link
                  :to="localePath('/')"
                  class="text-decoration-none"
                  style="color: #b1b1b1 !important;"
                >
                  Политика конфиденциальности
                </n-link>
                © {{ new Date().getFullYear() }} Тюменский ЦСМ
              </v-layout>
            </div>
          </div>
        </v-fade-transition>
      </v-container>
    </v-content>

    <SnackBar />

    <RequestDialog />
    <Footer />
  </v-app>
</template>

<script>
  import Sidebar from '../components/page/SideBar/Sidebar';
  import Footer from '../components/page/Footer.vue';
  import Header from "../components/page/Header";
  import RequestDialog from "../components/page/RequestDialog";
  import SnackBar from "../components/SnackBar";
  
  export default {
    components: {
        SnackBar,
        RequestDialog,
      Header,
      Footer,
      Sidebar,
    },

    data() {
      return {
        getMeInterval: null,
        getMeCalling: false,
      }
    },
    computed: {
      check_user(){
          return this.$auth.user;
      },
      checkShow(){
          if( this.check_user.approved == 1 ){
              return false
          }

          if( this.check_user.role_id == 1 ){
              return false
          }

          return true;
      },
    },
    mounted() {
      if(this.$auth.user){
        this.$store.dispatch('loadRegions');
        this.$store.dispatch('loadTransService');
        this.$store.dispatch('loadCountUserEvents');
      }
      if (this.$auth.user.role_id == 1) {
        this.$store.dispatch('loadCountUserRequests');
      }
      /**
       * Проверяем каждые 5 минут, не слетела ли авторизация
       */
      this.checkingAuthInterval();
      if (!!!this.getMeInterval) {
        this.getMeInterval = setInterval(this.checkingAuthInterval, 5*60*1000);
      }
    },
    methods: {
        openRequestDialog(){
            this.$store.commit('setRequestDialog', true);
            try{
                this.$router.replace({ path: '/cabinet/' });
            }catch(e){}
        },
      async checkingAuthInterval() {
          try {
            if (!this.getMeCalling) {
              this.getMeCalling = true;
              let {data} = (await this.$api.Auth.me()).data;
              this.getMeCalling = false;
            }
          }catch{
            clearInterval(this.getMeInterval);
            this.getMeCalling = false;
            await this.$api.Auth.logout();
            this.$router.go();
          }
      }
      /*checkShow(){
          if( this.check_user.approved == 1 ){
              return false
          }

          if( this.check_user.role_id == 1 ){
              return false
          }

          return true;
      },*/
    },
    head () {
        return {
            title: 'ЛК'
        }
    },
    middleware: 'authenticated',
  };
</script>

<style>
  .container .v-data-table .v-data-table__mobile-row { min-height: 35px;}
  @media screen and (max-width: 600px) {
    .v-data-table__mobile-row {padding: 7px !important; height: unset !important;}
    .v-application .container .elevation-1 {box-shadow: none !important;}
    .container {padding: 0 !important;}
  }
</style>