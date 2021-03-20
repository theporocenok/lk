<template>
  <div>
    <div class="headline">
      Страница Компании
    </div>

    <Company :company-id="this.$route.params.company_id" />

    <div class="mt-5">
      <div class="headline mb-3">
        Ваши коллеги
      </div>
      <CompanyUsers
        :show-admin="false"
        :hide-default-footer="false"
        :company-id="this.$route.params.company_id"
      />
    </div>

    <div class="mt-5">
      <div class="headline mb-3">
        Счета
      </div>
      <CompanyInvoices
        :show-filters="false"
        :hide-default-footer="false"
        :company-id="this.$route.params.company_id"
      />
    </div>

    <div class="mt-5">
      <div class="headline mb-3">
        Договора
      </div>
      <CompanyOrders
        :show-admin="false"
        :hide-default-footer="false"
        :company-id="this.$route.params.company_id"
      />
    </div>
  </div>
</template>>

<script>
    import Company from "../../../../components/page/Company/Company";
    import CompanyUsers from "../../../../components/page/Company/CompanyUsers";
    import CompanyInvoices from "../../../../components/page/Company/CompanyInvoices";
    import CompanyOrders from "../../../../components/page/Company/CompanyOrders";
    export default {
        name: "Index",
        components: {CompanyOrders, CompanyInvoices, CompanyUsers, Company}
    }
</script>

<style scoped>

</style>