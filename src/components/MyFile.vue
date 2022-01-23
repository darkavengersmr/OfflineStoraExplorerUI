<template>
  <div>
    <div class="my_dir" @click.stop="detectClick()" v-if="directory != 'false'">
      <pre><span>│<b> {{ format_name }} </b>│</span><span><b>{{ format_size }}</b></span>│ <span><b>{{ format_date }}</b></span> │</pre>
    </div>
    <div class="my_dir" @click.stop="detectClick()" v-if="directory == 'false'">
      <pre>│<span v-bind:class="{ my_file: !cursor_this }"> {{ format_name }} </span>│<span v-bind:class="{ my_file: !cursor_this }">{{ format_size }}</span>│ <span v-bind:class="{ my_file: !cursor_this }">{{ format_date }}</span> │</pre>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    id: String,
    name: String,
    directory: String,
    size: Number,
    date: String,
    parent: String,
    resource: String,
    cursor_position: Number,
    cursor_this: Boolean,
  },
  emits: ["clickFile"],
  data() {
    return {
      numClicks: 0,
    };
  },
  computed: {
    ...mapState({
      fullPath: "fullPath",
      searchMode: "searchMode",
    }),
    format_name: function () {
      function clearName(str) {
        var ars = str.replace(/[^a-zA-ZА-Яа-яЁё._-\d\s]/gi, "");
        return ars;
      }

      let f_str = clearName(this.name);
      if (this.searchMode && this.resource) {
        f_str = this.resource + ": " + f_str;
      }

      if (f_str.length <= 28) {
        f_str = f_str.padEnd(36, " ");

        return f_str;
      } else {
        f_str =
          f_str.slice(0, 27) +
          "~" +
          f_str.slice(f_str.length - 8, f_str.length);

        return f_str.padEnd(36, " ");
      }
    },
    format_size: function () {
      if (this.name != "..") {
        let str_size = this.size + "";
        if (this.size > 1000000000) {
          str_size = (this.size / 1000000000).toFixed(0) + "G";
        } else if (this.size > 1000000) {
          str_size = (this.size / 1000000).toFixed(0) + "M";
        } else if (this.size > 1000) {
          str_size = (this.size / 1000).toFixed(0) + "K";
        }

        return str_size.padStart(6, " ") + " ";
      } else {
        return "-ВВЕРХ-";
      }
    },
    format_date: function () {
      if (this.name != "..") {
        return this.date.padStart(16, " ");
      } else {
        return "".padStart(16, " ");
      }
    },
  },
  methods: {
    ...mapMutations({
      setCursorPosition: "setCursorPosition",
      setSearchMode: "setSearchMode",
    }),
    oneClick() {
      this.$store.commit("setCursorPosition", this.cursor_position);
      if (this.name == "..") {
        this.$store.commit("setCursorDirUp", true);
      } else {
        this.$store.commit("setCursorDirUp", false);
      }
    },
    doubleClick() {
      this.$store.commit("setCursorPosition", this.cursor_position);
      if (
        this.directory == "true" ||
        (this.name == ".." && this.fullPath.length > 1)
      ) {
        if (this.searchMode) {
          this.$store.commit("setSearchMode", false);
          this.$emit("clickFile", { id: "search" });
        } else {
          this.$emit("clickFile", { id: this.id });
        }
      }
    },
    detectClick: function () {
      this.numClicks++;
      if (this.numClicks === 1) {
        var self = this;
        setTimeout(function () {
          switch (self.numClicks) {
            case 1:
              self.oneClick();
              break;
            default:
              self.doubleClick();
          }
          self.numClicks = 0;
        }, 200);
      }
    },
  },
};
</script>

<style scoped>
</style>
