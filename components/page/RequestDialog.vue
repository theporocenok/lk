<template>
  <div>
    <TcsmDialog
      :dialog="dialog_request"
      persistent
      max-width="600"
      default-slot
      @close-dialog="closeRequestCompanyDialog"
    >
      <template v-slot:default>
        <RequestCompany
          :user="$auth.user"
          :show-window="dialog_request"
          @hideDialog="closeRequestCompanyDialog"
        />
      </template>
    </TcsmDialog>
  </div>
</template>

<script>
    import RequestCompany from "./user/RequestCompany";
    import TcsmDialog from "./Dialogs/tcsmDialog";
    export default {
        name: "RequestDialog",
        components: {TcsmDialog, RequestCompany},
        data() {
            return {
                dialog_request: false,
            }
        },
        computed: {
            requestDialog() {
                return this.$store.state.requestDialog;
            },
        },
        watch: {
            requestDialog(newValue) {
                if(newValue){
                this.dialog_request = newValue;
                    this.$store.commit('setRequestDialog', false);
                }
            }
        },
        mounted() {

        },
        methods: {
            closeRequestCompanyDialog(){
                this.dialog_request = false;
            },
        },

        // layout: 'guest',
        // layout: 'manage',
    }
</script>

<style scoped>

</style>