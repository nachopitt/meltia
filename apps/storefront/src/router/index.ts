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
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
