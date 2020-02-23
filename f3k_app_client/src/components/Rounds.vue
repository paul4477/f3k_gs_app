<template>
  <div class="">
    <div class="" v-for="round in rounds" :key="round._id">
      <div class="card border-primary  mb-3" style="width: 25rem;">
        <div class="card-header">
          Round {{ round.RoundNo + ": Task: " + round.F3KTask }}
        </div>
        <div class="card-body">
          <h4 class="card-title">{{ round.F3KTaskAbbreviation }}</h4>
          <p class="card-text">
            {{ round.F3KTaskDescription }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!--<div>
    <hr />
    <div class="list-unstyled" v-for="round in rounds" :key="round._id">
      <li class="media">
        <div class="media-body">
          <h4 class="mt-0 mb-1">
            Round {{ round.RoundNo + ": Task :" + round.F3KTask }}
          </h4>
          <h5>{{ round.F3KTaskAbbreviation }}</h5>
          <small>{{ round.F3KTaskDescription }}</small>
          <br />
        </div>
      </li>
      <hr />
    </div>
  </div>-->
</template>

<script>
const API_URL = "http://192.168.64.209:8080/api/comp/13D4Aa86ac9db/round";

export default {
  name: "Rounds",
  data: () => ({
    error: "",
    rounds: []
  }),

  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.rounds = result;
      });
  },
  methods: {}
};
</script>

<style></style>
