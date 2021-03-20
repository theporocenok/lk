<template>
  <TcsmDialog
    content-class="news__dialog"
    :dialog="showNew"
    max-width="70%"
    default-slot
    @close-dialog="$emit('show-news-dialog')"
    @click:outside="$emit('show-news-dialog')"
  >
    <template v-slot:default>
      <v-img
        v-if="card.image"
        class="white--text news__image"
        height="200px"
        :src="`${card.image.url}`"
      >
        <div class="news__image-background d-flex flex-column justify-center">
          <v-card-title class="news__title px-6">
            {{ card.title }}
          </v-card-title>
        </div>
      </v-img>


      <v-card-text
        class="pb-4 pt-0  text-justify text-secondary news__text"
      >
        <v-card-subtitle class="white--text pa-1 my-4 text-caption news__date d-inline-block">
          {{ $helpers.convertDate(card.date, 'DD MMMM YYYY') }}
        </v-card-subtitle>
        <div
          class="mt-3"
          v-html="card.text"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn
          :color="$config.defaultColor"
          outlined
          @click="$emit('show-news-dialog')"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </template>
  </TcsmDialog>
</template>

<script>
    import TcsmDialog from "../Dialogs/tcsmDialog";
    export default {
        name: "NewsModal",
      components: {TcsmDialog},
      props: {
            showNew: {
                type: Boolean,
                default: () => {
                    return false
                }
            },
            card: {
                type: Object,
                default: () => {
                    return 0;
                }
            }
        },
        data() {
            return {}
        },
        computed: {
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
            //     let {data} = (await this.$admin.SettingGroups.methods.all()).data;
            // },
        },
    }
</script>

<style>
  .news__dialog {
    box-shadow: unset !important;
  }

  .news__image .v-image__image {
    -webkit-filter: blur(4px);
    filter: blur(4px);
  }
</style>

<style scoped>

  .news__title {
    word-break: normal;
  }

  .news__text {
    line-height: 18px;
  }

  .news__image-background {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .news__date {
    background-color: grey;
    border-radius: 4px;
    /*position: absolute;*/
    /*left: 10px;*/
    /*bottom: 0;*/
  }

</style>