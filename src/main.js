/**Crear instancia de vue y configurar utilizando vue-router, vuetify y material desing icons */

// importar vue
import Vue from 'vue'

// importar router con las rutas creadas
import router from './router'

// importar vuetify (libreria utulizada para el diseño de la interfaz)
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Componente inicial de vue
import App from './App'

Vue.use(Vuetify)

// Configurar libreria de iconos para la interfaz: material desing icons (mdi)
const opts = {
  icons:{
      iconfont:'mdi'
  }
}

// Crear instancia de vue
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  vuetify: new Vuetify(opts),
})
