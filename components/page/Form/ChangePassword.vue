<template>
  <TcsmDialog
    :dialog="showWindow"
    edit-dialog
    persistent
    max-width="290"
    @save-changes="signin"
    @close-dialog="close"
  >
    <template v-slot:title>
      {{ $t('change_password_form.title') }}
    </template>
    <template v-slot:main>
      <div>
        <v-layout
          v-if="sending_data"
          justify-center
          align-center
          style="height: 100px"
        >
          <v-progress-circular
            indeterminate
            :color="defaultColor"
          />
        </v-layout>

        <v-form
          v-if="!sending_data"
          ref="changePasswordForm"
          class="mt-3"
        >
          <v-text-field
            v-model="form.password_last"
            :color="formColor"
            :rules="$config.rules.passwordRules"
            :outlined="$helpers.isMobile()"
            :hide-details="$helpers.isMobile()"
            :class="$helpers.isMobile ? 'mb-5' : ''"
            validate-on-blur
            label="Введите старый пароль"
            suffix="Введите старый пароль"
            :type="showPasswordLast ? 'text' : 'password'"
            light="light"
            :prepend-icon="!$helpers.isMobile() ? 'mdi-lock-outline' : ''"
            :append-icon="$helpers.isMobile() ? (showPasswordLast ? 'mdi-eye' : 'mdi-eye-off') : ''"
            name="password_last"
            @click:append="showPasswordLast = !showPasswordLast"
          />
          <v-text-field
            v-model="form.password"
            :color="formColor"
            :outlined="$helpers.isMobile()"
            validate-on-blur
            :label="$t('change_password_form.enter_password')"
            :hide-details="$helpers.isMobile()"
            :class="$helpers.isMobile ? 'mb-5' : ''"
            :rules="$config.rules.passwordRules"
            :suffix="$helpers.checkPasswordRules(form.password)"
            :type="showPassword ? 'text' : 'password'"
            light="light"
            :prepend-icon="!$helpers.isMobile() ? 'person' : ''"
            :append-icon="$helpers.isMobile() ? (showPassword ? 'mdi-eye' : 'mdi-eye-off') : ''"
            name="password"
            @click:append="showPassword = !showPassword"
            @keyup.enter.stop="signin"
          />
          <v-text-field
            v-model="form.password_confirmation"
            :outlined="$helpers.isMobile()"
            :hide-details="$helpers.isMobile()"
            :class="`${$helpers.isMobile ? 'mb-5' : 'mb-2'}`"
            :color="formColor"
            :label="$t('change_password_form.password_confirmation')"
            :suffix="$helpers.checkPasswordConfirmationRules(form.password, form.password_confirmation)"
            light="light"
            :prepend-icon="!$helpers.isMobile() ? 'lock' : ''"
            min="3"
            :type="showPassword ? 'text' : 'password'"
            name="confirm_password"
            required
            :rules="rules.passwordConfirmationRules"
            validate-on-blur
            @click:append="showPasswordConfirmation = !showPasswordConfirmation"
            @keyup.enter.stop="signin"
          />

          <v-alert
            v-if="errors.length"
            :value="true"
            type="error"
          >
            {{ $t('change_password_form.error') }}
          </v-alert>
        </v-form>
        <ConfirmDialog
          confirm-btn-text="Не сохранять"
          :dialog="confirmDialog"
          confirm-text="закрыть всплывающее окно без сохранения нового пароля?"
          @accept="closeWithoutSaving"
          @decline="confirmDialog = false"
        />
      </div>
    </template>
  </TcsmDialog>
</template>

<script>
  
  import ConfirmDialog from "../Dialogs/ConfirmDialog";
  import TcsmDialog from "../Dialogs/tcsmDialog";
  export default {
    name: 'ChangePassword',
    components: {TcsmDialog, ConfirmDialog},
    props: {
        showWindow: {
            type: Boolean,
            required: false,
            default: () => {
                return false;
            }
        },
        userId: {
            type: Number,
            required: false,
            default: () => {
                return 0;
            }
        }
    },
    data() {
      return {
        sending_data: false,

        rules: {
          passwordConfirmationRules: [
            password => !!password || 'Обязательно для заполнения',
            password => (password && password.length >= 6) || 'Не менее 6 символов',
            password => (password && password == this.form.password) || 'Не менее 6 символов',
          ],
        },
        errors: [],
        sendbutton_disabled: true,
        entrancing: false,
        form: {
          password_last: "",
          password: "",
          password_confirmation: "",
        },

        showPasswordLast: false,
        showPassword: false,
        showPasswordConfirmation: false,

        formColor: '#006e4c',

        confirmDialog: false,
      };
    },
    watch: {
      showWindow(val) {
        if (val) {
          if (this.$refs.changePasswordForm) {
            this.$refs.changePasswordForm.resetValidation();
          }
        }
      },
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

            if (!this.$refs.changePasswordForm.validate()) {
              this.errors.push({'description':'Введите старый пароль'})
            }

            if(this.errors.length){
                this.sendbutton_disabled = true;
            }
            // console.log("checkPass", this.sendbutton_disabled );
        },
        close() {
          if (this.form.password_last != '' || this.form.password != '' || this.form.password_confirmation != '') {
            this.confirmDialog = true;
            return;
          }
          this.closeWithoutSaving();
        },
        closeWithoutSaving() {
          this.form = {
            password_last: "",
            password: "",
            password_confirmation: "",
          }
          this.confirmDialog = false;
          this.$emit('hideDialog', true );
        },
        async signin() {
          if (!this.$refs.changePasswordForm.validate()) {
            return;
          }
          if(this.errors.length==0){
              try{
                this.sending_data = true;
                const {data} = (await this.$api.User.newPassword(this.userId, {password:this.form.password, password_last: this.form.password_last})).data;
                this.form.password = '';
                this.form.password_confirmation = '';
                this.closeWithoutSaving();
              }catch (e) {

              }
              this.sending_data = false;
          }

        /*try {
          this.entrancing = true;
          const {login, password} = this.form;
          const {access_token, token_type, refresh_token} = data;
          this.$auth.setRefreshToken('local', refresh_token);
          this.$auth.setToken('local', `${token_type} ${access_token}`);
          this.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          this.$auth.ctx.app.$axios.setHeader('Authorization', `${token_type} ${access_token}`);
          await this.getMe();
        } catch (e) {
          this.entrancing = false;
        }*/
      },
      async getMe() {
        /*const {data} = (await this.$api.Auth.me()).data;
        this.$auth.setUser(data);*/
      },
    }
  };
</script>
