export default (Request) => {
  return {
      create: async (data) => {
            return await Request(`company-devices/`).post(data);
      },
      update: async (data) => {
            return await Request(`company-devices/${data.id}/`).put(data);
      },
      delete: async (id) => {
            return await Request(`company-devices/${id}/delete`).post();
      },
  };
}
