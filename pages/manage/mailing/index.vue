<template>
  <div>
    <TcsmDialog
      :dialog="dialog_edit"
      persistent
      max-width="600"
      custom-footer
      :edit-dialog="!dialog_show"
      @close-dialog="closeDialogs"
    >
      <template v-slot:title>
        {{ editedItem.id ? 'Редактирование' : 'Создание' }} рассылки
      </template>
      <template v-slot:main>
        <v-text-field
          v-model="editedItem.title"
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          class="mt-5"
          label="Название рассылки (для себя)"
          :disabled="editedItem.sent_at!=null"
        />

        <v-select
          v-model="editedItem.type"
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          item-value="id"
          :items="mailing_types"
          label="Тип сообщения"
          :disabled="editedItem.sent_at!=null"
        />

        <v-select
          v-model="editedItem.recipients_list"
          item-value="id"
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          :items="recipients_type"
          label="Отправить рассылку"
          :disabled="editedItem.sent_at!=null"
        />

        <v-autocomplete
          v-show="editedItem.recipients_list!=null"
          v-model="editedItem.recipients"
          :items="recipients"
          item-value="id"
          item-text="full_name"
          multiple
          small-chips
          label="Укажите получателей"
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          clearable
          deletable-chips
          :disabled="editedItem.sent_at!=null"
          :search-input.sync="recipientsInput"
          @input="recipientsInput = ''"
        />

        <v-text-field
          v-model="editedItem.theme"
          class="mt-5"
          :outlined="$helpers.isMobile()"
          :color="$config.defaultColor"
          label="Тема сообщения (видно в кабинете и Email)"
          :disabled="editedItem.sent_at!=null"
        />

        <template v-if="editedItem.type==1">
          <v-textarea

            v-model="editedItem.text"
            auto-grow
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            rows="2"
            class=""
            label="Текст рассылки"
            counter
            :counter-value="calcSMSCount"
            :disabled="editedItem.sent_at!=null"
          />

          <v-layout
            v-if="editedItem.text && editedItem.text.length>0"
            justify-start
            align-center
          >
            <div class="mr-1">
              Стоимость рассылки:
            </div>
            <div>
              {{ editedItem.cost ? editedItem.cost + ' руб.' : '' }}

              <template v-if="editedItem.sent_at==null">
                <v-btn
                  x-small
                  text
                  href="#"
                  @click.prevent="calcMailing()"
                >
                  <v-icon
                    x-small
                    class="mr-1"
                  >
                    refresh
                  </v-icon>
                  пересчитать
                </v-btn>
              </template>
            </div>
          </v-layout>
        </template>
        <template v-else-if="editedItem.type==2">
          <v-form @change="doNothing">
            <TipTap
              v-if="editedItem.type==2"
              :value.sync="editedItem.text"
              :disabled="editedItem.sent_at!=null"
            />
          </v-form>
        </template>
      </template>
      <template v-slot:footer>
        <v-layout
          justify-space-between
          align-center
          :column="$helpers.isMobile()"
        >
          <div
            v-if="editedItem.sent_at==null"
            :class="$helpers.isMobile() ? 'd-flex flex-column align-center' : ''"
          >
            <v-btn
              dark
              small
              color="orange"
              @click="actionSaveRubric(false)"
            >
              Сохранить черновик
            </v-btn>

            <v-btn
              :class="$helpers.isMobile() ? 'mt-3' : ''"
              dark
              small
              :color="defaultColor"
              @click="actionSaveRubric(true)"
            >
              Сохранить и отправить
            </v-btn>
          </div>
          <div>
            <v-btn
              :class="$helpers.isMobile() ? 'mt-3' : ''"
              small
              @click="closeDialogs"
            >
              Отмена
            </v-btn>
          </div>
        </v-layout>
      </template>
    </TcsmDialog>


    <v-dialog
      v-model="dialog_remove"
      max-width="500"
    >
      <v-card>
        <v-card-title>Удаление рассылки <span class="ml-1 font-weight-bold">{{ editedItem.title }}</span></v-card-title>
        <v-card-text>
          <div class="subtitle-1">
            Вы действительно хотите удалить рассылку?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn
              color="error"
              @click="actionDeleteRubric(editedItem.id)"
            >
              Удалить
            </v-btn>

            <v-btn
              class="ml-5"
              @click="closeDialogs"
            >
              Отмена
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <div style="position:relative;">
      <SortFilterTitle
        title="Рассылки"
        :show-filters-btn="false"
        :show-sort-btn="false"
        @toggle-sort="showSort = !showSort"
        @toggle-filters="showFilters = !showFilters"
      />
      <v-layout
        justify-end
        class="ma-5"
        style="position:absolute;right:0;top:0;"
      >
        <v-btn
          :color="defaultColor"
          small
          dark
          @click="createMailing()"
        >
          Новая рассылка
        </v-btn>
      </v-layout>

      <Crud
        :model="$admin.Mailing"
        :show-title="false"
        :refresh.sync="refresh"
        :show-sort="showSort"
      >
        <template #item.type="{item}">
          <template v-if="item.type==1">
            SMS
          </template>
          <template v-else-if="item.type==2">
            E-mail
          </template>
        </template>


        <template #item.recipients="{item}">
          <template v-if="item.recipients_list==1">
            Выбрано: {{ item.recipients.length }}
          </template>
          <template v-else-if="item.recipients_list==null">
            все
          </template>
        </template>

        <template #item.text="{item}">
          <div class="font-weight-bold">
            {{ item.theme }}
          </div>
          <span
            :class="['d-inline-block', 'text-truncate', {'max400px':getWindowWidth>=500}, {'max150px':getWindowWidth<500}]"
          >
            {{ stripTags(item.text) }}
          </span>
        </template>

        <template #item.status="{item}">
          <template v-if="!item.approved">
            черновик
          </template>
          <div
            v-else-if="item.sent_at!=null"
            style="color:green"
          >
            Отправлено
            <div class="caption">
              {{ item.sent_at }}
            </div>
          </div>
          <div
            v-else-if="item.planned_at!=null"
            style="color:orange"
          >
            В очереди
            <div class="caption">
              {{ item.planned_at }}
            </div>
          </div>
        </template>


        <template #action_buttons_before="{item}">
          <v-layout
            justify-end
          >
            <v-tooltip
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2"
                  small
                  @click="copyMailing(item)"
                  v-on="on"
                >
                  mdi-content-copy
                </v-icon>
              </template>
              <span>Скопировать рассылку</span>
            </v-tooltip>


            <v-tooltip
              v-if="item.sent_at!=null"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2"
                  small
                  @click="editMailing(item, false)"
                  v-on="on"
                >
                  mdi-eye-outline
                </v-icon>
              </template>
              <span>Просмотр рассылки</span>
            </v-tooltip>


            <v-tooltip
              v-if="item.sent_at==null"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2"
                  small
                  @click="editMailing(item)"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Изменить рассылку</span>
            </v-tooltip>

            <v-tooltip
              v-if="item.sent_at==null"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2"
                  small
                  @click="deleteMailing(item)"
                  v-on="on"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Удалить рассылку</span>
            </v-tooltip>
          </v-layout>
        </template>
      </Crud>
    </div>
    <ConfirmDialog
      :dialog="confirmDialog"
      :confirm-text="confirmDialogText"
      :confirm-text-color="confirmDialogTextColor"
      :confirm-btn-text="confirmDialogBtnText"
      :confirm-btn-color="confirmDialogBtnColor"
      @accept="confirmDialogAcceptAction"
      @decline="confirmDialogDeclineAction"
    />
  </div>
