<template>
  <div>
    <div class="scotty-row top">
      <h4 class="page-title">Categories List</h4>
      <b-button variant="scotty" block @click="addCategory"
        ><i class="fa fa-user-edit"></i> Add Category</b-button
      >
    </div>
    <div class="scotty-row">
      <b-form-select
        v-model="perPage"
        :options="options"
        class="scotty-page-options"
      ></b-form-select>
      <div class="scotty-input-icon">
        <i class="fa fa-search"></i>
        <b-form-input
          v-model="filter"
          type="search"
          placeholder="Search..."
          class="scotty-search"
        ></b-form-input>
      </div>
    </div>
    <b-table
      striped
      hover
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      @filtered="onFiltered"
      id="my-table"
      class="scotty-table"
    >
      <template #cell(actions)="row">
        <b-button
          size="sm"
          @click="viewCategory(row.item.id)"
          class="me-1"
          variant="scotty-row"
        >
          <i class="fa fa-user-edit"></i>
        </b-button>
        <b-button
          size="sm"
          @click="deleteCategory(row.item, row.index, $event.target)"
          variant="scotty-row"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>

    <div class="overflow-auto">
      <div class="scotty-row">
        Showing {{ (currentPage - 1) * perPage + 1 }} to
        {{ currentPage * perPage > rows ? rows : currentPage * perPage }}
        of {{ rows }}
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
      body-class="scotty-modal"
    >
      <div class="modal-title">{{ infoModal.title }}</div>
      <div>
        <b-button
          class="me-2"
          variant="scotty-yes"
          block
          @click="confirm(infoModal.content.id)"
          >Yes, delete it!</b-button
        >
        <b-button variant="scotty-no" block @click="hideModal"
          >No, keep it</b-button
        >
      </div>
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
          sortable: false,
          thClass: "table-header",
        },
        {
          key: "description",
          sortable: false,
          thClass: "table-header",
        },
        {
          key: "created_at",
          sortable: false,
          thClass: "table-header",
        },
        {
          key: "actions",
          label: "",
          variant: "actions",
          thClass: "table-header",
        },
      ],
      items: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      perPage: 5,
      currentPage: 1,
      filter: null,
      rows: null,
      options: [
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 50, text: "50" },
      ],
    };
  },
  methods: {
    addCategory() {
      //dummy category addition

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
          this.rows = this.items.length;
        });
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
      axios.delete("api/included/" + id).then(
        () => {
          this.items = this.items.filter((item) => item.id !== id);
          this.rows = this.items.length;
        }
        // (this.items = this.items.filter((item) => item.id !== id)
        // )
      );
      this.$refs["my-modal"].hide();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    viewCategory(id) {
      this.$router.push({ name: "edit-category", params: { id: id } });
    },
    onFiltered(filteredItems) {
      this.rows = filteredItems.length;
      this.currentPage = 1;
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
      this.rows = this.items.length;
    });
  },
};
</script>