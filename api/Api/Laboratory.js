export default (Request) => {
  return {
      all: async () => {
            return await Request(`laboratories/`).get();
      },
  };
}