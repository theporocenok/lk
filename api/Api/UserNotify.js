export default (Request) => {
  return {
      get: async (user_id) => {
          return await Request(`user-notifies/${user_id}`).get();
      },
      save: async (user_id, data) => {
          return await Request(`user-notifies/${user_id}`).post(data);
      },
  };
}
