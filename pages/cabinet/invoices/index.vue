<template>
  <div>
    <SortFilterTitle
      title="Ваши счета"
      :count-filters="countFilters"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />

    <UserInvoices
      :show-sort="showSort"
      :show-filters="showFilters"
      @hide-filters="showFilters = false"
      @change-count-filters="(count) => {countFilters = count}"
    />
  </div>
</template>

<script>
    import UserInvoices from "../../../components/page/user/UserInvoices";
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    export default {
        name: "Index",
        components: {SortFilterTitle, UserInvoices},
        data () {
            return {
                showSort: false,
                showFilters: false,
                countFilters: 0,
            }
        },
        methods:{
        }
    }
</script>

<style scoped>

</style>