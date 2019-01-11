<template>
  <div class="mbody">
    <div>{{title}}</div>
    <div style="margin-top:10px;text-align:left" v-html="description"></div>
    <div style="margin:10px;">
      <div style="float:left;display:inline">
        <router-link v-bind:to=getUrl(1)>首页</router-link>
      </div>
      <div v-if="isDesc" style="float:right;display:inline">
        <a href="#" v-on:click=setDesc(0)>正序</a>
        <a style="margin-left:10px;margin-right:10px;">|</a>
        <a >倒序</a>
      </div>
      <div v-else style="float:right;display:inline">
        <a>正序</a>
        <a style="margin-left:10px;margin-right:10px;">|</a>
        <a href="#" v-on:click=setDesc(1)>倒序</a>
      </div>
    </div>
    <div style="margin:auto;text-align:left;margin-top:50px;" >
    <mt-cell v-for="(novel,index) in SortNovelList" :key="index" is-link v-bind:to=getUrl(novel) v-bind:title=novel.name></mt-cell>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Cell, Indicator } from 'mint-ui'
Vue.component('NovelCategory', Cell)

export default {
  name: 'NovelCategory',
  data () {
    return {
      title: '',
      description: '',
      novelList: [],
      isDesc: false
    }
  },
  created: function () {
    Indicator.open('加载中...')
    this.$http
      .get(
        '/api/getnovelcategory/' +
          this.$route.params.category +
          '/' +
          this.$route.params.guid
      )
      .then(response => {
        var result = response.body
        this.novelList = result.categoryList
        this.title = result.title
        this.description = result.description
        document.title = 'wireboy免费小说 - ' + this.title
        Indicator.close()
      })
  },
  methods: {
    getUrl: function (novel) {
      if (novel === 1) return '/'
      return (
        '/readnovel/' +
        this.$route.params.category +
        '/' +
        this.$route.params.guid +
        '/' +
        novel.guid
      )
    },
    setDesc: function (flag) {
      this.isDesc = flag === 1
    }
  },
  computed: {
    SortNovelList:
    {
      get: function () {
        var _this = this
        var sortFunc = function (a, b) {
          return _this.isDesc ? b.orderNo - a.orderNo : a.orderNo - b.orderNo
        }
        var ret = _this.novelList
        return ret.sort(sortFunc)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
