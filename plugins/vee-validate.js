import Vue from 'vue'
import {extend, localize, ValidationObserver, ValidationProvider} from 'vee-validate'

import * as veeRules from 'vee-validate/dist/rules';

export default ({app}) => {

  _.forEach(veeRules, (rule, k) => {
    extend(k, rule)
  });

  VeeLocalize(app.i18n);

  //Install VeeValidate components globally
  Vue.component("ValidationObserver", ValidationObserver);
  Vue.component("ValidationProvider", ValidationProvider);
}

const VeeLocalize = (i18n) => {

  const {locale} = i18n;

  if (!locale){
    return false;
  }

  let dictionary = {};
  _.forEach(i18n.locales, ({code}) => {
    dictionary[code] = require(`vee-validate/dist/locale/${code}.json`);
  });

  localize(locale);
  localize(dictionary)
}

