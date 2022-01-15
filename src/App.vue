<template>
  <div>
    <div class="activeCursor">
      <pre><span> Добавить </span>    <span> Пересинхронизировать </span>    <span> Удалить </span>           <span> Домой </span></pre>
    </div>
    <pre>┍━ <span class="my_path">{{ format_fullPath }}</span>{{ add_to_fullPath }}┑</pre>
    <pre>
┝━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━━━━━━━┥</pre
    >
    <pre>│                 <span class="my_path">Имя</span>                  │ <span class="my_path">Размер</span>│   <span class="my_path">Время правки</span>   │</pre>
    <my-file
      :id="lastId"
      :name="dir_up"
      :class="{ activeCursor: cursorDirUp }"
      @clickFile="
        downloadMyFiles({ params_id: $event.id, params_operation: 'dir_up' })
      "
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
    }),
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
        f_str = "Offline Stora Explorer v.0.1 ";
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
    }),
    ...mapMutations({
      setCursorPosition: "setCursorPosition",
    }),
    nextItem(event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.keyCode == 13 && !this.cursorDirUp) {
        this.downloadMyFiles({
          params_id: this.myFiles[this.cursorPosition]._id,
          params_operation: "dir_list",
          params_name: this.myFiles[this.cursorPosition].name,
        });
      } else if (event.keyCode == 13 && this.cursorDirUp) {
        this.downloadMyFiles({
          params_id: this.lastId,
          params_operation: "dir_up",
        });
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
      }
    },
  },
  mounted() {
    this.downloadMyFiles({
      params_id: "None",
      params_operation: "dir_list",
    });
    document.addEventListener("keydown", this.nextItem);
  },
  components: {
    MyFile,
  },
};
</script>

<style>
</style>
