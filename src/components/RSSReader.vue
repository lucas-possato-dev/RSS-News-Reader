<script setup>
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";
import Posts from "./Posts.vue";
</script>

<template>
  <div class="main-container">
    <Header />
    <Sidebar />
    <Posts />
  </div>
</template>

<style scoped>
.main-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar main";
  height: 100vh;
}
</style>
