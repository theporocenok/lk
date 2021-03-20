import RedirectAuth from "../api/RedirectAuth";


const strategy = 'local';

export default async ({app}) => {
  const {$axios, $auth, $api} = app;

  RedirectAuth(app.$auth, app.i18n.locale);
  
  $auth.onRedirect((to, from) => {
    setTimeout(() => {
      app.router.push(app.localePath('/'));
    });
  });
  
  const token = $auth.getToken(strategy);
  const tokenCookie = $auth.$storage.getCookie('_token.local');
  
  if (!token || !tokenCookie) {
    $auth.logout();
    return;
  }
  
  try {
    const {data} = await $api.Auth.me();
    if(data.status){
      $auth.setUser(data.data);
    }
    else {
      $api.Auth.logout();
      $auth.logout();
    }
  } catch ({response}) {
  }
  
}