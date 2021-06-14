<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            outlined
            single-line
          ></v-text-field>
        </v-toolbar>

        <v-dialog eager v-model="booleans.dialog" ref="edit" max-width="1000">
          <v-card>
            <v-toolbar dark color="indigo">
              <v-toolbar-title> Modificar Registro </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-alert
                type="success"
                transition="scale-transition"
                border="left"
                text
                v-model="booleans.alert"
                >Libro Guardado</v-alert
              >

              <v-form v-model="booleans.valid" ref="form" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col align-self="center" cols="6">
                      <v-container>
                        <v-row>
                          <v-text-field
                            prepend-inner-icon="mdi-tag-text"
                            label="Titulo del Libro"
                            color="blue darken-3"
                            background-color="red lighten-5"
                            outlined
                            v-model="editedItem.tittle"
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
                              v-model="editedItem.semestre"
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
                              v-model="editedItem.materia"
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
                              v-model="editedItem.autor"
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
                              v-model="editedItem.year"
                              :error-messages="error.year"
                              :rules="[rules.required]"
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
                              v-model="editedItem.edicion"
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
                              v-model="editedItem.resumen"
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
                          <v-img :src="editedItem.photoUrl"></v-img>
                        </v-row>

                        <v-row>
                          <v-file-input
                            accept="image/*"
                            prepend-icon="mdi-file-image"
                            color="blue darken-3"
                            label="Portada"
                            v-model="photo"
                            @change="photoChange"
                            :error-messages="error.photo"
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
                            v-model="editedItem.link"
                            :error-messages="error.link"
                            :rules="[rules.required, rules.link]"
                            required
                          ></v-text-field>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- Boton Cerrar -->
              <v-btn plain @click="close">Cerrar</v-btn>
              <!-- Boton Guardar cambios -->
              <v-btn
                color="indigo"
                :loading="booleans.loading"
                dark
                @click="clickSave"
                >Guardar Cambios</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="booleans.dialogDelete" max-width="325px">
          <v-card dark color="indigo">
            <v-card-title>
              <v-spacer></v-spacer>
              ¿Desea eliminar el registro?
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark plain @click="closeDelete">Cancelar</v-btn>
              <v-btn color="error" plain @click="deleteItemConfirm"
                >Borrar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Ver Miniaturas en la tabla -->
      <template v-slot:[`item.photoUrl`]="{ item }">
        <v-img
          :src="item.photoUrl"
          class="my-1"
          max-height="75"
          max-width="100"
        ></v-img>
      </template>

      <template v-slot:[`item.link`]="{ item }">
        <v-btn fab color="green" dark :href="item.link" target="_blank">
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>

      <!-- Botones de editar y borrar -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          x-small
          fab
          class="mr-2"
          color="indigo"
          dark
          @click.stop="editItem(item)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn x-small fab color="error" @click.stop="deleteItem(item)"
          ><v-icon>mdi-delete </v-icon></v-btn
        >
      </template>
    </v-data-table>

    <!-- Snackbar de registro Borrado -->
    <v-snackbar
      v-model="booleans.snackbar"
      timeout="3000"
      top
      color="red darken-1"
    >
      <v-icon>mdi-close</v-icon>
      Registro Borrado

      <template v-slot:action="{ attrs }">
        <v-btn
          color="indigo"
          text
          v-bind="attrs"
          @click="booleans.snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
  data: () => ({
    search: "",
    photo: null,
    desserts: [],
    editedIndex: -1,
    editedID: "",
    booleans: {
      dialog: false,
      dialogDelete: false,
      valid: true,
      alert: false,
      snackbar: false,
      loading: false,
    },
    error: {
      name: "",
      category: "",
      subcategory: "",
      plataform: "",
      link: "",
    },
    rules: {
      required: (value) => !!value || "Este Campo es requerido.",
      link: (value) => {
        if (value) {
          const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
          return pattern.test(value) || "Ingrese un link valido";
        } else {
          return true;
        }
      },
    },
    headers: [
      {
        text: "Miniatura",
        align: "start",
        sortable: false,
        value: "photoUrl",
      },
      { text: "Titulo", value: "tittle" },
      { text: "Semestre", value: "semestre" },
      { text: "Materia", value: "materia" },
      { text: "Autor", value: "autor" },
      { text: "Año", value: "year" },
      { text: "Edicion", value: "edicion" },
      { text: "Link", value: "link", align: "center", sortable: false },
      { text: "Acciones", value: "actions", align: "center", sortable: false },
    ],
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
    editedItem: {
      tittle: "",
      semestre: "",
      materia: "",
      autor: "",
      year: "",
      edicion: "",
      resumen: "",
      photoUrl: "",
      photoRef: "",
      link: "",
    },
    defaultItem: {
      tittle: "",
      semestre: "",
      materia: "",
      autor: "",
      year: "",
      edicion: "",
      resumen: "",
      photoUrl: "",
      photoRef: "",
      link: "",
    },
  }),

  methods: {
    getBooks() {
      var user = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("libros")
        .onSnapshot((querySnapshot) => {
          this.desserts = [];
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            this.desserts.push(data);
          });
        });
    },

    validar() {
      this.$refs.form.validate();
    },

    cleanData() {
      this.$refs.form.reset();
      this.editedItem.id = null;
      this.editedItem.photoRef = null;
      this.editedItem.photoUrl = null;
      this.editedID = "";
    },

    cleanError() {
      this.error.name = "";
      this.error.category = "";
      this.error.subcategory = "";
      this.error.plataform = "";
      this.error.photo = "";
      this.error.link = "";
    },

    photoChange() {
      if (this.photo) {
        this.editedItem.photoUrl = URL.createObjectURL(this.photo);
      } else {
        this.editedItem.photoUrl = this.desserts[this.editedIndex].photoUrl;
      }
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedID = this.desserts[this.editedIndex].id;
      this.editedItem = Object.assign({}, item);
      this.booleans.dialog = true;
    },

    clickSave() {
      this.booleans.alert = false;
      this.cleanError();
      this.validar();
      console.log('click');
        if (this.booleans.valid) {
          console.log('valido');
          if (this.photo) {
            console.log('con foto');
            this.booleans.loading = true;
            this.deletePhotoAndSaveData();
          } else {
            console.log('sin foto');
            this.booleans.loading = true;
            this.saveData();
          }
        }
      
    },

    deletePhotoAndSaveData() {
      var storage = firebase.storage().ref();
      storage
        .child(this.editedItem.photoRef)
        .delete()
        .then(() => {
          this.savePhoto();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    savePhoto() {
      var ruta = "libros/" + this.photo.name;
      var storage = firebase.storage().ref();
      storage
        .child(ruta)
        .put(this.photo)
        .then((snapshot) => {
          storage
            .child(ruta)
            .getDownloadURL()
            .then((url) => {
              this.editedItem.photoUrl = url;
              this.editedItem.photoRef = ruta;
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
        .doc(this.desserts[this.editedIndex].id)
        .set({
          tittle: this.editedItem.tittle,
          semestre: this.editedItem.semestre,
          materia: this.editedItem.materia,
          autor: this.editedItem.autor,
          year: this.editedItem.year,
          edicion: this.editedItem.edicion,
          resumen: this.editedItem.resumen,
          photoUrl: this.editedItem.photoUrl,
          photoRef: this.editedItem.photoRef,
          link: this.editedItem.link,
        })
        .then(() => {
          this.booleans.alert = true;
          this.booleans.loading = false;
        })
        .catch(function (error) {
          console.error("Error: ", error);
        });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.booleans.dialogDelete = true;
    },

    deleteItemConfirm() {
      firebase
        .firestore()
        .collection("libros")
        .doc(this.desserts[this.editedIndex].id)
        .delete()
        .then(() => {
          this.booleans.snackbar = true;
          this.closeDelete();
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    },

    close() {
      this.booleans.dialog = false;
      this.booleans.alert = false;
      this.photo = null;
      this.editedIndex = -1;
      this.cleanData();
    },

    closeDelete() {
      this.booleans.dialogDelete = false;
      this.editedIndex = -1;
      this.cleanData();
    },
  },

  created() {
    this.getBooks();
  },
};
</script>