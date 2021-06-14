<template>
  <v-main>
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">Contacto</h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-container fluid>
      <v-alert
        v-model="alert"
        type="success"
        transition="scale-transition"
        border="left"
        text
        >Mensaje Enviado</v-alert
      >

      <v-form class="mt-5" v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row align="center" justify="center">
            <v-col align-self="center" cols="7">
              <v-container>
                <v-row>
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
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    alert: false,
    valid: false,
    loading: false,
    form: {
      name: "",
      email: "",
      asunto: "",
      message: "",
    },
    rules: {
      required: (value) => !!value || "Este Campo es requerido.",
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Ingrese una Direccion de Correo Valida.";
      },
    },
  }),
  methods: {
    clean() {
      this.$refs.form.reset();
    },

    validate() {
      this.$refs.form.validate();
    },

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