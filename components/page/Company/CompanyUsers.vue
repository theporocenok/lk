<template>
  <div>
    <template v-if="showAdmin">
      <v-dialog
        v-model="linkdialog.show"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title>Присоединение к компании</v-card-title>
          <v-card-text>
            <v-autocomplete
              v-model="linkdialog.user_id"
              :items="linkdialog.foundUsers"
              :search-input.sync="linkdialog.searchUsers"
              label="Пользователь"
              placeholder="Введите часть ФИО"
              required
              clearable
              no-data-text="Ничего не найдено"
              @change="findUser"
              @keyup="findUser"
            />

            <v-text-field
              v-model="linkdialog.userpost"
              label="Должность"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              dark
              small
              :color="defaultColor"
              @click="link()"
            >
              Подключить
            </v-btn>
            <v-btn

              small
              @click="close"
            >
              Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template
      v-if="$auth.user.role_id==1"
    >
      <div style="position:relative;">
        <div style="position:absolute;right:0;top:-50px;">
          <v-btn

            dark
            :color="defaultColor"
            @click="linkdialog.show=true"
          >
            Подключить пользователя
          </v-btn>
        </div>
      </div>
    </template>

    <SortMobile
      :sort-by-list="sortByList"
      :show-sort="true"
      @refresh="(sortByValue) => {sortBy = sortByValue}"
    />
    <v-data-table
      :headers="users_headers"
      :items="users_items"
      hide-default-footer
      :sort-by="sortBy"
      :auto-query="!$helpers.isMobile()"
      class="elevation-1 hide-mobile-table-header"
    >
      <template
        v-if="showAdmin"
        #item.actions="{item}"
      >
        <v-btn
          dark
          small
          color="error"
          @click="unlink(item.id)"
        >
          Исключить
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
    import SortMobile from "../SortMobile";
    export default {
        name: "CompanyUsers",
      components: {SortMobile},
      props: {
            showAdmin: {
                type: Boolean,
                required: false,
                default: () => {
                    return false;
                }
            },
            hideDefaultFooter: {
                type: Boolean,
                required: false,
                default: () => {
                    return true;
                }
            },
            companyId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            }
        },
        data () {
            return {
                sortBy: null,
                sortByList: [
                  {label: 'Номер', key: 'number'},
                  {label: 'Дата', key: 'issued_at'},
                  {label: 'Сумма', key: 'sum'},
                  {label: 'Оплачен', key: 'payed_at'},
                  {label: 'Готов', key: 'ready_at'},
                  {label: 'Договор', key: 'order.number'},
                  {label: 'Состав', key: 'items'},
                ],

                users_items: [],
                users_headers: [
                    {text: 'ФИО', value: 'full_name'},
                    {text: 'Должность', value: 'userpost.userpost'},
                    {text: 'Телефон', value: 'phone'},
                    {text: 'Email', value: 'email'},
                ],
                defaultColor:'#006e4c',

                linkdialog: {
                  show: false,
                  searchUsers: '',
                  userpost: '',
                  user_id: 0,
                  foundUsers: []
                }

            }
        },
        mounted() {
            this.loadData();
            if(this.showAdmin){
                this.users_headers.push({text:'Действия',value:'actions'})
            }
        },
        methods:{
            async loadData(){
              try {
                let {data} = (await this.$api.Company.companyUsers(this.companyId)).data;
                this.users_items = data.company.users;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузке списка сотрудников компании',
                  color: 'error'
                });
              }
            },

            async findUser(){
              try{
                const {data} = (await this.$api.User.find({"searchText":this.linkdialog.searchUsers})).data;
                this.linkdialog.foundUsers = data.items.map(user => ({
                    text: user.full_name,
                    value: user.id
                }));
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузке пользователя',
                  color: 'error'
                });
              }
            },

            async link(){
              try{
                (await this.$api.UserCompany.link(this.linkdialog.user_id, this.companyId, this.linkdialog.userpost));
                this.close();
                this.loadData();
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка',
                  color: 'error'
                });
              }
            },
            async unlink(user_id){
              try{
                (await this.$api.UserCompany.unlink(user_id, this.companyId));
                this.loadData();
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка',
                  color: 'error'
                });
              }
            },

            close(){
                this.linkdialog.show=false;
                this.linkdialog.user_id=0;
                this.linkdialog.searchUsers='';
                this.linkdialog.linkdialog=[];
            }
            // showDialogItems(item){
            //     console.log("item", item);
            //     this.invoice_items: item.items;
            // }
        }
    }
</script>

<style scoped>

</style>