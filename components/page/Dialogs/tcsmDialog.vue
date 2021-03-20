<template>
  <v-dialog
    v-model="showDialog"
    :content-class="`r-dialog ${contentClass}`"
    :max-width="!$helpers.isMobile() ? maxWidth : '100vw'"
    :width="!$helpers.isMobile() ? width : '100vw'"
    :max-height="!$helpers.isMobile() ? maxHeight : '100vh'"
    :height="!$helpers.isMobile() ? height : '100vh'"
    :persistent="persistent"
    :fullscreen="$helpers.isMobile()"
  >
    <div
      v-if="!$helpers.isMobile()"
      style="position: relative"
    >
      <v-btn
        height="40"
        width="40"
        min-width="0"
        depressed
        absolute
        dark
        rounded
        :color="$config.defaultColor"
        class="r-dialog__close px-0"
        @click="$emit('close-dialog')"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <v-card
      class="d-flex flex-column justify-start"
    >
      <template
        v-if="$helpers.isMobile() && !hideTopCloseBlockMobile"
      >
        <v-layout
          justify-space-between
          align-center
          class="tcsm-dialog__edge px-4"
          @click="confirmClose"
        >
          <v-layout
            align-center
          >
            <v-btn
              text
              class="px-0"
              :color="$config.defaultColor"
            >
              <v-btn
                min-width="unset"
                min-height="unset"
                width="34"
                height="34"
                rounded
                depressed
                :color="$config.defaultColor"
                class="mr-3 px-0"
              >
                <v-icon color="white">
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <span
                v-if="editDialog"
                class="font-family--rubik text-none body-1"
              >
                Выход без сохранения
              </span>
              <span
                v-else
                class="font-family--rubik text-none body-1"
              >
                Назад
              </span>
            </v-btn>
          </v-layout>

          <v-icon :color="$config.defaultColor">
            close
          </v-icon>
        </v-layout>
      </template>

      <template v-if="loading">
        <v-layout
          align-center
          justify-center
          class="py-10"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            :color="$config.defaultColor"
            indeterminate
          />
        </v-layout>
      </template>
      <template v-else>
        <slot v-if="defaultSlot" />
        <template
          v-else
        >
          <v-card-title class="font-family--rubik">
            <slot name="title" />
          </v-card-title>
          <v-card-text
            v-scroll.self="scrollCardText"
            :class="disableCardTextPaddings ? 'pa-0' : ''"
          >
            <slot name="main" />
          </v-card-text>

          <v-spacer v-if="!disableSpacer && !hideFooter" />
          <v-divider v-if="!hideDivider && !hideFooter" />

          <v-card-actions
            v-if="!hideFooter"
            class="pa-4"
          >
            <template v-if="customFooter">
              <slot name="footer" />
            </template>
            <template v-else>
              <v-layout
                :justify-space-between="$helpers.isMobile()"
                :justify-end="!$helpers.isMobile()"
              >
                <template v-if="!editDialog">
                  <v-btn
                    :color="$config.defaultColor"
                    dark
                    :width="`${$helpers.isMobile() ? '100%' : ''}`"

                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                    @click="$emit('close-dialog')"
                  >
                    Закрыть
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn
                    :color="$config.defaultColor"
                    dark
                    depressed
                    :width="`${$helpers.isMobile() ? '49%' : ''}`"

                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                    :class="`font-family--rubik body-1 text-none ${$helpers.isMobile() ? 'mr-1' : 'mr-5'}`"
                    @click="$emit('save-changes')"
                  >
                    Сохранить
                  </v-btn>
                  <v-btn
                    :color="$config.defaultColor"
                    outlined
                    :width="`${$helpers.isMobile() ? '49%' : ''}`"

                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                    :class="`font-family--rubik body-1 text-none ${$helpers.isMobile() ? 'ml-1' : ''}`"
                    @click="$emit('close-dialog')"
                  >
                    Отмена
                  </v-btn>
                </template>
              </v-layout>
            </template>
          </v-card-actions>
        </template>
      </template>

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
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "TcsmDialog",
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      editDialog: {
        type: Boolean,
        default: false,
      },
      defaultSlot: {
        type: Boolean,
        default: false,
      },
      customFooter: {
        type: Boolean,
        default: false,
      },
      hideFooter: {
        type: Boolean,
        default: false,
      },
      maxWidth: {
        type: [String, Number],
        default: '',
      },
      width: {
        type: [String, Number],
        default: '',
      },
      maxHeight: {
        type: [String, Number],
        default: '',
      },
      height: {
        type: [String, Number],
        default: '',
      },
      persistent: {
        type: Boolean,
        default: false,
      },
      hideTopCloseBlockMobile: {
        type: Boolean,
        default: false,
      },
      hideDivider: {
        type: Boolean,
        default: false,
      },
      disableSpacer: {
        type: Boolean,
        default: false,
      },
      contentClass: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false
      },
      disableCardTextPaddings: {
        type: Boolean,
        default: false
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
    },
    mounted() {
      // this.loadData();
    },
    methods: {
      scrollCardText(event) {
        this.$emit('scroll-card-text', event.target.scrollTop, event);
      },
      confirmClose() {
        this.$emit('close-dialog');
      }
    },
  }
</script>

<style>

  .tcsm-dialog__edge {
    min-height: 70px;
    height: 70px;
    max-height: 70px;
    background-color: #F5F5F5;
  }
</style>
<style scoped>
</style>