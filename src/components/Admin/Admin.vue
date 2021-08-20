<template>
  <!-- Componente base de la consola de administracion de la pagina que incluye el appbar, sidebar (Menu Desplegable)
   y footer -->
  <v-app>
    <!-- Sidebar (Menu desplegable) de la consola de administrador para acceder a las diferentes ventanas -->
    <v-navigation-drawer
      app
      permanent
      color="blue darken-3"
      :mini-variant.sync="drawer"
    >
      <!-- Lista con los items del sidebar -->
      <v-list dense color="blue darken-3" dark>
        
        <!-- Item para acceder a la ventana principal -->
        <v-list-item @click="title = 'Administrador'" link to="/admin">
          <v-list-item-action >
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Consola</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Item para acceder a la ventana para administrar y agregar libros a la plataforma -->
        <v-list-item @click="title = 'Administar Libros'" link to="/books">
          <v-list-item-action >
            <v-icon>mdi-bookshelf</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administrar Libros</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Item para acceder a la ventana donde se ven las recomendaciones de libros hechas por los usuarios -->
        <v-list-item @click="title = 'Recomendaciones'" link to="/see_suggest">
          <v-list-item-action>
            <v-icon>mdi-lightbulb-on</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Recomendaciones</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Item para acceder a la ventana donde se pueden ver los mesnsajes, quejas, etc. Dejadas por los usuarios de las plataforma -->
        <v-list-item @click="title = 'Mensajes'" link to="/messsage">
          <v-list-item-action>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mensajes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App bar superior, color rojo, donde se muestra el boton para desplegar el menu, el titulo y el boton para salir -->
    <v-app-bar app color="red lighten-1" dark>
      <!-- Boton para desplegar el menu -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- Titulo de la ventana que se muestra -->
      <v-toolbar-title>{{title}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Boton para Cerrar Sesion y Salir de la consola -->
      <v-btn color="blue darken-3" x-small dark fab @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Caja donde se mostrara el contenido de la ventana correspondiente -->
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <!-- Llamada del router-view el cual cargara dentro el contenido correspondiente -->
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer de la ventana con los nombres de los creadores -->
      <v-footer color="blue darken-3">
        <span class="white--text">Hecho por Luis Herrera y Marco Alvarez</span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
// Importar las librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/auth";

export default {
  // Varialbes necesarias
  data() {
    return {
      // Variable donde se guarda el titulo de la ventana que se este viendo, por defecto: 'Administrador'
      title: "Administrador",
      // Variable booleana para controlar el despliegue del sidebar
      drawer: true,
      // Variable donde se guardan los 
    };
  },
  methods: {
    // Funcion que Cierra la Sesionde administrador y devuelve a la ventana de login de la plataforma
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/login");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>