import { createApp } from 'vue'
import '../style.css'
import App from './App.vue'
import {globalErrorHandler} from "../shared/services";
import {logger} from "../shared/services/logger.ts";
import "../shared/plugins/chart.js"
import {createPinia} from "pinia";
const app = createApp(App);
const pinia = createPinia()
app.config.errorHandler = (err, instance, info) => {
    globalErrorHandler.logError(err, {
        vueComponent: instance?.$options.name || 'UnknownComponent',
        vueLifecycleHook: info
    });
    if (import.meta.env.DEV) {
        logger.error('Vue error:', err, instance, info);
    }
};

window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();

    globalErrorHandler.logError(event.reason, {
        source: 'unhandledrejection'
    });
});
app.use(pinia)
app.mount('#app')
