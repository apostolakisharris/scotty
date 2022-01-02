<template>
  <div>
    <div class="scotty-row top">
      <h4 class="page-title">Edit Category</h4>
      <b-button variant="scotty" size="sm" @click="goToList()">
        Back to list
      </b-button>
    </div>
    <div class="edit-category-container">
      <div class="scotty-input">
        <label for="input-category-name" class="scotty-label">Name</label>
        <div class="scotty-input-icon">
          <i class="fa fa-user"></i>
          <b-form-input
            v-if="data.attributes"
            id="input-category-name"
            v-model="data.attributes.name"
            placeholder="Category name"
          ></b-form-input>
        </div>
      </div>
      <div class="scotty-input">
        <label for="input-category-description" class="scotty-label"
          >Description</label
        >
        <div class="scotty-input-icon">
          <i class="fa fa-user"></i>
          <b-form-input
            v-if="data.attributes"
            id="input-category-description"
            v-model="data.attributes.description"
            placeholder="Category discription"
          ></b-form-input>
        </div>
      </div>
      <div class="scotty-action-row">
        <b-button variant="scotty" block @click="updateCategory">
          Update Category</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CategoriesList",
  data() {
    return {
      data: {
        attrubites: { name: "", description: "" },
      },
    };
  },
  methods: {
    goToList() {
      this.$router.push("/categories-list");
      //this.$router.push({name:'categories-list', params: {id: '[paramdata]'}});
    },
    updateCategory() {
      axios
        .put(
          "http://localhost:8080/api/included/" + this.$route.params.id,
          this.data
        )
        .then(
          () => {
            this.goToList();
          }
        );
    },
  },
  created() {
    axios
      .get("http://localhost:8080/api/included/" + this.$route.params.id)
      .then((response) => (this.data = response.data));
  },
};
</script>
