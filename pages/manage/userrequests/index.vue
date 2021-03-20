<template>
  <div>
    <SortFilterTitle
      title="Новые активации пользователей"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="12"
          sm="4"
        >
          <v-select
            v-model="queryOptions.status"
            :items="filter_status_items"
            label="Поиск по статусу"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            :item-color="$config.defaultColor"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>

        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по ФИО либо компании"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          :class="`d-flex ${$helpers.isMobile() ? 'pb-0' : ''}`"
          cols="12"
          sm="2"
        >
          <SearchFiltersBtn
            :show-filters="showFilters"
            @refresh="refresh = true, showFilters = false"
            @hide-filters="showFilters = false"
          />
        </v-col>
      </v-row>
    </v-expand-transition>

    <TcsmDialog
      :dialog="userrequest_decline_dialog"
      max-width="500"
      persistent
      custom-footer
      @close-dialog="userrequest_decline_dialog = false"
    >
      <template v-slot:title>
        Причина отказа
      </template>
      <template v-slot:main>
        <v-layout
          v-if="sending_data"
          justify-center
          align-center
          style="height: 100px"
        >
          <v-progress-circular
            indeterminate
            :color="$config.defaultColor"
          />
        </v-layout>
        <v-textarea
          v-if="!sending_data"
          v-model="userrequest_decline_text"
          rows="1"
          auto-grow
          label="Укажите причину отказа, информация будет отправлена заявителю"
        />
      </template>
      <template v-slot:footer>
        <v-btn
          :disabled="userrequest_decline_text.trim()==''"
          small
          color="error"
          @click="decline"
        >
          Отклонить
        </v-btn>
        <v-btn
          small
          outlined
          class="float-right"
          @click="userrequest_decline_dialog=false"
        >
          Отмена
        </v-btn>
      </template>
    </TcsmDialog>

    <TcsmDialog
      :dialog="userrequest_dialog"
      max-width="600"
      persistent
      custom-footer
      @close-dialog="userrequest_dialog = false"
    >
      <template v-slot:title>
        Заявка # {{ userrequest_item.id }} от {{ userrequest_item.created_at }}
      </template>
      <template v-slot:main>
        <div
          :style="'background-color: ' + getBgColor(userrequest_item.status_id)"
          class="mx-n3 mb-2 px-3 py-2"
        >
          <template v-if="userrequest_item.status_id == 0">
            <span class="font-weight-bold">Отказано<template v-if="!!userrequest_item.comment">:</template></span> <template v-if="!!userrequest_item.comment">
              {{ userrequest_item.comment }}
            </template>
          </template>
          <template v-else-if="userrequest_item.status_id == 1">
            <span class="font-weight-bold">Одобрено</span>
          </template>
          <template v-else>
            <span class="font-weight-bold">На рассмотрении</span>
          </template>
        </div>
        <v-divider />
        <v-simple-table v-if="userrequest_item && userrequest_item.user">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="font-weight-bold">
                  ФИО
                </td>
                <td>
                  <n-link
                    :to="`/manage/users/${userrequest_item.user.id}/`"
                  >
                    {{ userrequest_item.user.full_name }}
                  </n-link>
                </td>
              </tr>
              <tr v-if="userrequest_item.user.phone">
                <td class="font-weight-bold">
                  Телефон
                </td>
                <td>{{ userrequest_item.user.phone }}</td>
              </tr>
              <tr v-if="userrequest_item.user.email">
                <td class="font-weight-bold">
                  E-mail
                </td>
                <td>{{ userrequest_item.user.email }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Письмо о подтверждении полномочий
                </td>
                <td>
                  <template v-if="userrequest_item.image">
                    <a
                      :href="userrequest_item.image.url"
                      target="_blank"
                    >
                      скачать
                    </a>
                  </template>
                  <template v-else>
                    Файл не загружен
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div class="title mt-5">
          Компания
        </div>
        <v-simple-table v-if="userrequest_item && userrequest_item.company">
          <template v-slot:default>
            <tbody>
              <tr
                v-for="row in userrequest_keys"
                :key="row.key"
              >
                <td class="font-weight-bold">
                  {{ row.title }}
                </td>
                <td>{{ userrequest_item.company[row.key] }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template v-slot:footer>
        <v-layout
          v-if="sending_data"
          justify-center
          align-center
          style="height: 100px"
        >
          <v-progress-circular
            indeterminate
            :color="$config.defaultColor"
          />
        </v-layout>
        <template v-else>
          <template v-if="!userrequest_item.processed_at">
            <v-layout justify-space-between>
              <v-flex>
                <v-btn
                  small
                  color="success"
                  @click="agree"
                >
                  Одобрить
                </v-btn>
                <v-btn
                  small
                  color="error"
                  @click="userrequest_decline_dialog = true"
                >
                  Отклонить
                </v-btn>
              </v-flex>
              <v-flex>
                <v-btn
                  small
                  outlined
                  class="float-right"
                  @click="close"
                >
                  Отложить
                </v-btn>
              </v-flex>
            </v-layout>
          </template>
          <template v-else>
            <v-btn
              small
              outlined
              class="float-right"
              @click="close"
            >
              Закрыть
            </v-btn>
          </template>
        </template>
      </template>
    </TcsmDialog>

    <Crud
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="queryOptions"
      :model="$admin.UserRequest"
      :show-sort="showSort"
      :auto-query="!$helpers.isMobile()"
      :element-id-to-get="getElementId"
      @open-dialog="showDialogRequest"
    >
      <template #action_buttons_after="{item}">
        <v-btn
          dark
          color="#006e4c"
          small
          class="mr-1"
          @click="showDialogRequest(item)"
        >
          Просмотр
        </v-btn>
      </template>
    </Crud>
  </div>
</template>

<script>
    import Crud from '~/components/CRUD/Index';
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
    import TcsmDialog from "../../../components/page/Dialogs/tcsmDialog";

    export default {
        name: "AdminUserRequests",
        components: {
          TcsmDialog,
          SearchFiltersBtn,
          SortFilterTitle,
          Crud
        },
        data () {
            return {
              showFilters: false,
              showSort: false,

                refresh: false,
                // queryOptions
                queryOptions: {
                    status: '',
                    searchText: '',
                },

                // фильтры
                filter_text: "", // по ФИО либо компании
                filter_status: "", // по статусу
                filter_status_items: [
                    { value:'-1',text: 'Все заявки' },
                    { value:'',text: 'На рассмотрении' },
                    { value:'0',text: 'Отказаны' },
                    { value:'1',text: 'Одобрены' },
                ],

                // модалка
                userrequest_decline_dialog: false,
                userrequest_decline_text: '',

                // модалка
                userrequest_dialog: false,
                userrequest_keys: [
                    {key:'title',title:'Название'},
                    {key:'inn',title:'ИНН'},
                    {key:'kpp',title:'КПП'},
                ],
                userrequest_item: false,

                sending_data: false,

                //Текущий пользователь
                currentUser: null,

                getElementId: null,
            }
        },
        computed: {

        },
        watch: {
        },
        mounted() {
          if (!!this.$route.query && !!this.$route.query.open) {
            this.getElementId = this.$route.query.open;
          }
        },
        methods:{
            getBgColor(status){
              if (status == 0) {
                return 'rgb(255,223,223)';
              }
              if (status == 1) {
                return this.$config.bgGreen;
              }
              return this.$config.bgGrey;
            },
            showDialogRequest(item){
                this.userrequest_dialog = true;
                this.userrequest_item = item;
            },
            close(){
                this.userrequest_decline_dialog = false;
                this.userrequest_decline_text = '';
                this.userrequest_dialog = false;
                this.userrequest_item = false;
                this.sending_data = false;
                this.currentUser = null;
                this.refresh = true;
            },
            async agree(){
                this.sending_data = true;
                /*const {data} = (await this.$api.Auth.login(login, password)).data;*/
                let {data} = (await this.$api.UserRequest.processRequest( this.userrequest_item.id, {status:1})).data;
                if (this.$auth.user.role_id == 1) {
                  this.$store.dispatch('loadCountUserRequests');
                }
                this.close();
            },
            async decline(){
                this.sending_data = true;
                let {data} = await this.$api.UserRequest.processRequest( this.userrequest_item.id, {status:0,comment:this.userrequest_decline_text});
                if (this.$auth.user.role_id == 1) {
                  this.$store.dispatch('loadCountUserRequests');
                }
                this.close();
            },
        },
        middleware: 'administrator',
    }
</script>

<style scoped>

</style>