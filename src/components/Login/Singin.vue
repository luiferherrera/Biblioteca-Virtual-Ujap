<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height class="red lighten-1">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" :loading="isLoading">
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-toolbar dark color="blue darken-3">
                  <v-toolbar-title>Crear Cuenta</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
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
                    @keyup.enter="clickIniciar"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <router-link to="/login" class="ml-2">
                    <v-chip color="blue darken-3" dark>Iniciar Sesion</v-chip>
                  </router-link>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-3" dark @click="clickIniciar"
                    >Crear Cuenta</v-btn
                  >
                </v-card-actions>
              </v-form>
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
      valid: false,
      isLoading: false,
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      errors: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      rules: {
        required: (value) => !!value || "Este campo es requerido.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || "Ingrese una Direccion de Correo Valida."
          );
        },
        length: (value) =>
          (!!value && value.length >= 8) ||
          "La contrasela debe tener al menos 8 caracteres",
      },
    };
  },
  
  methods: {
    clean() {
      this.errors.name = "";
      this.errors.email = "";
      this.errors.password = "";
      this.errors.password_confirmation = "";
    },

    validar() {
      this.$refs.form.validate();
    },

    clickIniciar() {
      this.validar();
      this.clean();
      if (this.valid) {
        this.isLoading = "warning";
        this.createAccount();
      }
    },

    createAccount() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then((user) => {
          var user = firebase.auth().currentUser;
          user
            .updateProfile({
              displayName: this.form.name,
            })
            .then(() => {
              this.$router.push("/");
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              this.errors.email = "Ya Existe Una Cuenta Con este Email";
              break;
            case "auth/invalid-email":
              this.errors.email = "Ingrese una Direccion de Correo Valida";
              break;
            default:
              alert(error.code + "\n\n" + error.message);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },

  computed: {
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