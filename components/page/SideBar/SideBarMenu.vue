<template>
  <div>
    <template v-if="$auth.loggedIn">
      <template v-for="item in menu">
        <SideBarMenuItem
          v-if="checkShowLink(item) && (!item.submenu || !item.submenu.length)"
          :key="item.id"
          :item="item"
        />
      
        <template v-if="item.submenu && item.submenu.length">
          <v-list-group
            :key="item.id"
            :value="false"
            class="menu__submenu"
            color="#fff"
          >
            <template
              v-slot:prependIcon
              class="mr-0"
            >
              <v-list-item-icon class="ma-0">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
            </template>
            <template v-slot:activator>
              <v-list-item-title>
                <template v-if="item.translate">
                  {{ $t(item.translate) }}
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
              </v-list-item-title>
            </template>
            <template
              v-for="(subItem) in item.submenu"
            >
              <SideBarMenuItem
                :key="subItem.id"
                :item="subItem"
                sub
              />
            </template>
          </v-list-group>
        </template>
      </template>
    </template>
  </div>
</template>

<style>
  .grouping__menu{
    position: relative;
  }
  .loader{
    height: 4px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .grouping__menu .v-treeview-node__label{
    font-size: 12px;
  }
  .grouping__menu .v-treeview-node--leaf{
    margin-left: 10px !important;
  }
  .grouping__menu .v-treeview-node{
    margin-left: 10px;
  }

  .menu__submenu .v-list-group__header__prepend-icon {
    margin-right: 8px !important;
  }

</style>

<script>
  import MenuUser from "../../../api/MenuUser";
  import MenuAdmin from "../../../api/MenuAdmin";
  import SideBarMenuItem from "./SideBarMenuItem";

  export default {
    name: 'SideBarMenu',
      components: {SideBarMenuItem},
      data() {
      return {
        menu: []
      };
    },
    computed: {
        check_approved(){
            return this.$auth.user.approved;
        },
        check_role(){
            return this.$auth.user.role_id;
        }
    },
    mounted() {
        this.chooseMenu();
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
      showProfile(item) {
        if (this.$helpers.isMobile() && item.path == '/cabinet/') {
          return false;
        }
        return true;
      },
      chooseMenu(){
          if( !this.$auth.loggedIn ) {
              return setTimeout(()=> {
                  this.chooseMenu();
              }, 500);
          }

          this.menu = this.$auth.user.role_id == 1 ? MenuAdmin(this.$admin) : MenuUser();
      }
    },
    
  };
</script>
