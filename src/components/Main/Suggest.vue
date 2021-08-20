<template>
 <!-- Modulo que permite a los usuarios enviar una sugerencia de un libro que consideran debe ser agregado a la pagina, 
  Para esto cuenta con un formulario con campos de identificacion del usuario, asi como datos para identificar el 
  libro que se esta sugiriendo, un campo para en caso que se desee dejar algun tipo de mensaje o comentario, 
  ademas de el boton correspondiente para enviar la sugerencia.-->
  <v-main>
    <!-- Caja con fondo azul donde se muestra el titulo de la ventana (Recomendar Libros) -->
    <v-card class="mt-0" color="blue darken-3" height="250" tile>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h2 class="display-2 font-weight-thin white--text">
              Recomendar Libros
            </h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Caja donde se encuetra el formulario, la alerta de confirmacion de envio del mensaje, y el boton de envio -->
    <v-container fluid>
      <!-- Alerta de notificacion que la sugernecia ha sido enviada correctamente -->
      <v-alert
        v-model="alert"
        type="success"
        transition="scale-transition"
        border="left"
        text
        >Recomendacion Enviada Correctamente</v-alert
      >

      <!-- Formulario con los campos necesarios.  -->
      <v-form class="mt-5" v-model="valid" ref="form" lazy-validation>
        <v-container>
          <v-row align="center" justify="center">
            <v-col align-self="center" cols="7">
              <v-container>
                <v-row>
                  <!-- Input text para el nombre del usuario que envia la sugerencia -->
                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    label="Nombre Completo *"
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    v-model="form.name"
                    :rules="[required]"
                    required
                  ></v-text-field>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input select para el rol del usuario para una mejor identificacion (ya sea alumno, profesor u otro)  -->
                    <v-select
                      label="Rol *"
                      :items="roles"
                      prepend-inner-icon="mdi-teach"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.rol"
                      :rules="[required]"
                      required
                    ></v-select>
                  </v-col>

                  <v-col v-if="other">
                    <!-- Input text que se muestra solo si se selecciona el otrol "otro" y asi este sea ingresado manualmente  -->
                    <v-text-field
                      label="Especifique *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.other"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text para el titulo del libro que se esta recomendando  -->
                    <v-text-field
                      label="Titulo del Libro *"
                      prepend-inner-icon="mdi-book"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.book"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text para el semestre al cual pertenece el libro que se esta recomendando  -->
                    <v-select
                      label="Semestre *"
                      :items="semester"
                      prepend-inner-icon="mdi-timeline"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.semestre"
                      :rules="[required]"
                      required
                    ></v-select>
                  </v-col>

                  <v-col>
                    <!-- Input text para la materia a la que corresponde el libro  -->
                    <v-text-field
                      label="Materia *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      v-model="form.materia"
                      :rules="[required]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <!-- Input text multilinea en caso que se desee agregar un comentario -->
                    <v-textarea
                      label="Comentarios *"
                      color="blue darken-3"
                      background-color="red lighten-5"
                      outlined
                      auto-grow
                      v-model="form.comment"
                      :rules="[required]"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <!-- Boton para enviar la sugerencia -->
                <v-row justify="center">
                  <v-btn
                    @click="click"
                    :loading="loading"
                    dark
                    color="blue darken-3"
                  >
                    Enviar Recomendacion
                  </v-btn>
                </v-row>

              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
// Importar librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    // Variable para el control del alert de mensaje enviado
    alert: false,
    // Variable para el control que se han llenado todos los campos del formulario y son validos
    valid: false,
    // Variable para el control que se han llenado todos los campos del formulario y son validos
    loading: false,
    // Objeto donde se guarda lo ingresado en el formulario 
    form: {
      book: "",
      materia: "",
      semestre: "",
      name: "",
      rol: "",
      other: "",
      comment: "",
    },
    // Arrray con los diferentes semestres disponibles para ser usados en el input select correspondiente
    semester: [
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
    // Array con los roles que puede tener el usuario que envia la sugerencia para ser usados en el input select
    roles: ["Estudiante", "Profesor", "Otro"],
    // Regla para validar en el formulario que el campo es requerido
    required: (value) => !!value || "Este Campo es requerido.",
  }),
  computed: {
    /**Propiedad computada para mostrar el input text para introducir el rol manualmente en caso de que seleccione
     * "Otro" en el select */ 
    other() {
      if (this.form.rol == "Otro") {
        return true;
      } else {
        return false;
      }
    },

    // Propiedad Computada para devolver el rol depenciendo si fue ingresado desde el select o manualmente
    rolFinal() {
      if (this.form.other) {
        return this.form.other;
      } else {
        return this.form.rol;
      }
    },
  },
  methods: {
    // Funcion limpiar y resetear el formulario
    clean() {
      this.$refs.form.reset();
    },

    // Funcion para validar el fomulario y verificar que los campos sean correctos
    validate() {
      this.$refs.form.validate();
    },

    /**Funcion que al dar click en el boton de enviar, valida que los datos ingresados en el formulario 
    sean validos, se hayan ingresado los campos, rerifica que el usuario haya iniciado sesion y luego 
    procede a enviar la sugerencia */
    click() {
      this.alert = false;
      this.validate();
      if (
        this.valid &&
        this.form.name &&
        this.form.rol &&
        this.form.book &&
        this.form.materia &&
        this.form.semestre &&
        this.form.comment &&
        this.rolFinal != "Otro"
      ) {
        const user = firebase.auth().currentUser;
          if (user) {
            this.loading = true;
            this.sendSuggest();
          } else {
            alert("Debe iniciar Sesion para Enviar");
          }
      }
    },

    /**Funcion que guarda el mensaje en la base de datos dentro de la coleccion "mensajes"
    */
    sendSuggest() {
      firebase
        .firestore()
        .collection("recomendaciones")
        .doc()
        .set({
          name: this.form.name,
          rol: this.rolFinal,
          book: this.form.book,
          semestre: this.form.semestre,
          materia: this.form.materia,
          comment: this.form.comment,
        })
        .then(() => {
          this.alert = true;
          this.clean();
        })
        .catch(function (error) {
          alert(error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>