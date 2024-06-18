<template>
  <div id="app">
    <CreateRedPacket />
  </div>
</template>

<script>
import CreateRedPacket from "@/components/CreateRedPacket.vue";

export default {
  name: "App",
  components: {
    CreateRedPacket,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
