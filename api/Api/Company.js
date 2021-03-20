export default (Request) => {
  return {
      page: async (id) => {
            return await Request(`companies/${id}`).get();
      },
      companyUsers: async (id) => {
            return await Request(`companies/${id}/users`).get();
      },
      orders: async (company_id, data = '') => {
            return await Request(`companies/${company_id}/orders`).get();
      },
      invoices: async (company_id, data = '') => {
            return await Request(`companies/${company_id}/invoices`).get();
      },
      find: async (data) => {
            return await Request(`companies/find`).post(data);
      },
  };
}
