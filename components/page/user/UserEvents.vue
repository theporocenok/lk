<template>
  <div>
    <SortMobile
      v-if="false"
      :sort-by-list="sortByList"
      :show-sort="true"
      @refresh="(sortByValue) => {sortBy = sortByValue}"
    />
    <v-data-table
      :headers="$helpers.isMobile() ? headersMobile : headers"
      :items="response.items"
      :items-per-page="eventsPerPage"
      :page="eventsPage"
      :server-items-length="response.meta.total"
      :page-count="response.meta.last_page"
      :sort-desc="sortDesc"
      mobile-breakpoint="0"
      :hide-default-footer="hideDefaultFooter || $helpers.isMobile()"
      :disable-sort="$helpers.isMobile()"
      :options.sync="options"
      :sort-by="sortBy"
      :auto-query="!$helpers.isMobile()"
      :footer-props="{
        itemsPerPageText: 'Показывать'
      }"
      class="elevation-1 hide-mobile-table-header events-table--mobile"
      @click:row="clickEventsRow"
    >
      <template #item.created_at="{item}">
        <v-layout align-center>
          <v-icon
            v-if="!item.read_at && $helpers.isMobile()"
            small
          >
            mdi-email-outline
          </v-icon>
          <v-icon
            v-else-if="$helpers.isMobile()"
            small
          >
            mdi-email-open-outline
          </v-icon>
          <span :class="`${$helpers.isMobile() ? 'font-family--rubik ml-1' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
            {{ $helpers.convertDateTcsm(item.created_at) }}
          </span>
        </v-layout>
      </template>
      <template #item.object_modified="{item}">
        <v-layout align-center>
          <v-icon v-if="!item.read_at && !$helpers.isMobile()">
            mdi-email-outline
          </v-icon>
          <v-icon v-else-if="!$helpers.isMobile()">
            mdi-email-open-outline
          </v-icon>
          <div :class="[{'ml-2':!$helpers.isMobile()},{'table_row--bold':!item.read_at}]">
            <template>
              <template v-if="item.invoice_id">
                <a
                  href="#"
                  :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                  @click.stop="openInvoice(item)"
                >
                  {{ $helpers.isMobile() ? '' : 'Счет ' }}№{{ item.invoice.number }}
                </a>
              </template>
              <template v-else-if="item.user_request_id">
                <a
                  href="#"
                  :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                  @click.stop="openCompany(item)"
                >
                  {{ item.request.company.title }}
                </a>
              </template>
              <template v-else-if="item.company_offer_id">
                <a
                  href="#"
                  :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                  @click.stop="openOffer(item)"
                  v-html="item.title"
                />
              </template>
              <template v-else>
                <a
                  href="#"
                  :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                  @click.stop="openMessage(item)"
                >
                  {{ item.title }}
                </a>
              </template>
            </template>
          </div>
        </v-layout>
      </template>
      <template #item.title_modified="{item}">
        <template v-if="item.invoice_id>0">
          <span :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
            {{ item.title }}
          </span>
        </template>

        <template v-else-if="item.user_request_id>0">
          <span :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
            {{ item.title }}
          </span>
        </template>

        <template v-else>
          <span
            :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`"
            v-html="item.text"
          />
        </template>
      </template>
      <template
        v-if="$helpers.isMobile() && isEventsPage"
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
            {{ props.itemsPerPageText }}
          </div>
          <v-select
            v-model="options.itemsPerPage"
            hide-details
            :color="$config.defaultColor"
            :items="[5, 10, 15]"
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
              @click="response.meta.page - 1 > 0 ? response.meta.page-- : response.meta.page"
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
              @click="response.meta.page + 1 <= props.pagination.pageCount ? response.meta.page++ : props.options.page"
            >
              <v-icon>
                arrow_forward
              </v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </template>
      <template #item.goto>
        <div
          class="overflow-hidden"
        >
          <v-icon
            color="#818181"
            large
          >
            mdi-chevron-right
          </v-icon>
        </div>
      </template>
      <template
        v-if="$helpers.isMobile()"
        #item="{item}"
      >
        <tr
          :style="`background-color: ${getBgColor(item)};`"
          @click="clickEventsRow({}, {item: item})"
        >
          <td
            class="text-start"
            style="padding-bottom: 8px !important; padding-top: 8px !important;"
          >
            <v-layout align-center>
              <v-icon
                v-if="!item.read_at && $helpers.isMobile()"
                small
              >
                mdi-email-outline
              </v-icon>
              <v-icon
                v-else-if="$helpers.isMobile()"
                small
              >
                mdi-email-open-outline
              </v-icon>
              <span :class="`${$helpers.isMobile() ? 'font-family--rubik ml-1' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
                {{ $helpers.convertDateTcsm(item.created_at) }}
              </span>
            </v-layout>
          </td>
          <td
            class="text-start"
            style="padding-bottom: 8px !important; padding-top: 8px !important;"
          >
            <v-layout align-center>
              <v-icon v-if="!item.read_at && !$helpers.isMobile()">
                mdi-email-outline
              </v-icon>
              <v-icon v-else-if="!$helpers.isMobile()">
                mdi-email-open-outline
              </v-icon>
              <div :class="[{'ml-2':!$helpers.isMobile()},{'table_row--bold':!item.read_at}]">
                <template>
                  <template v-if="item.invoice_id">
                    <a
                      href="#"
                      :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                      @click.stop="openInvoice(item)"
                    >
                      {{ $helpers.isMobile() ? '' : 'Счет ' }}№{{ item.invoice.number }}
                    </a>
                  </template>
                  <template v-else-if="item.user_request_id">
                    <a
                      href="#"
                      :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                      @click.stop="openCompany(item)"
                    >
                      {{ item.request.company.title }}
                    </a>
                  </template>
                  <template v-else-if="item.company_offer_id">
                    <a
                      href="#"
                      :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                      @click.stop="openOffer(item)"
                      v-html="item.title"
                    />
                  </template>
                  <template v-else>
                    <a
                      href="#"
                      :class="$helpers.isMobile() ? 'font-family--rubik text-decoration-none' : ''"
                      @click.stop="openMessage(item)"
                    >
                      {{ item.title }}
                    </a>
                  </template>
                </template>
              </div>
            </v-layout>
          </td>
          <td
            class="text-start"
            style="padding-bottom: 8px !important; padding-top: 8px !important;"
          >
            <template v-if="item.invoice_id>0">
              <span :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
                {{ item.title }}
              </span>
            </template>
            <template v-else-if="item.user_request_id>0">
              <span :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`">
                {{ item.title }}
              </span>
            </template>
            <template v-else>
              <span
                :class="`${$helpers.isMobile() ? 'font-family--rubik' : ''} ${!item.read_at ? 'font-weight-bold' : ''}`"
                v-html="item.text"
              />
            </template>
          </td>
          <td
            class="text-start"
            style="padding-bottom: 8px !important; padding-top: 8px !important;"
          >
            <div
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
    </v-data-table>

    <Invoice
      :dialog="dialog_invoice"
      :invoice-item-id="dialog_invoice_id"
      @hideDialog="dialog_invoice=false"
    />

    <TcsmDialog
      :dialog="dialog_company"
      max-width="600"
      custom-footer
      @close-dialog="dialog_company = false"
    >
      <template v-slot:title>
        {{ dialog_company_object.title }}
      </template>
      <template v-slot:main>
        <Company :company-item="dialog_company_object" />
      </template>
      <template v-slot:footer>
        <v-btn
          dark
          :color="defaultColor"
          @click="dialog_company=false"
        >
          Закрыть
        </v-btn>
        <v-btn
          dark
          class="ml-2"
          :color="defaultColor"
          :to="getLinkCompany(dialog_company_object.id)"
        >
          На страницу компании
        </v-btn>
      </template>
    </TcsmDialog>

    <TcsmDialog
      :dialog="dialog_message"
      max-width="600"
      @close-dialog="dialog_message = false"
    >
      <template v-slot:title>
        {{ dialog_message_opened.title }}
      </template>
      <template v-slot:main>
        {{ dialog_message_opened.text }}
      </template>
    </TcsmDialog>

    <OfferEditModal
      :dialog="dialog_offer"
      :offer-id="dialog_offer_id"
      :edit="false"
      @close-dialog="closeOffer"
    />
  </div>
</template>

<script>
    import Invoice from "../../../components/page/Invoice/Invoice";
    import Company from "../../../components/page/Company/Company";
    import OfferEditModal from "../Offer/OfferEditModal";
    import SortMobile from "../SortMobile";
    import TcsmDialog from "../Dialogs/tcsmDialog";
    export default {
        name: "UserEvents",
        components: {TcsmDialog, SortMobile, OfferEditModal, Company, Invoice},
        props: {
          hideDefaultFooter:{
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
          isMenuEvents: {
            type: Boolean,
            default: false,
          },
          optionsOutside: {
            type: Object,
            default: () => {
              return {}
            }
          },
          refreshEvents: {
            type: Boolean,
            default: () => {
              return false;
            },
          },
          readAllEvents: {
            type: Boolean,
            default: () => {
              return false;
            },
          },
          loadMore: {
            type: Boolean,
            default: () => {
              return false;
            }
          }
        },
        data () {
            return {
              sortBy: 'created_at',
              sortDesc: true,
              sortByList: [
                {
                  key: 'created_at',
                  label: 'Дата'
                },
                {
                  key: 'title',
                  label: 'Объект'
                },
                {
                  key: 'text',
                  label: 'Событие'
                },
              ],

              headers: [
                  {text:'Дата',value:"created_at", },
                  {text:'Объект',value:"object_modified", sortable:false,},
                  {text:'Событие',value:"title_modified", sortable:false,},
              ],
              headersMobile: [
                {text:'Дата',value:"created_at", width: '25%'},
                {text:'Объект',value:"object_modified", sortable:false, width: '20%'},
                {text:'Событие',value:"title_modified", sortable:false, width: '45%'},
                {text:'',value:"goto", sortable:false, width: '10%'},
              ],
              options: {
                  itemsPerPage: 10,
                  sortBy: ["created_at"],
                  sortDesc: [true]
              },
              currentPage: 1,
              response: {
                  items: [],
                  meta: {
                      page: 1,
                      last_page: 0,
                      per_page: 10,
                      total: 0
                  },

              },

              defaultColor: '#006e4c',

              // модалки
              dialog_invoice: false,
              dialog_invoice_id: null,
              dialog_company: false,
              dialog_company_object: {},
              dialog_message: false,
              dialog_message_opened: {},
              dialog_offer: false,
              dialog_offer_id: null,

              statusColors: [this.$config.bgGrey, this.$config.bgGreen, this.$config.bgYellow],

              loading: false,
            }
        },
        computed: {
          isEventsPage() {
            return this.$route.name == 'cabinet-events' && !this.isMenuEvents;
          },
          eventsPage() {
            return this.isMenuEvents ? 1 : this.response.meta.page;
          },
          eventsPerPage() {
            return this.isMenuEvents ? this.response.items.length : this.response.meta.per_page;
          }
        },
        watch: {
          async options(pagination) {
            this.options = Object.assign(this.options, pagination);
            this.loadData();
          },
          refreshEvents(val) {
            if (val) {
              this.loadData();
              this.$emit('update:refresh', false);
            }else{
              this.response.items = [];
              this.currentPage = 1;
            }
          },
          readAllEvents(val) {
            if (val) {
              this.readAll();
              this.$emit('update:readAllEvents', false);
            }
          },
          loadMore(val) {
            if (val) {
              this.loadMoreEventsFunc();
              this.$emit('update:loadMore', false);
            }
          },
        },
        mounted() {
            // this.loadData();
        },
        methods:{
          getBgColor(item) {
            if (this.isEventsPage || this.isMenuEvents) {
              let status = null;
              let color = null;
              if (!!item.user_request_id && !!item.request && !!item.request.status) {
                color = this.$helpers.convertHexToRGB(item.request.status.color);
              }
              if (!!item.company_offer_id && !!item.company_offer && !!item.company_offer.status) {
                status = this.getOfferStatus(item.company_offer.status);
              }
              if (!!item.invoice_id && !!item.invoice && !!item.invoice.status) {
                color = this.$helpers.convertHexToRGB(item.invoice.status.color);
              }

              if (!!color) {
                return 'rgba('+color+',.1)';
              }
              return this.statusColors[status];
            }
          },
          getOfferStatus(statusObj) {
            if (statusObj.id == this.$config.offerStatuses.underConsideration) {
              return 2;
            }
            if (statusObj.id == this.$config.offerStatuses.sentOffer) {
              return 1;
            }
            if (statusObj.id == this.$config.offerStatuses.canceled) {
              return 0;
            }
          },
          clickEventsRow(mouseEvent, item) {
            if (item.item.invoice_id) {
              this.openInvoice(item.item);
              return;
            }

            if (item.item.user_request_id) {
              this.openCompany(item.item);
              return;
            }
            if (item.item.company_offer_id) {
              this.openOffer(item.item);
              return;
            }
            this.openMessage(item.item);
          },
          getLinkCompany(company_id){
              if(this.$auth.user.role_id==1){
                  return `/manage/companies/${company_id}`;
              }
              return `/cabinet/companies/${company_id}`;
          },
          openInvoice( item ){
            this.dialog_invoice = true;
            this.dialog_invoice_id = item.invoice_id;
            this.readEvent(item);
          },
          openCompany( item ){
            this.dialog_company = true;
            this.dialog_company_object = item.request.company;
            this.readEvent(item);
          },
          openOffer(item) {
            this.dialog_offer_id = item.company_offer_id;
            this.dialog_offer = true;
            this.readEvent(item);
          },
          closeOffer() {
            this.dialog_offer_id = null;
            this.dialog_offer = false;
          },
          openMessage( item ){
            this.dialog_message = true;
            this.dialog_message_opened = item;
            this.readEvent(item);
          },
          async loadData(){
              let userId = this.$auth.user.id;
              if(this.userId){
                  userId = this.userId;
              }
              let optionsToSend = Object.assign({}, this.options, this.optionsOutside);
              if (this.isMenuEvents) {
                optionsToSend = Object.assign(optionsToSend, {page: this.currentPage});
              }
              let {data} = (await this.$api.User.listEvent(userId, optionsToSend)).data;
              this.response = data;
          },
          async loadMoreEventsFunc(){
            if (this.loading) {
              return;
            }
            this.loading = true;
            let userId = this.$auth.user.id;
            if(this.userId){
                userId = this.userId;
            }
            let optionsToSend = Object.assign({}, this.options, this.optionsOutside);
            if (this.isMenuEvents) {
              optionsToSend = Object.assign(optionsToSend, {page: ++this.currentPage});
            }
            let {data} = (await this.$api.User.listEvent(userId, optionsToSend)).data;
            this.$set(this.response, 'items', this.response.items.concat(data.items));
            this.$set(this.response, 'meta', data.meta);
            this.loading = false;
          },
          async readEvent(item){
              // console.log("item", item);
              if(!item.read_at){
                let {data} = (await this.$api.UserEvent.read(item.id)).data;
                if(data.success){
                  item.read_at = true;
                }
              }
          },
          async readAll() {
            this.response.items = [];
            let countEventsToRead = Object.assign({}, this.options, this.optionsOutside).itemsPerPage * this.currentPage;
            await this.$api.UserEvent.readEvents(countEventsToRead);
            this.currentPage = 1;
            this.$store.dispatch('loadCountUserEvents');
            this.loadData();
          },
        }

    }
</script>

<style>
  @media screen and (max-width: 1000px) {
    .events-table--mobile tr>th:not(:last-child),
    .events-table--mobile tr>td:not(:last-child) {
      padding-right: 6px !important;
    }
    .events-table--mobile tr>th:not(:first-child),
    .events-table--mobile tr>td:not(:first-child) {
      padding-left: 6px !important;
    }
  }
</style>

<style scoped>
  .table_row--bold { font-weight: bold;}
</style>