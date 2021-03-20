<template>
  <v-dialog
    v-model="showDialog"
    max-width="40vw"
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        Отмена заявки
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <v-form
              ref="cancelForm"
              v-model="cancelFormValidation"
              lazy-validation
            >
              <v-textarea
                v-model="reason"
                filled
                label="Укажите причину отмены заявки"
                :color="$config.defaultColor"
                :rules="rules.commentRule"
                required
              />
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          text
          @click="cancelOffer"
        >
          Отменить заявку
        </v-btn>
        <v-btn
          color="red"
          text
          @click="closeFunc"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "OfferCancelModalAdmin",
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      companyOfferId: {
        type: Number,
        required: true,
      }
    },
    data() {
      return {
        reason: '',
        cancelFormValidation: true,
        rules: {
          commentRule: [
            v => !!v || 'Поле обязательно для заполнения',
          ]
        }
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
    watch: {
      dialog(val) {
        if (val) {
          if (this.$refs.cancelForm) {
            this.$refs.cancelForm.resetValidation();
          }
        }
      }
    },
    mounted() {
      // this.loadData();
    },
    methods: {
      closeFunc() {
        this.reason = '';
        this.showDialog = false;
      },
      async cancelOffer() {
        if (this.$refs.cancelForm.validate()) {
          try {
            let {data} = await this.$api.CompanyOffer.cancel(this.companyOfferId, this.reason);
            this.closeFunc();
          }catch{
            this.$store.commit('setSnackParams', {
              text: 'Ошибка',
              color: 'error'
            });
          }
        }
      }
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