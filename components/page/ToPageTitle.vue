<template>
  <v-layout
    justify-space-between
    align-center
    :class="`${$helpers.isMobile() ? '' : 'mb-5'}`"
  >
    <span :class="`${$helpers.isMobile() ? 'headline' : 'display-1' } text--primary`">{{ title }}</span>
    <v-btn
      v-if="!hideBtn && !!link && $helpers.isMobile()"
      outlined
      :color="$config.defaultColor"
      min-width="0"
      width="34"
      height="34"
      class="pa-1 mr-2"
      :to="localePath(link)"
    >
      <v-icon
        :color="$config.defaultColor"
      >
        mdi-arrow-right
      </v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
  export default {
    name: "ToPageTitle",
    props: {
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: false,
      },
      hideBtn: {
        type: Boolean,
        default: false,
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