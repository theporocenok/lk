<template>
  <div class="container">
    <h1>
      <template v-if="error.statusCode === 404">
        Страница не найдена
      </template>
      <template v-else>
        Ошибка :(
      </template>
    </h1>
    <nuxt-link to="/">
      На главную
    </nuxt-link>
  </div>
</template>

<script>
    export default {
      props: {
          error: {
              type: Object,
              default: () => {
                  return {
                      statusCode: 400
                  }
              }
          }
      }
        // layout: 'blog' // you can set a custom layout for the error page
    }
</script>