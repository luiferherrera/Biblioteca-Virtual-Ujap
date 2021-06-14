<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="red lighten-1">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" :loading="isLoading">
              <v-toolbar dark color="blue darken-3">
                <v-toolbar-title>Iniciar Sesion</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pb-0">
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-text-field
                    prepend-inner-icon="mdi-email"
                    label="Correo Electronico"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    :error-messages="errors_email"
                    :rules="[rules.required, rules.email]"
                    v-model="form.email"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    prepend-inner-icon="mdi-lock"
                    label="Contraseña"
                    type="password"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    :error-messages="errors_password"
                    outlined
                    :rules="[rules.required]"
                    v-model="form.password"
                    @keyup.enter="doLogin"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <router-link to="/singin" class="ml-2"
                  ><v-chip color="blue darken-3" dark
                    >Crear cuenta</v-chip
                  ></router-link
                >
                <v-spacer></v-spacer>

                <v-btn @click="doLogin" class="ma-2" color="blue darken-3" dark>
                  Iniciar Sesion
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

 <script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      intento: false,
      isLoading: false,
      valid: false,
      form: {
        email: "",
        password: "",
      },
      errors_email: "",
      errors_password: "",
      rules: {
        required: (value) => !!value || "Este Campo es requerido.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || "Ingrese una Direccion de Correo Valida."
          );
        },
      },
    };
  },
  methods: {
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    doLogin() {
      firebase.auth().signOut();
      this.resetValidation();
      this.isLoading = "warning";
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then((user) => {
          const usuario = firebase.auth().currentUser;
          if (usuario.uid == "YOXF3pYuGlOYYWDzGKqy2mAh24Q2") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/");
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              this.errors_email = "Ingrese una Direccion de Correo Valida";
              break;
            case "auth/user-not-found":
              this.errors_email =
                "No se Encontro una Cuenta con esta Direccion de Correo";
              break;
            case "auth/wrong-password":
              this.errors_password = "Contraseña Incorrecta";
              break;
            default:
              console.log(error);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>