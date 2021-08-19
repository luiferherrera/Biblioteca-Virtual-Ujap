<template>
<!-- componente inicial de vue cuenta unicamente con una caja con el id establecido (app) donde se llama al router-view
 el cual cargara dentro de la caja interfaz de la ventana segun sea el caso -->
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
} 
</script>
