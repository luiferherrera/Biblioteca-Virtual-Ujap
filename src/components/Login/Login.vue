<template>
  <!-- Modulo que permite iniciar sesion dentro de la plataforma cuenta con un formulario dentro de un v-card,con campos
  para el correo electronico y la contraseña los cuales se encuentran validados, ademas de un boton para inicair sesion 
  y un boton para pasar al modulo de crear una cuenta -->
  <v-app>
    <v-main>
      <!-- Contenedor principal de la ventana (fondo rojo) dentro del cual se encuentra la v-card -->
      <v-container fluid fill-height class="red lighten-1">
        <v-row align="center" justify="center">
          <v-col xl="12" sm="8" md="4">
            <!-- v-card dentro de la cual se encuentra el formulario  -->
            <v-card class="elevation-12" :loading="loading">
              <!-- Toolbar superior color azul de la v-card con el titulo "Iniciar Sesion" -->
              <v-toolbar dark color="blue darken-3">
                <!-- Titulo -->
                <v-toolbar-title>Iniciar Sesion</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pb-0">
                <!-- Formulario de inicio de sesion -->
                <v-form v-model="valid" ref="form" lazy-validation>
                  <!-- input text para el correo electronico -->
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

                  <!-- Input text para la contraseña -->
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
                <!-- Boton para redirigir al modulo para crear cuenta  -->
                <router-link to="/singin" class="ml-2">
                  <v-btn dark color="blue darken-3" elevation="2" rounded outlined small> Crear cuenta </v-btn>
                </router-link>

                <!-- Separador para colocar los botones a la izquierda y derecha -->
                <v-spacer></v-spacer>

                <!-- Boton para inciar sesion -->
                <v-btn
                  @click="clickLogin"
                  class="ma-2"
                  color="blue darken-3"
                  dark
                >
                  Iniciar Sesion
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Importar librerias necesarias
import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";

export default {
  data() {
    return {
      // Variable para controlar mientras se este iniciando sesion
      loading: false,
      // Variable para controlar que los datos del formulario sean validos
      valid: false,
      // Objeto donde se guardan los datos introducidos el formulario
      form: {
        email: "",
        password: "",
      },
      // Variables para el control de errores al inicar sesion
      errors_email: "",
      errors_password: "",
      // Reglas para validar los campos del formulario
      rules: {
        // Regla para los campos requeridos
        required: (value) => !!value || "Este Campo es requerido.",
        // Regla para validar que sea un correo electronico valido
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || "Ingrese una Direccion de Correo Valida."
          );
        },
      },
    };
  },
  methods: {
    /**Funcion para limpiar los errores del formulario */
    cleanErrors() {
      this.errors_email = "";
      this.errors_password = "";
    },

    /**Funcion que al hacer click en el boton de iniciar sesion valida el formulario y valida que los datos esten 
     * correctos luego llama a la funcion para iniciar sesion
     */
    clickLogin() {
      // Limpiar errores viejos del formulario
      this.cleanErrors();
      // Validar el formulario y verifiacar los campos
      this.$refs.form.validate();
      // Esperar a que termine la validacion del formulario
      Vue.nextTick(() => {
        // Si el forumario es valido y se han ingresado los datos iniciar sesion
        if (this.form.email && this.form.password && this.valid) {
          this.loading = "warning";
          this.doLogin();
        }
      });
    },

    /**Funcion para iniciar sesion y redirigir a la ventana principal o la consola en caso de ser el adminstrador */
    doLogin() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then((user) => {
          // Verificar si el usuario es el adminstrador y redirigir a la ventana principal o la consola de adminstracion
          if (user.uid == "YOXF3pYuGlOYYWDzGKqy2mAh24Q2") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/");
          }
        })
        .catch((error) => {
          // Manejo de errores al iniciar sesion
          switch (error.code) {
            // Error correo electronico invalido
            case "auth/invalid-email":
              this.errors_email = "Ingrese una Direccion de Correo Valida";
              break;
            // Error de no existe cuenta con el correo ingresado
            case "auth/user-not-found":
              this.errors_email =
                "No se Encontro una Cuenta con esta Direccion de Correo";
              break;
            // Error contraseña incorrecta
            case "auth/wrong-password":
              this.errors_password = "Contraseña Incorrecta";
              break;
            default:
              alert(error.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>