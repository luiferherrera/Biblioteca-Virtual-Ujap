<template>
  <!-- Modulo principal de la vista normal de usuarios que incluye la barra de navegacion superior con los botones para
  acceder a los diferentes apartados de la interfaz, el boton para iniciar sesion, el menu para cambiar nombre de usuario
  correo elctronico y contrasela en caso de haber iniciado sesion, el footer y la caja donde se muestran las diferentes
  secciones de la pagina -->
  <v-app>
    <!-- App bar superior color rojo con el logo de la pagina, botones para acceder a los diferentes apartados, el boton
    para iniciar sesion y el menu de admistracion de la cuenta en caso se haber iniciado sesion -->
    <v-app-bar app dark color="red">
      <!-- Logo de la plataforma obtenido desde la base de datos -->
      <v-img
        max-width="170"
        src="https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Flogo-removebg-preview.png?alt=media&token=bf4620f4-a486-4d7c-92fe-9f9a8a90e8ab"
      ></v-img>
      <!-- Seperador vertical entre el logo y los botones de la barra de navegacion -->
      <v-divider vertical></v-divider>
      
      <!-- Boton de la barra de navegacion que redirige a la seccion para buscar libros por titulo o  por semestre -->
      <router-link to="/semestre">
        <v-btn class="ml-5" dark text> Semestres </v-btn>
      </router-link>

      <!-- Boton de la barra de navegacion que redirige a la seccion para buscar libros por materia -->
      <router-link to="/materia">
        <v-btn class="ml-5" dark text> Materias </v-btn>
      </router-link>

      <!-- Boton de la barra de navegacion que redirige a la seccion para relizar sugerencias de libros -->
      <router-link to="/suggest">
        <v-btn class="ml-5" dark text> Sugerir Libros </v-btn>
      </router-link>

      <!-- Boton de la barra de navegacion que redirige a la seccion para contactar y enviar un mensaje a la administracion
      de la pagina -->
      <router-link to="/contact">
        <v-btn class="ml-5" dark text> Contactanos </v-btn>
      </router-link>

      <!-- Espacio para colocar los botones de navegacio y el logo del lado izquero del appbar y el boton de inicio de
      secion o el menu de administacion de la cuenta del lado derecho -->
      <v-spacer></v-spacer>

      <!-- Boton para redirigir al apartado de "login" en caso de no haber iniciado sesion -->
      <router-link to="/login" v-if="!user">
        <v-btn @click="getUser" color="blue darken-3">Iniciar Sesion</v-btn>
      </router-link>

      <!-- Menu para la administracion de la cuenta del usuario, con opciones para cambiar nombren de usuario, correo
      electronico y contraseña, este se muestra como un boton con el nombre de usario y al dar click se despliega el 
      menu compoleto. -->
      <v-menu
        :close-on-content-click="false"
        :nudge-width="100"
        offset-x
        v-if="user"
      >
        <!-- Activador del menu, boton azul con el nombre de usuario de la cuenta -->
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="blue darken-3" dark v-bind="attrs" v-on="on">
            {{ currentUser.displayName }}
          </v-btn>
        </template>

        <!-- Contenido del menu una vez desplegado -->
        <v-card>
          <!-- Parte superior del menu (barra azul), se muestra el nombre de usuario actual del lado izquiero y del lado
          derecho el boton para cerrar sesion de la cuenta actual, se utiliza una lista (v-list) para ordenar y dar formato  -->
          <v-list color="blue darken-3">
            <v-list-item dark>
              <!-- Mostrar el nombre de usuario actual -->
                <v-list-item-title>
                  {{ currentUser.displayName }}
                </v-list-item-title>
              
              <!-- Boton para cerrar sesion -->
              <v-list-item-action>
                <v-btn color="red" x-small dark fab @click="logout"
                  ><v-icon>mdi-logout</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <!-- lista (v-list) con las opciones para cambiar nombre de usuario, contraseña, y correo, al dar click sobre 
          una opcion se despliega una ventana modal con los campor corresponientes para realizar el cambio -->
          <v-list>

            <!-- Elmento de la lista con la opcion para cambiar el nombre de usuario -->
            <v-list-item>
              <v-list-item-action>
                <!-- v-dialog para generar la ventana modal con los campos para cambiar el nombre de usuario, este 
                se muestra como un elemento de la lista con el texto de "cambiar nombre" que funciona como activador
                y al dar click de despliega la ventana modal -->
                <v-dialog eager persistent v-model="dialog_name" width="500">
                  
                  <!-- Activador del v-dialog se muestra como un elemento de accion de la lista con el texto correspondiente -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Nombre
                    </v-list-item-action-text>
                  </template>
                  
                  <!-- contenido de la ventana modal para cambiar el nombre de usuario-->
                  <v-card>
                    <!-- Toolbar superior de la ventana modal con el titulo de cambiar nombre y el boton para cerrarla -->
                    <v-toolbar dark color="blue darken-3">
                      <!-- titulo -->
                      <v-toolbar-title>Cambiar nombre</v-toolbar-title>
                      <!-- Separador -->
                      <v-spacer></v-spacer>
                      <!-- Boton para cerrar la ventana modal -->
                      <v-btn @click="close" fab x-small color="red" dark
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    
                    <!-- Caja con el formulario con el campo para introducir el nuevo nombre de usuario -->
                    <v-card-text class="mt-5">
                    <!-- Formulario para cambiar el nombre de usuario -->
                      <v-form
                        v-model="valid_name"
                        ref="form_name"
                        lazy-validation
                      > 
                        <!-- Input text para ingresar el nuevo nombre de usuario -->
                        <v-text-field
                          prepend-inner-icon="mdi-email"
                          label="Nuevo Nombre"
                          color="blue darken-3"
                          background-color="red lighten-5"
                          outlined
                          :rules="[rules.required]"
                          v-model="form.name"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    
                    <!-- Acciones de la ventana modal, boton enviar el nuevo nombre de usauario y cambiarlo,
                    se utilizan separadores (v-spacer) antes y despues para centrarlo dentro de la ventana -->
                    <v-card-actions>
                      <!-- separador -->
                      <v-spacer></v-spacer>  
                      <!-- Boton para cambiar el nombre -->
                      <v-btn
                        @click="updateName"
                        class="mb-2"
                        color="blue darken-3"
                        dark
                        :loading="loading_name"
                      >
                        Cambiar Nombre
                      </v-btn>
                      <!-- separador -->
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>

            <!-- Elmento de la lista con la opcion para cambiar el Correo electronico -->
            <v-list-item>
              <v-list-item-action>
              <!-- v-dialog para generar la ventana modal con los campos para cambiar el correo, este se muestra como
               un elemento de la lista con el texto de "Cambiar Correo Electronico" que funciona como activador
                y al dar click de despliega la ventana modal -->
                <v-dialog persistent eager v-model="dialog_email" width="500">

                  <!-- Activador del v-dialog se muestra como un elemento de accion de la lista con el texto correspondiente -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Correo Electronico
                    </v-list-item-action-text>
                  </template>

                  <!-- contenido de la ventana modal para cambiar el Correo electronico-->
                  <v-card>
                    <!-- Toolbar superior de la ventana modal con el titulo de la ventana y el boton para cerrarla -->
                    <v-toolbar dark color="blue darken-3">
                      <!-- titulo -->
                      <v-toolbar-title>Cambiar Correo Electronico</v-toolbar-title>
                      <!-- separador -->
                      <v-spacer></v-spacer>
                      <!-- Boton para cerrar la ventana modal -->
                      <v-btn @click="close" fab x-small color="red" dark
                        ><v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    
                    <!-- Caja con el formulario con los campos para introducir el nuevo correo electronico y un campo
                    para introducir la contraseña y asi validar el usuario -->
                    <v-card-text class="mt-5">
                    <!-- Formulario para cambiar el correo electronico -->
                      <v-form
                        v-model="valid_email"
                        ref="form_email"
                        lazy-validation
                      >
                        <!-- Text input para introducir el nuevo correo electronico, se encuentra validado para que solo
                        se acepten un correo electronico valido -->
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

                        <!-- Text input para introducir la contraseña actual de la cuenta para validar el usuario -->
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

                    <!-- Acciones de la ventana modal, boton enviar el nuevo nombre de usauario y cambiarlo,
                    se utilizan separadores (v-spacer) antes y despues para centrarlo dentro de la ventana -->
                    <v-card-actions>
                      <!-- separador -->
                      <v-spacer></v-spacer>
                      <!-- Boton para cambiar el correo electronico -->
                      <v-btn
                        @click="clickEmail"
                        :loading="loading_email"
                        class="mb-2"
                        color="blue darken-3"
                        dark
                      >
                        Cambiar Correo Electronico
                      </v-btn>
                      <!-- separador -->
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>

            <!-- Elmento de la lista con la opcion para cambiar la contraseña -->
            <v-list-item>
              <v-list-item-action>
                <!-- v-dialog para generar la ventana modal con los campos para cambiar la contrasña, este se muestra
                como un elemento de la lista con el texto de "Cambiar Contraseña" que funciona como activador y al dar
                click de despliega la ventana modal -->
                <v-dialog
                  persistent
                  eager
                  v-model="dialog_password"
                  width="500"
                >

                  <!-- Activador del v-dialog se muestra como un elemento de accion de la lista con el texto correspondiente -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action-text v-bind="attrs" v-on="on">
                      Cambiar Contraseña
                    </v-list-item-action-text>
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

                    <!-- Caja con el formulario con los campos para introducir la nueva contrasela, un campo para retetir
                    la contraseña nueva y un campo para introducir la contrasela actual y asi validar el usuario -->
                    <v-card-text class="mt-5">
                      
                      <!-- Formulario para cambiar la contrasela -->
                      <v-form
                        v-model="valid_password"
                        ref="form_password"
                        lazy-validation
                      >
                        <!-- input text para introducir la nueva contrasela, se encuentra validado para que tenga minimo
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
                          :error-messages="errors.password"
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
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Router-view para que se cargue el contenido del modulo qye este viendo el ususario -->
    <router-view></router-view>

    <!-- Snackbar para confirmar que se ha realizado en cambio (nombre de usuario, correo electronico, contrasela)
    segun sea necesario -->
    <v-snackbar v-model="snackbar" timeout="2500" bottom color="success">
      <v-icon>mdi-check</v-icon>
      {{ snackbarMessage }}

      <!-- Boton para cerrar la snackbar -->
      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Footer de la pagina con el texto correspondiente -->
    <v-footer color="red">
      <span class="white--text">Hecho por Luis Herrera y Marco Alvarez</span>
    </v-footer>
  </v-app>
