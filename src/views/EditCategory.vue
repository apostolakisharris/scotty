<template>
  <div>
    <h1>Edit Category</h1>
    <b-button size="sm" @click="goToList()" class="me-1">
      Back to list
    </b-button>
    <div>{{ data }}</div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CategoriesList",
  data() {
    return {
      data: {},
    };
  },
  methods: {
    goToList() {
      this.$router.push("/categories-list");
      //this.$router.push({name:'categories-list', params: {id: '[paramdata]'}});
    },
  },
  created() {
    axios
      .get("http://localhost:8080/api/included/" + this.$route.params.id)
      .then((response) => (this.data = response.data));
  },
};
</script>
