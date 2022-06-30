<template lang="pug">
div(class="loading")
</template>

<script setup lang="ts"></script>

<style scoped>
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.loading:after {
  content: ' ';
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  border-color: white transparent white transparent;
  animation: loading 1.2s linear infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
