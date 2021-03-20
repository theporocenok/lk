import Request from "../api/Request";
import Api from "../api/Api";
import ModelsAdmin from "../api/ModelsAdmin";
import ModelsUser from "../api/ModelsUser";


export default ({app, $axios}, inject) => {
  const {locale} = app.i18n;
  $axios.create({});
  $axios.defaults.headers.common['Accept-Locale'] = locale;
  // $axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  $axios.setBaseURL(process.env.API_HOST);

  const collectionResources = {
    admin: {},
    user: {},
    api: {}
  };

  const request = Request($axios, app);
  const api = loadApi(collectionResources.api, Api(request));
  const admin = loadApi(collectionResources.admin, ModelsAdmin(request));
  const user = loadApi(collectionResources.user, ModelsUser(request));

  inject('request', request);
  inject('admin', collectionResources.admin);
  inject('user', collectionResources.user);
  inject('api', collectionResources.api);
}

const loadApi = (obj, resources) => {

  _.forEach(resources, (resource, key) => {
    obj[key] = resource;
  });
  return obj;
};
