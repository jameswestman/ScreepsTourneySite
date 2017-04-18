import vue from 'vue'
import vueRouter from 'vue-router'
import vueMaterial from 'vue-material'

import app from './views/app.vue'
import roomView from './views/room.vue'
import leaderboardView from './views/leaderboard.vue'
import notFound from './views/notFound.vue'

vue.use(vueRouter)
vue.use(vueMaterial)

var router = new vueRouter({
	routes: [
		{
			name: "room",
			path: "/:challenge/room/:room",
			component: roomView,
			props: true
		},
		{
			name: "leaderboard",
			path: "/:challenge/leaderboard",
			component: leaderboardView,
			props: true
		},
		{
			name: "not_found",
			path: "*",
			component: notFound
		}
	],
	mode: "history"
})

new vue({
  el: '#app',
  router,
  render: h => h(app)
})
