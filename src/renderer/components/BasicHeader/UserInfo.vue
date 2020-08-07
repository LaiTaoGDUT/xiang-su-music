<template>
  <div>
    <template v-if="hasUserInfo">
      <a-popover
        v-model="visible"
        trigger="click"
        overlayClassName="user-wrapper"
        :overlayStyle="{ width: '280px' }"
        @visibleChange="refreshData"
      >
        <template slot="content">
          <a-spin :spinning="loadding">
            <div class="user-box">
              <a-row type="flex" justify="space-between" align="middle" class="list1">
                <a-col>
                  <router-link :to="`/user?id=${userInfo.profile.userId}`" class="username">
                    <img v-lazy="`${userInfo.profile.avatarUrl}?param=50y50`" class="user-avatar" />
                    <span class="user-info-name">{{userInfo.profile.nickname}}</span>
                    <img src="./../../assets/images/vip.jpg" v-if="userInfo.profile.vipType"  class="img-vip" />
                  </router-link>
                </a-col>
                <a-col style="position: relative;">
                  <a-button :icon="userInfo.pcSign ? 'check' : 'meh'" :disabled="userInfo.pcSign" class="sign-btn" @click="pcSign">
                    {{ userInfo.pcSign ? '已签到' : '签到' }}
                  </a-button>
                  <transition name="sign">
                    <div class="sign-point" v-if="showPoint">{{ signPoint }}</div>
                  </transition>
                </a-col>
              </a-row>

              <a-row class="list2" type="flex" justify="space-between" align="middle">
                <a-col :span="6">
                  <router-link :to="`/user-event?uid=${userInfo.userId}&nickname=${userInfo.profile.nickname}`" class="list2-item">
                    <strong>{{ userInfo.profile.eventCount }}</strong>
                    <div>动态</div>
                  </router-link>
                </a-col>
                <a-col :span="12">
                  <router-link :to="`/follower?uid=${userInfo.userId}`" class="list2-item">
                    <strong>{{ userInfo.profile.follows }}</strong>
                    <div>关注</div>
                  </router-link>
                </a-col>
                <a-col :span="6">
                  <router-link :to="`/followed?uid=${userInfo.userId}`" class="list2-item">
                    <strong>{{ userInfo.profile.followeds }}</strong>
                    <div>粉丝</div>
                  </router-link>
                </a-col>
              </a-row>

              <a-row type="flex" justify="space-between" align="middle" class="list3">
                <a-col :span="24">
                  <span class="list3-item" @click="logout">退出登录</span>
                </a-col>
              </a-row>
            </div>
          </a-spin>
        </template>
        <span class="header-user">
          <img
            width="30"
            height="30"
            class="avatar"
            v-lazy="`${userInfo.profile.avatarUrl}?param=30y30`"
            :key="userInfo.profile.avatarUrl"
          />
          <span class="header-user-info" :key="userInfo.profile.nickname" :title="userInfo.profile.nickname">
            <span class="header-user-info-name">{{userInfo.profile.nickname}}</span>
            <img src='./../../assets/images/vip.jpg' v-if="userInfo.profile.vipType" class="img-vip" />
            <a-icon type="caret-down" />
          </span>
        </span>
      </a-popover>
    </template>
    <span @click="showLogin" class="header-user" v-else>
      <a-avatar :size="30" class="avatar" icon="user" />
      <span>未登录</span>
    </span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { user_detail, daily_signin } from '@/api/user'
import eventBus from '@/utils/eventBus'

export default {
  data () {
    return {
      loadding: false,
      visible: false,
      showPoint: false,
      signPoint: ''
    }
  },
  computed: {
    ...mapState('User', ['userInfo']),
    ...mapGetters('User', ['hasUserInfo']),
    userId () {
      return this.userInfo.userId
    }
  },
  methods: {
    showLogin () {
      this.$store.commit('User/SET_SHOW_LOGIN', true)
    },
    logout () {
      this.$store.dispatch('User/logout', { self: this }).then(() => {
        this.$message.success('退出成功')
        if (this.$route.name === 'home') {
          // do nothing
        } else {
          this.$router.push({ path: '/home' })
        }
      })
    },
    async pcSign () {
      let [err, res] = await this.$errorCaptured(daily_signin(1))
      if (res) {
        if (res.code === 200) {
          this.$message.success('签到成功!')
          this.signPoint = res.point
          this.showPoint = true
        }
      }
    },
    async refreshData (visible) {
      if (visible) {
        this.loadding = true
        let [err, detail] = await this.$errorCaptured(user_detail(this.userId))
        if (!err) {
          let userInfo = { ...this.userInfo }
          this.$store.commit('User/SET_USER_INFO', Object.assign(userInfo, { userId: this.userId, ...detail }))
        }
        this.loadding = false
      }
    }
  }
}
</script>

<style lang="less">
.user-box {
  margin: -12px -16px;
  padding: 12px 16px;
  background: #fafafa;
  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }
  .username {
    color: #333;
  }
  .list1 {
    padding: 10px 0;
  }
  .list2 {
    padding: 10px 0;
    border-top: 1px solid #ddd;
    .list2-item {
      text-align: center;
      display: block;
      color: #333;
      &:not(:last-child) {
        border-right: 1px solid #ddd;
      }
    }
  }
  .list3 {
    padding: 10px 10px;
    border-top: 1px solid #ddd;
    .list3-item {
      text-align: center;
      display: block;
      color: #333;
      cursor: pointer;
    }
  }
  .list3:hover {
    background-color: #ddd;
  }
  .sign-point {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    line-height: 27px;
    text-align: center;
    color: @primary-color;
    opacity: 0;
  }
  .sign-btn {
    height: 27px;
    padding: 0 8px;
  }
}

</style>
