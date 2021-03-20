<template>
  <v-layout
    align-center
    justify-space-between
  >
    <div :class="`${$helpers.isMobile() ? 'title font-family--rubik' : 'headline'} pa-4`">
      {{ title }}
    </div>
    <div
      v-if="$helpers.isMobile() && (showFiltersBtn || showSortBtn || showAddBtn)"
      class="d-flex mr-3"
    >
      <v-btn
        v-if="showAddBtn"
        :color="$config.defaultColor"
        min-width="0"
        width="28"
        height="28"
        class="pa-1 mr-2"
        elevation="0"
        @click="$emit('add-action')"
      >
        <v-icon
          size="26"
          color="#fff"
        >
          mdi-plus
        </v-icon>
      </v-btn>
      <v-btn
        v-if="showSortBtn"
        outlined
        :color="$config.defaultColor"
        min-width="0"
        width="28"
        height="28"
        class="pa-1 mr-2"
        @click="$emit('toggle-sort')"
      >
        <v-icon
          size="26"
          :color="$config.defaultColor"
        >
          mdi-swap-vertical
        </v-icon>
      </v-btn>
      <template v-if="showFiltersBtn">
        <v-badge
          :content="countFilters"
          :value="countFilters"
          color="#5F616F"
          overlap
          bordered
          offset-x="7"
          offset-y="7"
          class="filter-badge"
        >
          <v-btn
            :outlined="countFilters == 0"
            :color="$config.defaultColor"
            min-width="0"
            width="28"
            height="28"
            class="pa-1"
            @click="$emit('toggle-filters')"
          >
            <v-icon
              size="26"
              :color="countFilters == 0 ? $config.defaultColor : '#fff'"
            >
              mdi-filter-outline
            </v-icon>
          </v-btn>
        </v-badge>
      </template>
    </div>
  </v-layout>
</template>

<script>
  export default {
    name: "SortFilterTitle",
    props: {
      title: {
        type: String,
        required: true,
      },
      showFiltersBtn: {
        type: Boolean,
        default() {
          return true;
        }
      },
      showSortBtn: {
        type: Boolean,
        default() {
          return true;
        }
      },
      showAddBtn: {
        type: Boolean,
        default: false,
      },
      countFilters: {
        type: Number,
        default: 0,
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

    // layout: 'guest',
    // layout: 'manage',
  }
</script>

<style>
  .filter-badge .v-badge__badge {
    height: 17px;
    min-width: 17px;
    font-size: 8px;
  }
</style>

<style scoped>

</style>