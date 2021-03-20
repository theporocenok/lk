export default (Request) => {
  return {
    register: async (email, password, password_confirmation) => {
      return await Request('sign-up').post({
        email,
        password,
        password_confirmation
      });
    },
    login: async (email, password) => {
      return await Request('sign-in/login').post({
        email,
        password
      });
    },
    me: async () => {
      return await Request(`account/me`).get();
    },
    logout: async () => {
      return await Request(`account/logout`).get();
    },



    forgot: async ({email,phone}) => {
      return await Request('account/forgot-password').post({
        email,
        phone
      });
    },
    restore: async ({email, phone, code, password, password_confirmation}) => {
      return await Request('account/restore-password').post({
        email,
        phone,
        code,
        password,
        password_confirmation
      });
    },


  };

}
