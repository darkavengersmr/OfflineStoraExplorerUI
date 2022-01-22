export default {
  setMyFilesRaw(state, payload) {
    state.myFilesRaw = payload;
  },
  setLastId(state, payload) {
    state.lastId = payload;
  },
  setFullPath(state, payload) {
    state.fullPath = payload;
  },
  setCursorPosition(state, payload) {
    state.cursorPosition = payload;
  },
  setCursorDirUp(state, payload) {
    state.cursorDirUp = payload;
  },
  setSlicePosition(state, payload) {
    state.slicePosition = payload;
  },
  setSortReverse(state, payload) {
    state.sortReverse = payload;
  },
  setSortType(state, payload) {
    state.sortType = payload;
  },
  setCommandLine(state, payload) {
    state.commandLine = payload;
  },
};
