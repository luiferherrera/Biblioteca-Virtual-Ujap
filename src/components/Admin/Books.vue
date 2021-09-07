<template>
  <!-- Componente dentro de la consola de administracion que permite agregar un nuevo libro a la plataforma,
  esta cuenta con un formulario para ingresar los datos necesarios para agregar el libro como son: 
  titulo, semestre, materia, autor, año, edicion, resumen y portada, ademas cuenta con un boton para guardar el libro
  y un componente alert para notificar que el libro fue guardado correctamente-->
  <v-container fluid>
    <!-- Alert tipo succes-text para comfirmar que el libro fue guardado correctamente -->
    <v-alert
      type="success"
      transition="scale-transition"
      border="left"
      text
      v-model="alert"
      >Libro Guardado</v-alert
    >
    <v-row>
      <!-- Formulario para ingresar los datos necesarios para guerdar el libro -->
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row justify="center" align="center">
            <v-col class="text-center" cols="7">
              <v-container>
                <v-row>
                  <!-- Input text para ingresar el titulo del libro -->
                  <v-text-field
                    prepend-inner-icon="mdi-tag-text"
                    label="Titulo del Libro"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    v-model="form.tittle"
                    :rules="[rules.required]"
                    required
                  >
                  </v-text-field>
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
                      @change="form.materia = ''"
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
                    <!-- Input text para ingresar el autor del libro -->
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
                    <!-- Input text de gran tamaño y multilinea para colocar un resumen del libro -->
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
                <v-row>
                  <!-- Caja para previsualizar la portada del libro -->
                  <v-img height="450" :src="form.photoUrl"></v-img>
                </v-row>

                <v-row>
                  <!-- Input file para ingresar la foto de portada del libro -->
                  <v-file-input
                    accept="image/*"
                    prepend-icon="mdi-file-image"
                    color="blue darken-3"
                    label="Portada"
                    v-model="form.photo"
                    @change="photoChange"
                    :rules="[rules.required, rules.size]"
                    show-size
                    required
                  ></v-file-input>
                </v-row>

                <v-row>
                  <!-- Input para el link del libro -->
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

          <v-row justify="center">
            <!-- Boton para guardar el registro dentro de la plataforma -->
            <v-btn dark color="indigo" :loading="loading" @click="clickSave">
              Agregar Libro
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-row>

    <v-row>
      <!-- Router-view para mostrar la tabla donde se muestran todos los libros que existen dentro de la plataforma -->
      <router-view></router-view>
    </v-row>
  </v-container>
</template>

<script>
// Importar librerias de Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import Vue from 'vue';

export default {
  data() {
    return {
      // Variable booleana para controlar si se muestra o no el alert
      alert: false,
      // Variable para controlar cuando se este agregando el resgistro en la base de datos de la plataforma
      loading: false,
      //  Variable para validar que todos los datos del formulario estan rellenos y son validos
      valid: false,
      /*Objeto donde se guardan los datos del formulario y otros datos necesarios para guardar el libro
       * en la base de datos como son el link de la foto y su ruta dentro de la BBD
       */
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
      // Reglas para validar los datos dentro del formulario
      rules: {
        // Regla para el campo requerido
        required: (value) => !!value || "Este Campo es requerido.",
        // Regla para que sea un link valido
        link: (value) => {
          if (value) {
            const pattern =
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/;
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
    };
  },
  methods: {
    // Funcion que valida el formulario
    validar() {
      this.$refs.form.validate();
    },

    // Funcion para limpiar el formulario y colocar de nuevo la miniatura por defecto.
    cleanForm() {
      this.$refs.form.reset();
      this.form.photoUrl =
        "https:firebasestorage.googleapis.com/v0/b/react-login-7ff2a.appspot.com/o/gui-2311260_640.png?alt=media&token=01577ef5-f63e-4d65-9674-807983604f2e";
    },

    /**Funcion que cuando se modifica un registro, si se selecciona una nueva foto
     * Genera una URL para asi previsualizarla en la caja correspondiente antes de subir esta a la plataforma
     * y en caso de que quitarla volver a la foto original.
     */
    photoChange() {
      if (this.form.photo) {
        this.form.photoUrl = URL.createObjectURL(this.form.photo);
      } else {
        this.form.photoUrl =
          "https:firebasestorage.googleapis.com/v0/b/react-login-7ff2a.appspot.com/o/gui-2311260_640.png?alt=media&token=01577ef5-f63e-4d65-9674-807983604f2e";
      }
    },

    /* Funnncion que al momento de dar click en el boton guardar, verifica que se hayan ingresado todos los datos
     * del formulario, y que estos sean validos para luego llamar a la funcion que realiza el guardado de la BBD
     */
    clickSave() {
      this.validar();
      this.alert = false;
      Vue.nextTick(() => {
        if (
          this.form.tittle &&
          this.form.semestre &&
          this.form.materia &&
          this.form.autor &&
          this.form.year &&
          this.form.edicion &&
          this.form.resumen &&
          this.form.photo &&
          this.form.link &&
          this.valid
        ) {
          this.loading = true;
          this.saveBook();
        }
      });
    },

    /* Funcion que guarda la  foto de portada en la base de datos y obtiene el link de la misma,
     * guarda su ruta en la base de datos y el link de la foto dentro del objeto form
     * y llama a la funcion para crear un nuevo documento y guardar la informacion en la BBD
     */
    saveBook() {
      var ruta = "libros/" + this.form.photo.name;
      var storage = firebase.storage().ref();
      // Guardar la foto en el almacenamiento de la base de datos
      storage
        .child(ruta)
        .put(this.form.photo)
        .then((snapshot) => {
          // Obtener el link de la foto
          storage
            .child(ruta)
            .getDownloadURL()
            .then((url) => {
              // Guardar la informacion en el formulario y llama a la funcion para guardar.
              this.form.photoUrl = url;
              this.form.photoRef = ruta;
              this.saveData();
            })
            .catch((error) => {
              alert(error.message);
              this.loading = false;
            });
        })
        .catch((error) => {
          alert(error.message);
          this.loading = false;
        });
    },

    /**Funcion que crea un nuevo documento dentro de la base de datos con ID autogenerado
     * y guarda la infomacion del libro junto con el resto de datos necesarios.
     */
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
          ratings: [],
          average: 0,
        })
        .then(() => {
          this.alert = true;
          this.cleanForm();
        })
        .catch(function (error) {
          alert(error.message);
        })
        .finally(() => {
          this.loading = false;
        });
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
        default:
          break;
      }
    },
  },
};
</script>