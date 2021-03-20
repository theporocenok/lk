<template>
  <v-container fill-height="fill-height">
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        class="text-center"
        style="max-width: 350px"
      >
        <v-layout
          class="display-1 mb-3"
          align-center
          justify-center
        >
          <span class="text-xl mr-2">{{ $t('app_name') }}</span>
          <div>
            <v-img
              :src="require('~/assets/images/logo.png')"
              width="60px"
            />
          </div>
        </v-layout>
            
        <v-card light="light">
          <v-card-text>
            <div class="subheading">
              <span>  {{ $t('register_form.title') }}</span>
            </div>
            <v-progress-circular
              v-if="entrancing"
              indeterminate
              :color="defaultColor"
            />
            <v-form v-if="!entrancing">
              <v-text-field
                v-model="form.email"
                :color="defaultColor"
                :label="$t('register_form.email')"
                type="email"
                light="light"
                prepend-icon="email"
                name="email"
              />
              <v-text-field
                v-model="form.password"
                :color="defaultColor"
                class="mb-2"
                :label="$t('register_form.password')"
                light="light"
                prepend-icon="lock"
                min="3"
                type="password"
                name="password"
                required
                @keyup.enter="signin"
              />
              <v-text-field
                v-model="form.password_confirmation"
                :color="defaultColor"
                class="mb-2"
                :label="$t('register_form.password_confirmation')"
                light="light"
                prepend-icon="lock"
                min="3"
                type="password"
                name="password_confirmation"
                required
                @keyup.enter="signin"
              />
                  
              <v-alert
                v-if="errors.length"
                :value="true"
                type="error"
              >
                <div
                  v-for="err in errors"
                  :key="err.id"
                >
                  {{ err.description }}
                </div>
              </v-alert>
              <v-btn
                block="block"
                :color="defaultColor"
                class="white--text"
                @click="signin"
              >
                {{ $t('register_form.entry') }}
              </v-btn>
            </v-form>
            <v-layout
              class="mt-3"
              justify-space-around
            >
              <n-link
                to="/auth/login"
              >
                {{ $t('register_form.already_registered') }}
              </n-link>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  
  export default {
    name: 'Register',
    data() {
      return {
        errors: [],
        entrancing: false,
        form: {
          email: "",
          password: "",
          password_confirmation: "",
        },
        sendbutton_disabled: true,
        defaultColor: '#006e4c'
      };
    },
    methods: {
      checkPassword(){
          this.errors = [];
          this.sendbutton_disabled = false;
          if( this.form.password != this.form.password_confirmation ){
              this.errors.push(
                  {'description':'Пароли не совпадают'}
              );
              //this.errors.push('register_form.error'); //
          } else if( this.form.password.trim() == '' ){
              this.errors.push(
                  {'description':'Введите пароль'}
              );
          }

          if(this.errors.length){
              this.sendbutton_disabled = true;
          }
      },
      async signin() {
        this.checkPassword();
        try {
          this.entrancing = true;
          const {email, password, password_confirmation} = this.form;
          const {data} = (await this.$api.Auth.register(email, password, password_confirmation)).data;

          if(data.refresh_token){
            const {access_token, token_type, refresh_token} = data;
            this.$auth.setRefreshToken('local', refresh_token);
            this.$auth.setToken('local', `${token_type} ${access_token}`);
            this.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
            this.$auth.ctx.app.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
            await this.getMe();
            this.$store.commit('setShowDrawler', true);
          }
        } catch (e) {
            console.log("error response", e );
            // if (e.response.status === 403) {
            //     app.$auth.logout();
            // }

          this.entrancing = false;
        }
      },
      async getMe() {
        try{
          const {data} = (await this.$api.Auth.me()).data;
          this.$auth.setUser(data);
          this.$nuxt.$router.replace({ path: '/ '});
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при получении информации о пользователе',
            color: 'error'
          });
        }
      },
    }
  };
</script>
