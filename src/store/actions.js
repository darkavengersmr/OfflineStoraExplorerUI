import axios from "axios";

export default {
  async downloadMyFiles(context, { params_id, params_operation }) {
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
  },
};
