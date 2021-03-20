export default (Request) => {
  return {
    sendApplication: async (data) => {
      return await Request(`mailer/application`).post(data);
    },
  };
}
