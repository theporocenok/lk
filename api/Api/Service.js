export default (Request) => {
  return {
      getCosts: async () => {
            return await Request(`services/costs`).get();
      },
      getTypes: async () => {
            return await Request(`services/types`).get();
      },
      getCoefficients: async () => {
            return await Request(`services/coefficients`).get();
      },
      findServices: async (text) => {
        return await Request(`services/search`).get({searchText: text, withCost: true});
      },
      getByDevice: async (id) => {
        return await Request(`services/device/${id}/`).get({ withCost: true});
      },
  };
}
