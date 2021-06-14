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
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-row class="pt-5" style="background-color: #eeeeee">
      <v-container>
        <v-row class="fill-height" align="center" justify="center">
          <template v-for="(item, i) in semestres">
            <v-col :key="i" cols="12" md="4" class="p-0">
              <v-hover v-slot="{ hover }">
                <router-link :to="'/semestre/' + item.nombre">
                <v-card
                  :class="{ 'on-hover': hover }"
                  :elevation="hover ? 12 : 2"
                  tile
                  height="250">
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
    page: 0,
    semestres: [
      { nombre: "Primero", numero: 1 },
      { nombre: "Segundo", numero: 2 },
      { nombre: "Tercero", numero: 3 },
      { nombre: "Cuarto", numero: 4 },
      { nombre: "Quinto", numero: 5 },
      { nombre: "Sexto", numero: 6 },
      { nombre: "Septimo", numero: 7 },
      { nombre: "Octavo", numero: 8 },
      { nombre: "Noveno", numero: 9 },
      { nombre: "Decimo", numero: 10 },
    ],
  }),
  methods: {},
};
</script>