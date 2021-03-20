<template>
  <div>
    <SortFilterTitle
      title="Пользователи"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />

    <v-expand-transition>
      <v-row
        v-if="!$helpers.isMobile() || showFilters"
        class="ml-1 mr-1"
      >
        <v-col
          :class="`d-flex pb-0 ${$helpers.isMobile() ? '' : 'pt-0'}`"
          cols="12"
          sm="3"
        >
          <v-select
            v-model="queryOptions.searchEnabled"
            :items="active_items"
            item-value="id"
            item-text="text"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            label="Поиск по активности"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0 pb-0"
          cols="12"
          sm="3"
        >
          <v-select
            v-model="queryOptions.searchRole"
            :items="roles"
            item-value="id"
            item-text="name"
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            label="Поиск по ролям"
            clearable
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>

        <v-col
          class="d-flex pt-0 pb-0"
          cols="12"
          sm="4"
        >
          <v-text-field
            v-model="queryOptions.searchText"
            label="Поиск по ФИО, телефону либо компании"
            clearable
            :outlined="$helpers.isMobile()"
            :color="$config.defaultColor"
            @change="!$helpers.isMobile() ? refresh=true : null"
          />
        </v-col>
        <v-col
          class="d-flex pt-0 pb-0"
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

    <Crud
      :show-title="false"
      :refresh.sync="refresh"
      :query-options="queryOptions"
      :model="$admin.User"
      :hide-default-footer="false"
      :show-sort="showSort"
      :auto-query="!$helpers.isMobile()"
    >
      <template #item.enabled="{item}">
        <v-switch
          v-model="item.enabled"
          :color="defaultColor"
          @change="updateUser(item)"
        />
      </template>
      <template #item.contacts="{item}">
        <div v-if="item.email">
          <a
            class="caption"
            :href="`mailto:${item.email}`"
            target="_blank"
          >{{ item.email }}</a>
        </div>
        <div v-if="item.phone">
          <a
            class="caption"
            :href="`tel:${item.phone}`"
          >{{ item.phone }}</a>
        </div>
      </template>
      <template #action_buttons_before="{ item }">
        <n-link
          :to="item.id+'/'"
          class="link_nodecor"
        >
          <v-icon
            small
            class="mr-2"
            title="В кабинет"
          >
            mdi-account
          </v-icon>
        </n-link>

        <n-link
          :to="item.id+'/orders/'"
          class="link_nodecor"
        >
          <v-icon
            small
            class="mr-2"
            title="Договоры"
          >
            mdi-file-document-edit-outline
          </v-icon>
        </n-link>

        <n-link
          :to="item.id+'/invoices/'"
          class="link_nodecor"
        >
          <v-icon
            small
            class="mr-2"
            title="Счета"
          >
            mdi-format-list-checks
          </v-icon>
        </n-link>

        <n-link
          :to="item.id+'/companies/'"
          class="link_nodecor"
        >
          <v-icon
            small
            class="mr-2"
            title="Компании"
          >
            mdi-book-multiple
          </v-icon>
        </n-link>
      </template>
    </Crud>
  </div>
</template>

<script>

    import Crud from "../../../components/CRUD/Index";
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    import SearchFiltersBtn from "../../../components/page/SearchFiltersBtn";
    export default {
        components: {
          SearchFiltersBtn,
          SortFilterTitle,
            Crud

        },
        data () {
            return {
              showFilters: false,
              showSort: false,

              refresh: false,
                defaultColor: '#006e4c',
                queryOptions: {
                    searchEnabled: '',
                    searchRole: '',
                    searchText: '',
                },
                active_items: [
                    {
                        id: 1,
                        text:'Активен'
                    },
                    {
                        id: 0,
                        text:'Отключен'
                    }
                ],
                roles: []
            }
        },
        mounted() {
            this.getUsers();
            this.getRoles();
        },
        methods:{
            async updateUser(editedItem){
                await (this.$admin.User.methods.update(editedItem.id, editedItem));
                this.refresh = true;
            },
            getUsers() {
                return true;
            },
            async getRoles() {
                let {data} = (await this.$admin.Role.methods.all({onlyTitle:true})).data;
                this.roles = data;
            },
        },
        middleware: 'administrator',
    };
</script>

<style scoped>
.link_nodecor{text-decoration: none;}
</style>