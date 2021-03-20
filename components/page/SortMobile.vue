<template>
  <v-expand-transition>
    <v-row
      v-if="$helpers.isMobile() && showSort"
      class="mx-1"
    >
      <v-col
        :class="`${$helpers.isMobile() ? 'pb-0' : ''}`"
      >
        <v-select
          v-model="sortBy"
          :items="sortByList"
          item-value="key"
          item-text="label"
          :item-color="$config.defaultColor"
          outlined
          :color="$config.defaultColor"
          label="Сортировать по"
          full-width
          @change="$emit('refresh', sortBy)"
        />
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script>
  export default {
    name: "SortMobile",
    props: {
      sortByList: {
        type: Array,
        required: true,
      },
      showSort: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    data() {
      return {
        sortBy: null,
      }
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