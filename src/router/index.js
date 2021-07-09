import Vue from 'vue'
import Router from 'vue-router'
import firebase from '../Firebase/Firebase';

import Index from './../components/Main/Index'
import Main from './../components/Main/Main'
import Suggest from './../components/Main/Suggest'
import Contact from './../components/Main/Contact'
import Materias from './../components/Main/Materias'
import Books from './../components/Main/Books'

import Login from './../components/Login/Login'
import Singin from './../components/Login/Singin'

import Admin from './../components/Admin/Admin'
import BooksAdmin from './../components/Admin/Books'
import BooksTable from './../components/Admin/Subcomponents/BooksTable';
import SeeSuggest from './../components/Admin/SeeSuggets'
import Message from './../components/Admin/Message'

Vue.use(Router)

const routes = [{
  path: '/',
  component: Index,
  children: [{
    path: '/',
    component: Main
  },
  {
    path: '/suggest',
    component: Suggest
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/semestre',
    component: Main
  },
  {
    path: '/materia',
    component: Materias,
  },
  {
    path: '/books/:id/:name',
    component: Books
  },]
},
{
  path: '/login',
  name: 'login',
  meta: { guest: true },
  component: Login
},
{
  path: '/singin',
  name: 'singin',
  component: Singin
},
{
  path: '/admin',
  name: 'admin',
  meta: { requiresAuth: true },
  component: Admin,
  children: [{
    path: '/books',
    component: BooksAdmin,
    children: [{
      path: '/books',
      component: BooksTable
    }]
  },
  {
    path: '/messsage',
    component: Message,
  },
  {
    path: '/see_suggest',
    component: SeeSuggest,

  }]

}]

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    var user = firebase.auth().currentUser;
    if (!user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const usuario = firebase.auth().currentUser;
        if (usuario.uid == 'YOXF3pYuGlOYYWDzGKqy2mAh24Q2') {
          next({
            path: '/admin',
            query: { redirect: to.fullPath }
          })
        } else {
          next({
            path: '/',
            query: { redirect: to.fullPath }
          })
        }
      } else {
        next()
      }
    });
  } else {
    next()
  }
})


export default router
