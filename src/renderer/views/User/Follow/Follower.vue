<template>
  <div class="follow">
    <header class="follow-header">
      <span>关注列表</span>
    </header>
    <main class="follow-main">
      <a-row type="flex" :gutter="16">
        <a-col :xl="8" :md="12" v-for="follower in followers" :key="follower.userId">
          <router-link class="follower-item" :to="`/user?id=${follower.userId}`">
            <div class="avatar">
              <img v-lazy="`${follower.avatarUrl}?param=60y60`" />
            </div>

            <div class="info">
              <router-link
                :to="`/user?id=${follower.userId}`"
                class="nickname"
              >by {{ follower.nickname }}</router-link>
              <div class="signature">{{ follower.signature }}</div>
              <div class="extra">
                <span>歌单：{{ follower.playlistCount }}</span>
                <span>粉丝：{{ follower.followeds }}</span>
              </div>
            </div>
          </router-link>
        </a-col>
      </a-row>
      <infinite-loading
        :identifier="infiniteId"
        forceUseInfiniteWrapper=".ant-layout-content"
        @infinite="loadmore"
      />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { user_follower } from '@/api/user'
export default {
  data () {
    return {
      followers: [],
      limit: 30,
      offset: -this.limit,
      infiniteId: +new Date()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.infiniteId += 1
      vm.followers = []
      vm.offset = -vm.limit
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.infiniteId += 1
    this.offset = -this.limit
    this.followers = []
  },
  methods: {
    async loadmore ($state) {
      let uid = this.$route.query.uid
      this.offset += this.limit
      let { limit, offset } = this
      let options = {
        limit,
        offset,
        uid
      }
      let res = await user_follower(options)
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
    margin: 0 20px;
    background: #f5f5f7;
    border-bottom: 1px solid #eae9e9;
  }
  .follow-main {
    padding: 15px;
    .follower-item {
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
  }
}
</style>
