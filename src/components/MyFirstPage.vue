<template>
  <div class="mbody">
    <div>
      <h1>{{ msg }}</h1>
      <!--<input style="width:400px;" v-model="text"><button v-on:click="getData">查询</button>-->
      <mt-field placeholder="请输入小说名称" v-model="text"><mt-button @click.native="getData">查询</mt-button></mt-field>
    </div>
    <div style="margin:auto;text-align:left;margin-top:30px;" >
    <mt-cell v-for="(novel,index) in novelList" is-link :key="index" v-bind:to=getUrl(novel) v-bind:title=novel.title>
    </mt-cell>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Cell, Search, Indicator } from 'mint-ui'
Vue.component('Cell.name', Cell)
Vue.component('Search.name', Search)

export default {
  name: 'MyFirstPage',
  data () {
    return {
      msg: '小说搜索',
      novelList: [],
      text: '',
      hisKey: '',
      nextPage: 1
    }
  },
  methods: {
    getData: function () {
      Indicator.open('加载中...')
      this.$http.get('/api/SearchNovel/' + this.text).then(response => {
        var result = response.body
        this.hisKey = result.key
        this.novelList = result.itemList
        // this.nextPage = 1 + result.pageIndex
        Indicator.close()
      })
    },
    getUrl: function (novel) {
      return ('/novelcategory/' + novel.category + '/' + novel.guid)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
