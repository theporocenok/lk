<template>
  <div>
    <div
      class="actuals__title body-1 text-none font-weight-bold mb-3"
    >
      <v-layout
        justify-space-between
        align-center
      >
        <div class="pa-4 headline black--text">
          Новости
        </div>
        <div class="news__top__buttons mr-3">
          <v-btn
            :min-width="$helpers.isMobile() ? 'unset' : ''"
            :width="$helpers.isMobile() ? '36' : ''"
            color="#006e4c"
            depressed
            outlined
            class="news__top__buttons__swiper__button-prev mr-3"
          >
            <v-icon>
              arrow_back
            </v-icon>
          </v-btn>
          <v-btn
            :min-width="$helpers.isMobile() ? 'unset' : ''"
            :width="$helpers.isMobile() ? '36' : ''"
            color="#006e4c"
            depressed
            outlined
            class="news__top__buttons__swiper__button-next"
          >
            <v-icon>
              arrow_forward
            </v-icon>
          </v-btn>
        </div>
      </v-layout>
    </div>
    <div :class="`actuals ${!$helpers.isMobile() ? 'mr-n3' : ''}`">
      <swiper
        ref="newsSwiper"
        class="swiper-container"
        :options="swiperOptions"
      >
        <swiper-slide
          v-for="(item, index) in news"
          :key="index"
          :item="item"
          class="actuals-item mr-3"
        >
          <NewsCard
            :news="item"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
    import NewsCard from "./NewsCard";
    import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
    import 'swiper/css/swiper.css'

    export default {
        name: "NewsList",
        components: {
            NewsCard,
            Swiper,
            SwiperSlide,
        },
        directives: {
            swiper: directive
        },
        data() {
            return {
                news: [],
                swiperOptions: {
                    slidesPerView: 'auto',
                    navigation: {
                        nextEl: '.news__top__buttons__swiper__button-next',
                        prevEl: '.news__top__buttons__swiper__button-prev'
                    }
                },
            }
        },
        computed: {
            swiper() {
                return this.$refs.newsSwiper.$swiper
            }
        },
        watch: {
            news(){
                
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async loadData(){
              try{
                let {data} = (await this.$api.News.get(10)).data;
                this.news = data.news;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при получении списка новостей',
                  color: 'error'
                });
              }
            },
            swipEvent(e) {
                console.log(e);
            }
        },

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style>

</style>

<style scoped>
  .actuals__title {
    color: #333333;
  }

  .actuals a {
    text-decoration: inherit;
  }

  .actuals-item {
    width: 30%;
    border-radius: 4px;
    overflow: hidden;
    min-width: 50px;
    height: 140px;
  }

  @media screen and (max-width: 950px) {
    .actuals-item {
      width: 40%;
    }
  }

  @media screen and (max-width: 700px) {
    .actuals-item {
      width: 80%;
    }
  }

</style>