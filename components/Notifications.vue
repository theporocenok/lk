<template>
  <div>
    <v-dialog
      v-model="dialog"
      :opened="dialogOpened"
      max-width="600"
      max-height="400"
    >
      <v-card>
        <v-card-title class="headline">
          <template v-if="countNotifications > 0">
            Показано {{ items.length }} событий
            <template v-if="countNotifications > items.length">
              из {{ countNotifications }}
            </template>
          </template>
          <template v-else>
            <div class="pa-5">
              Новых уведомлений нет
            </div>
          </template>
        </v-card-title>
        
        <v-card-text style="max-height:calc(100vh - 250px);overflow:auto;">
          <template v-if="dialog && countNotifications > 0">
            <v-list
              dense
              style="max-height:600px;overflow-y: auto;"
            >
              <template v-for="(item, index) in items">
                <v-subheader
                  v-if="item.header"
                  :key="index"
                  v-text="item.header"
                />
                
                <v-divider
                  v-else-if="item.divider"
                  :key="index"
                  :inset="item.inset"
                />
                
                <v-list-item
                  v-else
                  :key="item.id"
                  class="pa-0"
                  color="#3f4d67"
                >
                  <v-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-avatar>
                  <v-flex fill-height>
                    <v-flex
                      fill-height
                      column
                      style="text-align:center; font-size:12px; max-width:80px;"
                    >
                      {{ item.formatted_created_at }}
                    </v-flex>
                    <v-list-item>
                      <v-hover
                        v-slot:default="{ hover }"
                        close-delay="150"
                      >
                        <v-layout>
                          <v-flex>
                            <v-list-item-title
                              @click="goTo('object', item.object_id, 'monitoring')"
                            >
                              <v-btn
                                text
                                small
                                class="pa-0"
                              >
                                {{ item.object_title }}
                              </v-btn>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.event_title }}: <b>{{ item.history_value }}</b>
                            </v-list-item-subtitle>
                          </v-flex>
                          <v-flex v-show="hover || getWindowWidth < 1000">
                            <v-layout justify-end>
                              <v-btn
                                small
                                text
                                icon
                                color="green"
                                title="Нажмите, чтобы скрыть событие"
                                @click="readOne(item.id)"
                              >
                                <v-icon>mdi-email-mark-as-unread</v-icon>
                              </v-btn>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-hover>
                    </v-list-item>
                  </v-flex>
                </v-list-item>
              </template>
            </v-list>
          </template>
        </v-card-text>
        
        <v-card-actions v-if="countNotifications > 0">
          <v-spacer />
          <v-btn
            text
            color="orange"
            @click="goTo('group', 1, 'events')"
          >
            Смотреть остальные
          </v-btn>
          <v-btn
            text
            color="green"
            small
            class="ml-2"
            @click="readAll"
          >
            Скрыть все
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Event from '../api/models/Events';
  
  export default {
    data: () => ({
      dialog: false,
      notificationsMenu: false,
      items: [],
      countNotifications: 0,
      actionInterval: false,
    }),
    computed: {
      dialogOpened() {
        return this.$store.getters.getNotificationsOpenDialog;
      },
      getWindowWidth() {
        return this.$store.state.screenWidth;
      },
    },
    watch: {
      dialogOpened(newValue) {
        this.dialog = newValue;
      },
      dialog(newValue) {
        this.$store.commit('openedNotificationsDialog', newValue);
      },
    },
    mounted() {
      this.getNotifications();
    },
    destroyed() {
      clearInterval(this.actionInterval);
      this.actionInterval = false;
    },
    methods: {
      goTo(type = 'object', objectId, page = 'monitoring') {
        let route = {};
        switch (type) {
          case 'object':
            route = {
              id: objectId,
              type: 'object',
            };
            break;
          case 'group':
            route = {
              group_id: objectId,
              type: 'group',
            };
            break;
        }
        
        this.$store.commit('setRoute', route);
        this.$router.push(`/${type}/${objectId}/${page}`);
        this.close();
      },
      close() {
        this.notificationsMenu = false;
      },
      openDialog() {
        this.dialog = true;
      },
      async getNotifications() {
        const data = await Event.methods.getNotifications();
        this.parseNotifications(data);
        
        this.actionInterval = setTimeout(async () => {
          await this.getNotifications();
        }, 15000);
      },
      async readAll() {
        const data = await Event.methods.readAll();
        this.parseNotifications(data);
        this.close();
      },
      async readOne(id) {
        const data = await Event.methods.readOne(id);
        this.parseNotifications(data);
      },
      parseNotifications({count, notifications}) {
        this.$store.commit('setNotificationsCount', count);
        this.countNotifications = count;
        this.items = notifications;
      },
    },
  };
</script>

<style scoped></style>
