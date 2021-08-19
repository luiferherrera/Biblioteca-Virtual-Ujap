<template>
  <!-- Componente de la vista principal en la cual el usuario pude buscar libros por materia a travez de una serie 
  de cajas representan los diferentes materias y al darle click se redirig e a la busqueda, estas cajas cuentan con un
  logo de la materia y al pasar el mouse por arriba de esta se muestra el nombre de la materia correspondiente,
  igualmente cuenta con un campo para buscar las materias por su nombre -->
  <v-main>
    <!-- Caja donde se muestra el titulo de la ventana junto con el input text para buscar la materia por nombre -->
    <v-card color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <!-- Titulo -->
            <h1 class="display-2 font-weight-thin white--text mt-5">
              Materias
            </h1>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="5">
            <!-- Input text para la busqueda de la materia -->
            <v-text-field
              solo
              append-icon="mdi-book-search"
              label="Buscar Materias"
              v-model="searchText"
              @keyup.enter="clickSearch"
              @click:append="clickSearch"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Alert color rojo que se despliega con una animacion de tipo "fade" y muestra un mensaje de error diciendo que 
    no se encontraron materias con el nombre ingresado  -->
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
        No se han encontrado materias con ese nombre, por favor verifica.
      </v-alert>
    </v-fade-transition>

    <!-- Caja principal donde se muestran todas las cajas correspondiente a cada una de las materias del pensum 
    en caso de que no se haya realizado una busqueda -->
    <v-row v-if="!search" class="pt-5">
      <v-container>
        <!-- For anidado para generar las cajas correspondiente a cada materia, guardadas en el array "materias"
        donde cada elemento del array representa un semestre y su contenido es otro array con la informacion 
        de las materias correspondientes a ese semestre -->

        <!-- Primer for correspondiente al semestre (elementos del array "materias") -->
        <template v-for="(semestre, i) in materias">
          <v-row :key="i" class="pb-10" align="center" justify="center">
            <!-- for anidado el cual genera las cajas corespondiente a las materias del semestre -->
            <template v-for="(materia, j) in semestre">
              <v-col :key="j" cols="12" md="4" class="p-0">
                <!-- hover para detectar cuando el se pasa el muse por arriba de la caja -->
                <v-hover v-slot="{ hover }">
                  <!-- Router link para redirigir a la busqueda de libros de la materia seleccionada -->
                  <router-link :to="'books/materia/' + format(materia.id)">
                    <!-- Caja individual por cada materia, esta muestra un logo representado la materia y al pasar 
                    el mouse por encima de esta se muestra el nombre de la materia -->
                    <v-card
                      :class="{ 'on-hover': hover }"
                      :elevation="hover ? 12 : 2"
                      tile
                      height="250"
                      color="grey lighten-4"
                    >
                    <!-- Mostrar el logo de la materia -->
                    <v-img :src="materia.link" height="250">

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
                          {{ materia.id }}
                        </div>
                      </v-expand-transition>
                    </v-img> 
                    </v-card>
                  </router-link>
                </v-hover>
              </v-col>
            </template>
          </v-row>
        </template>
      </v-container>
    </v-row>

    <!-- Caja donde se muestran las cajas correspondiente a las materias cuyos nombres coincidan con el buscado
    es decir que esta solo se muestra si se realiza una busqueda -->
    <v-row v-if="search" class="pt-5">
      <v-container>
        <v-row class="pb-5" align="center" justify="center">

          <!-- for que se ejecutara por cada una de las materias que coincidan con la busqueda (guardadas en el array
           "materiasSearch") lo que permite generar un caja independiente por cada una -->
          <template v-for="(materia, i) in materiasSearch">
            <v-col :key="i" cols="12" md="4" class="p-0">

              <!-- hover para detectar cuando el se pasa el muse por arriba de la caja -->
              <v-hover v-slot="{ hover }">
                <!-- Router link para redirigir a la busqueda por semestres del cual se hizo click -->
                <router-link :to="'books/materia/' + format(materia.id)">
                  <!-- Caja individual por cada materia, esta muestra un logo representado la materia y al pasar 
                  el mouse por encima de esta se muestra el nombre de la materia -->
                  <v-card
                    :class="{ 'on-hover': hover }"
                    :elevation="hover ? 12 : 2"
                    tile
                    height="250"
                    color="grey lighten-4"
                  >
                    <!-- Mostrar el logo de la materia -->
                    <v-img :src="materia.link" height="250">

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
                          {{ materia.id }}
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
    // Variable donde se guarda el nombre de la materia que se desa buscar ingresado en el text input
    searchText: "",
    // Variable para el control de si se ha realizado o no una busqueda de materia
    search: false,
    // Variable para el control del despliegue del alert en caso de que no se encuentran materias durante la busqueda
    alert: false,
    // Array con la informacion de las materias, los elementos de este son otro array que representa cada semestre y en
    // interior contiene la informacion de las materias de ese semestre, la cual se encuentra en un objeto con el
    // con el nombre de la materia y el link del logo
    materias: [
      [
        { id: "Geometría Analítica", link: "" },
        { id: "Matemática I", link: "" },
        { id: "Educación Física y Salud", link: "" },
        { id: "Lógica", link: "" },
        { id: "Venezuela Contemporánea", link: "" },
      ],
      [
        { id: "Física I", link: "" },
        { id: "Matemática II", link: "" },
        { id: "Álgebra Lineal", link: "" },
        { id: "Creatividad e Inventiva", link: "" },
        { id: "Programación I", link: "" },
      ],
      [
        { id: "Física II", link: "" },
        { id: "Matemática III", link: "" },
        { id: "Ecuaciones Diferenciales", link: "" },
        { id: "Introducción a la Ingeniería", link: "" },
        { id: "Inglés", link: "" },
        { id: "Programación II", link: "" },
      ],
      [
        { id: "Fundamentos de Electrónica", link: "" },
        { id: "Laboratorio de Física", link: "" },
        { id: "Lógica Simbólica", link: "" },
        { id: "Estadística I", link: "" },
        { id: "Algoritmos y Estructuras I", link: "" },
        { id: "Programación III", link: "" },
      ],
      [
        { id: "Estructuras Discretas I", link: "" },
        { id: "Diseño Lógico", link: "" },
        { id: "Estadística II", link: "" },
        { id: "Cálculo Numérico", link: "" },
        { id: "Algoritmos y Estructuras II", link: "" },
        { id: "Programación Web", link: "" },
      ],
      [
        { id: "Estructuras Discretas II", link: "" },
        { id: "Control e Instrumentación", link: "" },
        { id: "Organización del Computador", link: "" },
        { id: "Comunicación de Datos", link: "" },
        { id: "Sistemas de Bases de Datos", link: "" },
        { id: "Sistemas de Programas", link: "" },
      ],
      [
        { id: "Traductores e Interpretadores", link: "" },
        { id: "Programación Matemática", link: "" },
        { id: "Redes de Computadoras", link: "" },
        { id: "Sistemas de Operación", link: "" },
        { id: "Lenguajes de Programación", link: "" },
        { id: "Sistemas de Información I", link: "" },
      ],
      [
        { id: "Métodos Cuantitativos", link: "" },
        { id: "Arquitectura del Computador", link: "" },
        { id: "Metodología de la Investigación", link: "" },
        { id: "Interfaces con el Usuario", link: "" },
        { id: "Sistemas de Información II", link: "" },
      ],
      [
        { id: "Pasantía I o Trabajo de Grado I", link: "" },
        { id: "Control de Proyectos", link: "" },
        { id: "Ingeniería del Software", link: "" },
      ],
      [
        { id: "Cultura", link: "" },
        { id: "Pasantía II o Trabajo de Grado II", link: "" },
        { id: "Gerencia", link: "" },
        { id: "El Hombre y su Ambiente", link: "" },
      ],
    ],
    // Array donde se guardan aquellas materias cuyo nombre coincida con aquel que el usuario haya buscado
    materiasSearch: [],
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
    /*Funcion que da formato al nombre de la materia para ser pasado al modulo de busqueda de libros 
    (reemplazar espacion por guiones)*/
    format(name) {
      const format = name.replace(/ /g, "-");
      return format;
    },
    
    /**Funcion que cuando se realiza una busqueda obtiene las materias cuyo nomber coincida con el introducido en el
    input text y en caso de que este se encuentre vacio devuelve todas las materias disponibles */
    clickSearch() {
      this.alert = false;
      // Verifica que se haya introducido un nombre
      if (this.searchText) {
        this.search = true;
        this.materiasSearch = [];
        // Recorrer array de materias para comprobar si el nombre conincide
        for (let i = 0; i <= this.materias.length - 1; i++) {
          for (let j = 0; j <= this.materias[i].length - 1; j++) {
            // dar formato al nombre actual de la materia para su comprobacion
            let format = this.materias[i][j].id
              .normalize("NFKD")
              .replace(/[\u0300-\u036F]/g, "")
              .toLowerCase();
            // Comprobar si el nombre coincide y agregarlo al array de busqueda
            if (format.includes(this.searchText.toLowerCase())) {
              this.materiasSearch.push(this.materias[i][j]);
            }
          }
        }
        // En caso de que no exista coincidencias mostrar el alert de error
        if (this.materiasSearch.length == 0) {
          this.alert = true;
        }
        // Si no se intrudujo un nombre mostrar todas las materias
      } else {
        this.search = false;
      }
    },
  },
};
</script>
