<template lang="pug">
div(class="loading")
</template>

<script setup lang="ts"></script>

<style scoped>
.loading {
  display: inline-block;
  width: 60px;
  height: 60px;
}
.loading:after {
  content: ' ';
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid black;
  border-color: black transparent black transparent;
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
