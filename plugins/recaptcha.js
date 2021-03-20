import {VueReCaptcha} from 'vue-recaptcha-v3'
import Vue from 'vue'

const siteKey = process.env.RECAPTCHA_V3;

export default ({app}) => {
  Vue.use(VueReCaptcha, {
    siteKey,
    autoHideBadge: true,
    useRecaptchaNet: true,
  })

}
