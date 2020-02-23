<template>
  <div>
    <hr />
    <blockquote class="blockquote" v-for="comp in comps" :key="comp._id">
      <p class="mb-0">
        {{ comp.CompName }} | {{ comp.CompVenue }} | {{ comp.CompDate }}
      </p>
      <footer class="blockquote-footer">{{ comp.CompID }}</footer>
    </blockquote>

    <hr />
  </div>
</template>

<script>
const API_URL = "http://192.168.64.209:8080/api/comp";

export default {
  name: "Competitions",
  data: () => ({
    error: "",
    comps: []
  }),

  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.comps = result;
      });
  },
  methods: {}
};
</script>

<style></style>
