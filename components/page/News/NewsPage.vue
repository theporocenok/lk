<template>
  <div>
    <div class="pa-4 headline black--text">
      Новости
    </div>
    <v-layout wrap>
      <template v-if="!$helpers.isMobile()">
        <v-col
          v-for="newsItem in news"
          :key="newsItem.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="pa-2 mb-2"
        >
          <NewsPageCard :news-item="newsItem" />
        </v-col>
      </template>
      <template v-else>
        <v-data-table
          hide-default-header
          hide-default-footer
          mobile-breakpoint="0"
          :items="news"
          class="news_table"
        >
          <template #item="{item}">
            <div
              class="py-2 px-6 mb-8"
              style="border-bottom: 1px solid #e5e5e5;"
              @click="newItemToShow = item, showNewDialog = true"
            >
              <div
                class="news_table__title pa-4 mb-4 caption text-none"
                v-html="item.title"
              />
              <div
                class="news_table__text px-4 overline text-none mb-3"
                v-html="item.text.slice(0, 200).concat('...')"
              />
              <v-layout
                justify-space-between
                align-center
                class="px-4"
                :style="`color: ${$config.defaultColor}`"
              >
                <div
                  class="overline text-none"
                  style="letter-spacing: unset !important;"
                >
                  {{ $helpers.convertDateTcsm(item.date) }}
                </div>
                <div
                  class="caption text-none"
                >
                  Подробнее <v-icon :color="$config.defaultColor">
                    mdi-chevron-down
                  </v-icon>
                </div>
              </v-layout>
            </div>
          </template>
          <template
            v-if="$helpers.isMobile()"
            #footer="{props}"
          >
            <v-layout
              v-if="props.pagination.itemsLength > props.pagination.itemsPerPage"
              class="px-2 mt-4"
              align-center
              justify-space-between
              :wrap="false"
            >
              <div class="text-no-wrap caption font-family--rubik mr-3">
                Показывать
              </div>
              <v-select
                v-model="props.options.itemsPerPage"
                hide-details
                :color="$config.defaultColor"
                :items="[5, 10, 15, 50]"
                class="tcsmSelect-mobile font-family--rubik caption mr-2"
                outlined
              />
              <div class="text-no-wrap caption font-family--rubik mr-2">
                {{ props.pagination.pageStart + 1 }}-{{ props.pagination.pageStop }} из {{ props.pagination.itemsLength }}
              </div>
              <v-layout justify-end>
                <v-btn
                  min-width="unset"
                  width="32"
                  height="32"
                  color="#006e4c"
                  depressed
                  outlined
                  class="mr-3"
                  @click="props.options.page - 1 > 0 ? props.options.page-- : props.options.page"
                >
                  <v-icon>
                    arrow_back
                  </v-icon>
                </v-btn>
                <v-btn
                  min-width="unset"
                  width="32"
                  height="32"
                  color="#006e4c"
                  depressed
                  outlined
                  class=""
                  @click="props.options.page + 1 <= props.pagination.pageCount ? props.options.page++ : props.options.page"
                >
                  <v-icon>
                    arrow_forward
                  </v-icon>
                </v-btn>
              </v-layout>
            </v-layout>
          </template>
        </v-data-table>
      </template>
    </v-layout>

    <NewsModal
      :show-new="showNewDialog"
      :card="newItemToShow"
      @show-news-dialog="showNewDialog = false"
    />
  </div>
</template>

<script>
    import NewsPageCard from "./NewsPageCard";
    import NewsModal from "./NewsModal";
    export default {
        name: "NewsPage",
        components: {NewsModal, NewsPageCard},
        props: {
        },
        data() {
            return {
                news: [],
                showNewDialog: false,
                newItemToShow: {}
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async loadData(){
              try {
                let {data} = (await this.$api.News.get(50)).data;
                this.news = data.news;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при получении списка новостей',
                  color: 'error'
                });
              }
            },
        },

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style>
  .news_table .v-data-table__wrapper {
    overflow: hidden;
    max-width: 100%;
  }
  .news_table table,
  .news_table tbody {
    max-width: 100%;
    overflow: hidden;
    display: block;
  }
  .news_table a {
    word-break: break-word;
  }
</style>

<style scoped>
  .news_table__title {
    background-color: #006e4c;
    border-radius: 5px;
    color: #fff;
    letter-spacing: unset !important;
    line-height: 18px;
  }
  .news_table__text {
    color: #858791;
    /*white-space: normal;*/
    /*-webkit-line-clamp: 5;*/
    /*-webkit-box-orient: vertical;*/
    /*display: -webkit-box;*/
    /*overflow: hidden;*/
    letter-spacing: unset !important;
  }
</style>