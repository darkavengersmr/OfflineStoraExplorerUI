<template>
  <pre>┍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━━━━━━━┑</pre>
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
      downloadMyFiles({ params_id: $event.id, params_operation: 'dir_list' })
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
    }),
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
