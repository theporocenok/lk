<template>
  <v-row
    v-if="!$helpers.isMobile() || showFilters"
    class="ma-0 pa-0"
  >
    <v-col :class="`mx-0 ${$helpers.isMobile() ? 'pl-0 pr-1 pt-0' : 'px-0'}`">
      <v-btn
        :color="`${$helpers.isMobile() ? $config.defaultColor : ''}`"
        :dark="$helpers.isMobile()"
        :width="`${$helpers.isMobile() ? '100%' : ''}`"
        :class="`mt-2`"
        height="41px"
        @click="$emit('refresh')"
      >
        Поиск
      </v-btn>
    </v-col>
    <v-col
      v-if="$helpers.isMobile()"
      class="mx-0 pr-0 pl-1 pt-0"
    >
      <v-btn
        :color="`${$helpers.isMobile() ? $config.defaultColor : ''}`"
        :dark="$helpers.isMobile()"
        :width="`${$helpers.isMobile() ? '100%' : ''}`"
        outlined
        height="41px"
        class="mt-2 py-2"
        @click="$emit('hide-filters')"
      >
        <v-icon class="mr-1">
          mdi-filter-outline
        </v-icon>
        Скрыть фильтры
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "SearchFiltersBtn",
    props: {
      showFilters: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {}
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>