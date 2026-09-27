import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import { useI18n } from "./composables/useI18n"
import { useCurrency } from "./composables/useCurrency"
import { useDateTime } from "./composables/useDateTime"
import "./style.css"

const app = createApp(App)

const { $t } = useI18n()
const { formatCurrency } = useCurrency()
const { formatDate } = useDateTime()

app.config.globalProperties.$t = $t
app.config.globalProperties.$formatCurrency = formatCurrency
app.config.globalProperties.$formatDate = formatDate

app.use(createPinia())
app.use(router)

app.mount("#app")
