import Vue from 'vue'
import Vuetify from 'vuetify'

// vuetify
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import colors from "vuetify/es5/util/colors";
import ru from 'vuetify/es5/locale/ru'
import VueTheMask from 'vue-the-mask'


Vue.use(Vuetify);
Vue.use(VueTheMask)

export default ctx => {
	const vuetify = new Vuetify({
		theme: {
			dark: false,
			themes: {
				dark: {
					primary: colors.deepPurple.lighten3,
					accent: colors.deepPurple.accent3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepPurple.accent4,
					success: colors.green.accent4
				}
			}
		},
	})

	ctx.app.vuetify = vuetify
	ctx.$vuetify = vuetify.framework
}