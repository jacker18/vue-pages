<template>
  <div id="app">
    Hello,World!
<!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'commutify'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
