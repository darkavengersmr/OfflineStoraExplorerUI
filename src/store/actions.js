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
    context.dispatch("sortFiles", myfiles.data);
    context.commit("setLastId", myfiles.data[0].parent);

    let path = this.state.fullPath;

    if (params_operation == "dir_list") {
      path.push(params_name);
    } else if (params_operation == "dir_up") {
      path.pop();
    }

    if (
      params_id == "None" &&
      params_operation == "dir_list" &&
      this.state.searchMode
    ) {
      this.state.searchMode = false;
      path = ["None"];
    }

    if (this.state.searchMode) {
      path = ["None", "Результаты поиска"];
    }

    context.commit("setFullPath", path);
    context.commit("setCursorPosition", 0);
  },
  async searchMyFiles(context, { search_string }) {
    let myfiles = await axios
      .get("/search/", {
        params: {
          search: search_string,
        },
      })
      .catch(function () {});
    context.dispatch("sortFiles", myfiles.data);
    context.commit("setLastId", myfiles.data[0].parent);
    context.commit("setFullPath", ["None", "Результаты поиска"]);
    context.commit("setCursorPosition", 0);
    this.state.searchMode = true;
  },
  async sendCommand(context, { command_string, parameter_string }) {
    await axios.get("/command/", {
      params: {
        command: command_string,
        parameter: parameter_string,
      },
    });
  },
  sortFiles(context, arrayToSort = null) {
    let unordered;
    if (arrayToSort !== null) {
      unordered = arrayToSort;
    } else {
      unordered = this.state.myFilesRaw;
    }

    function sortIt(arrayToSort, reverse, type) {
      function toDate(str) {
        let dateParts = str.slice(0, 10).split(".");
        let mydate = new Date(
          dateParts[2],
          dateParts[1] - 1,
          dateParts[0],
          str.slice(11, 13),
          str.slice(14, 16),
          0
        );
        return mydate;
      }

      if (reverse === false) {
        switch (type) {
          case 1:
            arrayToSort.sort((a, b) => (a.size > b.size ? 1 : -1));
            break;
          case 2:
            arrayToSort.sort((a, b) =>
              toDate(a.date) > toDate(b.date) ? 1 : -1
            );
            break;
          default:
            arrayToSort.sort((a, b) => (a.name > b.name ? 1 : -1));
            break;
        }
      } else {
        switch (type) {
          case 1:
            arrayToSort.sort((a, b) => (a.size < b.size ? 1 : -1));
            break;
          case 2:
            arrayToSort.sort((a, b) =>
              toDate(a.date) < toDate(b.date) ? 1 : -1
            );
            break;
          default:
            arrayToSort.sort((a, b) => (a.name < b.name ? 1 : -1));
            break;
        }
      }
      return arrayToSort;
    }

    let dirs = unordered.filter(function (element) {
      return element.directory == "true";
    });

    dirs = sortIt(dirs, this.state.sortReverse, this.state.sortType);

    let files = unordered.filter(function (element) {
      return element.directory == "false";
    });

    files = sortIt(files, this.state.sortReverse, this.state.sortType);

    let ordered = [...dirs, ...files];
    context.commit("setMyFilesRaw", ordered);
  },
  reverseSort(context) {
    context.commit("setSortReverse", !this.state.sortReverse);
    context.dispatch("sortFiles");
  },
};
