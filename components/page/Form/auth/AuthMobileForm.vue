<template>
  <v-card
    elevation="0"
    width="100vw"
  >
    <v-card-text>
      <v-tabs
        v-model="authTab"
        align-with-title
        fixed-tabs
        :color="$config.defaultColor"
      >
        <v-tabs-slider :color="$config.defaultColor" />

        <v-tab
          v-for="item in authTabs"
          :key="item"
          class="authTab font-weight-bold ml-auto"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-progress-linear
        v-if="entrancing"
        indeterminate
        width="100%"
        :color="$config.defaultColor"
      />
      <v-tabs-items
        v-model="authTab"
        class="mt-4"
      >
        <v-tab-item>
          <v-card flat>
            <v-card-text class="px-0">
              <v-form ref="loginForm">
                <v-text-field
                  v-model="loginEmail"
                  :rules="rules.emailRules"
                  validate-on-blur
                  outlined
                  hide-details
                  class="mb-5"
                  label="Email"
                  type="email"
                  :color="$config.defaultColor"
                  placeholder=" "
                  @blur="loginFormEmailValidate"
                />
                <v-text-field
                  v-model="loginPassword"
                  :rules="rules.passwordRules"
                  validate-on-blur
                  type="password"
                  outlined
                  hide-details
                  label="Пароль"
                  class="login-field--password mb-5"
                  placeholder=" "
                  :color="$config.defaultColor"
                  @keyup.enter.stop="SignIn"
                  @blur="loginFormPasswordValidate"
                >
                  <template v-slot:append>
                    <v-btn
                      text
                      small
                      :color="$config.defaultColor"
                      class="px-0 text-none body-2"
                      :to="localePath('/auth/restore')"
                    >
                      Напомнить
                    </v-btn>
                  </template>
                </v-text-field>
                <v-layout
                  v-if="!loginFormEmailValid || !loginFormPasswordValid"
                  class="mt-n2 mb-4"
                  style="color: #ff5252;"
                >
                  Неверные значения полей
                </v-layout>
              </v-form>
              <v-btn
                width="100%"
                dark
                height="43"
                :color="$config.defaultColor"
                @click="SignIn"
              >
                <span class="text-none font-weight-light body-1">

                  Войти
                </span>
              </v-btn>
              <v-layout
                class="mt-8"
                justify-center
              >
                <a
                  href="/storage/instructions/instruction.pdf"
                  target="_blank"
                >
                  Инструкция по работе в личном кабинете
                </a>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text class="px-0">
              <v-form ref="registerForm">
                <v-text-field
                  v-model="registerEmail"
                  :rules="rules.emailRules"
                  hide-details
                  class="mb-5"
                  :suffix="$helpers.checkEmailRules(registerEmail)"
                  validate-on-blur
                  outlined
                  label="Email"
                  type="email"
                  :color="$config.defaultColor"
                />
                <v-text-field
                  v-model="registerPassword"
                  :rules="rules.passwordRules"
                  hide-details
                  validate-on-blur
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  outlined
                  label="Пароль"
                  class="login-field--password mb-5"
                  :color="$config.defaultColor"
                  @click:append="showPassword = !showPassword"
                />
                <v-text-field
                  v-model="registerPasswordConfirmation"
                  :rules="rules.confirmationPasswordRules"
                  hide-details
                  class="mb-5"
                  :suffix="$helpers.checkPasswordConfirmationRules(registerPassword, registerPasswordConfirmation)"
                  validate-on-blur
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  label="Подтвердите пароль"
                  :color="$config.defaultColor"
                  @keyup.enter.stop="SignUp"
                />
                <v-checkbox
                  v-model="registerPolicy"
                  :rules="rules.policyRules"
                  class="mt-n2"
                  :color="$config.defaultColor"
                  on-icon="mdi-checkbox-marked-outline"
                >
                  <template v-slot:label>
                    Принимаю условия <n-link
                      :style="`display: contents; color: ${$config.defaultColor}`"
                      :to="localePath('/')"
                    >
                      пользовательского соглашения
                    </n-link>
                  </template>
                </v-checkbox>
              </v-form>
              <v-btn
                width="100%"
                dark
                height="43"
                :color="$config.defaultColor"
                @click="SignUp"
              >
                <span class="text-none font-weight-light body-1">

                  Зарегистрироваться
                </span>
              </v-btn>
              <v-layout
                class="mt-8"
                justify-center
              >
                <a
                  href="/storage/instructions/instruction.pdf"
                  target="_blank"
                >
                  Инструкция по работе в личном кабинете
                </a>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "AuthMobileForm",
    props: {
    },
    data() {
      return {
        entrancing: false,

        authTab: null,
        authTabs: ['Вход', 'Регистрация'],

        loginEmail: '',
        loginPassword: '',

        registerEmail: '',
        registerPassword: '',
        registerPasswordConfirmation: '',
        registerPolicy: false,

        showPassword: false,

        rules: {
          emailRules: [
            v => !!v || 'Обязательно для заполнения',
            v => /.+@.+\..+/.test(v) || 'Некорректный email',
          ],
          passwordRules: [
            password => !!password || 'Обязательно для заполнения',
            password => (password && password.length >= 6) || 'Не менее 6 символов',
          ],
          confirmationPasswordRules: [
            password => !!password || 'Обязательно для заполнения',
            password => (password && password.length >= 6) || 'Не менее 6 символов',
            confirmation => (confirmation === this.registerPassword) || 'Пароли не совпадают'
          ],
          policyRules: [
            v => !!v || '',
          ]
        },

        loginFormErrors: {
          email: false,
          password: false,
        },

        loginFormEmailValid: true,
        loginFormPasswordValid: true,
      }
    },
    computed: {
      showPasswordColor() {
        return this.showPassword ? this.$config.defaultColor : '#b1b1b1';
      }
    },
    watch: {

    },
    mounted() {
    },
    methods: {
      loginFormEmailValidate() {
        if (!!this.loginEmail && /.+@.+\..+/.test(this.loginEmail)) {
          this.loginFormEmailValid = true;
          return;
        }
        this.loginFormEmailValid = false;
      },
      loginFormPasswordValidate() {
        if (!!this.loginPassword && this.loginPassword.length >= 6) {
          this.loginFormPasswordValid = true;
          return;
        }
        this.loginFormPasswordValid = false;
      },
      async SignIn() {
        try {
          if (!this.$refs.loginForm.validate()) {
            return;
          }
          this.entrancing = true;
          const {data} = (await this.$api.Auth.login(this.loginEmail, this.loginPassword)).data;
          const {access_token, token_type, refresh_token} = data;
          this.$auth.setRefreshToken('local', refresh_token);
          this.$auth.setToken('local', `${token_type} ${access_token}`);
          this.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          this.$auth.ctx.app.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          await this.getMe();
        } catch (e) {
          this.entrancing = false;
        }
      },

      async SignUp() {
        try {
          if (!this.$refs.registerForm.validate()) {
            return;
          }
          this.entrancing = true;
          const {data} = (await this.$api.Auth.register(this.registerEmail, this.registerPassword, this.registerPasswordConfirmation)).data;

          if(data.refresh_token){
            const {access_token, token_type, refresh_token} = data;
            this.$auth.setRefreshToken('local', refresh_token);
            this.$auth.setToken('local', `${token_type} ${access_token}`);
            this.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
            this.$auth.ctx.app.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
            await this.getMe();
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
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при получении информации о пользователе',
            color: 'error'
          });
        }
      },
    },
  }
</script>

<style>
  .login-field--password .v-input__append-inner {
    margin-top: 14px !important;
  }
</style>

<style scoped>
  .authTab {
    border-bottom: 2px solid #B1B1B1;
  }
  .authTab:before {
    opacity: 0 !important;
  }
</style>