<template>
  <!-- Componente de la vista principal en la cual el usuario pude buscar libros por nombre a partir de un input text
  y por semestre a travez de una serie de cajas con nombre que representan los diferentes semestres -->
  <v-main>
    <!-- Caja donde se muestra el titulo de la plataforma junto con el input text para buscar los libros por nombre -->
    <v-card color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <!-- Titulo -->
            <h1 class="display-2 font-weight-thin white--text mt-5">
              Biblioteca Virtual UJAP
            </h1>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="5">
            <!-- Input text para la busqueda de los libros por nombre -->
            <v-text-field
              solo
              append-icon="mdi-book-search"
              label="Buscar Libros"
              v-model="search"
             @click:append="clickSearch"
             @keyup.enter="clickSearch"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  
      <!-- Cajas correspondiente a cada semestre  -->
    <v-row class="pt-5" style="background-color: #eeeeee">
      <v-container>
        <v-row class="pb-5" align="center" justify="center">

          <!-- for que se ejecutara por cada uno de los semestres (guardados en el array "semestres") lo que permite
          generar un caja independiente por cada uno -->
          <template v-for="(item, i) in semestres">
            <v-col :key="i" cols="12" md="4" class="p-0">

              <!-- hover para detectar cuando el se pasa el muse por arriba de la caja -->
              <v-hover v-slot="{ hover }">

                <!-- Router link para redirigir a la busqueda por semestres del cual se hizo click -->
                <router-link :to="'books/semestre/' + item.id">

                  <!-- Caja individual por cada semestre, esta muestra un logo con el numero del semestre y al pasar 
                  el mouse por encima de esta se muestra el semesntre en texto -->
                  <v-card
                    :class="{ 'on-hover': hover }"
                    :elevation="hover ? 12 : 2"
                    tile
                    height="250"
                  >
                    <!-- Mostrar el logo del semestre -->
                    <v-img :src="item.link" height="250">

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

                      <!-- Caja que se despliega con una animacion tipo "expand" por encima del logo, al pasar 
                      el mouse por arriba de la esta y muestra semestre en texto  -->
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          :style="mask"
                          class="d-flex white--text text-center text-md"
                        >
                          {{ item.name }}
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </router-link>
              </v-hover>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-row>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    // Variable donde se guarda el nombre del libro que se desa buscar ingresado en el text input
    search: "",
    // Array con la informacion de los diferentes semestres, esta se encuentra guardadas en objetos uno por cada semestre
    // ID: id para la busqueda, name: nombre en texto del semestre, link: Url del logo del semestre
    semestres: [
      {
        id: "Primero",
        name: "Primer Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fprimero.png?alt=media&token=e228bf4d-8df7-4aa8-8d27-99d1914adbfb",
      },
      {
        id: "Segundo",
        name: "Segundo Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fsegundo.png?alt=media&token=16511c75-2b73-4def-b3e0-0ea064737c31",
      },
      {
        id: "Tercero",
        name: "Tercer Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Ftercero.png?alt=media&token=05fcb514-a308-425e-a275-eaf1550acbdd",
      },
      {
        id: "Cuarto",
        name: "Cuarto Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fcuarto.png?alt=media&token=e75838c7-6c6e-4e37-8165-fb77a7321e21",
      },
      {
        id: "Quinto",
        name: "Quinto Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fquinto.png?alt=media&token=314f9674-88c7-470c-8234-b2bb919ffd89",
      },
      {
        id: "Sexto",
        name: "Sexto Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fsexto.png?alt=media&token=989c76ea-3cba-4e7f-82ad-a51989d55dd1",
      },
      {
        id: "Septimo",
        name: "Septimo Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fseptimo.png?alt=media&token=d1f18437-e59f-4da2-878a-35dd1059c3be",
      },
      {
        id: "Octavo",
        name: "Octavo Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Foctavo.png?alt=media&token=dbe114b3-662c-4bdc-9a60-01d389714400",
      },
      {
        id: "Noveno",
        name: "Noveno Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fnoveno.png?alt=media&token=57dce937-8ee2-43e7-86cb-310a754b7ae3",
      },
      {
        id: "Decimo",
        name: "Decimo Semestre",
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2FDecimo.png?alt=media&token=500fe2f8-4b4e-40aa-ba76-a5940f4c6e3e",
      },
    ],
    // Objeto que contiene el estilo que posee la caja que se despliega por encima del logo del semestre al pasar mouse 
    // por arriba
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
    /**Funcion que redirige a la pagina de busquedas por titulo del libro con el ingresado en el input text */
    clickSearch() {
      this.$router.push("books/tittle/" + this.search.replace(/ /g, "-"));
    },
  },
};
</script>