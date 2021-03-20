export default (Request) => {
  return {
      newRequest: async (data) => {
            return await Request(`user-requests/new`).post(data);
      },
      processRequest: async (id, data) => {
            return await Request(`user-requests/${id}/process/`).post(data);
      },
      countRequest: async () => {
            return await Request(`user-requests/countRequest/`).get();
      },
  };
}
