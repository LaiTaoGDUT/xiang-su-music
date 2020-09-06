<template>
  <router-link tag="li" :to="`/album/${album.id}?platform=${album.platform}`" class="item" :class="{'dark-back1': isDark}">
    <img v-lazy="`${album.picUrl}?param=150y150`" class="avatar">
    <div class="name">
      {{album.name}}
    </div>
    <div class="publish-time" v-if="desc=='time'">{{album.publishTime | toDate}}</div>
    <div class="artist" v-else>
      <artists :artists="album.artists" />
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import Artists from '@/components/Common/artists'
export default {
  name: 'album-item',
  data () {
    return {}
  },
  props: {
    album: {
      type: Object
    },
    desc: {
      type: String,
      default: 'time'
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  components: {
    Artists
  }
}
</script>

<style lang="less" scoped>
  .item {
    position: relative;
    width: 141px;
    margin: 0 10px 0;
    cursor: pointer;
    &:hover {
      &:after {
        transform: scaleX(1.1);
      }
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 141px;
      height: 125px;
      background: url("./../../assets/images/album_cover.png") no-repeat center;
      background-size: cover;
      transition: all .23s;
      transform-origin: left;
    }
    .avatar {
      width: 125px;
      height: 125px;
    }
    .name {
      width: 125px;
      line-height: 20px;
      font-weight: 600;
      color: #000;
    }
    .publish-time,.artist {
      line-height: 20px;
      font-size: 12px;
      color: #999;
    }
  }

  .dark-back1 {
    .name {
      color: #ffffff;
    }
    .publish-time,.artist {
      color: #999;
    }
  }
</style>
