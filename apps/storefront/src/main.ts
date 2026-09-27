import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import { useI18n } from "./composables/useI18n"
import "./style.css"

const app = createApp(App)

const { $t } = useI18n()
app.config.globalProperties.$t = $t

app.use(createPinia())
app.use(router)

app.mount("#app")
