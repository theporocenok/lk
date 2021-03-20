<template>
  <div>
    <v-data-table
      :headers="$helpers.isMobile() ? requests_headers_mobile : requests_headers"
      :items="requests_items"
      mobile-breakpoint="0"
      hide-default-footer
      class="elevation-1"
    >
      <template #item.company.title="{item}">
        <template v-if="item.company">
          <template v-if="item.status_id==1">
            <n-link :to="getLinkCompany(item.company.id)">
              {{ item.company.title }}
            </n-link>
          </template>
          <template v-else>
            <a>
              {{ item.company.title }}
            </a>
          </template>
          <div
            v-if="!$helpers.isMobile()"
            class="font-italic caption"
          >
            ИНН {{ item.company.inn }} / КПП {{ item.company.kpp }}
          </div>
        </template>
      </template>

      <template #item.status="{item}">
        <template v-if="item.status_id==1">
          Одобрено <template v-if="!!item.processed_at">
            ({{ $helpers.convertDateTcsm(item.processed_at) }})
          </template>
        </template>
        <template v-else-if="item.status_id==null">
          Не рассмотрено <template v-if="!!item.created_at">
            ({{ $helpers.convertDateTcsm(item.created_at) }})
          </template>
        </template>
        <template v-else-if="item.status_id==0">
          Отказано <template v-if="!!item.processed_at">
            ({{ $helpers.convertDateTcsm(item.processed_at) }})
          </template>
        </template>
      </template>

      <template
        #item.file_download="{item}"
      >
        <template
          v-if="!!item.image && !!item.image.url"
        >
          <a :href="item.image.url">
            Скачать
          </a>
        </template>
      </template>

      <template
        v-if="$helpers.isMobile()"
        #item="{item}"
      >
        <tr
          :style="`background-color: ${getBgColor(item.status_id)}`"
          @click="item.status_id==1 ? goToCompanyPage(item) : null"
        >
          <td class="text-start">
            <template v-if="item.company">
              <a>
                {{ item.company.title }}
              </a>
            </template>
          </td>
          <td class="text-start">
            <template v-if="item.status_id==1">
              Одобрено <template v-if="!!item.processed_at">
                ({{ $helpers.convertDateTcsm(item.processed_at) }})
              </template>
            </template>
            <template v-else-if="item.status_id==null">
              Не рассмотрено <template v-if="!!item.created_at">
                ({{ $helpers.convertDateTcsm(item.created_at) }})
              </template>
            </template>
            <template v-else-if="item.status_id==0">
              Отказано <template v-if="!!item.processed_at">
                ({{ $helpers.convertDateTcsm(item.processed_at) }})
              </template>
            </template>
          </td>
          <td class="text-start">
            <div
              v-if="item.status_id==1"
              class="overflow-hidden"
            >
              <v-icon
                color="#818181"
                large
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </td>
        </tr>
      </template>

      <template
        v-if="$helpers.isMobile() && isRequestsPage && requests_items.length > 10"
        #footer="{props}"
      >
        <v-layout
          v-if="props.pagination.itemsLength > props.pagination.itemsPerPage"
          class="px-2 mt-4"
          align-center
          justify-space-between
          :wrap="false"
        >
          <div class="text-no-wrap caption font-family--rubik mr-3">
            Показывать
          </div>
          <v-select
            v-model="props.options.itemsPerPage"
            hide-details
            :color="$config.defaultColor"
            :items="[5, 10, 15, 50]"
            class="tcsmSelect-mobile font-family--rubik caption mr-2"
            outlined
          />
          <div class="text-no-wrap caption font-family--rubik mr-2">
            {{ props.pagination.pageStart + 1 }}-{{ props.pagination.pageStop }} из {{ props.pagination.itemsLength }}
          </div>
          <v-layout justify-end>
            <v-btn
              min-width="unset"
              width="32"
              height="32"
              color="#006e4c"
              depressed
              outlined
              class="mr-3"
              @click="props.options.page - 1 > 0 ? props.options.page-- : props.options.page"
            >
              <v-icon>
                arrow_back
              </v-icon>
            </v-btn>
            <v-btn
              min-width="unset"
              width="32"
              height="32"
              color="#006e4c"
              depressed
              outlined
              class=""
              @click="props.options.page + 1 <= props.pagination.pageCount ? props.options.page++ : props.options.page"
            >
              <v-icon>
                arrow_forward
              </v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </template>
    </v-data-table>
  </div>
</template>

<script>
    export default {
        name: "UserRequests",
        props: {
            userId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            },
            refresh: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                requests_headers: [
                    {text: 'Дата', value: 'created_at'},
                    {text: 'Компания', value: 'company.title'},
                    {text: 'Статус', value: 'status'},
                    {text: 'Дата обработки', value: 'processed_at'},
                    {text: 'Файл', value: 'file_download'},
                ],
                requests_headers_mobile: [
                    {text: 'Название', value: 'company.title', sortable:false,},
                    {text: 'Статус подключения', value: 'status', sortable:false,},
                    {text: '', value: 'goto', sortable:false, width: '40px'},
                ],
                requests_items: [],
            }
        },
        computed: {
            refreshTable: {
                get() {
                    return this.refresh
                },
                set(v) {
                    this.$emit('update:refresh', v)
                }
            },
            refreshRequests() {
                return this.$store.state.refreshRequests;
            },
            isRequestsPage() {
                return this.$route.name == 'cabinet-companies';
            }
        },
        watch: {
            async refreshTable(v) {
                if (!v) {
                    return;
                }
                this.loadData();
                this.$emit('update:refresh', false);
            },
            refreshRequests(v) {
                if (!v) {
                    return;
                }

                this.loadData();
                this.$emit('update:refresh', false);
                this.$store.commit('setRefreshRequests', false);
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            getBgColor(status) {
              switch (status) {
                case (1):
                  return this.$config.bgGreen;
                case (0):
                  return this.$config.bgYellow;
                default:
                  return '';
              }
            },
            goToCompanyPage(item) {
              this.$router.push(this.getLinkCompany(item.company.id))
            },
            getLinkCompany(company_id){
                if(this.$auth.user.role_id==1){
                    return `/manage/companies/${company_id}`;
                }
                return `/cabinet/companies/${company_id}`;
            },
            async loadData() {
                let userId = this.$auth.user.id;
                if(this.userId){
                    userId = this.userId;
                }
                let {data} = (await this.$api.User.requests(userId)).data;
                this.requests_items = data.requests;
                if(!this.requests_items.length){
                    this.$store.commit('setRequestDialog', true);
                }
            },
        }
    }
</script>

<style scoped>

</style>