<template>
  <v-card
    v-if="newsItem"
    class="overflow-hidden"
    @click.prevent="showNew = true"
  >
    <div
      v-if="newsItem.image"
      :style="`background-image: url(${newsItem.image.url}); `"
      class="news__image"
    >
      <v-layout
        column
        justify-center
        align-center
        class="news__image-background py-2"
      >
        <v-card-title
          v-if="newsItem.title"
          class="pb-0 pt-3 align-start white--text body-1 text-none font-weight-bold news__title overflow-hidden"
        >
          {{ newsItem.title }}
        </v-card-title>
      </v-layout>
    </div>

    <v-card-text
      class="text--primary news__subtitle pb-0 overflow-hidden"
      v-html="newsItem.description"
    />

    <v-layout justify-end>
      <v-card-subtitle class="align-self-end">
        {{ $helpers.convertDate(newsItem.date, 'DD MMMM YYYY') }}
      </v-card-subtitle>
    </v-layout>
    <NewsModal
      :show-new="showNew"
      :card="newsItem"
      @show-news-dialog="showNew = false"
    />
  </v-card>
</template>

<script>
    import NewsModal from "./NewsModal";
    export default {
        name: "NewsPageCard",
        components: {NewsModal},
        props: {
            newsItem: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                showNew: false,
            }
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

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style scoped>

  .news__image {
    height: 150px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .news__image-background {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    /*background: linear-gradient(180deg, rgba(255, 255, 255, 0) 29.69%, rgba(0, 0, 0, 0.5) 86.98%);*/
  }

  .news__title {
    word-break: normal;
  }

  .news__subtitle {
    height: 101px;
    white-space: normal;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }

</style>