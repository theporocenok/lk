export default (Request) => {
  return {
      saveComment: async (id, data) => {
            return await Request(`invoices/${id}/comment`).post(data);
      },
      page: async (id) => {
            return await Request(`invoices/${id}/`).get();
      },
  };
}
