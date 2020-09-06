<template>
  <section class="page-layout" :class="{ 'dark-back1': isDark }">
    <header class="wy-header">
      <nav>
        <router-link :to="item.href" v-for="(item, index) in topMenus" :key="index">{{item.title}}</router-link>
      </nav>
    </header>
    <section class="wy-wrapper">
      <slot></slot>
    </section>
    <slot name="footer"></slot>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'indexTopNav',
  props: {
    topMenus: {
      type: Array,
      default () {
        return [
          {
            title: '个性推荐',
            href: '/home'
          },
          {
            title: '歌单',
            href: '/playlist'
          },
          {
            title: '主播电台',
            href: '/dj'
          },
          {
            title: '排行榜',
            href: '/rank'
          },
          {
            title: '歌手',
            href: '/artist'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  }
}
</script>

<style lang="less" scoped>
  .dark-back1 {
    background: #16181c;
    .wy-header {
      border-bottom: 1px solid #5c5e61;
      a {
          color: #828385 !important;
        &.router-link-exact-active,&.router-link-active {
          border-bottom: 3px solid #5fa7e4 !important;
          color: #dcdde4 !important;
        }
      }
    }
  }
  .wy-wrapper {
    position: relative;
    max-width: 1200px;
    padding: 0 20px;
    min-height: calc(100vh - 246px);
    margin: auto;
  }

  .wy-header {
    margin: 0 30px;
    border-bottom: 1px solid #e3e2e2;
    text-align: center;
    a {
      display: inline-block;
      margin: 0 15px;
      color: #333;
      line-height: 42px;
      &.router-link-exact-active,&.router-link-active {
        border-bottom: 3px solid @primary-color;
        color: @primary-color;
      }
    }
  }
</style>
