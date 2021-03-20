export default (Request) => {
  return {
      calc: async (data) => {
            return await Request(`mailing/calc`).post(data);
      },
  };
}
