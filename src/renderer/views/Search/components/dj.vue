<template>
  <div class="search-dj" :class="{'dark-back1': isDark}">
    <a-spin :spinning="spinning">
      <a-row
        type="flex"
        align="middle"
        v-for="djRadio in djRadios"
        :key="djRadio.id"
      >
        <a-col :span="20">
          <router-link :to="`/dj/${djRadio.id}`" class="dj">
            <img v-lazy="`${djRadio.picUrl}?param=50y50`">
            <span>{{djRadio.name}}</span>
          </router-link>
        </a-col>
        <a-col :span="4" class="search-dj-nickname">
          by <router-link :to="`/user?id=${djRadio.dj.userId}`">{{djRadio.dj.nickname}}</router-link>
        </a-col>
      </a-row>
    </a-spin>
    <slot :total="result.djRadiosCount"></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import searchMixin from '@/mixins/Search'
import Artists from '@/components/Common/artists'
export default {
  mixins: [
    searchMixin
  ],
  data () {
    return {
      djRadios: []
    }
  },
  components: {
    Artists
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    normalData () {
      this.djRadios = this.result.djRadios
      this.spinning = false
    }
  }
}
</script>

<style lang="less" scoped>
.search-dj .ant-row-flex {
  &:nth-child(even) {
    background: #eee;
  }
  &:hover {
    background: #ddd;
  }
}
.dj {
  display: flex;
  align-items: center;
  padding: 10px 40px;
  font-size: 14px;
  color: #333;
  img {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}
.dark-back1 .ant-row-flex  {
  &:nth-child(even) {
    background: #1b1d20;
  }
  &:hover {
    background: #242629;
  }
  .dj {
    color: #dcdde4;
  }
  .search-dj-nickname {
    color: #828385;
    a {
      color: #828385;
      &:hover {
        color: #dcdde4;
      }
    }
  }

}
</style>
