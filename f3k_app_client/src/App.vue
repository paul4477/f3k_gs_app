<template>
  <div id="app">
    <Competitions />
    <Rounds />
  </div>
</template>

<script>
import Competitions from "./components/Competitions.vue";
import Rounds from "./components/Rounds.vue";

export default {
  name: "App",
  components: {
    Competitions,
    Rounds
  }
};
</script>

<style></style>
