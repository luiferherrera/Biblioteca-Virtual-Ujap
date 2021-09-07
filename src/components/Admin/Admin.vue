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
        <v-list-item @click="title = 'Administrador'" link to="/files">
          <v-list-item-action>
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Consola</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Item para acceder a la ventana para administrar y agregar libros a la plataforma -->
        <v-list-item @click="title = 'Administar Registros'" link to="/books">
          <v-list-item-action>
            <v-icon>mdi-bookshelf</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administrar Registros</v-list-item-title>
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
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Ventana modal para cambiar la contraseña de la cuenta del administrador -->
      <v-dialog persistent eager v-model="dialog_password" width="500">

        <!-- Activador del v-dialog se muestra como un boton con el texto de cambiar contraseña -->
        <template v-slot:activator="{ on, attrs }">
          <!-- Boton para abrir la ventana modal -->
          <v-btn
            v-bind="attrs"
            v-on="on"
            elevation="2"
            style="background-color: white"
            class="mr-5 blue--text"
            outlined
            rounded
            small
          >
          Cambiar Contraseña
          </v-btn>
        </template>

        <!-- contenido de la ventana modal para cambiar la contrasela-->
        <v-card>
          <!-- Toolbar superior de la ventana modal con el titulo de la ventana y el boton para cerrarla -->
          <v-toolbar dark color="blue darken-3">
            <!-- titulo -->
            <v-toolbar-title>Cambiar Contraseña</v-toolbar-title>
            <!-- separador -->
            <v-spacer></v-spacer>
            <!-- Boton para cerrar la ventana modal -->
            <v-btn @click="close" fab x-small color="red" dark
              ><v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Caja con el formulario con los campos para introducir la nueva contraseña, un campo para retetir
          la contraseña nueva y un campo para introducir la contraseña actual y asi validar el usuario -->
          <v-card-text class="mt-5">
            <!-- Formulario para cambiar la contrasela -->
            <v-form
              v-model="valid_password"
              ref="form_password"
              lazy-validation
            >
              <!-- input text para introducir la nueva contraseña, se encuentra validado para que tenga minimo
              8 caracteres -->
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

              <!-- Input text para repetir la contraseña, se encuentra vadidado para que sea igual a la 
              introducida anteriormente -->
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

              <!-- input text para introducir la contraseña actual y asi validar al usaurio -->
              <v-text-field
                prepend-inner-icon="mdi-lock"
                label="Contraseña Actual"
                color="blue darken-3"
                background-color="red lighten-5"
                outlined
                type="password"
                v-model="form.password"
                :error-messages="errors_password"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <!-- Acciones de la ventana modal, boton enviar el nuevo nombre de usauario y cambiarlo,
          se utilizan separadores (v-spacer) antes y despues para centrarlo dentro de la ventana -->
          <v-card-actions>
            <!-- separador -->
            <v-spacer></v-spacer>
            <!-- Boton para cambiar la contraseña -->
            <v-btn
              @click="clickPassword"
              class="mb-2"
              color="blue darken-3"
              dark
              :loading="loading_password"
            >
              Cambiar Contraseña
            </v-btn>
            <!-- separador -->
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Boton para Cerrar Sesion y Salir de la consola -->
      <v-btn color="blue darken-3"  x-small dark fab @click="logout">
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
import Vue from 'vue';

export default {
  // Varialbes necesarias
  data() {
    return {
      // Variable donde se guarda el titulo de la ventana que se este viendo, por defecto: 'Administrador'
      title: "Administrador",
      // Variable booleana para controlar el despliegue del sidebar
      drawer: true,
      // Variable para el control del despliegue de la ventana modal para cambiar la contraseña
      dialog_password: false,
      // Variable para el control que los campos del formulario de cambio de contraseña sean correctos
      valid_password: false,
      // Variablem para el control miestras se este actualizando la contraseña en la base de datos
      loading_password: false,
      // Objeto con las variables donde se guardan los valores ingresados en los formularios
      form: {
        password: "",
        newPassword: "",
        repeat: "",
      },
      // Variable para el control de errores al cambiar la contraseña
      errors_password: "",
      // Reglas para la validacion de los campos del formulario
      rules: {
        // Regla para la validacion de los campos que son requeridos
        required: (value) => !!value || "Este Campo es requerido.",
        // Regla para la validacio que la contrasela tenga al menos 8 caracteres
        length: (value) =>
          (!!value && value.length >= 8) ||
          "La contrasela debe tener al menos 8 caracteres",
      },
      currentUser: {},
    };
  },
  methods: {
    // Funcion que Cierra la Sesionde administrador y devuelve a la ventana de login de la plataforma
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {})
        .catch((error) => {
          alert(error.message);
        });
    },

    /**Funcion que cierra la ventana modal y luego llama a la funcion paara reinicar el formulario */
    close() {
      this.dialog_password = false;
      this.$refs.form_password.reset();
      this.errors_password = "";
    },

    /**Funcion que al dar click para actualizar valida los datos del formulario, luego valida el usurio realizando una
     * reutenticacion con la contraseña ingresada y luego llama a la funcion para guardar la nueva contrasela en la BBD
     */
    clickPassword() {
      // Borrar errores de intentos previos
      this.errors_password = "";
      this.snackbar = false;

      // VAlidar el formulario
      this.$refs.form_password.validate();

      // Esperar a que termine la validacion del formulario y luego seguir
      Vue.nextTick(() => {
        // Comprobar que el formulario este valido y se haya ingresado todos los datos
        if (
          this.form.password &&
          this.form.newPassword &&
          this.form.repeat &&
          this.valid_password
        ) {
          this.loading_password = true;

          this.currentUser = firebase.auth().currentUser

          // Crear nuevas credenciales de autenticacion con la contrseña ingredasa en el formulario
          const credential = firebase.auth.EmailAuthProvider.credential(
            this.currentUser.email,
            this.form.password
          );

          // Reautenticar usuario con las nuevas credenciales
          this.currentUser
            .reauthenticateWithCredential(credential)
            .then(() => {
              // Si es correcto llamar a la funcion para actualizar usuario
              this.updatePassword();
            })
            .catch((error) => {
              this.loading_password = false;
              // Si hay un error verifcar si es de contraseña incorrecta y mostrar el mensaje
              if (error.code == "auth/wrong-password") {
                this.errors_password= "Contraseña incorrecta";
              } else {
                alert(error.message);
              }
            });
        }
      });
    },

    /**Funcion que actualiza la contraseña del usario en la BBD con la nueva ingresada desde el formulario */
    updatePassword() {
      this.currentUser
        .updatePassword(this.form.newPassword)
        .then(() => {
          // Una vez actualizado en la BBD mostrar la snackbar, cerrar la ventana modal y actualizar en la plataforma
          this.snackbarMessage = "Contraseña Actualizada";
          this.snackbar = true;
          this.close();
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => {
          this.loading_password = false;
        });
    },
  },

  computed: {
    /**Propiedad Computada que funciona como regla de validacion que verifica que la nueva contraseña y la contraseña
     * repetida sean iguales
     */
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
};
</script>