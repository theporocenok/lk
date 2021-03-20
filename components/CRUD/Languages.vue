<template>
  <v-card>
    <v-tabs
      v-model="selectedTab"
      grow
      show-arrows
      :color="color"
    >
      <v-tabs-slider />
      
      <v-tab
        v-for="language in languages"
        :key="language.value"
        :href="'#' + language.value"
      >
        {{ language.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTab">
      <v-tab-item
        v-for="(language) in languages"
        :key="language.value"
        :value="language.value"
      >
        <v-card
          flat
          tile
        >
          <v-card-text>
            <div
              v-for="(field, i) in formColumns[language.value]"
              :key="`${language.value}-${i}`"
            >
              <v-text-field
                v-if="field.type === 'textField'"
                v-model="field.value"
                :color="color"
                :label="translate(field.label || field.key)"
                @input="createContent"
              />
              <v-textarea
                v-if="field.type === 'textarea'"
                v-model="field.value"
                :color="color"
                :label="translate(field.label || field.key)"
                @input="createContent"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  
  export default {
    props: {
        languageFields: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        langContent: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        translateData: {
            type: [Array, Object],
            required: false,
            default: () => {
                return [];
            }
        },
        color: {
            type: String,
            required: false,
            default: () => {
                return '';
            }
        },
    },
    data: () => ({
      languages,
      selectedTab: false,
      formColumns: []
    }),
    watch: {
      translateData: {
        async handler(val) {
          await setTimeout(() => {
            this.translateData = val;
            this.selectedTab = false;
            this.selectedTab = this.languages[0].value;
          });
          this.createLanguageTabs();
        },
        deep: true
      }
    },
    mounted() {
      this.selectedTab = this.languages[0].value;
      this.createLanguageTabs();
    },
    methods: {
      translate(value) {
        return this.$t(value);
      },
      createLanguageTabs() {
        for (let lang of languages) {
          this.formColumns[lang.value] = _.cloneDeep({...this.languageFields});
          for (let langData in this.translateData[lang.value]) {
            _.map(this.formColumns[lang.value], (el) => {
              if (el.key === langData) {
                el.value = this.translateData[lang.value][langData];
              }
            });
          }
        }
      },
      createContent() {
        let editColumns = this.formColumns;
        let data = [];
        for (let lang of languages) {
          data.push({
            'content': editColumns[lang.value],
            'language_id': lang.language_id
          });
        }
        this.$emit('input', data);
      },
    },
  };
</script>
