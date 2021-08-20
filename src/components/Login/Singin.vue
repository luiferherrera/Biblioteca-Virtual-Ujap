<template>
  <!-- Modulo que permite crear una cuenta dentro de la plataforma cuenta con un formulario dentro de un v-card,con campos
  para el nombre de usuario, correo electronico, contraseña y repetir contreseña los cuales se encuentran validados,
  ademas de un boton para crear la cuenata y un boton para pasar al modulo de iniciar sesion -->
  <v-app>
    <v-main>
      <!-- Contenedor principal de la ventana (fondo rojo) dentro del cual se encuentra la v-card -->
      <v-container fluid fill-height class="red lighten-1">
        <v-row align="center" justify="center">
          <v-col xl="12" sm="8" md="4">
            <!-- v-card dentro de la cual se encuentra el formulario  -->
            <v-card class="elevation-12" :loading="loading">
              <!-- Toolbar superior color azul de la v-card con el titulo "Crear Cuenta" -->
              <v-toolbar dark color="blue darken-3">
                <!-- Titulo -->
                <v-toolbar-title>Crear Cuenta</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <!-- Formulario para crear la cuenta -->
                <v-form v-model="valid" ref="form" lazy-validation>
                  <!-- Input text para el nombre de usario -->
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="Nombre de Usuario"
                    type="text"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    :error-messages="errors.name"
                    :rules="[rules.required]"
                    v-model="form.name"
                    required
                  ></v-text-field>

                  <!-- input text para el correo electronico -->
                  <v-text-field
                    prepend-inner-icon="mdi-email"
                    label="Correo Electronico"
                    type="email"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    :error-messages="errors.email"
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
                    outlined
                    :error-messages="errors.password"
                    :rules="[rules.required, rules.length]"
                    v-model="form.password"
                    required
                  ></v-text-field>

                  <!-- Input text para repetir la contraseña -->
                  <v-text-field
                    prepend-inner-icon="mdi-repeat"
                    label="Repetir Contraseña"
                    type="password"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    :error-messages="errors.password_confirmation"
                    :rules="[rules.required, confirmation]"
                    v-model="form.password_confirmation"
                    @keyup.enter="clickCreate"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <!-- Boton para redirigir al modulo para crear cuenta  -->
                <router-link to="/login" class="ml-2">
                  <v-btn dark color="blue darken-3" elevation="2" rounded outlined small>Iniciar Sesion</v-btn>
                </router-link>

                <!-- Separador para colocar los botones a la izquierda y derecha -->
                <v-spacer></v-spacer>

                <!-- Boton para inciar sesion -->
                <v-btn color="blue darken-3" dark @click="clickCreate"
                  >Crear Cuenta</v-btn
                >
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
      // Variable para controlar mientras se este creando la cuenta
      loading: false,
      // Variable para controlar que los datos del formulario sean validos
      valid: false,
      // Objeto donde se guardan los datos introducidos el formulario
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      // Objeto con variables para el manejo de errores al crear cuanta o iniciar sesion
      errors: {
        email: "",
        password: "",
        password_confirmation: "",
      },
      // Reglas para validar los campos del formulario
      rules: {
        // Regla para los campos requeridos
        required: (value) => !!value || "Este campo es requerido.",
        // Regla para validar que sea un correo electronico valido
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || "Ingrese una Direccion de Correo Valida."
          );
        },
        // Regla para validar que la contraseña tenga al menos 8 caracteres
        length: (value) =>
          (!!value && value.length >= 8) ||
          "La contrasela debe tener al menos 8 caracteres",
      },
    };
  },

  methods: {
    /**Funcion para limpiar los errores del formulario */
    cleanErrors() {
      this.errors.email = "";
      this.errors.password = "";
      this.errors.password_confirmation = "";
    },

    /**Funcion que al hacer click en el boton de crear cuenta valida el formulario y valida que los datos esten 
     * correctos luego llama a la funcion para crear la cuenta
     */
    clickCreate() {
      // Limpiar errores viejos del formulario
      this.cleanErrors();
      // Validar el formulario y verifiacar los campos
      this.$refs.form.validate();
      // Esperar a que termine la validacion del formulario
      Vue.nextTick(() => {
        // Si el forumario es valido y se han ingresado los datos crear la cuenta
        if (
          this.form.name &&
          this.form.email &&
          this.form.password &&
          this.form.password_confirmation &&
          this.valid
        ) {
          this.loading = "warning";
          this.createAccount();
        }
      });
    },

    /**Funcion para crear la cuenta usando el correo y la contraseña ingresados y luego guardar el nombre de usuario y
     * redirigir a la ventana principal */
    createAccount() {
      // Crear la cuenta usando el correo electronico y la contraseña ingresadas
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
          // Una vez creada la cuenta guardar el nombre de usuario
          var user = firebase.auth().currentUser;
          user
            .updateProfile({
              displayName: this.form.name,
            })
            .then(() => {
              // Finalmente redirigir a la ventana principal
              this.$router.push("/");
            })
            .catch(function (error) {
              alert(error.message);
            });
        })
        .catch((error) => {
          // Manejo de errores producidos al crear la cuenta
          switch (error.code) {
            // Error de que ya existe una cuenta con ese correo electronico
            case "auth/email-already-in-use":
              this.errors.email = "Ya Existe Una Cuenta Con este Email";
              break;
              // Error de correo electronico invalido
            case "auth/invalid-email":
              this.errors.email = "Ingrese una Direccion de Correo Valida";
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

  computed: {
    /**Propiedad Computada que funciona como regla de validacion que verifica que la contrseña ingresada y la contraseña
     * repetida sean iguales
    */
    confirmation() {
      if (
        this.form.password &&
        this.form.password_confirmation &&
        this.form.password_confirmation == this.form.password
      ) {
        return true;
      } else {
        return "Las contraseñas deben ser iguales";
      }
    },
  },
};
</script>