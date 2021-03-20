<template>
  <div>
    <v-card
      class="mx-auto pa-5"
    >
      <div class="headline mb-5">
        Подключение к компании
      </div>
      <template v-if="user.first_name==null || user.last_name==null || user.patronymic_name==null">
        <v-alert
          type="error"
        >
          Укажите ваши ФИО для подачи заявки
        </v-alert>
        <v-btn
          color="gray"
          class="mr-4"
          @click="close"
        >
          Закрыть
        </v-btn>
      </template>
      <template v-else>
        <div class="subtitle-1">
          {{ user.full_name ? user.full_name : '' }}
          <div class="caption">
            <div class="font-italic font-weight-light">
              {{ user.phone }}
            </div>
            <div class="font-italic font-weight-light">
              {{ user.email }}
            </div>
          </div>
        </div>


        <v-layout
          v-if="sending_data"
          justify-center
          align-center
        >
          <v-progress-circular
            indeterminate
            :size="64"
            :color="defaultColor"
          />
        </v-layout>
        <v-form
          v-else
          ref="confirmation_form"
        >
          <v-row class="mt-5">
            <v-col
              class="mt-0 mb-0 pb-0"
              cols="12"
              md="12"
            >
              <v-autocomplete
                v-model="form.company_id"
                :items="foundCompanies"
                :search-input.sync="searchCompanies"
                :filter="customFilter"
                :rules="[company => !!company || 'Обязательное поле']"
                label="Компания"
                placeholder="Введите Название либо ИНН компании"
                required
                clearable
                no-data-text="Ничего не найдено"
                @change="findCompany"
                @keyup="findCompany"
                @click="findCompany"
              >
                <template #item="{item}">
                  <div>
                    <div>{{ item.text }}</div>
                    <div class="font-italic caption">
                      ИНН {{ item.inn }}
                      <template v-if="item.kpp">
                        / КПП {{ item.kpp }}
                      </template>
                      <template v-if="item.ogrn">
                        / ОГРН {{ item.ogrn }}
                      </template>
                    </div>
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="mt-0 mb-0">
            <v-col
              class="pt-0"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.userpost"
                label="Должность в компании"
                required
              />
            </v-col>
            <v-col
              class="pt-0"
              cols="12"
              md="6"
            >
              <v-file-input
                v-model="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                :rules="[file => !!file || 'Обязательное поле', file => !!file && checkType(file) || 'Неверный формат']"
                label="Письмо о подтверждении полномочий"
                @change="onFilePicked"
              />
            </v-col>
          </v-row>


          <v-layout justify-center>
            <v-btn
              dark
              class="mr-4"
              :color="defaultColor"
              @click="sendForm"
            >
              Отправить
            </v-btn>
            <v-btn
              color="gray"
              class="mr-4"
              @click="close"
            >
              Закрыть
            </v-btn>
          </v-layout>
        </v-form>
      </template>
    </v-card>
    <ConfirmDialog
      :dialog="confirmDialog"
      custum-text
      confirm-text="Ваша заявка на присоединение к компании успешно отправлена"
      :show-decline-btn="false"
      confirm-btn-text="Продолжить"
      @accept="confirmDialogCallback"
    />
  </div>
</template>


<script>
    import ConfirmDialog from "../Dialogs/ConfirmDialog";
    export default {
        name: 'RequestCompany',
      components: {ConfirmDialog},
      props: {
            user: {
                type: Object,
                required: true,
                default: () => {
                    return {};
                }
            },
            showWindow: {
              type: Boolean,
              default: false,
            }
        },
        data() {
            return {
                sending_data: false,
                foundCompanies: [],
                searchCompanies: '',
                file:null,
                form: {
                    company_id: '',
                    userpost: '',
                    imageName: null,
                    imageFile: null,
                    imageUrl: null,
                },
                checkbox: false,

                defaultColor: '#006e4c',

                confirmDialog: false,
                confirmDialogCallback: () => {},

                correctTypes: ['image/jpg','image/jpeg','image/png','image/gif','image/webp','application/pdf'],
            };
        },
        watch: {
          showWindow(val) {
            this.clearValues();
          }
        },
        methods: {
            checkType(file) {
              return this.correctTypes.indexOf(file.type) != -1;
            },
            customFilter (item, queryText, itemText) {
                return true;
            },
            onFilePicked(File){
                if(File !== undefined) {
                    this.form.imageName = File.name
                    if(this.form.imageName.lastIndexOf('.') <= 0) {
                        return
                    }
                    const fr = new FileReader ()
                    fr.readAsDataURL(File)
                    fr.addEventListener('load', () => {
                        this.form.imageUrl = fr.result
                        this.form.imageFile = File // this is an image file that can be sent to server...
                    })
                } else {
                    this.form.imageName = ''
                    this.form.imageFile = ''
                    this.form.imageUrl = ''
                }
            },
            async findCompany(){
              try {
                const {data} = (await this.$api.Company.find({"searchText":this.searchCompanies})).data;
                this.foundCompanies = data.items.map(company => ({
                    text: company.title,
                    inn: company.inn,
                    kpp: company.kpp,
                    ogrn: company.ogrn,
                    value: company.id
                }));
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при поиске компании',
                  color: 'error'
                });
              }
            },
            async sendForm(){
                if (!this.$refs.confirmation_form.validate()) {
                  return;
                }
                try {
                    this.sending_data = true;
                    const {company_id, inn, file} = this.form;
                    const {data} = (await this.$api.UserRequest.newRequest(this.form)).data;

                    this.confirmSended();
                } catch (e) {
                  this.sending_data = false;
                  // this.$store.commit('setSnackParams', {
                  //   text: 'Некорректные данные',
                  //   color: 'error'
                  // });
                }
            },
            close() {
                this.clearValues();
                this.$emit('hideDialog', true );
            },
            clearValues() {
              if (!!this.$refs.confirmation_form) {
                this.$refs.confirmation_form.resetValidation();
              }
              this.confirmDialog = false;
              this.confirmDialogCallback = () => {};
              this.form = {
                company_id: '',
                userpost: '',
                imageName: null,
                imageFile: null,
                imageUrl: null,
              };
              this.file = null;
            },
            confirmSended() {
              this.confirmDialogCallback = () => {
                this.sending_data = false;
                this.$store.commit('setRefreshRequests', true);
                this.close();
              }
              this.confirmDialog = true;
            }
        }
    }
</script>

<style scoped>

</style>