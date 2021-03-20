export default (Request) => {
  return {
      searchText: async (text) => {
            return await Request(`service-devices/search`).get({searchText: text,  withCost: true});
      },
      find: async (id) => {
            return await Request(`service-devices/search`).get({filterId: id});
      },
  };
}