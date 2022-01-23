<template>
  <div>
    <div class="activeCursor">
      <pre>  <span @click.stop="goHome()"> {{goHomeButton}} </span>      <span @click.stop="commandLineSearch()"> Поиск </span>       <span @click.stop="reverseSort()"> Сортировка{{sortArrow}} </span><span @click.stop="nextSortType()">{{displaySortType}}</span></pre>
    </div>
    <pre>┍━ <span class="my_path">{{ format_fullPath }}</span>{{ add_to_fullPath }}┑</pre>
    <pre>
┝━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━━━━━━━┥</pre
    >
    <pre>│                 <span class="my_path" @click.stop="nextSortType(0)">Имя</span>                  │ <span class="my_path" @click.stop="nextSortType(1)">Размер</span>│   <span class="my_path" @click.stop="nextSortType(2)">Время правки</span>   │</pre>
    <my-file
      :id="lastId"
      :name="dir_up"
      :class="{ activeCursor: cursorDirUp }"
      @clickFile="dirUp($event.id)"
    />
    <my-file
      v-for="(file, key, idx) in myFiles"
      :id="file._id"
      :name="file.name"
      :directory="file.directory"
      :size="file.size"
      :date="file.date"
      :parent="file.parent"
      :resource="file.resource"
      :key="idx"
      :cursor_position="key"
      :cursor_this="key == cursorPosition"
      :class="{ activeCursor: key == cursorPosition && !cursorDirUp }"
      @clickFile="
        downloadMyFiles({
          params_id: $event.id,
          params_operation: 'dir_list',
          params_name: file.name,
        })
      "
    />
    <div v-for="index in add_clear_string" :key="index">
      <pre>
│                                      │       │                  │</pre
      >
    </div>
    <pre>
┕━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━━━━━━━┙</pre
    >
    <input v-model="commandLine" class="commandline" />
    <div>
      <pre>1<span class="activeCursor">On/off_1</span> 2<span class="activeCursor">On/off_2</span> 3<span class="activeCursor">On/off_3</span> 4<span class="activeCursor">On/off_4</span> 5<span class="activeCursor">On/off_5</span> 6<span class="activeCursor">On/off_6</span> 0<span class="activeCursor">Status</span></pre>
    </div>
  </div>
</template>

