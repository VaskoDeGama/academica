<template>
  <b-container fluid="true" class="d-flex flex-column align-items-center min-vh-100 m-0 p-0" >
    <NavBar/>
    <router-view class="flex-grow-1"></router-view>
    <Footer/>
  </b-container>
</template>

<script>

import { NavBar, Footer } from './../components'

export default {
  name: 'MainLayout',
  components: { Footer, NavBar },

  props: ['bus'],

  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
