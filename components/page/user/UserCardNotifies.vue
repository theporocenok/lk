<template>
  <div>
    <TcsmDialog
      :dialog="dialog"
      edit-dialog
      persistent
      max-width="600"
      @save-changes="saveNotifiesSettings"
      @close-dialog="close"
    >
      <template v-slot:title>
        Уведомления пользователя
      </template>
      <template v-slot:main>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-left"
                  style="border-bottom: 1px solid #000"
                >
                  Тип уведомления
                </th>
                <th
                  class="text-left"
                  style="border-bottom: 1px solid #000"
                >
                  E-mail
                </th>
                <th
                  class="text-left text-no-wrap"
                  style="border-bottom: 1px solid #000"
                >
                  PUSH / SMS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="notify in notifies_keys"
                :key="notify.key"
              >
                <td
                  class="py-3"
                >
                  {{ notify.title }}
                </td>
                <td
                  class="py-3"
                >
                  <v-switch
                    v-model="notifies_items[`${notify.key}_email`]"
                    :color="$config.defaultColor"
                    hide-details
                    class="mt-0"
                  />
                </td>
                <td
                  class="py-3"
                >
                  <v-switch
                    v-model="notifies_items[`${notify.key}_sms`]"
                    :color="$config.defaultColor"
                    hide-details
                    class="mt-0 swith-center"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
    </TcsmDialog>
    <ConfirmDialog
      :dialog="confirmDialog"
      confirm-text="закрыть окно редактирования уведомлений без сохранения?"
      confirm-btn-text="Не сохранять"
      @accept="closeWithoutSaving"
      @decline="confirmDialog = false"
    />
  </div>
</template>

<script>
    import TcsmDialog from "../Dialogs/tcsmDialog";
    import ConfirmDialog from "../Dialogs/ConfirmDialog";
    export default {
        name: "UserCardNotifies",
      components: {ConfirmDialog, TcsmDialog},
      props: {
          userId: {
            type: [Number, String],
            required: true,
            default: () => {
                return 0;
            }
          },
          dialog: {
            type: Boolean,
            default: false,
          }
        },
        data(){
          return {
            notifies_keys: [
              {key: 'userrequest_status',title:'Подключение к компании'},
              {key: 'invoice_payed',title:'Оплата счета'},
              {key: 'invoice_ready',title:'Готовность счета'},
              {key: 'invoice_new',title:'Выставление счета'},
              {key: 'offer_status',title:'Статусы заявок на КП'},
              {key: 'messaging',title:'Сообщения от ЦСМ'},
            ],
            notifies_items: [],
            defaultColor: '#006e4c',

            isEdited: false,
            confirmDialog: false,
            loading: false,
          }
        },
        watch: {
          async dialog(val) {
            if (!val) {
              this.notifies_items = [];
            }else{
              await this.loadData();
            }
            this.isEdited = false;
          },
          notifies_items: {
            handler(val){
              if (!this.isLoading) {
                this.isEdited = true;
              }
            },
            deep: true,
          }
        },
        // watch: {
        //     notifies_items: {
        //         handler(newValue){
        //             // do stuff
        //             console.log("changed",newValue);
        //         },
        //         deep: true
        //     },
        // },
        mounted() {
            this.loadData();
        },
        methods: {
            saveNotifiesSettings() {
              this.updateNotifies();
              this.closeWithoutSaving();
            },
            async loadData() {
                this.loading = true;
                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }
                let {data} = (await this.$api.UserNotify.get(userId)).data;
                this.notifies_items = data.notifies;
                this.loading = false;
            },
            async updateNotifies() {
                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }
                let {data} = (await this.$api.UserNotify.save(userId, this.notifies_items)).data;
                this.notifies_items = data.notifies;
            },

            close() {
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

<style>
  .swith-center .v-input__slot {
    justify-content: center;
  }
</style>

<style scoped>

</style>