<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss" scoped>
  $mainBg: #F6F6F6;
  .app{
    background-color: $mainBg;
  }
</style>
