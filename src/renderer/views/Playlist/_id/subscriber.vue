<template>
  <div class="subscriber" :class="{'dark-back1': isDark}">
    <div class="items" v-if="subscribers.length">
      <router-link :to="`/user?id=${subscriber.userId}`"
                   v-for="subscriber in subscribers"
                   :key="subscriber.userId"
      >
        <img v-lazy="`${subscriber.avatarUrl}?param=55y55`" class="avatar">
        <div class="nickname">{{ subscriber.nickname }}</div>
      </router-link>
    </div>
    <div v-else style="text-align: center" class="no-subscriber">暂无收藏者~</div>
  </div>
</template>

<script>
import { getPlaylistSubscribers } from '@/api/playlist'
import { mapGetters } from 'vuex'
export default {
  name: 'playlist_id_subscriber',
  data () {
    return {
      subscribers: [],
      options: {
        limit: 30,
        offset: 0
      }
    }
  },
  activated () {
    this._getPlaylistSubscribers()
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    _getPlaylistSubscribers () {
      let id = this.$route.params.id
      let platform = this.$route.query.platform
      let options = { ...this.options, id, platform }
      getPlaylistSubscribers(options).then(res => {
        this.subscribers = res.subscribers
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./../../../styles/mixins";
  .subscriber {
    page-break-after: 20px;
    .items {
      .grid-layout(40px, 55px);
      padding: 30px;
      a {
        color: #333;
      }
      .avatar {
        border-radius: 50%;
      }
      .nickname {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .dark-back1 {
    .items {
      .nickname {
        color: #fff;
      }
    }
    .no-subscriber {
      padding: 10px 0;
      color: #fff;
    }
  }
</style>
