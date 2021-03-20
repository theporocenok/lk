<template>
  <v-layout justify-end>
    <v-btn
      text
      href="/storage/instructions/instruction.pdf"
      target="_blank"
    >
      Инструкция
    </v-btn>
    <v-btn
      text
      @click="logout"
    >
      <v-icon>mdi-logout</v-icon>
      Выход
    </v-btn>
  </v-layout>
</template>

<script>
  // import EquipmentFilter from "../page/EquipmentFilter";
  
  export default {
    name: "HeaderMenu",
    components: {
      // EquipmentFilter
    },
    data() {
      return {};
    },
    computed: {
        toggleDrawler: {
            get() {
                return this.$store.state.showDrawler;
            },
            set(v) {
                this.$store.commit('setShowDrawler', v);
            }
        },
    },
    mounted() {
    
    },
    methods: {
        logout() {
            this.toggleDrawler = false;
            this.$api.Auth.logout();
            return this.$auth.logout();
        },
    }
  };
</script>

<style scoped>

</style>