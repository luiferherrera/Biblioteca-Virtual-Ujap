<template>
  <!-- Componente para mostar los libros que se encuentran en la plataforma 
    dentro del area de administrar libros de la consola de administrador
    incluye una tabla donde se muestran los registros, con botones para abrir el libro, eliminarlo y modificar el registro,
    y dos ventanas modales, la primera para confirmar que se desa borrar un registro y la segunda para modificar un registro
    esta cuenta con un formulario con los datos del registro que permite modificar y botones para guardar y salir-->
  <v-container class="mt-10">
    <!-- Tabla donde se muestyran los libros -->
    <v-data-table
      :headers="headers"
      :items="books"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <!-- Toolbar en la parte superior de la tabla -->
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <!-- Campo de texto par las busquedas -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            outlined
            single-line
          ></v-text-field>
        </v-toolbar>

        <!-- Ventana Modal para modificar el registro de un libro -->
        <v-dialog
          persistent
          fullscreen
          eager
          v-model="booleans.dialog"
          ref="edit"
          max-width="1000"
        >
          <v-card>
            <!-- Toolbar superior de la ventana modal donde se muestra el titulo -->
            <v-toolbar dark color="indigo">
              <v-toolbar-title> Modificar Registro </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <!-- Alert para confirmar que se han cambiado los datos -->
              <v-alert
                type="success"
                transition="scale-transition"
                border="left"
                text
                v-model="booleans.alert"
                >Libro Guardado</v-alert
              >

              <!-- Formulario con los datos del registro -->
              <v-form v-model="booleans.valid" ref="form" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col align-self="center" cols="6">
                      <v-container>
                        <v-row>
                          <!-- Input text para el titulo del libro -->
                          <v-text-field
                            prepend-inner-icon="mdi-tag-text"
                            label="Titulo del Libro"
                            color="blue darken-3"
                            background-color="red lighten-5"
                            outlined
                            v-model="form.tittle"
                            :rules="[rules.required]"
                            required
                          ></v-text-field>
                        </v-row>

                        <v-row>
                          <v-col>
                            <!-- Input select para el semestre al que pertenece la materia del libro-->
                            <v-select
                              prepend-inner-icon="mdi-view-grid"
                              label="Semestre"
                              color="blue darken-3"
                              background-color="red lighten-5"
                              outlined
                              v-model="form.semestre"
                              :items="semestres"
                              :rules="[rules.required]"
                              required
                            ></v-select>
                          </v-col>

                          <v-col>
                            <!-- Input select para la materia, cuyos valores dependen del semestre seleccionado -->
                            <v-select
                              prepend-inner-icon="mdi-widgets"
                              label="Materia"
                              color="blue darken-3"
                              background-color="red lighten-5"
                              outlined
                              v-model="form.materia"
                              :items="materias"
                              no-data-text="Seleccione un Semestre"
                              :rules="[rules.required]"
                              required
                            ></v-select>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <!-- Input text para el autor del libro -->
                            <v-text-field
                              prepend-inner-icon="mdi-code-tags"
                              label="Autor"
                              color="blue darken-3"
                              background-color="red lighten-5"
                              outlined
                              v-model="form.autor"
                              :rules="[rules.required]"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <!-- Input text para el año del libro -->
                            <v-text-field
                              prepend-inner-icon="mdi-widgets"
                              label="Año"
                              color="blue darken-3"
                              background-color="red lighten-5"
                              outlined
                              type="number"
                              v-model="form.year"
                              :rules="[rules.required, rules.year]"
                              required
                            ></v-text-field>
                          </v-col>

                          <v-col>
                            <!-- Input text para la edicion del libro -->
                            <v-text-field
                              prepend-inner-icon="mdi-view-grid"
                              label="Edicion"
                              color="blue darken-3"
                              background-color="red lighten-5"
                              outlined
                              v-model="form.edicion"
                              :rules="[rules.required]"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col>
                            <!-- Input text de gran tamaño para colocar un resumen del libro -->
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

                    <!-- Barra vertical para dividir la ventana -->
                    <v-col cols="1">
                      <v-divider vertical></v-divider>
                    </v-col>

                    <v-col cols="4">
                      <v-container>
                        <!-- Caja para mostrar la portada del libro -->
                        <v-row>
                          <v-img :src="form.photoUrl"></v-img>
                        </v-row>

                        <!-- Input file para escoger una nueva foto de portada -->
                        <v-row>
                          <v-file-input
                            accept="image/*"
                            prepend-icon="mdi-file-image"
                            color="blue darken-3"
                            label="Portada"
                            v-model="photo"
                            @change="photoChange"
                            :rules="[rules.size]"
                            show-size
                            required
                          ></v-file-input>
                        </v-row>

                        <!-- Input para el link del libro -->
                        <v-row>
                          <v-text-field
                            prepend-inner-icon="mdi-link"
                            label="Link del libro"
                            color="blue darken-3"
                            background-color="red lighten-5"
                            outlined
                            type="url"
                            v-model="form.link"
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
              <!-- Boton para cerrar la ventana -->
              <v-btn plain @click="close">Cerrar</v-btn>
              <!-- Boton Guardar cambios y cerrar -->
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
        

        <!-- Ventana para Borrar el registro -->
        <v-dialog persistent v-model="booleans.dialogDelete" max-width="325px">
          <v-card dark color="blue darken-3">
            <!-- Mensaje de confirmacion para borrar la ventana -->
            <v-card-title>
              <v-spacer></v-spacer>
              ¿Desea eliminar el registro?
              <v-spacer></v-spacer>
            </v-card-title>

            <!-- Botones de la ventana -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- Boton de cancelar y cerrar -->
              <v-btn dark plain @click="closeDelete">Cancelar</v-btn>
              <!-- Boton de Confirmar borrar y cerrar la ventana -->
              <v-btn color="red" plain @click="deleteItemConfirm"
                >Borrar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Ver Portadas del libro en la tabla -->
      <template v-slot:[`item.photoUrl`]="{ item }">
        <v-img
          :src="item.photoUrl"
          class="my-1"
          max-height="75"
          max-width="100"
        ></v-img>
      </template>

      <!-- Boton para abrir el libro en una pestaña nueva -->
      <template v-slot:[`item.link`]="{ item }">
        <v-btn fab color="green" dark :href="item.link" target="_blank">
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>

      <!-- Botones Accion de la tabla  -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Boton para modificar el registro -->
        <v-btn
          x-small
          fab
          class="mr-2"
          color="indigo"
          dark
          @click.stop="editItem(item)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <!-- Boton para borrar el registro -->
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

      <!-- Boton para cerrar el snackbar -->
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue darken-3"
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
// Importar librerias de Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
  data: () => ({
    // Varaible para las busquedas en la tabla
    search: "",
    // Foto para el cambio de portada
    photo: null,
    // Posicion en el array del registro que se dea modificar o guardar
    editedIndex: -1,
    // ID en la base de datos del registro que se desea modificar o guardar
    editedID: "",
    // Objeto donde se cargan los datos del formulario cuando se desea moficar un registro
    form: {
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
    // Variables boleanas para el control de la interfaz
    booleans: {
      // Ventana modal para modifar un registro
      dialog: false,
      // Ventana modal para borrar un registro
      dialogDelete: false,
      // Variable para verificar que todos los datos el formulario son validos al momento de modificar un registro
      valid: true,
      // Alert para confirmar que un registro se ha modificado
      alert: false,
      // Snackbar para confirmar que un registro se ha borrado
      snackbar: false,
      // Varible para el control cuando se este acutalizando un registro en la base de datos
      loading: false,
    },
    // Array con los semestres para ser usados como items del input select correspondiente.
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
    // Array con los titulos de las columnas y configuracion de esta como el valor correspondiente, alineacion, etc.
    headers: [
      // Columna con la portada del libro, alineado a la izquierda y no ordenable
      {
        text: "Portada",
        align: "start",
        sortable: false,
        value: "photoUrl",
      },
      // Columna de titulo, ordenable
      { text: "Titulo", value: "tittle" },
      // Columnna de Semetre, ordenable
      { text: "Semestre", value: "semestre" },
      // Columna de Materia, Ordenable
      { text: "Materia", value: "materia" },
      // Columna de Autor, Ordenable
      { text: "Autor", value: "autor" },
      // Columna de año, Ordenable
      { text: "Año", value: "year" },
      // Columna de Edicion, Ordenable
      { text: "Edicion", value: "edicion" },
      // Columna con el boton para abrir el libro en una estaña neuva, alineado al centro y no ordenable
      { text: "Link", value: "link", align: "center", sortable: false },
      // Columna con los botones de accion (Modificar y borrar), alineado al centro y no ordenable
      { text: "Acciones", value: "actions", align: "center", sortable: false },
    ],
    // Array donde se guardan los registros para mostrarlos en la tablña
    books: [],
    // Reglas para validar el formulario
    rules: {
      // Regla para el campo requerido
      required: (value) => !!value || "Este Campo es requerido.",
      // Regla para que sea un link valido
      link: (value) => {
        if (value) {
          const pattern =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
          return pattern.test(value) || "Ingrese un link valido";
        } else {
          return true;
        }
      },
      // Regla para validar el tamaño de la foto de portada
      size: (value) =>
        !value ||
        value.size < 2000000 ||
        "La portada debe tener un tamaño menor a 2MB",
      // Regla para validar que se ingrese un año valido
      year: (value) =>
        (!!value && value > 1950 && value <= new Date().getFullYear()) ||
        "Ingrese un Año Valido",
    },
  }),

  methods: {
    // Funcion que obtiene todos los libros de la base de datos y los guarda en el array de books
    getBooks() {
      firebase
        .firestore()
        .collection("libros")
        .onSnapshot((querySnapshot) => {
          this.books = [];
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            this.books.push(data);
          });
        });
    },

    // Funcion que valida el formulario
    validar() {
      this.$refs.form.validate();
    },

    // Funcion para limpiar y vaciar el formulario.
    cleanData() {
      this.$refs.form.reset();
      this.form.id = null;
      this.form.photoRef = null;
      this.form.photoUrl = null;
      this.editedID = "";
    },

    /**Funcion que cuando se modifica un registro, si se selecciona una nueva foto
     * Genera una URL para asi previsualizarla en la caja correspondiente antes de subir esta a la plataforma
     * y en caso de que quitarla volver a la foto original.
     */
    photoChange() {
      if (this.photo) {
        this.form.photoUrl = URL.createObjectURL(this.photo);
      } else if (this.photo == null) {
        return;
      } else {
        this.form.photoUrl = this.books[this.editedIndex].photoUrl;
      }
    },

    /**Funcion que cuando se desea modificar un registro carga el objeto form con los datos de ese registro
     * y abre la ventana modal para modificar el registro
     */
    editItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedID = this.books[this.editedIndex].id;
      this.form = Object.assign({}, item);
      this.booleans.dialog = true;
    },

    /* Funcion cuando se le da click al boton de guardar cambios valida que el formulario este correcto
     * y luego verifica si se debe actualizar solo la informacion unicamente o  se debe actualizar tambien la foto
     */
    clickSave() {
      this.booleans.alert = false;
      //validar formulario
      this.validar();
      if (this.booleans.valid) {
        // verificar si se debe actualizar la foto
        if (this.photo) {
          this.booleans.loading = true;
          this.deletePhotoAndSaveData();
        } else {
          this.booleans.loading = true;
          this.saveData();
        }
      }
    },

    /* Funcion que a partir de su ruta en la base de datos (Guardada en la variable 'photoRef' del objeto form)
     * elimina de la base de datos la foto correspondiente a la portada del registro que se desea modificar,
     * para luego llama a la funcion que permite guardar la nueva
     */
    deletePhotoAndSaveData() {
      var storage = firebase.storage().ref();
      storage
        .child(this.form.photoRef)
        .delete()
        .then(() => {
          this.savePhoto();
        })
        .catch((error) => {
          alert(error.message);
          this.booleans.loading = false;
        });
    },

    /* Funcion que guarda la nueva foto en la base de datos y obtiene el link de la misma,
     * guarda la ruta en la base de datos y el link de la foto dentro del formulario
     * y llama a la funcion para actualizar la informacion
     */
    savePhoto() {
      var ruta = "libros/" + this.photo.name;
      var storage = firebase.storage().ref();
      // Guardar la foto en el almacenamiento de la base de datos
      storage
        .child(ruta)
        .put(this.photo)
        .then((snapshot) => {
          // Obtener el link de la foto
          storage
            .child(ruta)
            .getDownloadURL()
            .then((url) => {
              // Guardar la informacion en el formulario y llama a la funcion para actualizar.
              this.form.photoUrl = url;
              this.form.photoRef = ruta;
              this.saveData();
            })
            .catch((error) => {
              alert(error.message);
              this.booleans.loading = false;
            });
        })
        .catch((error) => {
          alert(error.message);
          this.booleans.loading = false;
        });
    },

    /**Funcion actualiza en la base de datos, a partit de su ID
     * el documento con la infomacion del resgstro que se desea modificar
     */
    saveData() {
      firebase
        .firestore()
        .collection("libros")
        .doc(this.books[this.editedIndex].id)
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
          this.booleans.alert = true;
        })
        .catch(function (error) {
          alert(error.message);
        })
        .finally(() => {
          this.booleans.loading = false;
        });
    },

    /**Funcion que cuando se desea eliminar carga la informacion de ese registro
     * y abre la ventana modal para confirmar que se desea borrar
     */
    deleteItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.form = Object.assign({}, item);
      this.booleans.dialogDelete = true;
    },

    /**Funcion elimina de la base de datos, a partit de su ID y su ruta
     * el documento y la foto de portada correspondienten al registro que se desea borrar
     */
    deleteItemConfirm() {
      // Borrar foto de portada
      var storage = firebase.storage().ref();
      storage
        .child(this.form.photoRef)
        .delete()
        .then(() => {})
        .catch(function (error) {
          alert(error.message);
        });
      // Borrar Registro del libro
      firebase
        .firestore()
        .collection("libros")
        .doc(this.books[this.editedIndex].id)
        .delete()
        .then(() => {
          this.booleans.snackbar = true;
          this.closeDelete();
        })
        .catch(function (error) {
          alert(error.message);
        });
    },

    // Funcion que cierra la ventana para editar un registro y limpia los campos
    close() {
      this.booleans.dialog = false;
      this.booleans.alert = false;
      this.photo = null;
      this.editedIndex = -1;
      this.cleanData();
    },

    // Funcion que cierra la ventana para borrar un resgistro y limpa los campos
    closeDelete() {
      this.booleans.dialogDelete = false;
      this.editedIndex = -1;
      this.cleanData();
    },
  },

  computed: {
    /**Funcion computada que dependiendo del semestre seleccionado (Guardado en la variable semestre del objeto form)
     * devuelve las materias del pensum correspondiente a ese semestre
     */
    materias() {
      switch (this.form.semestre) {
        case "Primero":
          return [
            "Geometría Analítica",
            "Matemática I",
            "Educación Física y Salud",
            "Lógica",
            "Venezuela Contemporánea",
          ];

        case "Segundo":
          return [
            "Física I",
            "Matemática II",
            "Álgebra Lineal",
            "Creatividad e Inventiva",
            "Programación I",
          ];

        case "Tercero":
          return [
            "Física II",
            "Matemática III",
            "Ecuaciones Diferenciales",
            "Introducción a la Ingeniería",
            "Inglés",
            "Programación II",
          ];

        case "Cuarto":
          return [
            "Fundamentos de Electrónica",
            "Laboratorio de Física",
            "Lógica Simbólica",
            "Estadística I",
            "Algoritmos y Estructuras I",
            "Programación III",
          ];

        case "Quinto":
          return [
            "Estructuras Discretas I",
            "Diseño Lógico",
            "Estadística II",
            "Cálculo Numérico",
            "Algoritmos y Estructuras II",
            "Programación Web",
          ];

        case "Sexto":
          return [
            "Estructuras Discretas II",
            "Control e Instrumentación",
            "Organización del Computador",
            "Comunicación de Datos",
            "Sistemas de Bases de Datos",
            "Sistemas de Programas",
          ];

        case "Septimo":
          return [
            "Traductores e Interpretadores",
            "Programación Matemática",
            "Redes de Computadoras",
            "Sistemas de Operación",
            "Lenguajes de Programación",
            "Sistemas de Información I",
          ];

        case "Octavo":
          return [
            "Métodos Cuantitativos",
            "Arquitectura del Computador",
            "Metodología de la Investigación",
            "Interfaces con el Usuario",
            "Sistemas de Información II",
          ];

        case "Noveno":
          return [
            "Pasantía I o Trabajo de Grado I",
            "Control de Proyectos",
            "Ingeniería del Software",
          ];

        case "Decimo":
          return [
            "Cultura",
            "Pasantía II o Trabajo de Grado II",
            "Gerencia",
            "El Hombre y su Ambiente",
          ];

        case "Lectiva":
          return [
            "FORMACION DE EMPRENDEDORES",
            "TOPICOS AVANZ ING EN COMPU",
            "TIC Y NEGOCIOS ELECTRONICO",
          ];

        default:
          break;
      }
    },
  },

  // Al cargar la pagina se llama a la funcion para obtener los libros de la base de datos.
  created() {
    this.getBooks();
  },
};
</script>