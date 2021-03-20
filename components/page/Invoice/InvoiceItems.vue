<template>
  <div class="mt-6">
    <v-simple-table
      v-if="invoiceItems.length && !$helpers.isMobile()"
      fixed-header
      :class="$helpers.isMobile() ? 'mx-n6' : ''"
      :style="$helpers.isMobile() ? 'max-width: unset;' : ''"
      max-height="500px"
    >
      <template
        v-if="!$helpers.isMobile()"
        v-slot:default
      >
        <thead>
          <tr>
            <th class="text-left">
              Позиция
            </th>
            <th class="text-left">
              Вид номенклатуры
            </th>
            <th class="text-left">
              Кол-во
            </th>
            <th class="text-left">
              Ед. измерения
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item,key) of invoiceItems"
            :key="key"
          >
            <td>{{ item.title }}</td>
            <td v-if="item.type">
              {{ item.type.title }}
            </td>
            <td v-else>
              -
            </td>
            <td>{{ item.count }}</td>
            <td>{{ item.basename.title }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-data-table
      v-else
      mobile-breakpoint="0"
      :headers="mobile_headers"
      :items="invoiceItems"
      hide-default-footer
      class="elevation-0 mx-n6 invoices-table"
    >
      <template #item.count="{item}">
        {{ item.count }} шт.
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: "InvoiceItems",
    props: {
      invoiceItems: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        mobile_headers: [
          {text: 'Номенклатура', value: 'title', sortable: false},
          {text: 'Количество', value: 'count', sortable: false},
        ]
      }
    }
  };
</script>

<style>
  .invoices-table {
    max-width: unset !important;
  }
  .invoices-table thead>tr>th:first-child,
  .invoices-table tbody>tr>td:first-child {
    padding-left: 24px !important;
  }
  .invoices-table thead>tr>th:last-child,
  .invoices-table tbody>tr>td:last-child {
    padding-right: 24px !important;
  }
</style>

<style scoped>

</style>