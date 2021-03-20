<template>
  <TcsmDialog
    :dialog="showDialog"
    max-width="80vw"
    hide-footer
    disable-card-text-paddings
    @close-dialog="showDialog = false"
    @scroll-card-text="scrollNotificationsDialog"
  >
    <template v-slot:title>
      <v-layout
        justify-space-between
        align-center
      >
        <div>
          Уведомления
        </div>
        <div>
          <v-btn
            outlined
            :color="$config.defaultColor"
            min-width="0"
            height="28"
            @click="readAllEvents = true"
          >
            <span class="caption text-none font-family--rubik">
              Прочитать все
            </span>
          </v-btn>
        </div>
      </v-layout>
    </template>

    <template v-slot:main>
      <UserEvents
        :read-all-events.sync="readAllEvents"
        :refresh-events.sync="refreshEventsTable"
        :load-more.sync="loadMore"
        is-menu-events
        :options-outside="options"
      />
    </template>
  </TcsmDialog>
</template>

<script>
  import TcsmDialog from "./tcsmDialog";
  import UserEvents from "../user/UserEvents";
  export default {
    name: "NotificationsDialog",
    components: {UserEvents, TcsmDialog},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      }
    },
    data() {
      return {
        options: {
          itemsPerPage: 30,
          filterRead: false,
        },
        refreshEventsTable: false,
        readAllEvents: false,
        loadMore: false,
        dialogScrollTop: 0,
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.dialog;
        },
        set(v) {
          this.$emit('close-dialog');
        }
      },
    },
    watch: {
      dialog(val) {
        this.refreshEventsTable = val;
      }
    },
    mounted() {

    },
    methods: {
      scrollNotificationsDialog(scrollTop, event) {
        if (scrollTop + event.target.offsetHeight >= event.target.scrollHeight * 0.8) {
          this.loadMore = true;
        }
      }
    },
  }
</script>

<style scoped>

</style>