<template>
  <!-- Componente que permite guardar en la base de datos archivos pdf que correspondan a libros que se desean usar en la
  plataforma cuenta con una tabla donde se muestran los archivos disponibles en la base de datos la cual cuenta con un 
  text input para buscar y un boton que despliega una ventana modal para subir un nuevo archuivo-->
  <v-container>
    <!-- Tabla donde se muestran los archivos disponibles en la bse de datos -->
    <v-data-table
      :headers="headers"
      :items="files"
      :search="search"
      class="elevation-2"
      :loading="loading"
      loading-text="Obteniendo Archivos por favor Espere"
      :items-per-page="-1"
      dense
    >
      <template v-slot:top>
        <!-- Toolbar en la parte superior de la tabla -->
        <v-toolbar flat>
          <!-- Ventana modal para agregar un nuevo libro a la BBD cuenta con el titulo en la parte superior y un 
          formulario con un file input par ingresar el archivo, el activador que se muestra en la tabla es un boton azul
          con el texto subir libro -->
          <v-dialog click:outside="closeDialog" v-model="dialog" width="500">

            <!-- Activador de la ventana que se muestra en la tabla corresponde a un boton color azul con el texto
            "Subir Libro" -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="blue darken-3" dark v-bind="attrs" v-on="on">
                Subir Libro
              </v-btn>
            </template>

            <!-- Contenido de la ventana modal -->
            <v-card>
              <!-- Toolbar superior de la ventana modal con el titulo de cambiar nombre y el boton para cerrarla -->
              <v-toolbar dark color="blue darken-3">
                <!-- titulo -->
                <v-toolbar-title>Subir Libro</v-toolbar-title>
              </v-toolbar>

              <!-- Caja con el formulario con el campo para seleccionar el archivo -->
              <v-card-text class="mt-5">
                <!-- Formulario con el input file -->
                <v-form v-model="valid" ref="form" lazy-validation>
                  <!-- Input file para ingresar el archivo -->
                  <v-file-input
                    prepend-inner-icon="mdi-file-pdf-outline"
                    prepend-icon=""
                    color="blue darken-3"
                    background-color="red lighten-5"
                    outlined
                    show-size
                    label="Seleccionar Archivo"
                    accept=".pdf"
                    @change="error_file = ''"
                    :error-messages="error_file"
                    :rules="[rules.required, rules.size]"
                    required
                    v-model="file"
                  ></v-file-input>
                </v-form>
              </v-card-text>

              <!-- Acciones de la ventana modal, boton subir el archivo a la base de datos,se utilizan 
              separadores (v-spacer) antes y despues para centrarlo dentro de la ventana -->
              <v-card-actions>
                <!-- separador -->
                <v-spacer></v-spacer>
                <!-- Boton para cambiar el nombre -->
                <v-btn
                  class="mb-2"
                  color="blue darken-3"
                  dark
                  @click="clickUpload"
                >
                  Subir Archivo
                </v-btn>
                <!-- separador -->
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Separador para colocar el boton y el input para las busquedas a cada lado -->
          <v-spacer></v-spacer>

          <!-- Input de texto para las busquedas -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            color="blue darken-3"
            single-line
          ></v-text-field>
        </v-toolbar>
      </template>

      <!-- Boton para abrir el libro en una pestaña nueva -->
      <template v-slot:[`item.link`]="{ item }">
        <v-btn fab x-small color="green" dark :href="item.link" target="_blank">
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>

      <!-- Agregar la unidad "Mb" a la columna de Tamaño -->
      <template v-slot:[`item.size`]="{ item }"> {{ item.size }} Mb </template>

      <!-- Boton para borrar el archivo de la base de datos -->
      <template v-slot:[`item.delete`]="{ item }">
        <v-btn fab x-small color="red" dark @click="clickDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    
    <!-- Ventana modal donde se muestra el progreso de la subida del archivo a la base de datos  -->
    <v-dialog v-model="dialog_upload" persistent width="500">
      <!-- Contenido de la ventana modal -->
      <v-card color="red" dark>
        <v-card-text class="text-center font-weight-bold">
          Subiendo Archivo, por favor espera
          <!-- Barra de progreso con la subida del archivo -->
          <v-progress-linear
            v-model="upload_progress"
            class="mt-5"
            color="blue darken-3"
            background-color="red"
            rounded
            height="15"
            ><strong
              >{{ Math.ceil(upload_progress) }}%</strong
            ></v-progress-linear
          >
        </v-card-text>
      </v-card>
    </v-dialog>

     <!-- Ventana para Borrar el registro -->
    <v-dialog persistent v-model="dialog_delete" max-width="325px">
      <v-card dark color="blue darken-3">
        <!-- Mensaje de confirmacion para borrar la ventana -->
        <v-card-title>
          <v-spacer></v-spacer>
          ¿Desea eliminar el arahivo?
          <v-spacer></v-spacer>
        </v-card-title>

        <!-- Botones de la ventana -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Boton de cancelar y cerrar -->
          <v-btn dark plain @click="closeDelete">Cancelar</v-btn>
          <!-- Boton de Confirmar borrar y cerrar la ventana -->
          <v-btn color="red" plain @click="deleteConfirm">Borrar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de registro Borrado -->
    <v-snackbar v-model="snackbar" timeout="3000" top color="red darken-1">
      <v-icon>mdi-close</v-icon>
      Archivo Borrado

      <!-- Boton para cerrar el snackbar -->
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue darken-3"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    
  </v-container>
