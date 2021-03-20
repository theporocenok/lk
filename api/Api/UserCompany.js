export default (Request) => {
  return {
      link: async (user_id, company_id, userpost) => {
            return await Request(`user-companies/link/`).post({user_id:user_id,company_id:company_id, userpost:userpost});
      },
      unlink: async (user_id, company_id) => {
            return await Request(`user-companies/unlink/`).post({user_id:user_id,company_id:company_id});
      },
  };
}
