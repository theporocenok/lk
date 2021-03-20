export default (Request) => {
  return {
    read: async (id) => {
          return await Request(`user-events/${id}/read`).get();
    },
    countEvents: async() => {
      return await Request(`user-events/get-count`).get();
    },
    readEvents: async(count) => {
      return await Request(`user-events/read`).post({count: count});
    },
  };
}
