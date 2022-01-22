import { createStore } from "vuex";

import mutations from "./mutations";
import actions from "./actions";

export default createStore({
  state() {
    return {
      fullPath: [],
      myFiles: [],
      myFilesRaw: [],
      lastId: "None",
      cursorPosition: -1,
      slicePosition: 0,
      cursorDirUp: true,
      fileManagerHeight: 20,
      sortType: 0, // 0 - name, 1 - size, 2 - date
      sortReverse: false,
      commandLine: "command> ",
    };
  },
  mutations: mutations,
  actions: actions,

  getters: {},
});
