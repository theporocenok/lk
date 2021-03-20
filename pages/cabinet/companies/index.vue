<template>
  <div>
    <SortFilterTitle
      title="Мои компании"
      :show-filters-btn="false"
      :show-sort-btn="false"
      show-add-btn
      @toggle-sort="showSort = !showSort"
      @toggle-filters="showFilters = !showFilters"
      @add-action="$store.commit('setRequestDialog', true)"
    />

    <UserCompanies
      :show-sort="showSort"
    />
  </div>
</template>>

<script>
    import UserCompanies from "../../../components/page/user/UserCompanies";
    import SortFilterTitle from "../../../components/page/SortFilterTitle";
    export default {
        name: "Index",
        components: {SortFilterTitle, UserCompanies},
      data () {
        return {
          showSort: false,
          showFilters: false,
        }
      },
    }
</script>

<style scoped>

</style>