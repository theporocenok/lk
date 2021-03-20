<template>
  <div>
    <template v-if="showAdmin">
      <TcsmDialog
        :dialog="showAddCompanyDialog"
        persistent
        max-width="600"
        custom-footer
        @close-dialog="showAddCompanyDialog = false"
      >
        <template v-slot:title>
          Подключение к новой компании
        </template>
        <template v-slot:main>
          <v-autocomplete
            v-model="linkdialog.company_id"
            :items="linkdialog.foundCompanies"
            :search-input.sync="linkdialog.searchCompanies"
            label="Компания"
            placeholder="Введите Название либо ИНН компании"
            required
            clearable
            no-data-text="Ничего не найдено"
            @change="findCompany"
            @keyup="findCompany"
          />

          <v-text-field
            v-model="linkdialog.userpost"
            label="Должность"
          />
        </template>
        <template v-slot:footer>
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
        </template>
      </TcsmDialog>
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
            Подключить компанию
          </v-btn>
        </div>
      </div>
    </template>

    <SortMobile
      v-if="$auth.user.role_id == 1"
      :sort-by-list="sortByList"
      :show-sort="showSort"
      @refresh="(sortByValue) => {sortBy = sortByValue}"
    />
    <v-data-table
      v-if="$auth.user.role_id == 1"
      :headers="companies_headers"
      :items="companies_items"
      hide-default-footer
      mobile-breakpoint="0"
      :sort-by="sortBy"
      :auto-query="!$helpers.isMobile()"
      class="elevation-1 mt-5 hide-mobile-table-header"
    >
      <template #item.title="{item}">
        <n-link :to="getLinkCompany(item.id)">
          {{ item.company.title }}
        </n-link>
        <div class="font-italic caption">
          ИНН {{ item.company.inn }} / КПП {{ item.company.ogrn }} / ОГРН {{ item.company.ogrn }}
        </div>
      </template>
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
    <UserRequests
      v-else
      :user-id="$auth.user.id"
    />
  </div>
</template>

<script>
    import SortMobile from "../SortMobile";
    import TcsmDialog from "../Dialogs/tcsmDialog";
    import UserRequests from "./UserRequests";
    export default {
      name: "UserCompanies",
      components: {UserRequests, TcsmDialog, SortMobile},
      props: {
            showAdmin: {
                type: Boolean,
                required: false,
                default: () => {
                    return false;
                }
            },
            userId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            },
            showSort: {
                type: Boolean,
                default: false,
            },
        },
        data () {
            return {
              sortBy: null,
              sortByList: [
                {
                  key: 'title',
                  label: 'Название'
                },
                {
                  key: 'userpost',
                  label: 'Должность'
                },
                {
                  key: 'contact_address',
                  label: 'Адрес'
                },
              ],

              companies_items: [],
                defaultColor:'#006e4c',

                linkdialog: {
                  show: false,
                  searchCompanies: '',
                  userpost: '',
                  company_id: 0,
                  foundCompanies: []
                }

            }
        },
        computed: {
            showAddCompanyDialog: {
              get() {
                return this.linkdialog.show;
              },
              set() {
                this.linkdialog.show = false;
              }
            },
            companies_headers() {
              if (this.showAdmin){
                return [
                  {text: 'Название', value: 'title', sortable: false},
                  {text: 'Должность', value: 'userpost', sortable: false},
                  {text: 'Адрес', value: 'contact_address', sortable: false},
                  {text: 'Действия', value: 'actions', sortable: false, width: '100px'},
                ];
              }
              return [
                {text: 'Название', value: 'title'},
                {text: 'Должность', value: 'userpost.userpost'},
                {text: 'Адрес', value: 'contact_address'},
              ];
            }
        },
        mounted() {
            this.loadData();
            if(this.showAdmin){
                this.companies_headers.push({text:'Действия',value:'actions'})
            }
        },
        methods:{
            getLinkCompany(company_id){
                if(this.$auth.user.role_id==1){
                    return `/manage/companies/${company_id}`;
                }
                return `/cabinet/companies/${company_id}`;
            },
            async loadData(){
                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }
                let {data} = (await this.$api.User.requests(userId)).data;
                this.companies_items = data.requests;
            },

            async findCompany(){
                const {data} = (await this.$api.Company.find({"searchText":this.linkdialog.searchCompanies})).data;
                this.linkdialog.foundCompanies = data.items.map(company => ({
                    text: `${company.title} (ИНН ${company.inn}, КПП ${company.kpp})`,
                    value: company.id
                }));
            },

            async link(){
                (await this.$api.UserCompany.link(this.userId, this.linkdialog.company_id, this.linkdialog.userpost));
                this.close();
                this.loadData();
            },
            async unlink(company_id){
                (await this.$api.UserCompany.unlink(this.userId, company_id));
                this.loadData();
            },

            close(){
                this.linkdialog.show=false;
                this.linkdialog.company_id=0;
                this.linkdialog.searchCompanies='';
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