export default (Request) => {
  return {
    async index(params) {
      return await Request('city-objects/fields').post(params);
    },
    async show(id) {
      return await Request(`city-objects/fields/${id}`).get();
    },
    async create(data) {
      return await Request(`city-objects/fields/create`, {
        'Content-Type': 'multipart/form-data'
      }).post(data);
    },
    async update(id, data) {
      return await Request(`city-objects/fields/${id}`, {
        'Content-Type': 'multipart/form-data'
      }).post(data);
    },
    async delete(id) {
      return await Request(`city-objects/fields/${id}`).delete();
    },
    async getQrCode(id) {
      return await Request(`city-objects/fields/${id}/qrcode/`).get();
    },
    async qrcode(code) {
      return await Request(`city-objects/qrcode/`).get({code});
    },
    async map(filters) {
      return await Request('city-objects/map').get(filters);
    },
  };
};