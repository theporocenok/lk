export default (Request) => {
  return {
    delete: async (id) => {
      return await Request(`media/${id}`).delete();
    },
  };
}
