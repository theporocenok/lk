export default (Request, baseRoute = null) => {
  if(!baseRoute) return null;

  return (model_path) => {
    const routeToModel = `${baseRoute}${model_path}`;
    return {
      async all(params) {
        params = _.assign(params, {'all': ''});
        return await Request(`${routeToModel}`).get(params);
      },
      async paginate(params) {
        return await Request(routeToModel).get(params);
      },
      async find(id) {
        return await Request(`${routeToModel}/${id}`).get();
      },
      async create(data) {
        return await Request(routeToModel).post(data);
      },
      async update(id, data) {
        return await Request(`${routeToModel}/${id}`).put(data);
      },
      async delete(id, data) {
        return await Request(`${routeToModel}/${id}`).delete(data);
      },
      async languages(id) {
        return await Request(`${routeToModel}/${id}/languages/`).get();
      },
      request(path){
        return Request(`${routeToModel}/${path}`);
      }
    };
  };
}
