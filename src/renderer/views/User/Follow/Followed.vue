<template>
  <div class="follow">
    <header class="follow-header">
      <span>粉丝列表</span>
    </header>
    <main class="follow-main">
      <a-row type="flex" :gutter="16">
        <a-col :xl="8" :md="12" v-for="followed in followeds" :key="followed.userId">
          <router-link class="followed-item" :to="`/user?id=${followed.userId}`">
            <div class="avatar">
              <img v-lazy="`${followed.avatarUrl}?param=60y60`" />
            </div>

            <div class="info">
              <router-link
                :to="`/user?id=${followed.userId}`"
                class="nickname"
              >by {{ followed.nickname }}</router-link>
              <div class="signature">{{ followed.signature }}</div>
              <div class="extra">
                <span>歌单：{{ followed.playlistCount }}</span>
                <span>粉丝：{{ followed.followeds }}</span>
              </div>
            </div>
          </router-link>
        </a-col>
      </a-row>
      <div class="no-more">只能查看这么多了~</div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { user_followed } from '@/api/user'
export default {
  data () {
    return {
      followeds: [],
      limit: 100,
      offset: 0,
      infiniteId: +new Date()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.infiniteId += 1
      vm.followeds = []
      vm.offset = 0
      vm.getData(vm.$route.query.uid)
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getData(to.query.uid)
    this.infiniteId += 1
    this.offset = 0
    this.followeds = []
  },
  methods: {
    getData (uid) {
      let { limit, offset } = this
      let options = {
        limit,
        offset,
        uid
      }
      user_followed(options).then(res => {
        this.followeds = res.followeds
      })
    },
    async loadmore ($state) {
      let uid = this.$route.query.uid
      this.offset += this.limit
      let { limit, offset } = this
      let options = {
        limit,
        offset,
        uid
      }
      let res = await user_followed(options)
      if ( res.follow.length ) {
        this.followers.push(...res.follow)
      }
      $state.loaded()
      if ( !res.more ) {
        $state.complete()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.follow {
  .follow-header {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    font-size: 17px;
    color: #555;
    background: #f5f5f7;
    margin: 0 20px;
    border-bottom: 1px solid #eae9e9;
  }
  .follow-main {
    padding: 15px;
    .followed-item {
      display: flex;
      padding: 15px;
      border-bottom: 1px solid #eee;
      color: #333;
      font-size: 14px;
      &:hover {
        background: #eee;
      }
      .avatar {
        position: relative;
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        img {
          display: block;
          width: 100%;
          border-radius: 50%;
        }
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        overflow: hidden;
        padding-left: 15px;
        .nickname,.signature {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .no-more {
      margin: 15px 0;
      text-align: center;
    }
  }
}
</style>
