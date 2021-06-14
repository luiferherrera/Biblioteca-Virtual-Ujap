<template>
  <v-app>
    <v-navigation-drawer
      app
      permanent
      color="blue darken-3"
      :mini-variant.sync="drawer"
    >
      <v-list dense color="blue darken-3" dark>
        <v-list-item link to="/admin">
          <v-list-item-action>
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Consola</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/books">
          <v-list-item-action>
            <v-icon>mdi-bookshelf</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administrar Libros</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/see_suggest">
          <v-list-item-action>
            <v-icon>mdi-lightbulb-on</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Recomendaciones</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/messsage">
          <v-list-item-action>
            <v-icon>mdi-message-text</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mensajes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="red lighten-1" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Administrador</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn color="blue darken-3" x-small dark fab @click="logout"
        ><v-icon>mdi-logout</v-icon></v-btn
      >
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>

      <v-footer color="blue darken-3">
        <span class="white--text">Hecho por Luis Herrera y Marco Alvarez</span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      drawer: true,
      currentUser: {},
    };
  },
  methods: {
    getUser() {
      var user = firebase.auth().currentUser;
      if (user) {
        this.currentUser = user;
      } else {
      }
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/login");
        })
        .catch((error) => {});
    },
  },
  created() {
    this.getUser();
  },
};
</script>