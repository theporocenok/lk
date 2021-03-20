<template>
  <div>
    <UserProfileTop
      v-if="!$helpers.isMobile()"
      :user-id="userId"
    />


    <v-card
      :class="`${$helpers.isMobile() ? 'pa-0 py-7' : 'pa-5 mt-5'} `"
      elevation="0"
    >
      <v-card-text>
        <ToPageTitle
          title="Последние события"
          link="/cabinet/events"
        />
      </v-card-text>
      <v-card-text :class="`${$helpers.isMobile() ? 'pa-0' : ''}`">
        <UserEvents
          :user-id="userId"
          :hide-default-footer="true"
        />
      </v-card-text>
    </v-card>


    <v-card
      :class="`${$helpers.isMobile() ? 'pa-0 py-7' : 'pa-5 mt-5'} `"
      elevation="0"
    >
      <v-card-text :class="`${$helpers.isMobile() ? 'pa-0' : ''}`">
        <v-layout
          justify-space-between
          :class="`mb-5 ${$helpers.isMobile() ? 'flex-wrap px-4' : ''}`"
        >
          <ToPageTitle
            title="Мои компании"
            link="/cabinet/companies"
          />
          <v-btn
            v-if="!$helpers.isMobile()"
            text
            @click="$store.commit('setRequestDialog', true)"
          >
            <v-icon>mdi-plus</v-icon>Подать заявку
          </v-btn>
        </v-layout>

        <UserRequests
          :refresh.sync="refresh_requests"
          :user-id="userId"
        />
      </v-card-text>
    </v-card>

    <v-card
      :class="`${$helpers.isMobile() ? 'pa-0 py-7' : 'pa-5 mt-5'} `"
      elevation="0"
    >
      <v-card-text>
        <ToPageTitle
          title="Последние счета"
          link="/cabinet/invoices"
        />
      </v-card-text>
      <v-card-text :class="`${$helpers.isMobile() ? 'pa-0' : ''}`">
        <UserInvoices
          :show-filters="false"
          :user-id="userId"
        />
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
    import UserInvoices from "./UserInvoices";
    import UserRequests from "./UserRequests";
    import UserProfileTop from "./UserProfileTop";
    import UserEvents from "./UserEvents";
    import ToPageTitle from "../ToPageTitle";

    export default {
        name: "UserProfile",
        components: {
          ToPageTitle,
            UserEvents,

            UserProfileTop,
            UserRequests,

            UserInvoices
        },
        props: {
            userId: {
                type: [Number, String],
                required: false,
                default: () => {
                    return 0;
                }
            }
        },
        data () {
            return {
                refresh_requests: false,

                // массивы данных
                defaultColor: '#006e4c'
            }
        },
        computed: {
            requestDialog() {
                return this.$store.state.requestDialog;
            },
        },
        mounted() {
        },
        methods: {


        }
    }
</script>

<style scoped>

</style>