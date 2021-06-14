<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
      single-expand
      show-expand
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <!-- Input para las busquedas -->
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

          <!--Tarjeta para eliminar un mensaje -->
          <v-dialog v-model="dialogDelete" max-width="325px">
            <v-card dark color="indigo">
              <v-card-title>
                <v-spacer></v-spacer>
                ¿Desea eliminar el mensaje?
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark plain @click="closeDelete">Cancelar</v-btn>
                <v-btn color="error" plain @click="deleteItemConfirm"
                  >Borrar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- Dar formato segun si mensaje esta marcado como leido -->
      <template v-slot:[`item.name`]="{ item }">
        <span v-if="item.read">{{ item.name }}</span>
        <span v-if="!item.read" :style="style">{{ item.name }}</span>
      </template>
      <template v-slot:[`item.asunto`]="{ item }">
        <span v-if="item.read">{{ item.asunto }}</span>
        <span v-if="!item.read" :style="style">{{ item.asunto }}</span>
      </template>
      <template v-slot:[`item.message`]="{ item }">
        <span v-if="item.read">{{ shortMessage(item.message) }}</span>
        <span v-if="!item.read" :style="style">{{
          shortMessage(item.message)
        }}</span>
      </template>

      <!--Botones de eliminar y marcar como leido -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          x-small
          fab
          class="mr-2"
          color="indigo"
          dark
          @click="editItem(item)"
        >
          <v-icon dark small>mdi-email-mark-as-unread</v-icon>
        </v-btn>

        <v-btn x-small fab color="error" @click.stop="deleteItem(item)">
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>

      <!--Mostrar mensaje -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-container>
            <v-row>
              <p class="font-weight-medium text-subtitle-1">Correo:</p>
              <p class="text-subtitle-1">{{ item.email }}</p>
            </v-row>
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

    <!-- Snackbar de mensaje borrado  -->
    <v-snackbar v-model="snackbar" timeout="3000" color="red darken-1" top>
      <v-icon>mdi-close</v-icon>
      Mensaje Borrado

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  data: () => ({
    search: "",
    dialogDelete: false,
    snackbar: false,
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      email: "",
      asunto: "",
      message: "",
      read: true,
    },
    defaultItem: {
      name: "",
      email: "",
      asunto: "",
      message: "",
      read: true,
    },
    headers: [
      {
        text: "Nombre de Contacto",
        align: "start",
        value: "name",
      },
      { text: "Asunto", value: "asunto" },
      { text: "Mensaje", value: "message" },
      { text: "Actions", value: "actions", align: "center", sortable: false },
    ],
    style: {
      color: "#3F51B5",
      "font-weight": "bold",
    },
  }),

  methods: {
    initialize() {
      firebase
        .firestore()
        .collection("mensajes")
        .onSnapshot((querySnapshot) => {
          this.desserts = [];
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            this.desserts.push(data);
          });
        });
    },

    shortMessage(message) {
      if (message.length > 60) {
        var cut = message.slice(0, 60);
        return cut + "...";
      } else {
        return message;
      }
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.markAsRead();
    },

    markAsRead() {
      firebase
        .firestore()
        .collection("mensajes")
        .doc(this.desserts[this.editedIndex].id)
        .update({
          read: true,
        })
        .catch(function (error) {
          console.error("Error: ", error);
        });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      firebase
        .firestore()
        .collection("mensajes")
        .doc(this.desserts[this.editedIndex].id)
        .delete()
        .then(() => {
          this.snackbar = true;
          this.closeDelete();
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },

  created() {
    this.initialize();
  },
};
</script>