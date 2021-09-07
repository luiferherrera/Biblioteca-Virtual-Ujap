/**Creacion de lsa diferente rutas de la plataforma utilizando vue-router y redireccion ya sea al login, consola de
 * administrador o ventana principal segun sea necesario.
  */

// importar componentes de vue, vue-router y el entorno de firebase creado con las credenciales del proyecto
import Vue from 'vue'
import Router from 'vue-router'
import firebase from '../Firebase/Firebase';

// Importar componentes de la vista normal de usuario
import Index from './../components/Main/Index'
import Main from './../components/Main/Main'
import Suggest from './../components/Main/Suggest'
import Contact from './../components/Main/Contact'
import Materias from './../components/Main/Materias'
import Books from './../components/Main/Books'

// Importar componetes del login
import Login from './../components/Login/Login'
import Singin from './../components/Login/Singin'

// Importar componentes de la consola de administracion
import Admin from './../components/Admin/Admin'
import BooksAdmin from './../components/Admin/Books'
import BooksTable from './../components/Admin/Subcomponents/BooksTable';
import SeeSuggest from './../components/Admin/SeeSuggest'
import Message from './../components/Admin/Message'


Vue.use(Router)

// Rutas de la plataforma
const routes = [{
  // Ruta principal (componente con el appbar, footer y router-view donde se cargan el resto de componentes)
  path: '/',
  component: Index,
  // Componetes hijos que se mostraran dentro del componente principal
  children: [
    // Ruta por defecto, Vista de busqueda por nombre y semestres (componente/archivo "main")
    {
    path: '/',
    component: Main
  },
  // Ruta de la vista de busqueda por nombre o semestre (componente "main")
  {
    path: '/semestre',
    component: Main
  },
  // Ruta de la vista de la busqueda por materias (componente "Materias")
  {
    path: '/materia',
    component: Materias,
  },
  // Ruta de la vista para enviar una recomendacion de libro (componente "Suggest")
  {
    path: '/suggest',
    component: Suggest
  },
  // Ruta de la vista del formualrio de contacto con la admistracion de la palataforma (componente "Contact") 
  {
    path: '/contact',
    component: Contact
  },
  // Ruta de la vista de busqueda de libros (componente "Books")
  // Parametros id: caracteristica a buscar (titulo, materia, semestre) / name: nombre a buscar
  {
    path: '/books/:id/:name',
    component: Books
  },]
},
// Ruta de la vista de inicio de sesion en la plataforma (Meta guest para configurar la redireccion si es necesario)
{
  path: '/login',
  meta: { guest: true },
  component: Login
},
// Ruta de la vista para crear una cuenta
{
  path: '/singin',
  meta: { guest: true },
  component: Singin
},
// Ruta principal de la consola de administracion (componente con el appbar, sidebar, footer y router-view)
// meta requiresAuth para configurar la redereccion si es necesario
{
  path: '/admin',
  meta: { requiresAuth: true },
  component: Admin,
  // Componetes hijos que se mostraran dentro del componente principal de la consola de administracion
  children: [
    // Ruta de la vista para agregar un nuevo libro a la plataforma
    {
    path: '/books',
    component: BooksAdmin,
    children: [
      // Componenten hijo de la tabla donde se muestran los libros agregados a la plataforma y que permite modificarlos
      {
      path: '/books',
      component: BooksTable
    }]
  },
  //Ruta de la vista en la consola donde se muestran los mensjes que los usuarios dejaron desde el formulario de contacto 
  {
    path: '/messsage',
    component: Message,
  },
  //Ruta de la vista en la consola donde se muestran las recomendaciones de libros que los usuarios dejaron 
  {
    path: '/see_suggest',
    component: SeeSuggest,

  }]
}]

// Crear vue-router con las rutas especificadas
const router = new Router({
  mode: 'history',
  routes
})

// Configurar redirecciones segun el casp
router.beforeEach((to, from, next) => {

  // Si se trata de acceder a la consola de administracion y cualquiera de sus modulos (rutas con meta "requiresAuth" )
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verificar si se ha iniciado sesion en la plataforma
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Verificar que el usuario que ha iniciado sesion sea el administrador de la pagina
        if (user.uid == 'YOXF3pYuGlOYYWDzGKqy2mAh24Q2') {
          // si el usuario es el administrador dar acceso a la consola
          next()
        } else {
          // En caso de que el usuario no sea el administrador redirigir a la pagina principal
          next({
            path: '/',
            query: { redirect: to.fullPath }
          })
        }
      } else {
        // En caso de que no se haya iniciado sesion redirigir a la ventana de inicio de sesion 
        next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
      }
    });

    // Si se trata de acceder al login de la pagina (rutas con meta "guest"), ya sea inicio de sesion o crear cuenta 
    } else if (to.matched.some(record => record.meta.guest)) {
    // Verificar si se ha iniciado sesion en la plataforma
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Verificar que el usuario que ha iniciado sesion sea el administrador de la pagina
        if (user.uid == 'YOXF3pYuGlOYYWDzGKqy2mAh24Q2') {
          // Si el usuario es el administrador redirigir a la consola de administracion
          next({
            path: '/admin',
            query: { redirect: to.fullPath }
          })
        } else {
          // Si el usuario no es el administrador redirigir a la pagina principal
          next({
            path: '/',
            query: { redirect: to.fullPath }
          })
        }
      } else {
        // Si no se ha iniciado sesion dar acceso al login de la pagina
        next()
      }
    });
  } else {
    // Para el resto de rutas dar acceso sin redireccion
    next()
  }
})

export default router