</template>


<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import Vue from "vue";

export default {
  data() {
    return {
      dialog: false,
      dialog_upload: false,
      dialog_delete: false,
      loading: false,
      snackbar: false,
      valid: false,
      file: null,
      upload_progress: 0,
      delete_path: "",
      error_file: "",
      search: "",
      files: [],
      headers: [
        {
          text: "Nombre del Archivo",
          value: "name",
        },
        {
          text: "Tamaño del archivo",
          value: "size",
          align: "center",
        },
        {
          text: "Fecha",
          value: "time",
        },
        {
          text: "Link del libro",
          value: "link",
          align: "center",
          sortable: false,
        },
        {
          text: "Borrar Archivo",
          value: "delete",
          align: "center",
          sortable: false,
        },
      ],
      rules: {
        // Regla para el campo requerido
        required: (value) => !!value || "Debe seleccionar un arcchivo.",
        // Regla para validar el tamaño de la foto de portada
        size: (value) =>
          !value ||
          value.size < 50000000 ||
          "La portada debe tener un tamaño menor a 50MB",
      },
    };
  },
  methods: {
    /**Funcion que consulta los archivos de libros disponibles en la base de datos, consulta la informacion necesaria
     * de estos y la guarda en el array "files"
     */
    getFiles() {
      // Colocar la tabla en modo de carga "Obteniendo archivos"
      this.loading = true;
      // Limpiar el array
      this.files = [];
      // Creaar la ruta en la base de datos dentro de la cual se encuentran los archivos
      var listRef = firebase.storage().ref().child("files/");

      // Obtener la infromacion de los archivos
      listRef
        .listAll()
        .then((res) => {
          res.items.forEach((itemRef) => {
            // Crear objeto donde se con la informacion individual de cada archivo
            let file = {};
            // Guardar el nombre del archivo dentro del objeto
            file.name = itemRef.name;
            // Guardar la ruta en la base de datos del archivo
            file.delete = itemRef.fullPath;
            // Obtener el link de acceso al archivo
            itemRef.getDownloadURL().then((url) => {
              // Guardar el link
              file.link = url;
            });
            // Obtener los metadatos del archivo
            itemRef.getMetadata().then((meta) => {
              // Convertir el tamaño del archivo (Obtenido de bytes) a Mb
              const toMb = (meta.size / (1024 * 1024)).toFixed(2);
              // Obtener la fecha del archivo y gurardar solo el dia-mes-año
              const formatTime = meta.updated.slice(
                0,
                meta.updated.indexOf("T")
              );
              // Guardar el tamaño en Mb del archivo
              file.size = toMb;
              // Guardar la fecha del archivo
              file.time = formatTime;
              // Guardar el objeto con la informacion del archivo indivudual dentro del array correspondiente
              this.files.push(file);
            });
          });
        })
        .catch(function (error) {
          alert(error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**Funicon para cerrar la venta modal para subir un nuevo archivo y limpiar el formulario (Vaciar el input file) */
    closeDialog() {
      this.$refs.form.reset();
      this.dialog = false;
    },

    /**Funcin que al dar click en el boton de subir archivo de la ventana modal valida que se haya ingresado un archivo,
    que sea un archivo valido, y que este no se encuentre entro de la base de datos y luego llama a la funcion para 
    comenzar la subida del archuivo */
    clickUpload() {
      // limpiar errores
      this.error_file = "";
      // Validar el formulario
      this.$refs.form.validate();
      // Esperar a que termine la validacion
      Vue.nextTick(() => {
        // Validar que se haya introducido un archivo y que sea valido
        if (this.valid && this.file) {
          // Variable booleana para controlar si ya existe el archivo
          let already_exits = false;
          // Ciclo for para recorrer el array donde de encuentra la informacion de los archivos (array "files") para 
          // Comprobar que el archivo que se desea subir no exita en la base de datos
          for (let i = 0; i < this.files.length; i++) {
            // Comprobar si el archivo del array es igual al que se desea introducir
            if (this.files[i].name == this.file.name) {
              // Si es igual cambiar la variable booleana
              already_exits = true;
            }
          }
          // Si el archivo no existe llamar a la funcion para comenzar la subida
          if (!already_exits) {
            this.uploadFile();
          // Si el archivo existe mostrar el mensaje de error
          } else {
            this.error_file =
              "Ya se ha subido ese archivo, por favor verifique";
          }
        }
      });
    },

    /**Variable que realiza la subida del archivo a la base de datos y muestra el progreso en la ventana modal correspondiente */
    uploadFile() {
      // Crear referencia donde se guardara el archivo
      var storage = firebase.storage().ref();
      var uploadTask = storage.child("files/" + this.file.name).put(this.file);

      // Controlar la subida del archivo
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Mostar la ventana modal de la subida del archivo
          this.dialog_upload = true;
          // Calcular el progreso de la subida del archivo para mostrarlo en el progress bar de la ventana modal
          this.upload_progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          this.clickUpload = false;
          alert(
            "Se produjo un error por favor verifica y trata de nuevo mas tarde"
          );
        },
        () => {
          this.dialog_upload = false;
          this.closeDialog();
          this.getFiles();
        }
      );
    },

    /**Funcion que al dar click al boton de la tabla para eliminar un archivo muestra la ventana modal para confirmar
     * quje se desa borrar y guarda la ruta dentro de la base de datos del archivo que se desea borrar
    */
    clickDelete(item) {
      this.dialog_delete = true;
      this.delete_path = item.delete;
    },

    /**Funcion para borrar un archivo de la base de datos */
    deleteConfirm() {
      var storage = firebase.storage().ref();
      storage
        .child(this.delete_path)
        .delete()
        .then(() => {
          this.snackbar = true;
          this.closeDelete();
          this.getFiles();
        })
        .catch(function (error) {
          alert(error.message);
        });
    },

    /**Funcion para cerrar la ventana modal para confirmar que se desea borrar un archivo y limpar la ruta del archivo 
     * a borrar
     */
    closeDelete() {
      this.dialog_delete = false;
      this.delete_path = "";
    },
  },

  /**al crear la ventana obtener los archivos */
  created() {
    this.getFiles();
  },
};
</script>
