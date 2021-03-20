<template>
  <div>
    <v-dialog
      v-model="syncDialog"
      max-width="500px"
    >
      <v-card
        max-width="500"
        height="650px"
        class="mx-auto"
      >
        <v-btn
          absolute
          right
          text
          icon
          color="red"
          @click="syncDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-layout
          id="qrCode"
          justify-center="center"
          align-center
          style="height: 600px"
        >
          <v-progress-circular
            v-if="!qrCode"
            :size="50"
            color="primary"
            indeterminate
          />
          <div
            v-if="qrCode"
            style="padding: 20px;max-width: 400px;display: flex;flex-direction: column;align-items: center"
          >
            <div style="margin-bottom: 5px;max-width: 300px;text-align: center">
              Данное оборудование является собственностью ИП Бабинцев Николай Владимирович
            </div>
            <div style="margin-bottom: 5px;font-size: 27px">
              {{ selectedItem.equipment_type.title }} {{ selectedItem.equipment_manufacturer.title }}/ {{ selectedItem.equipment_model.title }}
            </div>
            <img
              :src="require('~/assets/images/logo13.png')"
            > <img
              v-if="qrCode"
              style="max-width: 200px"
              :src="qrCode"
            >
          </div>
        </v-layout>
        <v-layout justify-end>
          <v-btn
            class="mr-2"
            @click="printQrCode"
          >
            Печать
          </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "QRCodeDialog",
    props: {
      dialog: Boolean,
      selectedItem: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        qrCode: ""
      };
    },
    computed: {
      syncDialog: {
        get() {
          return this.dialog;
        },
        set() {
          return this.$emit('update:dialog', !this.dialog);
        }
      }
    },
    watch: {
      itemId() {
        this.qrCode = null;
        this.openModalQrCode();
      }
    },
    mounted() {
      this.openModalQrCode();
    },
    methods: {
      printQrCode() {
        document.body.innerHTML = document.getElementById('qrCode').innerHTML;
        window.print();
        window.location.reload();
      },
      async openModalQrCode() {
        try {
          const {data} = (await this.$api.CityObjectField.getQrCode(this.selectedItem.id)).data;
          this.qrCode = data;
        }catch{
          this.$store.commit('setSnackParams', {
            text: 'Ошибка при получении qrCode',
            color: 'error'
          });
        }
      },
    }
  };
</script>

<style scoped>

</style>