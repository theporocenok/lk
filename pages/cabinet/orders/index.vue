<template>
  <div>
    <SortFilterTitle
      title="Договоры ваших компаний"
      :count-filters="countFilters"
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
    />


    <div>
      <UserOrders
        :show-sort="showSort"
        :show-filters="showFilters"
        @hide-filters="showFilters = false"
        @change-count-filters="(count) => {countFilters = count}"
      />
    </div>
  </div>
</template>

<script>
    import UserOrders from "../../../components/page/user/UserOrders";
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    export default {
        name: "Index",
        components: {SortFilterTitle, UserOrders},
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