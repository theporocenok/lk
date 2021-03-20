export default function ({app, store, redirect}) {
    // app.$auth.user
    // store.state.auth.user
    if (app.$auth.user.role_id !== 1) {
      return redirect(app.localePath('/'))
    }

}
