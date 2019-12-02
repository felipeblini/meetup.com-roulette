<template>
  <div id="app">
    <MeetupSorteioComponent />

    <div class="text-center mt-5">
      Done with <font-awesome-icon icon="heart" color="red" /> by the
      <a href="http://www.devpp.com.br" target="_blank">DevPP Community</a>
    </div>
  </div>
</template>

<script>
import MeetupSorteioComponent from "@/components/sorteio/Index";
export default {
  name: "app",
  components: {
    MeetupSorteioComponent
  }
};
</script>
