import { createStore } from "vuex";

import mutations from "./mutations";
import actions from "./actions";

export default createStore({
  state() {
    return {
      fullPath: [],
      myFiles: [],
      lastId: "None",
    };
  },
  mutations: mutations,
  actions: actions,

  getters: {},
});
