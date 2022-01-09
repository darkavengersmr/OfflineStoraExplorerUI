import axios from "axios";

export default {
  async downloadMyFiles(context, { params_id, params_operation, params_name }) {
    let myfiles = await axios
      .get("/files/", {
        params: {
          id: params_id,
          operation: params_operation,
        },
      })
      .catch(function () {});
    context.commit("setMyFiles", myfiles.data);
    context.commit("setLastId", myfiles.data[0].parent);

    let path = this.state.fullPath;

    if (params_operation == "dir_list") {
      path.push(params_name);
    } else if (params_operation == "dir_up") {
      path.pop();
    }
    context.commit("setFullPath", path);
  },
};
