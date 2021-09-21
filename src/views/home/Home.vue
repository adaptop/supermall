<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @loadMore="loadMore">
    <!--轮播图-->
    <HomeSwiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick"/>
    <goods-list :goods="showGoods"/>
    </scroll>
    <!--<back-top @click.native="backClick" v-show="isShowBackTop"/>-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navBar/NavBar"

  import HomeSwiper from "./childComps/HomeSwiper"
  import RecommendView from "./childComps/RecommendView"
  import FeatureView from "./childComps/FeatureView"

  import TabControl from "components/content/tabControl/TabControl"
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";


  import HomeApi from 'network/home'
  import {debounce} from 'common/utils'
  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        titles: ['流行','火爆','性感'],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultiData()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 3.事件监听商品图片的加载
      this.$bus.$on("goodsItemImageLoad",() => {
        // console.log("图片加载完成" + data);
        // console.log(this.$refs.scroll);
        debounce(this.$refs.scroll.refresh,500)
      })
    },
    methods: {
      getHomeMultiData() {
        HomeApi.getHomeMultiData().then(response => {
          this.banners = response.data.banner.list
          this.recommends = response.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page+1
        HomeApi.getHomeGoods(type,page).then( response => {
          console.log("当前的页码是"+page);
          this.goods[type].list.push(...response.data.list)
          this.goods[type].page += 1;
          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp();
        })
      },

      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      // 返回顶部
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      // 判断是否显示返回按钮
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000
      },
      // 加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
