<template>
  <div class="mbody">
    <div style="text-align:left">
      <router-link v-bind:to=getUrl(1)>首页</router-link>
      <router-link v-bind:to=getUrl(2)>目录</router-link>
    </div>
    <div>
      {{title}}
    </div>
    <div style="margin:auto;text-align:left;margin-top:30px;text-indent:2em;" v-html="content" @touchstart="touchstart" @touchend="touchend">
      {{content}}
    </div>
    <div>
      <router-link v-if="prePageEnable" v-bind:to=getUrl(prePage)>上一页</router-link>
      <a v-else>上一页</a>
      <a style="margin-left:10px;margin-right:10px;">|</a>
      <router-link v-if="lastPageEnable" v-bind:to=getUrl(lastPage)>下一页</router-link>
      <a v-else>下一页</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Cell, Indicator, Toast } from 'mint-ui'
Vue.component('ReadNovel', Cell)

export default {
  name: 'ReadNovel',
  data () {
    return {
      title: '',
      content: '',
      lastPage: '',
      prePage: '',
      lastPageEnable: false,
      prePageEnable: false,
      startPos: 0,
      endPos: 0,
      startTime: 0,
      endTime: 0,
      autoRead: false,
      isLoadData: true,
      isTouched: false
    }
  },
  created: function () {
    this.initPage()
    requestAnimationFrame(this.moveNextPosition)
  },
  methods: {
    getUrl: function (page) {
      var result = '/'
      if (page === 1) {
        result = '/'
      } else if (page === 2) {
        result =
          '/novelcategory/' +
          this.$route.params.category +
          '/' +
          this.$route.params.guid
      } else if (page) {
        result =
          '/readnovel/' +
          this.$route.params.category +
          '/' +
          this.$route.params.guid +
          '/' +
          page
      }
      return result
    },
    initPage: function () {
      var _this = this
      _this.content = ''
      _this.title = ''
      _this.prePage = ''
      _this.lastPage = ''
      _this.prePageEnable = false
      _this.lastPageEnable = false
      Indicator.open('加载中...')
      _this.$http
        .get(
          '/api/readnovel/' +
            _this.$route.params.category +
            '/' +
            _this.$route.params.guid +
            '/' +
            _this.$route.params.page
        )
        .then(response => {
          _this.content = response.body.content
          _this.title = response.body.title
          _this.prePage = response.body.prePage
          _this.lastPage = response.body.lastPage
          _this.prePageEnable = _this.prePage.length > 0
          _this.lastPageEnable = _this.lastPage.length > 0
          document.title = 'wireboy免费小说 - ' + _this.title
          Indicator.close()
          _this.scrollTopValue = document.body.scrollTop
          setTimeout(function () {
            _this.isLoadData = false
          }, 1000)
        })
    },
    touchstart (e) {
      this.startPos = [e.touches[0].pageX, e.touches[0].pageY]
      this.startTime = new Date()
      this.isTouched = true
    },
    touchend (e) {
      this.isTouched = false
      this.endPos = [e.changedTouches[0].pageX, e.changedTouches[0].pageY]
      var distanceX = this.startPos[0] - this.endPos[0]
      var distanceY = this.startPos[1] - this.endPos[1]
      this.endTime = new Date()
      if (distanceX > window.screen.width / 3) {
        // window.location.href = this.getUrl(this.lastPage)
        this.$router.push(this.getUrl(this.lastPage))
      } else if (Math.abs(distanceX) < 2 && Math.abs(distanceY) < 2) {
        var disTime = this.endTime - this.startTime
        if (disTime < 500) {
          this.autoRead = !this.autoRead
          if (this.autoRead) {
            Toast('已开启自动阅读，点击屏幕关闭！')
          } else {
            Toast('已关闭自动阅读，点击屏幕开启！')
          }
        }
      }
    },
    moveNextPosition () {
      var _this = this
      if (!this.isTouched && this.autoRead && !this.isLoadData) {
        var lastScrollValue = document.body.scrollTop
        document.body.scrollTop += 1
        if (document.body.scrollTop === lastScrollValue) {
          _this.isLoadData = true
          setTimeout(function () {
            // window.location.href = _this.getUrl(_this.lastPage)
            _this.$router.push(_this.getUrl(_this.lastPage))
          }, 2000)
        }
      }
      requestAnimationFrame(_this.moveNextPosition)
    }
  },
  watch: {
    $route (to, from) {
      this.initPage(this.$route.path)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
