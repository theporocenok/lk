<template>
  <v-card
    elevation="0"
    class="pb-5"
  >
    <v-card-title>
      Восстановление пароля
    </v-card-title>
    <v-card-subtitle class="mt-n2">
      Укажите
      <template v-if="isRestoreByPhonePage">
        номер телефона
      </template>
      <template v-else>
        e-mail
      </template>
      , который вы использовали при регистрации. Мы отправим на него код для сброса пароля
    </v-card-subtitle>

    <v-card-text
      v-if="entrancing"
    >
      <v-layout justify-center>
        <v-progress-circular
          size="64"
          indeterminate
          :color="$config.defaultColor"
        />
      </v-layout>
    </v-card-text>
    <v-card-text v-if="successChanged">
      <v-btn
        width="100%"
        dark
        :color="$config.defaultColor"
        class="mt-3"
        :to="localePath('/auth/login')"
      >
        <span class="text-none font-weight-light body-1">
          Перейти на страницу входа
        </span>
      </v-btn>
    </v-card-text>
    <v-card-text v-if="!entrancing && !successChanged">
      <v-form
        ref="restorePasswordForm"
      >
        <v-text-field
          v-if="!isRestoreByPhonePage"
          v-model="email"
          :rules="!codeSent ? $config.rules.emailRules : []"
          hide-details
          class="mb-5 mt-2"
          :suffix="$helpers.checkEmailRules(email)"
          validate-on-blur
          type="email"
          outlined
          label="E-mail"
          :color="$config.defaultColor"
          @input="codeSent = false"
        />
        <v-text-field
          v-else
          v-model="phone"
          v-mask="'+7 (###) ###-##-##'"
          :rules="!codeSent ? $config.rules.phoneRules : []"
          hide-details
          class="mb-5"
          :suffix="$helpers.checkPhoneRules(phone)"
          validate-on-blur
          required
          name="phone"
          outlined
          label="Телефон"
          :color="$config.defaultColor"
          @input="codeSent = false"
        />
        <template v-if="codeSent">
          <v-row class="py-0">
            <v-col class="py-0">
              <v-text-field
                v-model="code"
                :color="$config.defaultColor"
                class="mt-0 pt-0"
                outlined
                label="Код"
              />
            </v-col>
            <v-col class="py-0">
              <v-btn
                outlined
                :color="$config.defaultColor"
                width="100%"
                height="56px"
              >
                Отправить <br> повторно
              </v-btn>
            </v-col>
          </v-row>
          <v-text-field
            v-model="password"
            :rules="rules.passwordRules"
            hide-details
            :suffix="$helpers.checkPasswordRules(password)"
            validate-on-blur
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            label="Новый пароль"
            class="login-field--password mb-5"
            :color="$config.defaultColor"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field
            v-model="passwordConfirmation"
            :rules="rules.confirmationPasswordRules"
            hide-details
            :suffix="$helpers.checkPasswordConfirmationRules(password, passwordConfirmation)"
            validate-on-blur
            :type="showPassword ? 'text' : 'password'"
            outlined
            label="Подтвердите пароль"
            class="mb-5"
            :color="$config.defaultColor"
            @keyup.enter.stop="Restore"
          />
        </template>
      </v-form>
      <v-btn
        v-if="!codeSent"
        width="100%"
        dark
        :color="$config.defaultColor"
        class="mt-3"
        @click="SendRestoreCode"
      >
        <span class="text-none font-weight-light body-1">

          Отправить код восстановления
        </span>
      </v-btn>
      <v-btn
        v-else
        width="100%"
        dark
        :color="$config.defaultColor"
        class="mt-3"
        @click="Restore"
      >
        <span class="text-none font-weight-light body-1">

          Восстановить пароль
        </span>
      </v-btn>
      <v-layout
        class="mt-5"
        justify-center
      >
        <n-link
          v-if="!isRestoreByPhonePage"
          :to="localePath('/auth/login')"
        >
          Вспомнил пароль
        </n-link>
      </v-layout>
      <v-layout
        v-if="!codeSent"
        class="mt-8"
        justify-center
      >
        <n-link
          v-if="!isRestoreByPhonePage"
          :to="localePath('/auth/restore/phone')"
        >
          Восстановить по телефону
        </n-link>
        <n-link
          v-else
          :to="localePath('/auth/restore')"
        >
          Восстановить по e-mail
        </n-link>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "RestorePasswordMobileForm",
    props: {

    },
    data() {
      return {
        email: '',
        phone: '',
        code: '',
        password: '',
        passwordConfirmation: '',
        showPassword: false,
        rules: {
          passwordRules: [
            password => !!password || 'Обязательно для заполнения',
            password => (password && password.length >= 6) || 'Не менее 6 символов',
          ],
          confirmationPasswordRules: [
            password => !!password || 'Обязательно для заполнения',
            password => (password && password.length >= 6) || 'Не менее 6 символов',
            confirmation => (confirmation === this.password) || 'Пароли не совпадают'
          ],
        },
        codeSent: false,
        successChanged: false,
        entrancing: false,
      }
    },
    computed: {
      isRestoreByPhonePage() {
        return this.$route.path.includes('phone');
      }
    },
    mounted() {
    },
    methods: {
      SendRestoreCode() {
        if (!this.$refs.restorePasswordForm.validate()) {
          return;
        }
        this.SendCode();
      },

      async SendCode(){
        this.entrancing = true;
        try{
          // console.log('inside sendCode');
          let sendData = {
            email: !this.isRestoreByPhonePage ? this.email : null,
            phone: this.isRestoreByPhonePage ? this.phone : null,
            code: this.code,
            password: this.password,
            password_confirmation: this.passwordConfirmation,
          };
          // console.log(sendData);
          let {data} = (await this.$api.Auth.forgot(sendData)).data;
          if(data.sended == true){
            this.codeSent = true;
          }
        }catch (e){
          console.log(e)
        }
        this.entrancing = false;
      },
      async Restore(){
        this.entrancing = true;
        let sendData = {
          email: !this.isRestoreByPhonePage ? this.email : null,
          phone: this.isRestoreByPhonePage ? this.phone : null,
          code: this.code,
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        };
        let {data} = (await this.$api.Auth.restore(sendData)).data;
        if(data.changed == true){
          this.successChanged = true;
        }
        this.entrancing = false;
      },
      async getMe() {
        const {data} = (await this.$api.Auth.me()).data;
        this.$auth.setUser(data);
      },
    },
  }
</script>

<style scoped>

</style>