<script>
import MyFile from "./components/MyFile.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      dir_up: "..",
    };
  },
  computed: {
    ...mapState({
      myFilesRaw: "myFilesRaw",
      lastId: "lastId",
      fullPath: "fullPath",
      cursorPosition: "cursorPosition",
      cursorDirUp: "cursorDirUp",
      slicePosition: "slicePosition",
      fileManagerHeight: "fileManagerHeight",
      sortType: "sortType",
      sortReverse: "sortReverse",
      commandLine: "commandLine",
      searchMode: "searchMode",
    }),
    totalSize: function () {
      let size = 0;
      let str_size = "";

      for (let i = 0; i < this.myFilesRaw.length; i++) {
        size += this.myFilesRaw[i].size;
      }

      if (size > 1000000000) {
        str_size = (size / 1000000000).toFixed(0) + "G";
      } else if (size > 1000000) {
        str_size = (size / 1000000).toFixed(0) + "M";
      } else if (size > 1000) {
        str_size = (size / 1000).toFixed(0) + "K";
      }
      return str_size;
    },
    goHomeButton: function () {
      if (this.searchMode) {
        return "Завершить поиск";
      } else {
        return "Список ресурсов";
      }
    },
    sortArrow: function () {
      if (this.sortReverse) {
        return "↑";
      } else {
        return "↓";
      }
    },
    displaySortType: function () {
      switch (this.sortType) {
        case 1:
          return "по размеру";
        case 2:
          return "по дате";
        default:
          return "по имени";
      }
    },
    myFiles: function () {
      if (typeof this.myFilesRaw != "undefined") {
        if (this.myFilesRaw.length > this.fileManagerHeight) {
          return this.myFilesRaw.slice(
            this.slicePosition + 1,
            this.slicePosition + this.fileManagerHeight
          );
        } else {
          return this.myFilesRaw;
        }
      }
      return [];
    },
    add_clear_string: function () {
      if (this.myFiles.length < this.fileManagerHeight - 1) {
        return this.fileManagerHeight - 1 - this.myFiles.length;
      } else {
        return 0;
      }
    },
    format_fullPath: function () {
      function clearPath(str) {
        var ars = str.replace(/[^a-zA-ZА-Яа-яЁё._-\d\s/]/gi, "");
        return ars;
      }
      let path = "";
      for (var i = 1; i < this.fullPath.length; i++) {
        if (i == this.fullPath.length - 1) {
          path += this.fullPath[i];
        } else {
          path += this.fullPath[i] + "/";
        }
      }
      let f_str = clearPath(path);
      if (this.fullPath.length == 1) {
        f_str = "Offline Stora Explorer v.0.5 ";
      }

      if (f_str == "Результаты поиска") {
        f_str =
          f_str +
          ": " +
          this.myFilesRaw.length +
          " Общий объем: " +
          this.totalSize;
      }

      if (f_str.length <= 50) {
        return f_str;
      } else {
        f_str =
          this.fullPath[1] +
          ":..." +
          f_str.slice(
            f_str.length - 45 - this.fullPath[1].length,
            f_str.length
          );

        return f_str;
      }
    },
    add_to_fullPath: function () {
      let f_str = "";
      if (this.fullPath.length <= 40) {
        f_str = f_str.padEnd(63 - this.format_fullPath.length, "━");
        return f_str;
      } else {
        return f_str;
      }
    },
  },
  methods: {
    ...mapActions({
      downloadMyFiles: "downloadMyFiles",
      searchMyFiles: "searchMyFiles",
      sortFiles: "sortFiles",
      reverseSort: "reverseSort",
    }),
    ...mapMutations({
      setCursorPosition: "setCursorPosition",
      setCommandLine: "setCommandLine",
      setSearchMode: "setSearchMode",
    }),
    nextItem(event) {
      //event.stopPropagation();
      //event.preventDefault();
      if (
        event.keyCode == 13 &&
        !this.cursorDirUp &&
        this.myFiles[this.cursorPosition].directory == "true" &&
        this.commandLine.length <= 9
      ) {
        this.downloadMyFiles({
          params_id: this.myFiles[this.cursorPosition]._id,
          params_operation: "dir_list",
          params_name: this.myFiles[this.cursorPosition].name,
        });
      } else if (
        event.keyCode == 13 &&
        this.cursorDirUp &&
        this.myFiles[this.cursorPosition].parent != "None"
      ) {
        if (!this.searchMode) {
          this.downloadMyFiles({
            params_id: this.lastId,
            params_operation: "dir_up",
          });
        } else {
          this.$store.commit("setSearchMode", false);
          this.goHome();
        }
      } else if (event.keyCode == 38 && this.cursorPosition > 0) {
        this.$store.commit("setCursorPosition", this.cursorPosition - 1);
      } else if (
        event.keyCode == 38 &&
        this.cursorPosition == 0 &&
        this.slicePosition > 0
      ) {
        this.$store.commit("setSlicePosition", this.slicePosition - 1);
      } else if (event.keyCode == 38 && this.cursorPosition == 0) {
        this.$store.commit("setCursorDirUp", true);
      } else if (
        event.keyCode == 40 &&
        this.cursorPosition == this.fileManagerHeight - 2 &&
        this.myFilesRaw.length - this.slicePosition > this.fileManagerHeight
      ) {
        this.$store.commit("setSlicePosition", this.slicePosition + 1);
      } else if (event.keyCode == 40 && this.cursorDirUp) {
        this.$store.commit("setCursorDirUp", false);
        this.$store.commit("setCursorPosition", 0);
      } else if (
        event.keyCode == 40 &&
        this.cursorPosition < this.myFiles.length - 1
      ) {
        this.$store.commit("setCursorPosition", this.cursorPosition + 1);
      } else if (event.keyCode == 8) {
        if (this.commandLine.length > 9) {
          this.$store.commit(
            "setCommandLine",
            this.commandLine.slice(0, this.commandLine.length - 1)
          );
        }
      }
    },
    commandLineInput(event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.keyCode == 13 && this.commandLine.length > 11) {
        this.searchMyFiles({
          search_string: this.commandLine.slice(9, this.commandLine.length),
        });
        this.$store.commit("setCommandLine", this.commandLine.slice(0, 9));
      } else if (event.keyCode > 19 && event.keyCode < 127) {
        this.$store.commit(
          "setCommandLine",
          this.commandLine + String.fromCharCode(event.keyCode)
        );
      }
    },
    commandLineSearch() {
      if (this.commandLine.length > 11) {
        this.searchMyFiles({
          search_string: this.commandLine.slice(9, this.commandLine.length),
        });
        this.$store.commit("setCommandLine", this.commandLine.slice(0, 9));
      }
    },
    goHome() {
      this.$store.commit("setFullPath", []);
      this.downloadMyFiles({
        params_id: "None",
        params_operation: "dir_list",
      });
    },
    dirUp(id) {
      if (id != "search") {
        this.downloadMyFiles({ params_id: id, params_operation: "dir_up" });
      } else {
        this.goHome();
      }
    },
    nextSortType(type = null) {
      switch (type) {
        case 0:
          this.$store.commit("setSortType", 0);
          this.reverseSort();
          break;
        case 1:
          this.$store.commit("setSortType", 1);
          this.reverseSort();
          break;
        case 2:
          this.$store.commit("setSortType", 2);
          this.reverseSort();
          break;
        default:
          if (this.sortType < 2) {
            this.$store.commit("setSortType", this.sortType + 1);
          } else {
            this.$store.commit("setSortType", 0);
          }
          this.sortFiles();
          break;
      }
    },
  },
  mounted() {
    this.goHome();
    document.addEventListener("keypress", this.commandLineInput);
    document.addEventListener("keydown", this.nextItem);
  },
  components: {
    MyFile,
  },
};
</script>

<style>
</style>
