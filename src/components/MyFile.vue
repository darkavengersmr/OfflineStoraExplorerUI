<template>
  <div>
    <div class="my_dir" @click.stop="clickFile(id)" v-if="directory != 'false'">
      <pre><span>│<b> {{ format_name }} </b>│</span><span><b>{{ format_size }}</b></span>│ <span><b>{{ format_date }}</b></span> │</pre>
    </div>
    <div class="my_dir" @click.stop="clickFile(id)" v-if="directory == 'false'">
      <pre>│<span class="my_file"> {{ format_name }} </span>│<span class="my_file">{{ format_size }}</span>│ <span class="my_file">{{ format_date }}</span> │</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    directory: String,
    size: Number,
    date: String,
    parent: String,
    resource: String,
  },
  emits: ["clickFile"],
  data() {
    return {};
  },
  computed: {
    format_name: function () {
      function clearName(str) {
        var ars = str.replace(/[^a-zA-ZА-Яа-яЁё._-\d\s]/gi, "");
        return ars;
      }

      let f_str = clearName(this.name);
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
    clickFile() {
      if (this.directory == "true" || this.name == "..") {
        this.$emit("clickFile", { id: this.id });
      }
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 0px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 0px;
}
a {
  color: #54fefc;
}
</style>
