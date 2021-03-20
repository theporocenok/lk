<template>
  <v-snackbar
    v-model="snackBar"
    right
    bottom
    :color="snackBarColor"
    :timeout="5000"
  >
    {{ $t(snackBarText) }}
    <v-btn
      dark
      text
      @click="snackBar = false"
    >
      {{ $t('global.close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
    export default {
        name: "SnackBar",
        data() {
            return {
                snackBarText: '',
                snackBarColor: 'info',
                showSnackBar: false,
            }
        },
        computed: {
            snackBar: {
                get() {
                    return this.$store.state.snackState.showSnackBar;
                },
                set(v) {
                    this.$store.commit('setSnackParams', v);
                    this.$store.commit('setSnackShow', false);
                }
            },
        },
        created() {
            this.$store.watch(state => state.snackState.showSnackBar, () => {
                const show = this.$store.state.snackState.showSnackBar;
                if (show === true) {
                    this.showSnackBar = true;
                    this.snackBarText = this.$store.state.snackState.snackBarText;
                    this.snackBarColor = this.$store.state.snackState.snackBarColor;
                }
            })
        },
        mounted() {
            // this.loadData();
        },
        methods: {
            // async loadData(){
            //     let {data} = (await this.$admin.SettingGroups.methods.all()).data;
            // },
        },

    }
</script>

<style scoped>

</style>