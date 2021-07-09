<template>
  <v-main>
    <v-card color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h1 class="display-2 font-weight-thin white--text mt-5">
              Materias
            </h1>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="5">
            <v-text-field
              solo
              append-icon="mdi-book-search"
              label="Buscar Materias"
              v-model="searchText"
              @click:append="clickSearch"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

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

    <v-row v-if="!search" class="pt-5">
      <v-container>
        <template v-for="(semestre, i) in materias">
          <v-row :key="i" class="pb-10" align="center" justify="center">
            <template v-for="(materia, j) in semestre">
              <v-col :key="j" cols="12" md="4" class="p-0">
                <v-hover v-slot="{ hover }">
                  <router-link :to="'books/materia/' + format(materia)">
                    <v-card
                      :class="{ 'on-hover': hover }"
                      :elevation="hover ? 12 : 2"
                      tile
                      height="250"
                      color="grey lighten-4"
                    >
                      {{ materia }}
                    </v-card>
                  </router-link>
                </v-hover>
              </v-col>
            </template>
          </v-row>
        </template>
      </v-container>
    </v-row>

    <v-row v-if="search" class="pt-5">
      <v-container>
        <v-row class="pb-5" align="center" justify="center">
          <template v-for="(materia, i) in materiasSearch">
            <v-col :key="i" cols="12" md="4" class="p-0">
              <v-hover v-slot="{ hover }">
                <router-link :to="'books/materia/' + format(materia)">
                  <v-card
                    :class="{ 'on-hover': hover }"
                    :elevation="hover ? 12 : 2"
                    tile
                    height="250"
                    color="grey lighten-4"
                  >
                    {{ materia }}
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
    searchText: "",
    search: false,
    alert: false,
    materias: [
      [
        "Geometría Analítica",
        "Matemática I",
        "Educación Física y Salud",
        "Lógica",
        "Venezuela Contemporánea",
      ],
      [
        "Física I",
        "Matemática II",
        "Álgebra Lineal",
        "Creatividad e Inventiva",
        "Programación I",
      ],
      [
        "Física II",
        "Matemática III",
        "Ecuaciones Diferenciales",
        "Introducción a la Ingeniería",
        "Inglés",
        "Programación II",
      ],
      [
        "Fundamentos de Electrónica",
        "Laboratorio de Física",
        "Lógica Simbólica",
        "Estadística I",
        "Algoritmos y Estructuras I",
        "Programación III",
      ],
      [
        "Estructuras Discretas I",
        "Diseño Lógico",
        "Estadística II",
        "Cálculo Numérico",
        "Algoritmos y Estructuras II",
        "Programación Web",
      ],
      [
        "Estructuras Discretas II",
        "Control e Instrumentación",
        "Organización del Computador",
        "Comunicación de Datos",
        "Sistemas de Bases de Datos",
        "Sistemas de Programas",
      ],
      [
        "Traductores e Interpretadores",
        "Programación Matemática",
        "Redes de Computadoras",
        "Sistemas de Operación",
        "Lenguajes de Programación",
        "Sistemas de Información I",
      ],
      [
        "Métodos Cuantitativos",
        "Arquitectura del Computador",
        "Metodología de la Investigación",
        "Interfaces con el Usuario",
        "Sistemas de Información II",
      ],
      [
        "Pasantía I o Trabajo de Grado I",
        "Control de Proyectos",
        "Ingeniería del Software",
      ],
      [
        "Cultura",
        "Pasantía II o Trabajo de Grado II",
        "Gerencia",
        "El Hombre y su Ambiente",
      ],
      [
        "FORMACION DE EMPRENDEDORES",
        "TOPICOS AVANZ ING EN COMPU",
        "TIC Y NEGOCIOS ELECTRONICO",
      ],
    ],
    materiasSearch: [],
  }),
  methods: {
    format(name) {
      const format = name.replace(/ /g, "-");
      return format;
    },

    clickSearch() {
      this.alert = false;
      if (this.searchText) {
        this.search = true;
        this.materiasSearch = [];
        for (let i = 0; i <= this.materias.length - 1; i++) {
          for (let j = 0; j <= this.materias[i].length - 1; j++) {
            let format = this.materias[i][j]
              .normalize("NFKD")
              .replace(/[\u0300-\u036F]/g, "")
              .toLowerCase();
            if (format.includes(this.searchText.toLowerCase())) {
              this.materiasSearch.push(this.materias[i][j]);
            }
          }
        }
        if (this.materiasSearch.length == 0){
          this.alert=true;
        }
      } else {
        this.search = false;
      }
    },
  },
};
</script>