</template>

<script>
// Inportar librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data: () => ({
    // Objeto donde se guarda la informacion del usaurio actual si se ha iniciado sesion
    currentUser: {},
    // Variable para el control si el usuario ha iniciado o no sesion dentro de la plataforma
    user: false,
    // Variable para el control del despliegue de la snackbar
    snackbar: false,
    // Variable con el mensaje que contendra la snackbar segun se haya cambiado el nombre, correo o contraseña
    snackbarMessage: "",
    // Variable para el control del despliegue de la ventana modal para cambiar el nombre de usuario
    dialog_name: false,
    // Variable para el control del despliegue de la ventana modal para cambiar el correo electronico
    dialog_email: false,
    // Variable para el control del despliegue de la ventana modal para cambiar la contraseña
    dialog_password: false,
    // Variable para el control que los campos del formulario de cambio de nombre sean correctos
    valid_name: false,
    // Variable para el control que los campos del formulario de cambio de correo sean correctos
    valid_email: false,
    // Variable para el control que los campos del formulario de cambio de contraseña sean correctos
    valid_password: false,
    // Variablem para el control miestras se este actualizando el nombre en la base de datos
    loading_name: false,
    // Variablem para el control miestras se este actualizando el correo en la base de datos
    loading_email: false,
    // Variablem para el control miestras se este actualizando la contraseña en la base de datos
    loading_password: false,
    // Objeto con las variables donde se guardan los valores ingresados en los formularios
    form: {
      name: "",
      email: "",
      password: "",
      newPassword: "",
      repeat: "",
    },
    // Objeto para el control de errores cuando se desee cambiar el correo o contraseña
    errors: {
      email: "",
      password: "",
    },
    // Reglas para la validacion de los campos del formulario
    rules: {
      // Regla para la validacion de los campos que son requeridos
      required: (value) => !!value || "Este Campo es requerido.",
      // Regla para la validacion de que se ingrese un email valido
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Ingrese una Direccion de Correo Valida.";
      },
      // Regla para la validacio que la contrasela tenga al menos 8 caracteres
      length: (value) =>
        (!!value && value.length >= 8) ||
        "La contrasela debe tener al menos 8 caracteres",
    },
  }),

  methods: {
    /**Funcion que obtiene el usuario actual y guarda su informacion en la varable "currentUser"
     */
    getUser() {
      
      const user = firebase.auth().currentUser;
      if (user) {
        this.currentUser = user;
        this.user = true;
      } else {
      }
    },

    /**Funcion que vacia y reinicia los formularios y mensajes de error */
    clean() {
      this.$refs.form_name.reset();
      this.$refs.form_email.reset();
      this.$refs.form_password.reset();
      this.errors.email = "";
      this.errors.password = "";
    },

    /**Funcion que cierra la ventana modal y luego llama a la funcion paara reinicar el formulario */
    close() {
      this.dialog_name = false;
      this.dialog_email = false;
      this.dialog_password = false;
      this.clean();
    },

    /**Fucion la secion del usuario actual */
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = false;
        })
        .catch((error) => {});
    },

    /**Funcion que guarda el nuevo nombre de usuario en la base de datos y actualiza en la plataforma */
    updateName() {
      this.snackbar = false;
      // Validar el formulario
      this.$refs.form_name.validate();
      // Comprobar que el formulario este valido y se haya ingresado un nombre de usuario
      if (this.valid_name && this.form.name) {
        this.loading_name = true;
        // Actualizar nombre en la base de datos
        this.currentUser
          .updateProfile({
            displayName: this.form.name,
          })
          .then(() => {
            // Una vez actualizado en la BBD mostrar la snackbar, cerrar la ventana modal y actualizar en la plataforma
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

    /**Funcion que al dar click para actualizar valida los datos del formulario, luego valida el usurio realizando una
     * reutenticacion con la contraseña ingresada y luego llama a la funcion para guardar el nuevo email en la BBD
     */
    clickEmail() {
      this.snackbar = false;
      // Validar formulario 
      this.$refs.form_email.validate();

      // Comprobar que el formulario este valido y se haya ingresado todos los datos
      if (this.form.email && this.form.password && this.valid_email) {
        this.loading_email = true;

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
            this.updateEmail();
          })
          .catch((error) => {
            this.loading_email = false;
            // Si hay un error verifcar si es de contraseña incorrecta y mostrar el mensaje
            if (error.code == "auth/wrong-password") {
              this.errors.password = "Contraseña incorrecta";
            } else {
              console.log();
              error;
            }
          });
      }
    },

    /**Funcion que actualiza en la base de datos el correo electronico del usuario con el correo ingresado*/
    updateEmail() {
      this.currentUser
        .updateEmail(this.form.email)
        .then(() => {
          // Una vez actualizado en la BBD mostrar la snackbar, cerrar la ventana modal y actualizar en la plataforma
          this.snackbarMessage = "Correo electronico Actualizado";
          this.snackbar = true;
          this.close();
          this.getUser(); 
        })
        .catch((error) => {
          this.loading_email = false;
          // Si se produce un error verificar el tipo y mostrar el mensaje
          if (error.code == "auth/email-already-in-use") {
            this.errors.email = "Ya existe una cuenta con esa direccion de correo";
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          this.loading_email = false;
        });
    },

    /**Funcion que al dar click para actualizar valida los datos del formulario, luego valida el usurio realizando una
     * reutenticacion con la contraseña ingresada y luego llama a la funcion para guardar la nueva contrasela en la BBD
     */
    clickPassword() {
      this.snackbar = false;
      // Validar formulario 
      this.$refs.form_password.validate();
      
      // Comprobar que el formulario este valido y se haya ingresado todos los datos
      if (
        this.form.password &&
        this.form.newPassword &&
        this.form.repeat &&
        this.valid_password
      ) {
        this.loading_password = true;

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
              this.errors.password = "Contraseña incorrecta";
            } else {
              console.log(error);
            }
          });
      }
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
          this.getUser();
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

  created() {
    // Obtener el usuario al cargar la pagina
    this.getUser();
  },
};
</script>