<template>
  <v-app>
    <v-app-bar app dark color="red">
      <v-img
        max-width="170"
        src="https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Flogo-removebg-preview.png?alt=media&token=bf4620f4-a486-4d7c-92fe-9f9a8a90e8ab"
      ></v-img>
      <v-divider vertical></v-divider>

      <router-link to="/semestre">
        <v-btn class="ml-5" dark text> Semestres </v-btn>
      </router-link>

      <router-link to="/materia">
        <v-btn class="ml-5" dark text> Materias </v-btn>
      </router-link>

      <router-link to="/suggest">
        <v-btn class="ml-5" dark text> Sugerir Libros </v-btn>
      </router-link>

      <router-link to="/contact">
        <v-btn class="ml-5" dark text> Contactanos </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="100"
        offset-x
        v-if="user"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="blue darken-3" dark v-bind="attrs" v-on="on">
            {{ currentUser.displayName }}
          </v-btn>
        </template>

        <v-card>
          <v-list color="blue darken-3">
            <v-list-item dark>
              <v-list-item-content>
                <v-list-item-title>
                  {{ currentUser.displayName }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn color="red" x-small dark fab @click="logout"
                  ><v-icon>mdi-logout</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-dialog eager persistent v-model="dialog_name" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Nombre
                    </v-list-item-action-text>
                  </template>

                  <v-card>
                    <v-toolbar dark color="blue darken-3">
                      <v-toolbar-title>Cambiar nombre</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="close" fab x-small color="red" dark
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>

                    <v-card-text class="mt-5">
                      <v-form
                        v-model="valid_name"
                        ref="form_name"
                        lazy-validation
                      >
                        <v-text-field
                          prepend-inner-icon="mdi-email"
                          label="Nuevo Nombre"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          :error-messages="errors.name"
                          :rules="[rules.required]"
                          v-model="form.name"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="updateName"
                        class="mb-2"
                        color="blue darken-3"
                        dark
                        :loading="loading_name"
                      >
                        Cambiar Nombre
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-dialog persistent eager v-model="dialog_email" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Correo Electronico
                    </v-list-item-action-text>
                  </template>

                  <v-card>
                    <v-toolbar dark color="blue darken-3">
                      <v-toolbar-title>Cambiar Email</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="close" fab x-small color="red" dark
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>

                    <v-card-text class="mt-5">
                      <v-form
                        v-model="valid_email"
                        ref="form_email"
                        lazy-validation
                      >
                        <v-text-field
                          prepend-inner-icon="mdi-email"
                          label="Nuevo Correo Electronico"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          type="email"
                          v-model="form.email"
                          :error-messages="errors.email"
                          :rules="[rules.required, rules.email]"
                          required
                        ></v-text-field>

                        <v-text-field
                          prepend-inner-icon="mdi-lock"
                          label="Contraseña"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          type="password"
                          v-model="form.password"
                          :error-messages="errors.password"
                          :rules="[rules.required, rules.length]"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="clickEmail"
                        :loading="loading_email"
                        class="mb-2"
                        color="blue darken-3"
                        dark
                      >
                        Cambiar Correo Electronico
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-dialog
                  persistent
                  eager
                  v-model="dialog_password"
                  width="500"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Contraseña
                    </v-list-item-action-text>
                  </template>

                  <v-card>
                    <v-toolbar dark color="blue darken-3">
                      <v-toolbar-title>Cambiar Contraseña</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="close" fab x-small color="red" dark
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>

                    <v-card-text class="mt-5">
                      <v-form
                        v-model="valid_password"
                        ref="form_password"
                        lazy-validation
                      >
                        <v-text-field
                          prepend-inner-icon="mdi-lock"
                          label="Contraseña Antigua"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          type="password"
                          v-model="form.password"
                          :error-messages="errors.password"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>

                        <v-text-field
                          prepend-inner-icon="mdi-lock"
                          label="Nueva Contraseña"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          type="password"
                          v-model="form.newPassword"
                          :rules="[rules.required, rules.length]"
                          required
                        ></v-text-field>

                        <v-text-field
                          prepend-inner-icon="mdi-lock"
                          label="Repetir  Contraseña"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          type="password"
                          v-model="form.repeat"
                          :rules="[rules.required, confirmation]"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="clickPassword"
                        class="mb-2"
                        color="blue darken-3"
                        dark
                        :loading="loading_password"
                      >
                        Cambiar Contraseña
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <router-link to="/login" v-if="!user">
        <v-btn @click="getUser" color="blue darken-3">Iniciar Sesion</v-btn>
      </router-link>
    </v-app-bar>

    <router-view></router-view>

    <v-snackbar v-model="snackbar" timeout="2500" bottom color="success">
      <v-icon>mdi-check</v-icon>
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <v-footer color="red">
      <span class="white--text">Hecho por Luis Herrera y Marco Alvarez</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data: () => ({
    menu: false,
    currentUser: {},
    user: false,
    form: {
      name: "",
      email: "",
      password: "",
      newPassword: "",
      repeat: "",
    },
    snackbar: false,
    snackbarMessage: "",
    dialog_name: false,
    dialog_email: false,
    dialog_password: false,
    valid_name: false,
    valid_email: false,
    valid_password: false,
    loading_name: false,
    loading_email: false,
    loading_password: false,
    errors: {
      email: "",
      password: "",
    },
    rules: {
      required: (value) => !!value || "Este Campo es requerido.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Ingrese una Direccion de Correo Valida.";
      },
      length: (value) =>
        (!!value && value.length >= 8) ||
        "La contrasela debe tener al menos 8 caracteres",
    },
  }),

  methods: {
    getUser() {
      const user = firebase.auth().currentUser;
      if (user) {
        this.currentUser = user;
        this.user = true;
      } else {
      }
    },

    clean() {
      this.$refs.form_name.reset();
      this.$refs.form_email.reset();
      this.$refs.form_password.reset();
      this.errors.email = "";
      this.errors.password = "";
    },

    close() {
      this.dialog_name = false;
      this.dialog_email = false;
      this.dialog_password = false;
      this.clean();
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = false;
        })
        .catch((error) => {});
    },

    updateName() {
      this.snackbar = false;
      this.$refs.form_name.validate();
      if (this.valid_name && this.form.name) {
        this.loading_name = true;
        const user = firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: this.form.name,
          })
          .then(() => {
            this.snackbarMessage = "Nombre actualizado";
            this.snackbar = true;
            this.close();
            this.getUser();
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => {
            this.loading_name = false;
          });
      }
    },

    clickEmail() {
      this.snackbar = false;
      this.$refs.form_email.validate();
      if (this.form.email && this.form.password && this.valid_email) {
        this.loading_email = true;
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.form.password
        );
        user
          .reauthenticateWithCredential(credential)
          .then(() => {
            this.updateEmail();
          })
          .catch((error) => {
            this.loading_email = false;
            if (error.code == "auth/wrong-password") {
              this.errors.password = "Contraseña incorrecta";
            } else {
              console.log();
              error;
            }
          });
      }
    },

    updateEmail() {
      const user = firebase.auth().currentUser;
      user
        .updateEmail(this.form.email)
        .then(() => {
          this.snackbarMessage = "Correo electronico Actualizado";
          this.snackbar = true;
          this.close();
        })
        .catch((error) => {
          this.loading_email = false;

          if (error.code == "auth/email-already-in-use") {
            this.errors.email =
              "Ya existe una cuenta con esa direccion de correo";
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          this.loading_email = false;
        });
    },

    clickPassword() {
      this.snackbar = false;
      this.$refs.form_password.validate();
      if (
        this.form.password &&
        this.form.newPassword &&
        this.form.repeat &&
        this.valid_password
      ) {
        this.loading_password = true;
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.form.password
        );
        user
          .reauthenticateWithCredential(credential)
          .then(() => {
            this.updatePassword();
          })
          .catch((error) => {
            this.loading_password = false;
            if (error.code == "auth/wrong-password") {
              this.errors.password = "Contraseña incorrecta";
            } else {
              console.log(error);
            }
          });
      }
    },

    updatePassword() {
      const user = firebase.auth().currentUser;
      user
        .updatePassword(this.form.newPassword)
        .then(() => {
          this.snackbarMessage = "Contraseña Actualizada";
          this.snackbar = true;
          this.close();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading_email = false;
        });
    },
  },
  computed: {
    confirmation() {
      if (
        this.form.newPassword &&
        this.form.repeat &&
        this.form.repeat == this.form.newPassword
      ) {
        return true;
      } else {
        return "Las contraseñas deben ser iguales";
      }
    },
  },

  created() {
    this.getUser();
  },
};
</script>