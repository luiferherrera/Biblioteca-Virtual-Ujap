<template>
  <v-main>
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">
              Recomendar Libros
            </h2>
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
        >Recomendacion Enviada Correctamente</v-alert
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
                    :rules="[required]"
                    required
                  ></v-text-field>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      label="Rol *"
                      :items="roles"
                      prepend-inner-icon="mdi-teach"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.rol"
                      :rules="[required]"
                      required
                    ></v-select>
                  </v-col>

                  <v-col v-if="other">
                    <v-text-field
                      label="Especifique *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.other"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      label="Titulo del Libro *"
                      prepend-inner-icon="mdi-book"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.book"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      label="Semestre *"
                      :items="semester"
                      prepend-inner-icon="mdi-timeline"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.semestre"
                      :rules="[required]"
                      required
                    ></v-select>
                  </v-col>

                  <v-col>
                    <v-text-field
                      label="Materia *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.materia"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-textarea
                      label="Comentarios *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      auto-grow
                      v-model="form.comment"
                      :rules="[required]"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn
                    @click="click"
                    :loading="loading"
                    dark
                    color="blue darken-3"
                  >
                    Enviar Recomendacion
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
    roles: ["Estudiante", "Profesor", "Otro"],
    form: {
      book: "",
      materia: "",
      semestre: "",
      name: "",
      rol: "",
      other: "",
      comment: "",
    },
    semester: [
      "Primero",
      "Segundo",
      "Tercero",
      "Cuarto",
      "Quinto",
      "Sexto",
      "Septimo",
      "Octavo",
      "Noveno",
      "Decimo",
    ],
    required: (value) => !!value || "Este Campo es requerido.",
  }),
  computed: {
    other() {
      if (this.form.rol == "Otro") {
        return true;
      } else {
        return false;
      }
    },
    rolFinal() {
      if (this.form.other) {
        return this.form.other;
      } else {
        return this.form.rol;
      }
    },
  },
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
        this.form.rol &&
        this.form.book &&
        this.form.materia &&
        this.form.semestre &&
        this.form.comment &&
        this.rolFinal != "Otro"
      ) {
        const user = firebase.auth().currentUser;
          if (user) {
            this.loading = true;
            this.sendSuggest();
          } else {
            alert("Debe iniciar Sesion para Enviar");
          }
      }
    },

    sendSuggest() {
      firebase
        .firestore()
        .collection("recomendaciones")
        .doc()
        .set({
          name: this.form.name,
          rol: this.rolFinal,
          book: this.form.book,
          semestre: this.form.semestre,
          materia: this.form.materia,
          comment: this.form.comment,
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