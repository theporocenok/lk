<template>
  <v-dialog
    v-model="showDialog"
    max-width="370px"
    persistent
    :fullscreen="$helpers.isMobile()"
  >
    <div
      :class="$helpers.isMobile() ? 'd-flex align-center' : ''"
      :style="$helpers.isMobile ? 'height: 100%; background-color: #F5F5F5' : ''"
    >
      <v-card
        :elevation="$helpers.isMobile() ? '0' : ''"
        :height="$helpers.isMobile() ? '' : ''"
        :min-height="$helpers.isMobile() ? '' : ''"
        :class="`d-flex flex-column ${!$helpers.isMobile() ? 'overflow-hidden' : 'pa-4 justify-center'}`"
      >
        <v-card-title
          :class="$helpers.isMobile() ? 'd-flex justify-center' : ''"
        >
          <div :class="`headline lighten-2 text-no-wrap ${$helpers.isMobile() ? 'text-center' : ''}`">
            Подтверждение действия
          </div>
        </v-card-title>

        <v-card-text
          :class="$helpers.isMobile() ? 'text-center' : ''"
        >
          <v-row>
            <v-col style="color: #222;">
              <template v-if="!custumText">
                Вы уверены, что желаете <span :style="`color: ${confirmTextColorComputed}`">{{ confirmText }}</span>
              </template>
              <template v-else>
                <span :style="`color: ${confirmTextColorComputed}`">{{ confirmText }}</span>
              </template>
            </v-col>
          </v-row>
        </v-card-text>

        <div
          v-if="$helpers.isMobile()"
          :class="$helpers.isMobile() ? 'px-8' : ''"
        >
          <v-divider />
        </div>
        <v-card-actions :class="$helpers.isMobile() ? 'px-8' : ''">
          <v-row>
            <v-spacer v-if="!$helpers.isMobile()" />
            <v-col :class="$helpers.isMobile() ? '' : 'px-0'">
              <v-btn
                :color="confirmBtnColorComputed"
                :height="`${$helpers.isMobile() ? '40' : ''}`"
                :width="`${$helpers.isMobile() ? '100%' : ''}`"
                dark
                class="text-none"
                @click="$emit('accept')"
              >
                {{ confirmBtnText }}
              </v-btn>
            </v-col>
            <v-col :class="$helpers.isMobile() ? '' : ''">
              <v-btn
                v-if="showDeclineBtn"
                :color="$config.defaultColor"
                :height="`${$helpers.isMobile() ? '40' : ''}`"
                :width="`${$helpers.isMobile() ? '100%' : ''}`"
                outlined
                class="text-none"
                @click="$emit('decline')"
              >
                Отмена
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
    <template
      v-if="$helpers.isMobile() && false"
    >
      <v-layout
        justify-center
        align-center
        column
        class="tcsm-dialog__edge px-4 body-2"
        style="color: #b1b1b1;"
      >
        <n-link
          :to="localePath('/')"
          class="text-decoration-none"
          style="color: #b1b1b1 !important;"
        >
          Политика конфиденциальности
        </n-link>
        © {{ new Date().getFullYear() }} Тюменский ЦСМ
      </v-layout>
    </template>
  </v-dialog>
</template>

<script>
  export default {
    name: "ConfirmDialog",
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      confirmText: {
        type: String,
        default: () => {
          return '';
        }
      },
      confirmTextColor: {
        type: String,
        default: '',
      },
      confirmBtnText: {
        type: String,
        default: () => {
          return 'Продолжить';
        }
      },
      confirmBtnColor: {
        type: String,
        default: '',
      },
      custumText: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      showDeclineBtn: {
        type: Boolean,
        default: () => {
          return true;
        }
      }
    },
    data() {
      return {}
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
      confirmTextColorComputed() {
        if (this.confirmTextColor != '') {
          return this.confirmTextColor;
        }
        return this.$config.defaultColor;
      },
      confirmBtnColorComputed() {
        if (this.confirmBtnColor != '') {
          return this.confirmBtnColor;
        }
        return this.$config.defaultColor;
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