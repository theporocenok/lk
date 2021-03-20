export default ($auth, locale) => {
  let redirect = {
    login: '/',
    logout: '/login',
    callback: '/',
    home: '/'
  };
  
  /*_.forEach(redirect, (el, k) => {
   redirect[k] = `/${locale}${redirect[k]}`;
   });*/
  $auth.$storage.options.redirect = redirect;
}