</template>

<script>
    import Crud from "../../../components/CRUD/Index";
    import TipTap from "../../../components/TipTap/TipTap";
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    import TcsmDialog from "../../../components/page/Dialogs/tcsmDialog";
    import ConfirmDialog from "../../../components/page/Dialogs/ConfirmDialog";
    export default {
        name: "Index",
        components: {ConfirmDialog, TcsmDialog, SortFilterTitle, TipTap, Crud},
        data() {
            return {
              recipientsInput: '',
              showSort: true,
              
                headers: [
                    { text: '#', value: 'id', width: 80 },
                    { text: 'Дата рассылки', value: 'sent_at' },
                    { text: 'Получатели', value: 'recipients' },
                    { text: 'Текст', value: 'text'  },
                    { text: 'Стоимость', value: 'cost'  },
                    { text: 'Действия', value: 'action'  },
                ],
                items:[
                    {
                        recipients: [2,3]
                    },
                    {
                        recipients: [1,4]
                    }
                ],

                menu_date: false,
                recipients: [],
                recipients_type: [
                    {id:null,text:'Всем'},
                    {id:1,text:'Выбрать пользователей'},
                ],
                mailing_types: [
                    {id:1,text:'SMS'},
                    {id:2,text:'E-mail'},
                ],
                refresh: false,
                refreshTimeout:false,

                defaultColor: '#006e4c',
                editedItem: {

                },
                defaultItem: {
                  text: ''
                },

                dialog_edit: false,
                dialog_show: false,
                dialog_remove: false,

                confirmDialog: false,
                confirmDialogText: '',
                confirmDialogTextColor: this.$config.defaultColor,
                confirmDialogBtnText: '',
                confirmDialogBtnColor: this.$config.defaultColor,
                confirmDialogAcceptAction: () => {},
                confirmDialogDeclineAction: () => {},

                loading: false,
                isEdited: false,
            }
        },
        computed: {
            getWindowWidth() {
                return this.$store.state.screenWidth;
            },
            // refreshTable: {
            //     get() {
            //         return this.refresh;
            //     },
            //     set(v) {
            //         this.('update:refresh', v);
            //     }
            // }
        },
        watch: {
            refresh(newValue) {
                if(!newValue){
                    this.autorefresh()
                }
            },
            editedItem: {
              handler(val){
                if (!this.loading) {
                  this.isEdited = true;
                }
              },
              deep: true,
            },
            dialog_edit() {
              this.isEdited = false;
            },
            dialog_remove() {
              this.isEdited = false;
            }
        },
        mounted() {
            this.loadData();
            this.autorefresh();
        },
        methods: {
            doNothing(){ return false; },
            autorefresh(){
                clearTimeout(this.refreshTimeout);
                this.refreshTimeout = setTimeout(() => {
                    if(this.dialog_edit===true){
                        // если сейчас что-то редактируем, выходим, ждем еще 10 сек.
                        return this.autorefresh();
                    }
                    this.refresh = true;
                }, 10000);
            },
            calcSMSCount(text){
                if(!text) return;
                let count = text.length;
                let sms = Math.ceil(count/70);
                return `до 1000 символов, введено − ${count}, sms − ${sms}`;
            },
            async loadData(){
                this.loading = true;
                let {data} = (await this.$admin.User.methods.all({onlyTitle: true})).data;
                this.recipients = data;
                this.isEdited = false;
                this.loading = false;
            },

            closeDialogs(){
              if (this.isEdited) {

                this.confirmDialogText = 'закрыть рассылку без сохранения?';
                this.confirmDialogBtnText = 'Продолжить';
                this.confirmDialogBtnColor = this.$config.defaultColor;
                this.confirmDialogAcceptAction = () => {
                  this.closeDialogsWithoutSaving();
                };
                this.confirmDialogDeclineAction = () => {
                  this.confirmDialog = false;
                };

                this.confirmDialog = true;
                return;
              }
              this.closeDialogsWithoutSaving();
            },

            closeDialogsWithoutSaving() {
              this.dialog_show = false,

              this.confirmDialog = false;
              this.confirmDialogText = '';
              this.confirmDialogTextColor = this.$config.defaultColor;
              this.confirmDialogBtnText = '';
              this.confirmDialogBtnColor = this.$config.defaultColor;
              this.confirmDialogAcceptAction = () => {};
              this.confirmDialogDeclineAction = () => {};

              this.dialog_edit = false;
              this.dialog_remove = false;
              this.editedItem = Object.assign({}, this.defaultItem);
              this.isEdited = false;
            },

            createMailing(){
                this.editedItem = Object.assign({}, this.defaultItem);
                this.dialog_edit = true;
            },
            editMailing(item, editing = true){
                this.editedItem = Object.assign({}, this.defaultItem, item);
                this.editedItem.recipients = this.editedItem.recipients.map(function(item){
                    return item.id;
                });
                if (!editing) {
                  this.dialog_show = true;
                }
                this.dialog_edit = true;
            },
            copyMailing(item){
                this.editedItem = Object.assign({}, this.defaultItem, item, {
                    id: null,
                    approved: null,
                    planned_at: null,
                    sent_at: null,
                });
                this.editedItem.recipients = this.editedItem.recipients.map(function(item){
                    return item.id;
                });
                this.dialog_edit = true;
            },
            deleteMailing(item){
                this.editedItem = Object.assign({}, this.defaultItem, item);

                this.confirmDialogText = 'удалить рассылку?';
                this.confirmDialogTextColor = 'red';
                this.confirmDialogBtnText = 'Удалить';
                this.confirmDialogBtnColor = 'error';
                this.confirmDialogAcceptAction = () => {
                  this.actionDeleteRubric(this.editedItem.id);
                };
                this.confirmDialogDeclineAction = () => {
                  this.closeDialogsWithoutSaving();
                };

                this.confirmDialog = true;
            },
            async actionDeleteRubric(id){
                await this.$admin.Mailing.methods.delete(id);
                this.refresh = true;
                this.closeDialogsWithoutSaving();
            },
            async actionSaveRubric(approved = false){
                this.editedItem.approved = approved;
                if(this.editedItem.id){
                    // save
                    await this.$admin.Mailing.methods.update(this.editedItem.id, this.editedItem);
                    this.refresh = true;
                } else {
                    // create
                    let {data} = (await this.$admin.Mailing.methods.create(this.editedItem)).data;
                    this.editedItem.id = data.id;
                    this.refresh = true;
                }
                this.closeDialogsWithoutSaving();
            },
            async calcMailing(){
                let send_data = {
                    recipients_list:this.editedItem.recipients_list,
                    recipients:this.editedItem.recipients,
                    text:this.editedItem.text,
                };
                let {data} = (await this.$api.Mailing.calc(send_data)).data;
                // console.log("data", data);
                if(data.cost){
                    this.editedItem.cost = data.cost;
                }

            },
            stripTags(value){
                if(!value) return;
                return value.replace(/<\/?[^>]+>/gi, " ").substr(0,70);
            },
            updateText(new_value){
                this.editedItem.text = new_value;
            },
        },

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style scoped>

</style>