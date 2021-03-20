export default (Request) => {
  return {
      updateProfile: async (user_id, data) => {
            return await Request(`users/${user_id}/personals`).post(data);
      },
      updateContactsComment: async (data) => {
            return await Request(`users/profile/contactsComment`).post(data);
      },
      newPassword: async (user_id, data) => {
            return await Request(`users/${user_id}/newpassword`).post(data);
      },
      profile: async (user_id) => {
            return await Request(`users/${user_id}/profile`).get();
      },
      companies: async (user_id) => {
            return await Request(`users/${user_id}/companies`).get();
      },
      requests: async (user_id) => {
            return await Request(`users/${user_id}/requests`).get();
      },
      find: async (data) => {
          return await Request(`users/find`).post(data);
      },
      listEvent: async (user_id, data) => {
          return await Request(`users/${user_id}/events`).post(data);
      },
      invoices: async (user_id, data) => {
          return await Request(`users/${user_id}/invoices`).post(data);
      },
  };
}
