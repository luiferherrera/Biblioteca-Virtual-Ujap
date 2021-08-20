<template>
  <!-- Componente que permite al administrador ver en una tabla con columnas expandibles los mensajes que han dejado 
  los usuarios en la plataforma a travez del formulario de contacto, esto incluye botones para borrar el mensaje 
  y para marcarlo como leido -->
  <v-container>
    <!-- Tabla donde se mostraran los mensajes -->
    <v-data-table
      :headers="headers"
      :items="messages"
      single-expand
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

        <!-- Ventana modal con la tarjeta para eliminar un mensaje -->
        <v-dialog v-model="dialogDelete" max-width="325px">
          <v-card dark color="indigo">
            <!-- Mensaje de confirmacion para borrar el mensaje -->
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
              <v-btn color="error" plain @click="clickDeleteConfirm">
                Borrar
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Dar formato a las columnas de la tabla segun si mensaje esta marcado como leido o no aplicando el estilo
      que se encuentra en el objeto 'noRead'-->

      <!-- Dar formato al campo del nombre -->
      <template v-slot:[`item.name`]="{ item }">
        <span v-if="item.read">{{ item.name }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.name }}</span>
      </template>

      <!-- Dar formato al campo del asunto del mensaje -->
      <template v-slot:[`item.asunto`]="{ item }">
        <span v-if="item.read">{{ item.asunto }}</span>
        <span v-if="!item.read" :style="noRead">{{ item.asunto }}</span>
      </template>

      <!-- Dar formato al campo de la previsualizacion del mensaje -->
      <template v-slot:[`item.message`]="{ item }">
        <span v-if="item.read">{{ shortMessage(item.message) }}</span>
        <span v-if="!item.read" :style="noRead">
          {{ shortMessage(item.message) }}
        </span>
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

      <!-- Columna extendible de la tabla para mostrar el mensaje completo -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <!-- Dar formato a como se muestra el mensaje -->
          <v-container>
            <!-- Mostrar correo en la parte superior -->
            <v-row>
              <p class="font-weight-medium text-subtitle-1">Correo:</p>
              <p class="text-subtitle-1">{{ item.email }}</p>
            </v-row>
            <!-- Mostrar mensaje -->
            <v-row>
              <p class="text-h6">Mensaje:</p>
            </v-row>
            <v-row>
              <p class="font-weight-regular text-body-1">{{ item.message }}</p>
            </v-row>
          </v-container>
        </td>
      </template>
    </v-data-table>

    <!-- Snackbar para confirmar que un mensaje ha sido borrado  -->
    <v-snackbar v-model="snackbar" timeout="3000" color="red darken-1" top>
      <v-icon>mdi-close</v-icon> Mensaje Borrado

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
    // Array donde se guardan los diferentes mensajes obtenidos desde la base de datos para ser mostrados en la tabla
    messages: [],
    // Indice (Posicion) dentro del array del mensaje que se desea borrrar o marcar como leido
    index: -1,
    // Array con los titulos de las columnas y configuracion de esta como el valor correspondiente, alineacion, etc.
    headers: [
      // Columna con el nombre de quien mando el mensaje alineado a la izquierda
      {
        text: "Nombre de Contacto",
        align: "start",
        value: "name",
      },
      // Columna del aunto del mensaje
      { text: "Asunto", value: "asunto" },
      // Columna con la previsualizacion del mensaje
      { text: "Mensaje", value: "message" },
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
    // Funcion que obtiene los mesajes de la base de datos y los guarda junto con su id dentro del array "messages"
    getMessages() {
      firebase
        .firestore()
        .collection("mensajes")
        .onSnapshot((querySnapshot) => {
          this.messages = [];
          querySnapshot.forEach((doc) => {
            // Guardar el registro dentro del array
            var data = doc.data();
            data.id = doc.id;
            this.messages.push(data);
          });
        });
    },

    /**Funcion que dependiendo si el mensaje es mayor de 60 caracteres genera una previsualizacion de este
     * (primeros 60 caracteres) para ser mostrado dentro de la tabla
     */
    shortMessage(message) {
      if (message.length > 60) {
        var cut = message.slice(0, 60);
        return cut + "...";
      } else {
        return message;
      }
    },

    /**Funcion que marca como leido un mensaje dentro de la base de datos, modificando el campo "read" a "true" en el
     * documento correspondinete al registro a partir de su ID"
     */
    markAsRead(item) {
      // Obtener el indice del mensaje a modificar
      this.index = this.messages.indexOf(item);
      // Modificar el documento a partir de su ID
      firebase
        .firestore()
        .collection("mensajes")
        .doc(this.messages[this.index].id)
        .update({
          read: true,
        })
        .then(() => {
          // Reiniciar el index a -1
          this.index = -1;
        })
        .catch(function (error) {
          alert(error.message);
        });
    },

    /**Funcion que obtine el indice del mensaje que se desea borrar y despliega la ventana modal para confirmar
     * que se desea borrarlo
     */
    deleteItem(item) {
      this.index = this.messages.indexOf(item);
      this.dialogDelete = true;
    },

    /**Funcion que elimina de la BBD, a partir de su ID, el documento correspondiente a el mensaje
     * que se desea borrar, una vez confirmado desde la ventana modal 
     */
    clickDeleteConfirm() {
      firebase
        .firestore()
        .collection("mensajes")
        .doc(this.messages[this.index].id)
        .delete()
        .then(() => {
          // Una vez se ha borrado, cerrar la ventana modal y mostrar la snackbar
          this.snackbar = true;
          this.closeDelete();
        })
        .catch(function (error) {
          alert(error.message);
        });
    },

    // Funcion que cierra la ventana modal para borrar un mensaje y reininiar el indice 
    closeDelete() {
      this.dialogDelete = false;
      this.index = -1;
    },
  },

  // Al cargar la pagina llamar a la funcion para obtener los mensajes.
  created() {
    this.getMessages();
  },
};
</script>