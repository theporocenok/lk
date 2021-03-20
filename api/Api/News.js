export default (Request) => {
  return {
      get: async ( count ) => {
            return await Request(`news/${count}`).get();
      },
  };
}
