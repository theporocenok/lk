export const SelectDataMixin = {
  data() {
    return {
      citiesData: [],
    };
  },
  methods: {
    async cities() {
      const {data} = (await this.$model.City.methods.all()).data;
      this.citiesData = data;
    },
  }
};