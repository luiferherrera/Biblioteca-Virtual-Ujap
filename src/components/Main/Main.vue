<template>
  <v-main>
    <v-card color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h1 class="display-2 font-weight-thin white--text mt-5">
              Biblioteca Virtual UJAP
            </h1>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="5">
            <v-text-field
              solo
              append-icon="mdi-book-search"
              label="Buscar Libros"
              v-model="search"
              @click:append="clickSearch"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-row class="pt-5" style="background-color: #eeeeee">
      <v-container>
        <v-row class="pb-5" align="center" justify="center">
          <template v-for="(item, i) in semestres">
            <v-col :key="i" cols="12" md="4" class="p-0">
              <v-hover v-slot="{ hover }">
                <router-link :to="'books/semestre/' + item.nombre">
                  <v-card
                    :class="{ 'on-hover': hover }"
                    :elevation="hover ? 12 : 2"
                    tile
                    height="250"
                  >
                    {{ item.nombre }}
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
    search: "",
    semestres: [
      { nombre: "Primero" },
      { nombre: "Segundo" },
      { nombre: "Tercero" },
      { nombre: "Cuarto" },
      { nombre: "Quinto" },
      { nombre: "Sexto" },
      { nombre: "Septimo" },
      { nombre: "Octavo" },
      { nombre: "Noveno" },
      { nombre: "Decimo" },
      { nombre: "Lectiva" },
    ],
  }),
  methods: {
    clickSearch () {
      this.$router.push("books/tittle/" + this.search.replace(/ /g, "-"));
    },
  },
};
</script>