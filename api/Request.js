import GetQueryConverterJson from "./GetQueryConverterJson";

const API = 'v1/';


export default function (axios, app) {
  const RequestCycle = async ({url, method, data = null, headers = null, responseType = null}) => {
    try {
      return await axios({
        method,
        url: `${API}${url}`,
        headers,
        data,
        responseType
      });
    } catch (e) {
      if (e.response.status === 403) {
        app.store.commit('setSnackParams', {
          text: 'Нет доступа!',
          color: 'error'
        });
        if(app.$auth.loggedIn){
          app.$api.Auth.logout();
        }
        app.$auth.logout();
      } else if (e.response.status !== 200) {
        if (!!e.response.data && !!e.response.data.errors) {
          e.response.data.errors.map((error)=>{
            app.store.commit('setSnackParams', {
              text: !!error.description && typeof error.description == 'string' ? error.description : 'Ошибка!',
              color: 'error'
            });
          });
        }else{
          app.store.commit('setSnackParams', {
            text: 'Ошибка!',
            color: 'error'
          });
        }
      }
    }
  };
  
  return (url, headers = {}) => {
    return {
      async get(query = "") {
        if (query) {
          query = GetQueryConverterJson(query);
        }
        return await RequestCycle({
          method: 'GET',
          url: `${url}${query}`,
          headers
        });
      },
      async post(data = "") {
        return await RequestCycle({
          method: 'POST',
          url,
          data,
          headers
        });
      },
      async uploadFile(data = "") {
        return await RequestCycle({
          method: 'POST',
          url: url,
          data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      },
      async put(data = "") {
        return await RequestCycle({
          method: 'PUT',
          url: url,
          data,
          headers
        });
      },
      async patch(data = "") {
        return await RequestCycle({
          method: 'PATCH',
          url: url,
          data,
          headers
        });
      },
      async delete(query = "") {
        if (query) {
          query = convert(query);
        }
        return await RequestCycle({
          method: 'DELETE',
          url: `${url}${query}`,
        });
      },
      async download(query = {}) {
        if (query) {
          query = GetQueryConverterJson(query);
        }
        return await RequestCycle({
          method: 'GET',
          url: `${url}${query}`,
          responseType: 'blob',
        }).then(function(response){
          const file_url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = file_url;

          var filename = url.split('/').pop();
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();

        });
      }
    };
  };
}
