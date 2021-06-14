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
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-main>
</template>