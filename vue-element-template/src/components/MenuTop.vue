<template>
  <div class="menuTop">
    <el-tabs v-model="activeName" type="card" @tab-click="tabChange" stretch="stretch">
      <el-tab-pane label="团队/企业体检预约" name="first"></el-tab-pane>
      <el-tab-pane label="个人体检预约" name="second"></el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  export default {
    name: 'menuTop',
    created () {
    },
    data() {
      return {
        activeName: 'first',
      };
    },
    methods: {
      tabChange(tab, event) {
        let that = this;
        that.$emit('tabChange', tab.name);
      }
    }
  };
</script>


<style scoped>
</style>
