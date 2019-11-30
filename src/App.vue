<template>
  <div id="app">
    <MeetupSorteioComponent />
  </div>
</template>

<script>
import MeetupSorteioComponent from "./components/MeetupSorteioComponent";

export default {
  name: "app",
  components: {
    MeetupSorteioComponent
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
