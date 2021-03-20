<template>
  <div>
    <TcsmDialog
      :dialog="dialog"
      edit-dialog
      persistent
      max-width="700"
      @save-changes="save"
      @close-dialog="close"
    >
      <template v-slot:title>
        <div class="pb-1">
          Персональные данные
        </div>
        <div
          class="mx-n6 mb-n5"
          style="border-bottom: 1px solid #e5e5e5; width: calc(100% + 48px);"
        />
      </template>
      <template v-slot:main>
        <v-form
          ref="confirmation_form"
          lazy-validation
        >
          <v-row>
            <v-col>
              <v-layout
                align-center
                justify-center
                :class="$helpers.isMobile() ? 'mt-5' : ''"
              >
                <v-avatar
                  class="avatar-upload"
                  size="128"
                  @click="openAvatarInput"
                >
                  <v-img
                    :src="userObj.avatar ? userObj.avatar : require('~/assets/images/empty-avatar.jpg')"
                  />
                </v-avatar>
                <v-file-input
                  v-show="false"
                  ref="avatarInput"
                  v-model="avatarFile"
                  prepend-icon=""
                  @change="chooseFile"
                />
              </v-layout>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="userObj.last_name"
                :rules="nameRules"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile() ? 'mb-2 mt-3' : ''"
                suffix="Введите фамилию"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                label="Фамилия"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="userObj.first_name"
                :rules="nameRules"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-2' : ''"
                suffix="Введите имя"
                label="Имя"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="userObj.patronymic_name"
                :rules="nameRules"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-2' : ''"
                suffix="Введите отчество"
                label="Отчество"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                v-model="userObj.phone"
                v-mask="'+7 (###) ###-##-##'"
                :rules="phoneRules"
                label="Телефон"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-2' : ''"
                :suffix="$helpers.checkPhoneRules(user.phone)"
                placeholder="+7 (922) 000-00-00"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                v-model="userObj.email"
                :rules="$config.rules.emailRules"
                label="E-mail"
                :hide-details="$helpers.isMobile()"
                :class="$helpers.isMobile ? 'mb-2' : ''"
                :suffix="$helpers.checkEmailRules(user.email)"
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="userObj.service_cost_id"
                :items="$store.state.regions"
                label="Регион цен"
                item-value="id"
                hide-details
                :outlined="$helpers.isMobile()"
                :color="$config.defaultColor"
                item-text="title"
                required
                @keyup="clearValidButton"
                @change="clearValidButton"
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </TcsmDialog>
    <ConfirmDialog
      :dialog="confirmDialog"
      confirm-btn-text="Не сохранять"
      confirm-text="закрыть окно редактирования профиля без сохранения?"
      @accept="closeWithoutSaving"
      @decline="confirmDialog = false"
    />
  </div>
</template>


<script>
    import TcsmDialog from "../Dialogs/tcsmDialog";
    import ConfirmDialog from "../Dialogs/ConfirmDialog";
    export default {
        name: 'UserPersonals',
      components: {ConfirmDialog, TcsmDialog},
      props: {
        user: {
          type: Object,
          required: true,
          default: () => {
              return {};
          }
        },
        dialog: {
          type: Boolean,
          default: false,
        }
      },
      data() {
        return {
          regions: [],
          valid: false,
          validated: false,
          checkbox: false,
          // user: {
          //     id: '',
          //     first_name: '',
          //     last_name: '',
          //     patronymic_name: '',
          //     email: '',
          //     phone: '',
          // },
          defaultColor: '#006e4c',
          nameRules: [
              value => !!value || 'Обязательно заполнить.',
              value => (value || '').length <= 30 || 'Не более 3х символов',
              value => value && value.length >= 2 || 'Не менее 2х символов',
          ],
          phoneRules: [
              v => (!!v && v.length == 18 || !!!v) || 'Номер телефона должен содержать 11 цифр',
          ],
          emailRules: [
              v => !!v || 'E-mail обязательно заполнить',
              v => /.+@.\..+/.test(v) || 'E-mail не верный',
          ],

          isEdited: false,
          confirmDialog: false,

          userObj: {},

          avatarFile: null,
          avatarFileUrl: null,
        };
      },

      watch: {
        async dialog(val) {
          if (!!this.$refs.confirmation_form) {
            this.$refs.confirmation_form.resetValidation();
          }
          if (val) {
            this.userObj = await Object.assign({}, this.user);
          }
          this.isEdited = false;
        },
        userObj: {
          handler(val) {
            if (JSON.stringify(val) !== JSON.stringify(this.user)) {
              this.isEdited = true;
            }
          },
          deep: true,
        }
      },

      mounted() {
        // this.loadData();
        this.$store.dispatch('loadRegions');
      },
      methods: {
        chooseFile(file) {
          if (typeof file != 'object') {
            return;
          }
          const fr = new FileReader ()
          fr.readAsDataURL(file)
          fr.addEventListener('load', () => {
            this.userObj = Object.assign({avatar: fr.result});
            this.avatarFile = file // this is an image file that can be sent to server...
          });
        },
        openAvatarInput() {
          this.$refs.avatarInput.$refs.input.click();
        },
        loadData() {
            // let userId = this.$auth.user.id;
            // if(this.userId){
            //     userId = this.userId;
            // }
            // this.user = Object.assign({}, this.user, this.$auth.user);
        },
        async save() {
            //валидацию прошли, сохраняем
            // let userId = this.$auth.user.id;
            // if(this.userId){
            //     userId = this.userId;
            // }
            if (!this.isEdited) {
              return;
            }
            if (!this.$refs.confirmation_form.validate()) {
              return;
            }
            let {data} = (await this.$api.User.updateProfile(this.user.id, this.userObj)).data;
            this.getMe();
            this.closeWithoutSaving();
        },
        async getMe() {
            const {data} = (await this.$api.Auth.me()).data;
            this.$auth.setUser(data);
        },
        clearValidButton(){
            // this.$refs.confirmation_form.validate();
        },
        close(){
          if (this.isEdited) {
            this.confirmDialog = true;
            return;
          }
          this.closeWithoutSaving();
        },
        closeWithoutSaving() {
          this.isEdited = false;
          this.confirmDialog = false;
          this.$emit('hideDialog', true );
        }
      }
    }
</script>

<style scoped>
  .avatar-upload {
    cursor: pointer;
  }
</style>