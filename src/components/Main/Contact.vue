<template>
  <!-- Modulo que permite a los usuarios enviar un mensje a la administracion de la pagina, ya sea para  reportar
  errores, conultas, sugerencias, etc. Para esto cuenta con un formulario con campos de contacto y de para enviar el
  mesaje deseado ademas de el boton correspondiente para enviar el mensaje.-->
  <v-main>
    <!-- Caja con fondo azul donde se muestra el titulo de la ventana de contacto -->
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">Contacto</h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Caja donde se encuetra el formulario, la alerta de confirmacion de envio del mensaje, y el boton de envio -->
    <v-container fluid>
      <!-- Alerta de notificacion que el mesaje ha sido enviado correctamente -->
      <v-alert
        v-model="alert"
        type="success"
        transition="scale-transition"
        border="left"
        text
        >Mensaje Enviado</v-alert
      >

      <!-- Formulario de contacto  -->
      <v-form class="mt-5" v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row align="center" justify="center">
            <v-col align-self="center" cols="7">
              <v-container>
                <v-row>
                  <!-- Input text para el nombre del usuario que envia el mensaje -->
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="Nombre Completo *"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    v-model="form.name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text para el correo electronico del usuario, validado que sea un email valido  -->
                    <v-text-field
                      label="Email *"
                      prepend-inner-icon="mdi-teach"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.email"
                      :rules="[rules.required, rules.email]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text para el asunto del mensaje -->
                    <v-text-field
                      label="Asunto *"
                      prepend-inner-icon="mdi-book"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.asunto"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text multilinea para el mensaje que se desea enviar -->
                    <v-textarea
                      label="Mensaje *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      auto-grow
                      v-model="form.message"
                      :rules="[rules.required]"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn dark @click="click" color="blue darken-3">
                    Enviar Mensaje
                  </v-btn>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
// Importar librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    // Variable para el control del alert de mensaje enviado
    alert: false,
    // Variable para el control que se han llenado todos los campos del formulario y son validos
    valid: false,
    // Variable para controlar cuando se esta enviado el mensaje y actualizando la base de datos
    loading: false,
    // Objeto donde se guarda lo ingresado en el formulario 
    form: {
      name: "",
      email: "",
      asunto: "",
      message: "",
    },
  // Reglas para la validacion de los campos del formulario.
    rules: {
      // Regla de validacion de que el campo es requerido 
      required: (value) => !!value || "Este Campo es requerido.",
      // Regla de validacion de que se ingrese un correo electronico valido
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Ingrese una Direccion de Correo Valida.";
      },
    },
  }),
  methods: {
    // Funcion limpiar y resetear el formulario
    clean() {
      this.$refs.form.reset();
    },

    // Funcion para validar el fomulario y verificar que los campos sean correctos
    validate() {
      this.$refs.form.validate();
    },

    /**Funcion que al dar click en el boton para enviar el mensaje, valida que los datos ingresados en el formulario 
    sean validos, se hayan ingresado todos los campos, rerifica que el usuario haya iniciado sesion y luego 
    procede a enviar el mensaje */
    click() {
      this.alert = false;
      this.validate();
      if (
        this.valid &&
        this.form.name &&
        this.form.email &&
        this.form.asunto &&
        this.form.message
      ) {
        const user = firebase.auth().currentUser;
        if (user) {
          this.loading = true;
          this.sendMessage();
        } else {
          alert("Debe iniciar Sesion para Enviar");
        }
      }
    },

    /**Funcion que guarda el mensaje en la base de datos dentro de la coleccion "mensajes"
    */
    sendMessage() {
      firebase
        .firestore()
        .collection("mensajes")
        .doc()
        .set({
          name: this.form.name,
          email: this.form.email,
          asunto: this.form.asunto,
          message: this.form.message,
        })
        .then(() => {
          this.alert = true;
          this.clean();
        })
        .catch(function (error) {
          console.error("Error: ", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>