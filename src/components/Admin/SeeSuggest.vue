<template>
  <!-- Componente que permite al administrador ver en una tabla con columnas expandibles las sugerencias de libros
  que han dejado los usuarios en la plataforma a travez del formulario correspondiente, 
  esto incluye botones para borrar el mensaje y para marcarlo como leido -->
  <v-container>
    <!-- Tabla donde se mostraran los mensajes -->
    <v-data-table
      :headers="headers"
      :items="suggest"
      single-expand
      item-key="name"
      show-expand
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <!-- Toolbar en la parte superior de la tabla -->
        <v-toolbar flat>
          <!-- Input de texto para las busquedas -->
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            color="blue darken-3"
            background-color="red lighten-5"
            outlined
            single-line
          ></v-text-field>
        </v-toolbar>

        <!-- Ventana modal con la tarjeta para eliminar una sugerencia -->
          <v-dialog v-model="dialogDelete" max-width="325px">
            <v-card dark color="indigo">
              <!-- Mensaje de confirmacion para borrar el registro -->
              <v-card-title>
                <v-spacer></v-spacer>
                ¿Desea eliminar el mensaje?
                <v-spacer></v-spacer>
              </v-card-title>

              <!-- Botones de accion de la ventana -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <!-- Boton de cancelar y cerrar -->
                <v-btn dark plain @click="closeDelete">Cancelar</v-btn>
                <!-- Boton de Confirmar borrar y cerrar la ventana -->
                <v-btn color="error" plain @click="clickDeleteConfirm"
                  >Borrar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </template>

      <!-- Dar formato a las columnas de la tabla segun si registrto esta marcado como visto o no, aplicando el estilo
      que se encuentra en el objeto 'noRead'-->

      <!-- Dar formato al campo del nombre de quien mando la sugerencia -->
      <template v-slot:[`item.name`]="{ item }">
        <span v-if="item.read">{{ item.name }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.name }}</span>
      </template>

      <!-- Dar formato al campo del nombre o titulo del libro -->
      <template v-slot:[`item.book`]="{ item }">
        <span v-if="item.read">{{ item.book }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.book }}</span>
      </template>

      <!-- Dar formato al campo de la materia a la que pertenece el libro -->
      <template v-slot:[`item.materia`]="{ item }">
        <span v-if="item.read">{{ item.materia }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.materia }}</span>
      </template>

      <!-- Dar formato al campo del semestre a la que pertenece el libro -->
      <template v-slot:[`item.semestre`]="{ item }">
        <span v-if="item.read">{{ item.semestre }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.semestre }}</span>
      </template>

      <!-- Dar formato al campo del rol de la persona que hizo la sugerencia -->
      <template v-slot:[`item.rol`]="{ item }">
        <span v-if="item.read">{{ item.rol }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.rol }}</span>
      </template>

      <!--Botones de accion para los mesanjes dentro de la tabla  -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Boton para marcar un mensaje como leido -->
        <v-btn
          x-small
          fab
          class="mr-2"
          color="indigo"
          dark
          @click="markAsRead(item)"
        >
          <v-icon dark small>mdi-email-mark-as-unread</v-icon>
        </v-btn>
        <!-- Boton para borrar un mensaje -->
        <v-btn x-small fab color="error" @click.stop="deleteItem(item)">
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>

      <!-- Columna extendible de la tabla para mostrar el comentario que haya dejado el usurio -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <span>
            <h4>Comentario:</h4>
            <br />
            {{ item.comment }}
          </span>
        </td>
      </template>
    </v-data-table>

    <!-- Snackbar para confirmar que un mensaje ha sido borrado  -->
    <v-snackbar v-model="snackbar" timeout="3000" color="red darken-1" top>
      <v-icon>mdi-close</v-icon>
      Mensaje Borrado

      <!-- Boton de accion dentro de la snackbar para cerrarla -->
      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
// Importar las librerias de firebase necesarias
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    // Variable para realizar las busquedas dentro de la tabla
    search: "",
    // Variable para el control de la ventana modal de borrar un mensaje
    dialogDelete: false,
    // Variable para en control de la snackbar
    snackbar: false,
    // Array donde se guardan las recomendaciones obtenidas desde la base de datos para ser mostrados en la tabla
    suggest: [],
    // Indice (Posicion) dentro del array del mensaje que se desea borrrar o marcar como leido
    index: -1,
     // Array con los titulos de las columnas y configuracion de esta como el valor correspondiente, alineacion, etc.
    headers: [
      // Columna con el nombre o titulo del libro sugerido, alineado a la izquierda
      {
        text: "Nombre del libro",
        align: "start",
        value: "book",
      },
      // Columna con la materia a la que pertenece
      { text: "Materia", value: "materia" },
      // Columna del semestre
      { text: "Semestre", value: "semestre" },
      // Columna de la persona que mando la sugerencia
      { text: "Nombre", value: "name" },
      // Columna con el rol de la persona
      { text: "Rol", value: "rol" },
      // Columna con los botones de accion, alineacion en el centro y no ordenable
      { text: "Actions", value: "actions", align: "center", sortable: false },
    ],
    // Objeto con el estilo a applicar a los mensajes no leidos: fuente en negrita y color 'blue darken-3'
    noRead: {
      color: "#1565C0",
      "font-weight": "bold",
    },
  }),

  methods: {
    // Funcion que obtiene las sugerencuas de la base de datos y los guarda junto con su id dentro del array "suggest"
    getSuggest() {
      firebase
        .firestore()
        .collection("recomendaciones")
        .onSnapshot((querySnapshot) => {
          this.suggest = [];
          querySnapshot.forEach((doc) => {
            // Guardar el registro dentro del array
            var data = doc.data();
            data.id = doc.id;
            this.suggest.push(data);
          });
        });
    },

    /**Funcion que marca como vista una sugerencua dentro de la base de datos, modificando el campo "read" a "true" 
     * en el documento correspondinete al registro a partir de su ID"
     */
    markAsRead(item) {
      // Obtener el indice del mensaje a modificar
      this.index = this.suggest.indexOf(item);
      // Modificar el documento a partir de su ID
      firebase
        .firestore()
        .collection("recomendaciones")
        .doc(this.suggest[this.index].id)
        .update({
          read: true,
        })
        .then(() => {
          // Reiniciar el index a -1
          this.index = -1;
        })
        .catch(function (error) {
          console.error("Error: ", error);
        });
    },

    /**Funcion que obtine el indice del registro que se desea borrar y despliega la ventana modal para confirmar
     * que se desea borrarlo
     */
    deleteItem(item) {
      this.index = this.suggest.indexOf(item);
      this.dialogDelete = true;
    },

    /**Funcion que elimina de la BBD, a partir de su ID, el documento correspondiente a el registro
     * que se desea borrar, una vez confirmado desde la ventana modal 
     */
    clickDeleteConfirm() {
      var user = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("recomendaciones")
        .doc(this.suggest[this.index].id)
        .delete()
        .then(() => {
           // Una vez se ha borrado, cerrar la ventana modal y mostrar la snackbar
          this.snackbar = true;
          this.closeDelete();
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      this.closeDelete();
    },

    // Funcion que cierra la ventana modal para borrar un mensaje y reininiar el indice 
    closeDelete() {
      this.dialogDelete = false;
      this.index = -1;

    },
  },

  // Al cargar la pagina llamar a la funcion para obtener las sugerencias.
  created() {
    this.getSuggest();
  },
};
</script>