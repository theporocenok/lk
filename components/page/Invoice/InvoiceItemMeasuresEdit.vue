<template>
  <v-dialog
    v-model="showDialog"
    persistent
    width="50vw"
    content-class="measure-edit"
  >
    <div style="position: relative">
      <v-btn
        height="40"
        width="40"
        min-width="0"
        depressed
        absolute
        dark
        rounded
        :color="$config.defaultColor"
        class="measure-edit__close px-0"
        @click="showDialog = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <v-card>
      <v-card-title />
      <v-card-text>
        <v-text-field
          :color="$config.defaultColor"
          label="Наименование товара"
          placeholder="Наименование товара"
        />

        <v-text-field
          label="Адрес"
          placeholder="Адрес"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
        name: "InvoiceItemMeasuresEdit",
        props: {
            dialog: {
                type: Boolean,
                default: () => {
                    return false;
                }
            }
        },
        data() {
            return {}
        },
        computed: {
            showDialog: {
                get () {
                    return this.dialog;
                },
                set () {
                    this.$emit('close-dialog')
                }
            }
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

<style>
  .measure-edit {
    box-shadow: unset !important;
    position: relative;
    height: 90%;
    overflow-y: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<style scoped>
  .measure-edit__close {
    top: -20px;
    right: -20px;
    z-index: 217;
  }
</style>