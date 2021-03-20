<template>
  <v-layout
    justify-space-between
    align-center
    class="mr-5"
    style="min-width: 120px;max-width: 120px;"
  >
    <div>
      {{ translate(field.label) }}
    </div>

    <template v-if="field.label_icon">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            small
            icon
            v-on="on"
          >
            <v-icon small>
              {{ field.label_icon }}
            </v-icon>
          </v-btn>
        </template>
        <div style="max-width:350px;">
          {{ translate(field.label_tootlip) }}
        </div>
      </v-tooltip>
    </template>
  </v-layout>
</template>

<script>
    export default {
        name: "CrudTooltip",
        props: {
            field: {
                type: [Object,Array],
                default: () => {
                    return {}
                },
            },
        },
        data() {
            return {}
        },
        methods: {
            translate(value) {
                return this.$te(value) ? this.$t(value) : value;
            },
        },
    }
</script>

<style scoped>

</style>