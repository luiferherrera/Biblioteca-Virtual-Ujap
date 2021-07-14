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
                <router-link :to="'books/semestre/' + item.id">
                  <v-card
                    :class="{ 'on-hover': hover }"
                    :elevation="hover ? 12 : 2"
                    tile
                    height="250"
                  >
                    <v-img :src="item.link" height="250">
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
    search: "",
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
        link: "https://firebasestorage.googleapis.com/v0/b/biblioteca-virtual-ujap.appspot.com/o/logos%2Fdecimo.png?alt=media&token=625ebb41-d3a7-475a-93ee-a89e7d82cabc",
      },
    ],
    
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
    clickSearch() {
      this.$router.push("books/tittle/" + this.search.replace(/ /g, "-"));
    },
  },
};
</script>