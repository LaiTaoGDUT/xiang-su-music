<template>
  <div class="top-bar" :class="{ 'dark-back1': isDark }">
    <div class="top-bar-logo">
      <img src="../../assets/images/top_bar_logo.png" alt="LOGO">
    </div>
    <div class="top-bar-main">
      <div class="top-bar-control">
        <controls />
      </div>
      <div class="top-bar-search">
        <search-box />
      </div>
      <div class="top-bar-menu">
        <div class="top-bar-menu-user">
          <div class="item">
            <user-info></user-info>
          </div>
          <div class="item">
            <theme-setting />
          </div>
          <div class="item" @click="clickSetting">
            <a-icon type="setting" class="icon"/>
          </div>
        </div>
        <frame-actions />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import config from '@/config/defaultSettings'
import ZIcon from '@/components/ZIcon'
import SearchBox from './SeachBox'
import UserInfo from './UserInfo'
import Controls from './Controls'
import ThemeSetting from './ThemeSetting'
import FrameActions from './FrameActions'
import eventBus from '@/utils/eventBus'
export default {
  components: {
    ZIcon,
    SearchBox,
    UserInfo,
    Controls,
    ThemeSetting,
    FrameActions
  },
  computed: {
    ...mapGetters('App', ['primaryColor', 'isDark']),
    ...mapGetters('User', ['userId']),
    ...mapGetters('play', [
      'current_song',
      'history_play_list',
      'current_play_list',
      'current_song_index'
    ]),
    ...mapState(['User'])
  },
  methods: {
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
    clickSetting () {
      this.$router.push( { path: '/setting' } )
      this.$store.commit('play/SET_FULLSCREEN', false)
    }
  }
}
</script>

<style>
.ant-popover-arrow {
  border-top-color: #fafafa !important;
  border-left-color: #fafafa !important;
}
</style>
<style lang="less" scoped>
.top-bar {
  display: flex;
  height: 100%;
  overflow: hidden;
  .top-bar-logo {
    display: flex;
    align-items: center;
    width: 200px;
    flex: 0 0 200px;
    padding-left: 5px;
    img {
      width: 180px;
    }
  }
  .top-bar-main {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-bar-search {
      width: 240px;
      flex: 0 0 240px;
      -webkit-app-region: no-drag;
    }
    .top-bar-control {
      margin-right: 5px;
      -webkit-app-region: no-drag;
      /deep/ .ant-btn {
        height: 24px;
        line-height: 22px;
      }
    }
  }
}

.top-bar-menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  height: 100%;
  .top-bar-menu-user {
    display: flex;
    -webkit-app-region: no-drag;
    .item {
      display: inline-flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: rgba(255, 255, 255, 1);
      }
      .ant-badge-count {
        height: 16px;
        line-height: 16px;
        min-width: 16px;
        padding: 0 5px;
        background: #fff;
        color: @primary-color;
        box-shadow: none;
        border-radius: 8px;
      }
      .avatar {
        margin-right: 8px;
        border-radius: 50%;
      }

      .icon {
        font-size: 16px;
      }
    }
  }
}

.header-user {
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  .header-user-info {
    display: flex;
    align-items: center;
  }
  span {
    font-size: 14px;
    letter-spacing: 2px;
  }
}
.user-info-name {
  display: inline-block;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.dark-back1 {
  border-bottom: 2px solid #5fa7e4;
}
</style>
