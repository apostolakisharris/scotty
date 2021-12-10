import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/edit-category/:id",
      name: "edit-category",
      component: () => import("./views/EditCategory")
    },
    {
      path: "/categories-list",      
      alias: "/",
      name: "categories-list",
      component: () => import("./views/CategoriesList")
    },
  ]
});
