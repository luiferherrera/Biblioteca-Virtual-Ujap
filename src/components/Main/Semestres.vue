<template>
  <v-main>
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">
              {{ semestre }}
            </h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-container fluid>
      <v-row no-gutters>
        <template v-for="(item, i) in books">
          <v-col :key="i" cols="auto" md="3" class="p-0">
            <v-hover v-slot="{ hover }">
              <v-card  max-width="300" :class="{ 'on-hover': hover }" tile>
                <v-dialog
                  v-model="dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-img
                      v-bind="attrs"
                      v-on="on"
                      :src="item.photoUrl"
                      :lazy-src="item.photoUrl"
                      class="justify-center"
                    >
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

                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-toolbar-title>{{ item.tittle }}</v-toolbar-title>
                    </v-toolbar>
                    <v-container class="fill-height">
                      <v-row class="fill-height">
                        <v-col  class="text-center" cols="4">
                          <v-img :src="item.photoUrl"> </v-img>
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
                        </v-col>
                        
                        <v-col cols="7">
                          <v-list>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Titulo:
                                </v-list-item-subtitle>
                                <v-list-item-title >{{
                                  item.tittle
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Autor:
                                  </v-list-item-subtitle>
                                <v-list-item-title>{{
                                  item.autor
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Edicion:
                                  </v-list-item-subtitle>
                                <v-list-item-title>{{
                                  item.edicion
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Año:
                                  </v-list-item-subtitle>
                                <v-list-item-title>{{
                                  item.year
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Semestre:
                                  </v-list-item-subtitle>
                                <v-list-item-title>{{
                                  item.semestre
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Materia:
                                  </v-list-item-subtitle>
                                <v-list-item-title>{{
                                  item.materia
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>
                                  Resumen:
                                  </v-list-item-subtitle>
                                <v-list-item-action-text class="text-subtitle-1 black--text">{{
                                  item.resumen
                                }}</v-list-item-action-text>
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
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    semestre: "",
    dialog: false,
    books: [],
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
    getBooks() {
      firebase
        .firestore()
        .collection("libros")
        .where("semestre", "==", this.semestre)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.books.push(doc.data());
          });
        })
        .catch((error) => {
          console.log("Error al obtener datos:", error);
        });
    },
  },

  created() {
    this.semestre = this.$route.params.id;
    this.getBooks();
  },
};
</script>