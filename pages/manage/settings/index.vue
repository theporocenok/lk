<template>
  <div>
    <v-tabs
      v-model="tab"
      align-with-title
      :color="$config.defaultColor"
    >
      <v-tabs-slider :color="$config.defaultColor" />
    
      <v-tab>
        Основные
      </v-tab>
      <v-tab>
        Уведомления
      </v-tab>
    </v-tabs>
    <v-card
      elevation="0"
      outlined
    >
      <v-card-text>
        <v-tabs-items
          v-model="tab"
        >
          <v-tab-item>
            <v-tabs
              v-model="selectedGroup"
              align-with-title
              :color="$config.defaultColor"
            >
              <v-tabs-slider :color="$config.defaultColor" />
    
              <v-tab
                v-for="group in groups"
                :key="group.id"
              >
                {{ group.title }}
              </v-tab>
            </v-tabs>
            <v-select
              v-if="false"
              v-model="selectedGroup"
              :items="groups"
              item-value="id"
              item-text="title"
              class="col-sm-3 col-xs-12 mt-3"
              label="Группа настроек"
            />
            <v-card
              elevation="0"
              outlined
            >
              <v-card-text class="pa-2">
                <Crud
                  :show-title="false"
                  :model="$admin.Setting"
                  :query-options="{group_id: selectedGroupIndex}"
                >
                  <template #item.value="{item}">
                    <v-layout justify-start>
                      <template v-if="item.files && item.files.length">
                        <div
                          v-for="file of item.files"
                          :key="file.id"
                        >
                          <v-img
                            v-if="file.sizes && file.sizes.length"
                            :src="file.sizes[0].url"
                            width="50"
                            height="50"
                          />
                        </div>
                      </template>
                      <span
                        :class="['d-inline-block', 'text-truncate', {'max400px':getWindowWidth>=500}, {'max150px':getWindowWidth<500}]"
                      >
                        {{ stripTags(item.value) }}
                      </span>
                    </v-layout>
                  </template>
                </Crud>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-tabs
              v-model="selectedUserAdminNotifyGroup"
              align-with-title
              :color="$config.defaultColor"
            >
              <v-tabs-slider :color="$config.defaultColor" />
              <v-tab
                v-for="group in userAdminNotifyGroups"
                :key="group.id"
              >
                {{ group.title }}
              </v-tab>
            </v-tabs>
  
            <v-card
              elevation="0"
              outlined
            >
              <v-card-text class="pa-2">
                <Crud
                  :model="$admin.UserAdminNotify"
                  :show-title="false"
                  :query-options="{group_id: selectedUserAdminNotifyGroupIndex}"
                  :to-send-options="tab == 1 ? {group_id: selectedUserAdminNotifyGroupIndex} : {}"
                >
                  <template #item.email="{item}">
                    <template v-if="item.email==1">
                      Да
                    </template>
                  </template>
                  <template #item.sms="{item}">
                    <template v-if="item.sms==1">
                      Да
                    </template>
                  </template>
                </Crud>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
    import Crud from '~/components/CRUD/Index';

    export default {
        components: {
            Crud
        },
        data() {
            return {
                groups: [],
                selectedGroup: 0,
                userAdminNotifyGroups: [],
                selectedUserAdminNotifyGroup: 0,
                tab: null,
                tabGeneral: null,
            }
        },
        layout: 'administrator',
        computed: {
            getWindowWidth() {
                return this.$store.state.screenWidth;
            },
            selectedGroupIndex() {
                return this.selectedGroup + 1;
            },
            selectedUserAdminNotifyGroupIndex() {
              return this.selectedUserAdminNotifyGroup + 1;
            }
        },
        mounted() {
            this.loadSettingGroup();
            this.loadUserAdminNotifyGroups();
        },
        methods: {
            async loadSettingGroup(){
                let {data} = await this.$admin.SettingGroup.methods.all();
                // var $this = this;
                this.groups = data.data;
                if(this.selectedGroup==null && this.groups.length ){
                    this.selectedGroup = this.groups[0].id;
                }
                // .map(function(item){
                //     if($this.selectedGroup==null){
                //         $this.selectedGroup = item.id;
                //     }
                // });
            },
            async loadUserAdminNotifyGroups(){
                let {data} = await this.$admin.UserAdminNotifyGroup.methods.all();
                this.userAdminNotifyGroups = data.data;
                if(this.selectedUserAdminNotifyGroup==null && this.userAdminNotifyGroups.length ){
                    this.selectedUserAdminNotifyGroup = this.userAdminNotifyGroups[0].id;
                }
            },
            stripTags(value){
                if(!value) return;
                return value.replace(/<\/?[^>]+>/gi, " ").substr(0,70);
            },
            showUserNotifiesDialog() {

            }
        },
    };
</script>

<style scoped>
  .csm-settings__tab-content {
    
  }
</style>