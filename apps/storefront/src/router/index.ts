import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import CustomizerView from "../views/CustomizerView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/customizer",
      name: "customizer",
      component: CustomizerView
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth"
      }
    }
    return { top: 0 }
  }
})

export default router
