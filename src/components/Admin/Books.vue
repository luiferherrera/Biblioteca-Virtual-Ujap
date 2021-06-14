<template>
  <v-container fluid>
    <!-- Alert de Video Guardado -->
    <v-alert
      type="success"
      transition="scale-transition"
      border="left"
      text
      v-model="alert"
      >Libro Guardado</v-alert
    >
    <v-row>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row>
            <v-col align-self="center" cols="7">
              <v-container>
                <v-row>
                  <v-text-field
                    prepend-inner-icon="mdi-tag-text"
                    label="Titulo del Libro"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    v-model="form.tittle"
                    :error-messages="error.tittle"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      prepend-inner-icon="mdi-view-grid"
                      label="Semestre"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.semestre"
                      :error-messages="error.semestre"
                      :items="semestres"
                      :rules="[rules.required]"
                      required
                    ></v-select>
                  </v-col>

                  <v-col>
                    <v-text-field
                      prepend-inner-icon="mdi-widgets"
                      label="Materia"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.materia"
                      :error-messages="error.materia"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      prepend-inner-icon="mdi-code-tags"
                      label="Autor"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.autor"
                      :error-messages="error.autor"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      prepend-inner-icon="mdi-widgets"
                      label="Año"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      type="number"
                      v-model="form.year"
                      :error-messages="error.year"
                      :rules="[rules.required, rules.year]"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field
                      prepend-inner-icon="mdi-view-grid"
                      label="Edicion"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.edicion"
                      :error-messages="error.edicion"
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-textarea
                      label="Resumen"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      auto-grow
                      v-model="form.resumen"
                      :rules="[rules.required]"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>

            <v-col cols="1">
              <v-divider vertical></v-divider>
            </v-col>

            <v-col cols="4">
              <v-container>
                <v-row>
                  <v-img :src="form.photoUrl"></v-img>
                </v-row>

                <v-row>
                  <v-file-input
                    accept="image/*"
                    prepend-icon="mdi-file-image"
                    color="blue darken-3"
                    label="Portada"
                    v-model="form.photo"
                    @change="photoChange"
                    :error-messages="error.photo"
                    :rules="[rules.required]"
                    required
                  ></v-file-input>
                </v-row>

                <v-row>
                  <v-text-field
                    prepend-inner-icon="mdi-link"
                    label="Link del libro"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    type="url"
                    v-model="form.link"
                    :error-messages="error.link"
                    :rules="[rules.required, rules.link]"
                    required
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-btn
              dark
              color="indigo"
              :loading="loading"
              @click="verifyAndSave"
            >
              Agregar Libro
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-row>

    <v-row style="height: 30px"> </v-row>

    <v-row>
      <router-view></router-view>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
  data() {
    return {
      alert: false,
      loading: false,
      valid: false,
      form: {
        tittle: "",
        semestre: "",
        materia: "",
        autor: "",
        year: "",
        edicion: "",
        resumen: "",
        photoUrl:
          "https:firebasestorage.googleapis.com/v0/b/react-login-7ff2a.appspot.com/o/gui-2311260_640.png?alt=media&token=01577ef5-f63e-4d65-9674-807983604f2e",
        photoRef: "",
        link: "",
      },
      error: {
        tittle: "",
        semestre: "",
        materia: "",
        autor: "",
        year: "",
        photo: "",
        link: "",
      },
      semestres: [
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
      rules: {
        required: (value) => !!value || "Este Campo es requerido.",
        link: (value) => {
          if (value) {
            const pattern =
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/;
            return pattern.test(value) || "Ingrese un link valido";
          } else {
            return true;
          }
        },
        year: (value) => (!!value && value > 1950 && value <= new Date().getFullYear()) ||
            "Ingrese un Año Valido"
        
      },
    };
  },
  methods: {
    validar() {
      this.$refs.form.validate();
    },

    cleanError() {
      this.error.name = "";
      this.error.category = "";
      this.error.subcategory = "";
      this.error.plataform = "";
      this.error.photo = "";
      this.error.link = "";
    },

    cleanForm() {
      this.$refs.form.reset();
      this.form.photoUrl =
        "https:firebasestorage.googleapis.com/v0/b/react-login-7ff2a.appspot.com/o/gui-2311260_640.png?alt=media&token=01577ef5-f63e-4d65-9674-807983604f2e";
    },

    photoChange() {
      if (this.form.photo) {
        this.form.photoUrl = URL.createObjectURL(this.form.photo);
      } else {
        this.form.photoUrl =
          "https:firebasestorage.googleapis.com/v0/b/react-login-7ff2a.appspot.com/o/gui-2311260_640.png?alt=media&token=01577ef5-f63e-4d65-9674-807983604f2e";
      }
    },

    verifyAndSave() {
      this.cleanError();
      this.validar();
      this.alert = false;
      if (
        this.form.tittle &&
        this.form.semestre &&
        this.form.materia &&
        this.form.autor &&
        this.form.year &&
        this.form.edicion &&
        this.form.resumen &&
        this.form.photo &&
        this.form.link
      ) {
        if (this.valid) {
          this.loading = true;
          this.saveBook();
        }
      }
    },

    saveBook() {
      var ruta = "libros/" + this.form.photo.name;
      var storage = firebase.storage().ref();
      storage
        .child(ruta)
        .put(this.form.photo)
        .then((snapshot) => {
          storage
            .child(ruta)
            .getDownloadURL()
            .then((url) => {
              this.form.photoUrl = url;
              this.form.photoRef = ruta;
              this.saveData();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    saveData() {
      firebase
        .firestore()
        .collection("libros")
        .doc()
        .set({
          tittle: this.form.tittle,
          semestre: this.form.semestre,
          materia: this.form.materia,
          autor: this.form.autor,
          year: this.form.year,
          edicion: this.form.edicion,
          resumen: this.form.resumen,
          photoUrl: this.form.photoUrl,
          photoRef: this.form.photoRef,
          link: this.form.link,
        })
        .then(() => {
          this.alert = true;
          this.loading = false;
          this.cleanForm();
        })
        .catch(function (error) {
          console.error("Error: ", error);
        });
    },
  },
};
</script>