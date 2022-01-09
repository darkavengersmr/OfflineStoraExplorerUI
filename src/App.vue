<template>
  <pre>┍━ <span class="my_path">{{ format_fullPath }}</span>{{ add_to_fullPath }}┑</pre>
  <pre>┝━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━━━━━━━┥</pre>
  <pre>│                 <span class="my_path">Имя</span>                  │ <span class="my_path">Размер</span>│   <span class="my_path">Время правки</span>   │</pre>
  <my-file
    :id="lastId"
    :name="dir_up"
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
    @clickFile="
      downloadMyFiles({
        params_id: $event.id,
        params_operation: 'dir_list',
        params_name: file.name,
      })
    "
  />
  <pre>┕━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━━━━━━━┙</pre>
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
      myFiles: "myFiles",
      lastId: "lastId",
      fullPath: "fullPath",
    }),
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
    ...mapMutations({
      setMyFiles: "setMyFiles",
      setLastId: "setLastId",
    }),
    ...mapActions({
      downloadMyFiles: "downloadMyFiles",
    }),
  },
  mounted() {
    this.downloadMyFiles({
      params_id: "None",
      params_operation: "dir_list",
    });
  },
  components: {
    MyFile,
  },
};
</script>

<style>
</style>
