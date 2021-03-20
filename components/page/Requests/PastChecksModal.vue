<template>
  <v-dialog
    v-model="showDialog"
    max-width="80vh"
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        Информация об устройстве
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="showDialog = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "PastChecksModal",
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
        headers: [
          {
            text: 'Дата прохождения поверки',
            value: 'lastDate',
          },
          {
            text: 'Новая дата прохождения поверки',
            value: 'newDate'
          },
        ],
        items: [
          {
            lastDate: '20-20-2020',
            newDate: '21-21-2021',
          },
          {
            lastDate: '20-20-2020',
            newDate: '21-21-2021',
          },
          {
            lastDate: '20-20-2020',
            newDate: '21-21-2021',
          },
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