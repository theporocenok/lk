<template>
  <v-form>
    <v-layout>
      {{ form }}
      <v-text-field
        v-model="form.title"
        class="mr-2"
      />
      <v-text-field v-model="form.equipment_manufacture_id" />
    </v-layout>
    <v-btn
      v-if="form.id"
      @click="updated(update)"
    >
      Обновить
    </v-btn>
    <v-btn
      v-else
      @click="created(create)"
    >
      Создать
    </v-btn>
  </v-form>
</template>

<script>
  export default {
    name: "ExampleForm",
    props: {
      // eslint-disable-next-line vue/require-default-prop
      update: Function,
      // eslint-disable-next-line vue/require-default-prop
      create: Function,
      // eslint-disable-next-line vue/require-default-prop
      items: Object,
    },
    data() {
      return {
        form: {}
      };
    },
    mounted() {
      this.form = this.items;
    },
    methods: {
      updated(update) {
        update(this.form);
      },
      created(create) {
        create(this.form);
      }
    }
  };
</script>

<style scoped>

</style>