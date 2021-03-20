<template>
  <v-list-item
    class="white--text"
    color="#fff"
    :to="item.path"
    :href="item.href"
    :target="item.target"
  >
    <v-list-item-icon :class="`${(sub)?'ml-4':''} mr-2`">
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-title>
      <template v-if="item.translate">
        {{ $t(item.translate) }}
      </template>
      <template v-else>
        {{ item.name }}
      </template>
    </v-list-item-title>
    <v-list-item-icon v-if="item.right_number && $store.state.userRequests">
      {{ $store.state.userRequests }}
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
    export default {
        name: "SideBarMenuItem",
        props: {
            item: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            sub: {
                type: Boolean,
                default: () => {
                    return false;
                }
            }
        },
        data() {
            return {}
        },
        computed: {
        },
        mounted() {
            // this.loadData();
        },
        methods: {
            checkShowLink(link){
                if(!link.needApproved){
                    return true;
                }

                if(this.check_role==1){
                    return true
                }

                if(this.check_approved==1){
                    return true
                }

                return false;
            },
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