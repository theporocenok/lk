export default (Request) => {
  return {
      list: async (data) => {
            return await Request(`orders/list`).post(data);
      },
  };
}
