<template>
  <div>
    <div>
      <b-button variant="primary" block @click="addCategory"
        ><i class="fa fa-user-edit"></i> Add Category</b-button
      >
    </div>
    <b-table
      striped
      hover
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      id="my-table"
    >
      <template #cell(actions)="row">
        <b-button size="sm" @click="viewCategory(row.item.id)" class="me-1">
          <i class="fa fa-user-edit"></i>
        </b-button>
        <b-button
          size="sm"
          @click="deleteCategory(row.item, row.index, $event.target)"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>

    <div class="overflow-auto">
      <div>
        Showing {{ (currentPage - 1) * perPage + 1 }} to
        {{
          currentPage * perPage > items.length
            ? items.length
            : currentPage * perPage
        }}
        of {{ items.length }}
        <b-pagination
          v-model="currentPage"
          pills
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          size="sm"
          align="right"
        ></b-pagination>
      </div>
    </div>
    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      centered
      @hide="resetInfoModal"
      ref="my-modal"
      :hide-footer="true"
      :hide-header="true"
    >
      <div>{{ infoModal.title }}</div>
      <b-button
        class="me-2"
        variant="outline-warning"
        block
        @click="confirm(infoModal.content.id)"
        >Yes, delete it!</b-button
      >
      <b-button variant="outline-warning" block @click="hideModal"
        >No, keep it</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CategoriesList",
  data() {
    return {
      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "description",
          sortable: false,
        },
        {
          key: "created_at",
          sortable: true,
        },
        { key: "actions", label: "" },
      ],
      items: [],
      infoModal: {
        id: "info-modal",
        content: "",
      },
      perPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
  methods: {
    //dummy category addition
    addCategory() {
      axios
        .post("api/included", {
          type: "categories",
          attributes: {
            name: "Food & Drinks",
            description: "Our favourite recipes",
            created_at: "2021-05-18 15:09:41",
            updated_at: "2021-09-27 14:37:41",
          },
        })
        .then((response) => {
          response.data.attributes.id = response.data.id;
          this.items = [...this.items, response.data.attributes];
        })

    },
    deleteCategory(item, index, button) {
      this.infoModal.title = `Delete this category?`;
      this.infoModal.content = item;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    confirm(id) {
      axios
        .delete("api/included/" + id)
        .then((this.items = this.items.filter((item) => item.id !== id)));
      this.$refs["my-modal"].hide();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    viewCategory(id) {
      this.$router.push({ name: "edit-category", params: { id: id } });
    },
  },
  created() {
    const tableData = [];
    axios.get("api/included/").then((response) => {
      response.data.forEach((val) => {
        if (val.type === "categories") {
          const obj = val.attributes;
          obj.id = val.id;
          tableData.push(obj);
        }
      });
      this.items = tableData;
    });
  },
};
</script>
<style></style>
