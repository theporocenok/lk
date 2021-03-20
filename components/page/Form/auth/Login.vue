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
              <span>  {{ $t('login_form.title') }}</span>
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
                :label="$t('login_form.email')"
                type="email"
                light="light"
                prepend-icon="person"
                name="email"
                placeholder=" "
              />
              <v-text-field
                v-model="form.password"
                :color="defaultColor"
                class="mb-2"
                :label="$t('login_form.password')"
                light="light"
                prepend-icon="lock"
                min="3"
                type="password"
                name="password"
                placeholder=" "
                required
                @keyup.enter="signin"
              />
                  
              <v-alert
                v-if="errors.length"
                :value="true"
                type="error"
              >
                {{ $t('login_form.error') }}
              </v-alert>
              <v-btn
                block="block"
                :color="defaultColor"
                class="white--text"
                :disabled="entrancing"
                @click="signin"
              >
                {{ $t('login_form.entry') }}
              </v-btn>
              <v-layout
                class="mt-3"
                justify-space-around
              >
                <n-link
                  to="/auth/restore"
                >
                  {{ $t('login_form.did_remember') }}
                </n-link>
                <n-link
                  to="/auth/register"
                >
                  {{ $t('login_form.register') }}
                </n-link>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>

        <v-layout
          class="mt-3"
          justify-center
        >
          <a
            href="/storage/instructions/instruction.pdf"
            target="_blank"
          >
            Инструкция по работе в личном кабинете
          </a>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  
  export default {
    name: 'Login',
    data() {
      return {
        errors: [],
        entrancing: false,
        form: {
            email: "",
          password: "",
        },
        defaultColor: '#006e4c'
      };
    },
    methods: {
      async signin() {
        try {
          this.entrancing = true;
          const {email, password} = this.form;
          const {data} = (await this.$api.Auth.login(email, password)).data;
          const {access_token, token_type, refresh_token} = data;
          this.$auth.setRefreshToken('local', refresh_token);
          this.$auth.setToken('local', `${token_type} ${access_token}`);
          this.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          this.$auth.ctx.app.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          await this.getMe();
          this.$store.commit('setShowDrawler', true);
        } catch (e) {
          this.entrancing = false;
        }
      },
      async getMe() {
        try{
          const {data} = (await this.$api.Auth.me()).data;
          this.$auth.setUser(data);
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
