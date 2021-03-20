export default function ({app, store, redirect}) {
  if (store.state.auth.loggedIn) {
    return redirect(app.localePath('/'))
  }
}
