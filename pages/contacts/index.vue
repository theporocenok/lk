<template>
  <div class=" pa-4">
    <div class="headline mb-4">
      Контакты Тюменского ЦСМ
    </div>


    <v-row>
      <v-col
        class=""
        cols="12"
        sm="5"
        xs="12"
      >
        <div>ФБУ «Тюменский ЦСМ» - один из крупнейших региональных центров стандартизации, метрологии и испытаний в системе Федерального агентства по техническому регулированию и метрологии (Росстандарт).<br></div>





        <v-list two-line>
          <template v-for="item in contacts">
            <v-layout
              :key="item.title"
              align-center
              class="mt-3"
            >
              <div
                class="ma-3"
                :style="[{'background-color':defaultColor}]"
              >
                <v-icon
                  x-large
                  dark
                  class="ma-3"
                  v-text="item.icon"
                />
              </div>
              <v-list-item-content class="ma-3">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle v-html="item.subtitle" />
              </v-list-item-content>
            </v-layout>
          </template>
        </v-list>
      </v-col>
      <v-col
        class="d-flex pb-0"
        cols="12"
        sm="7"
        xs="12"
        style="position: relative;"
      >
        <script
          type="text/javascript"
          charset="utf-8"
          async
          src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A44c1ef105a822309796eeadcf686923b5c8a51446d312f41e995d7782c4766d8&amp;width=100%25&amp;height=600&amp;lang=ru_RU&amp;scroll=false"
        />
        <div
          v-if="$helpers.isMobile()"
          class="position-absolute"
          style="position: absolute; z-index: 3; top: 0; right: 0; bottom: 0; left: 0;"
        />
      </v-col>
    </v-row>


    <div
      v-if="show_comment"
      class="mt-2"
    >
      <v-textarea
        v-model="user.contacts_comment"
        outlined
        label="Мои заметки"
        :color="$config.defaultColor"
        max-width="100%"
        auto-hide
        @change="changeComment"
      />
    </div>
  </div>
</template>

<script>
    export default {
        name: "Index",
        data(){
            return {
                defaultColor: '#006e4c',
                contacts_timer: false,
                show_comment: false,
                contacts_comment: '',
                user: {
                    contacts_comment: '',
                },
                contacts: [
                    {
                        icon:'mdi-map-marker',
                        title: 'Адрес',
                        subtitle: '625027, г.Тюмень,  ул.Минская, д.88',
                    },
                    {
                        icon:'mdi-phone',
                        title: 'Телефон',
                        subtitle: '+7 (3452) 20-62-95',
                    },
                    {
                        icon:'mdi-at',
                        title: 'Email',
                        subtitle: 'mail@csm72.ru',
                    },
                    {
                        icon:'mdi-at',
                        title: 'Режим работы',
                        subtitle: 'Пн. – Чт.: с 8:00 до 17:20<br>' +
                            'Обед: с 12:30 до 13:20<br>' +
                            'Пт: с 8:00 до 14:00 (без обеда)<br>' +
                            'Сб. - Вс.: выходные',
                    }
                ],
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async getMe() {
              try{
                const {data} = (await this.$api.Auth.me()).data;
                this.$auth.setUser(data);
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при загрузки информации о пользователе',
                  color: 'error'
                });
              }
            },
            async loadData(){
                await this.getMe();
                this.user = Object.assign({}, this.$auth.user);
                this.show_comment = true;
            },
            async saveComment(){
                // this.comment
              try{
                await this.$api.User.updateContactsComment({contacts_comment:this.user.contacts_comment});
                this.editComment = false;
              }catch{
                this.$store.commit('setSnackParams', {
                  text: 'Ошибка при updateContactsComment',
                  color: 'error'
                });
              }
            },
            changeComment(){
                clearTimeout(this.contacts_timer);
                this.contacts_timer = setTimeout(() => {
                    this.saveComment();
                }, 1000);
            }
        },
    }
</script>

<style scoped>

</style>