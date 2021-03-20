<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="80vh"
    content-class="r-dialog"
  >
    <div style="position: relative">
      <v-btn
        height="55"
        width="55"
        min-width="0"
        depressed
        absolute
        dark
        rounded
        :color="$config.defaultColor"
        class="r-dialog__close px-0"
        @click="showDialog = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <v-card class="r-dialog__card">
      <ServicesTable
        :table-font="tableFont"
        none-elevation
        :services="services"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :color="$config.defaultColor"
          @click="showDialog = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import ServicesTable from "./ServicesTable";
  export default {
    name: "ServicesModal",
    components: {ServicesTable},
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      services: {
        type: Array,
        default: () => {
          return [];
        }
      },
      tableFont: {
        type: String,
        default: () => {
          return '';
        }
      }
    },
    data() {
      return {
        headers: [
          { text: 'id', value: 'id' },
          { text: 'Наименование', value: 'title' },
          { text: 'Поверка на выезде', value: 'checkout' },
          { text: 'Постановление 250', value: 'decree250' },
        ]
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
      // refreshTable: {
      //     get() {
      //         return this.refresh;
      //     },
      //     set(v) {
      //         this.('update:refresh', v);
      //     }
      // }
    },
    mounted() {
      // this.loadData();
    },
    methods: {
      // async loadData(){
      //     let {data} = (await this.$model.SettingGroups.methods.all()).data;
      // },
    },

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style scoped>

</style>