<template>
  <v-card
    v-if="news"
    height="100%"
    width="100%"
    outlined
    class="overflow-hidden"
    @click.prevent="showNew = true"
  >
    <div
      :style="`background-image: url(${(news.image)?news.image.url:''}); `"
      class="news__image"
    >
      <v-layout
        column
        class="news__image-background"
      >
        <v-card-title
          v-if="news.title"
          class="pb-0 pt-3 align-start white--text body-2 text-none font-weight-bold news__title overflow-hidden"
        >
          {{ news.title }}
        </v-card-title>
        <v-card-subtitle
          v-if="news.description"
          class="mt-1 py-0 white--text caption text-none news__subtitle overflow-hidden"
          v-html="news.description"
        />
        <v-card-subtitle class="py-0 mt-2 white--text font-weight-bold align-self-end">
          {{ $helpers.convertDate(news.date, 'DD MMMM YYYY') }}
        </v-card-subtitle>
      </v-layout>
    </div>
    <NewsModal
      :show-new="showNew"
      :card="news"
      @show-news-dialog="showNew = false"
    />
  </v-card>
</template>

<script>
    import NewsModal from "./NewsModal";

    export default {
        name: "NewsCard",
        components: {
            NewsModal
        },
        props: {
            news: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                showNew: false,
            }
        },
    }
</script>

<style scoped>

  .news__image {
    height: 100%;
    width: 100%;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .news__image-background {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /*background: linear-gradient(180deg, rgba(255, 255, 255, 0) 29.69%, rgba(0, 0, 0, 0.5) 86.98%);*/
  }

  .news__title {
    word-break: normal;
    min-height: 34px;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }

  .news__subtitle {
    height: 56px;
    white-space: normal;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
</style>