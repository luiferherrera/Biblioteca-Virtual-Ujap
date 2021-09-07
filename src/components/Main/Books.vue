<template>
  <!-- Modulo que permite mostrar los resultados de la busqueda de libros ya sea por semestre, materia o nombre de este
  cuenta con una caja donde se muestra el titulo o termino buscado, bajo de esta se muestran los libros resultado de la
  busqueda en cajas pequeñas que cuentan con la portada del libro y las cuales al pasar el mouse por arriba muestran
  el titulo del libro con una aminacion, ademas de esto cuenta con una ventana modal donde se puede ver toda la informacion
  del libro seleccionado y desde donde se puede abrir el libro y calificarlo en una escala de 5 estrellas -->
  <v-main>
    <!--Caja donde se muestra el titulo o termino de busqueda de libros  -->
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">
              {{ name }}
            </h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Alert color rojo que se despliega con una animacion de tipo "fade" y muestra un mensaje de error de que no
    se encontraron libros para mostrar  -->
    <v-fade-transition>
      <v-alert
        v-if="alert"
        text
        prominent
        v-model="alert"
        type="error"
        icon="mdi-close-circle"
        border="right"
        class="ma-2"
      >
        {{ alertMessage }}
      </v-alert>
    </v-fade-transition>

    <!-- Contenedor donde se mostrarar los libros que coincidan con la busqueda realizada -->
    <v-container fluid>
      <v-row no-gutters align="center" justify="center">
        <!-- for que se ejecutara por cada uno de los libros resultados (guardados en el array "books") lo que permite
        generar un caja independiente por cada libro -->
        <template v-for="(item, i) in books">
          <v-col :key="i" cols="auto" md="3" class="p-0">
            <!-- hover para detectar cuando el se pasa el muse por arriba de la caja -->
            <v-hover v-slot="{ hover }">
              <!-- Caja individual de cada del libro resultado de la busqueda, esta muestra la portada del libro
              y el titulo al pasar el mouse, ademas funciona como activador para mostrar una ventana modal donde 
              se ve toda la informacion del libro, el boton para abrir el libro y la escala para calificarlo -->
              <v-card max-width="300" :class="{ 'on-hover': hover }" tile>
                <!-- dialog para generar la ventana modal que ocupa toda la pantalla "fullscreen" y que se despliega
                con una animacion de barido desd el fondo al dar click en el activador en este caso la portada del libro -->
                <v-dialog
                  v-model="dialog[i]"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <!-- Activador de dialog o el elemnto que se mostrara normalmente en la caja individual del libro
                   hasta que se de click sobre esta y abra la ventana modal con la informacion correspondiente  -->
                  <template v-slot:activator="{ on, attrs }">
                    <!-- Mostrar la portada del libro como activador -->
                    <v-img
                      v-bind="attrs"
                      v-on="on"
                      :src="item.photoUrl"
                      :lazy-src="item.photoUrl"
                      class="justify-center mt-2"
                      @click="rating = item.average"
                    >
                      <!-- Animacion de carga de la imagen (circulo girando) mientras se carga esta de la base de datos -->
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey"
                          ></v-progress-circular>
                        </v-row>
                      </template>

                      <!-- Caja que se despliega con una animacion tipo "expand" por encima de la imagen de la portada
                       al pasar el mouse por arriba de la esta y muestra el titulo del libro  -->
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          :style="mask"
                          class="d-flex white--text text-center text-md"
                        >
                          {{ item.tittle }}
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </template>

                  <!-- Contenido de la ventana modal con la informacion del libro -->
                  <v-card>
                    <!-- Toolbar superior color azul que contiene el boton par cerrar la ventana modal y el titulo -->
                    <v-toolbar dark color="primary">
                      <!-- Boton para cerrar la ventana modal -->
                      <v-btn icon dark @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>

                      <!-- Titulo del libro  -->
                      <v-toolbar-title>{{ item.tittle }}</v-toolbar-title>
                    </v-toolbar>

                    <!-- Conenedor donde se muestra la informacion del libro -->
                    <v-container class="fill-height">
                      <v-row class="fill-height">
                        <!-- Dividir la ventana en dos partes (Izquierda y derecha) -->
                        <v-col class="text-center" cols="4">
                          <!-- Mostar la portada del libro  -->
                          <v-img :src="item.photoUrl"> </v-img>

                          <!-- Boton para abrir el libro en una pestaña nueva -->
                          <v-btn
                            class="mt-5"
                            color="green"
                            dark
                            :href="item.link"
                            target="_blank"
                          >
                            <v-icon>mdi-link</v-icon>
                            Ver Libro
                          </v-btn>

                          <!-- Escala de 5 estrellas para calificar el libro, originalmente son de color azul y muestra
                           el promedio de las calificaciones dadas por otros usuarios, si se coloca una calificacion
                           pasan a ser color rojo y se colocan en modo readonly  -->
                          <v-rating
                            class="pt-5"
                            empty-icon="mdi-star-outline"
                            full-icon="mdi-star"
                            half-icon="mdi-star-half-full"
                            hover
                            length="5"
                            :color="
                              readonly ? 'red lighten-3' : 'blue darken-3'
                            "
                            :background-color="
                              readonly ? 'red lighten-3' : 'blue darken-3'
                            "
                            :readonly="readonly"
                            v-model="rating"
                            @input="clickRating(item)"
                          ></v-rating>
                        </v-col>

                        <!-- Segunda parte de la ventana modal (lado derecho) -->
                        <v-col cols="7">
                          <!-- Lista para dar formato y mostrar los elementos en orden -->
                          <v-list>
                            <!-- Mostral el titulo completo de libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Titulo:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.tittle }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar el autor del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Autor:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.autor }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar la edicion del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Edicion:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.edicion }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar año de publicacion del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Año:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.year }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar el semestre al que pertenece del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Semestre:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.semestre }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar la materia a la que corresponde del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Materia:
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                  {{ item.materia }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Mostrar el resumen del contenido del libro -->
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Resumen:
                                </v-list-item-subtitle>
                                <v-list-item-action-text
                                  class="text-subtitle-1 black--text"
                                >
                                  {{ item.resumen }}
                                </v-list-item-action-text>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-card>
            </v-hover>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
// Importar librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    // Variable para en control del alert en caso de que no se encontraran libros
    alert: false,
    // Mensaje que se mostrara dentro del alert ya sea que no se encuentran libros o que se debe inciar sesion
    alertMessage: "",
    // Nonmbre o termino por el cual se desea realizar la busqueda de libros
    name: "",
    // Caracteristica por la cual se desa buscar ya sea por titulo, semestre o materia
    id: "",
    // promedio de calificaciones que posee el libro o calficacion que le dio el usuario al libro
    rating: 0,
    // Nuevo promedio de calificaciones incluenyendo la que recientemente dio el usuario
    newAverage: "",
    // Nuevo array con las calificaciones de los usuarios incluyendo la recientemente dada por el usuario
    newRatings: [],
    // Variable para controlar el estado de escala de calificacion si permite agregar una nueva calificacion
    readonly: false,
    // Array cuyos elementos representan variables para el control del despliegue de las deferentes ventanas modal
    dialog: [],
    // Array donde se guardan los libros resultantes de la busqueda desde la base de datos
    books: [],
    // Objeto que contiene el estilo que posee la caja que se despliega por encima de la portada del libro
    // (activador de la ventana modal) al pasar mouse por arriba y que incluye en titulo del libro
    mask: {
      width: "100%",
      height: "100%",
      "background-color": "#F4433690",
      "font-size": "2rem",
      "font-weight": "bold",
      "align-items": "center",
      "justify-content": "center",
      position: "absolute",
      bottom: 0,
    },
  }),

  methods: {
    /**Funcion que realiza la consulta en la base de datos con la busqueda deseada, obtiene los libros que conincidan
     * y los guarda en el array "books", en caso de que no se encuentren libros o que el usuario no haya inciado sesion
     * despliega el alert con el mensaje correspondiente
     */
    // getBooks() {
    //   // Realizar consulta a partir de la caracteristica a buscar (id) y el termino a bucar (name)
    //   firebase
    //     .firestore()
    //     .collection("libros")
    //     .where(this.id, "==", this.name)
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         // guardar libros en el array "books"
    //         let data = doc.data();
    //         data.id = doc.id;
    //         this.books.push(data);
    //       });

    //       /*En caso de que no se encuentren libros que coincidan mostrar el alert con el mensaje:
    //         "No se encontraron libros, por favor verifique e intente nuevamente." */
    //       if (this.books.length == 0) {
    //         this.alertMessage =
    //           "No se encontraron libros, por favor verifique e intente nuevamente.";
    //         this.alert = true;
    //       }
    //     })
    //     .catch((error) => {
    //       /*En caso de que el usuario no haya iniciado sesion mostrar el alert con el mensaje:
    //         "Se Produjo un error, debe iniciar Secion para poder acceder a los libros." */
    //       if ((error.message = "Missing or insufficient permissions")) {
    //         this.alertMessage =
    //           "Se Produjo un error, debe iniciar Secion para poder acceder a los libros.";
    //         this.alert = true;
    //       }
    //       else{
    //         alert(error.message);
    //       }
    //     });
    // },

    getBooks() {
      // Realizar consulta a partir de la caracteristica a buscar (id) y el termino a bucar (name)
      firebase
        .firestore()
        .collection("libros")
        .where(this.id, "==", this.name)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let already_exits = false;
            for (let i = 0; i < this.books.length; i++) {
              if (this.books[i].tittle == doc.data().tittle) {
                already_exits = true;
              }
            }
            if (!already_exits) {
              let data = doc.data();
              data.id = doc.id;
              this.books.push(data);
            }
          });

          /*En caso de que no se encuentren libros que coincidan mostrar el alert con el mensaje:
            "No se encontraron libros, por favor verifique e intente nuevamente." */
          if (this.books.length == 0) {
            this.alertMessage =
              "No se encontraron libros, por favor verifique e intente nuevamente.";
            this.alert = true;
          }
        })
        .catch((error) => {
          /*En caso de que el usuario no haya iniciado sesion mostrar el alert con el mensaje:
            "Se Produjo un error, debe iniciar Secion para poder acceder a los libros." */
          if ((error.message = "Missing or insufficient permissions")) {
            this.alertMessage =
              "Se Produjo un error, debe iniciar Secion para poder acceder a los libros.";
            this.alert = true;
          } else {
            alert(error.message);
          }
        });
    },

    /**Funcion que cierra la ventana modal con la informacion del libro, para esto mediante un ciclo for se recorre el
     * array correspondiente ("dialog") hasta encontrar la ventana abierta (valor 'true') y procede a cerrarla ('false")
     */
    closeModal() {
      // Recorrer array
      for (let i = 0; i < this.dialog.length; i++) {
        // Buscar ventan abierta
        if (this.dialog[i] == true) {
          // Si esta abierta cerrarla
          this.$set(this.dialog, i, false);
        }
      }
    },

    /**Funcion que en caso de que el usuario le de una calificacion al libro con la escala de entrellas genera los nuevos
     * valores del promedio de calificaciones y el array con las mismas y luego actualiza estos datos en la base de datos
     * y bloquea la escala colocandola en "readonly" para que no se coloquen mas calificaciones
     */
    clickRating(item) {
      //  Colocar escala en modo "readonly"
      this.readonly = true;

      // Generar nuevos valores
      this.newValues(item);
      // Actualizar en la base de datos
      firebase
        .firestore()
        .collection("libros")
        .doc(item.id)
        .update({
          ratings: this.newRatings,
          average: this.newAverage,
        })
        .catch(function (error) {
          alert(error.message);
        });
    },

    /**Funcion que genera el nuevo promedio de calificaciones y el array con todas las calificaiones del libro,
     * resultado de la nueva calificacion daba por el usuario
     */
    newValues(item) {
      // Generar nuevo array con todas las calificaiones dadas al libro
      this.newRatings = item.ratings;
      this.newRatings.push(this.rating);

      // Calcular el promedio de todas las calificaciones
      let sum = 0;
      for (let i = 0; i < this.newRatings.length; i++) {
        sum = sum + this.newRatings[i];
      }
      this.newAverage = sum / this.newRatings.length;
    },
  },

  /**Al cargar la pagina obtener el la caracteristica que se desea buscar (id) y el termino a buscar (name)
   * y luego llamar la funcion para realizar la consulta a la BBd y obtener los libros.
   */
  created() {
    // Obtener el "name" con el formato correspondiente (reemplazar guiones por espacios)
    this.name = this.$route.params.name.replace(/-/g, " ");
    // Obtener el id
    this.id = this.$route.params.id;
    this.getBooks();
  },
};
</script>