<template>
  <section class="desc" :class="{'dark-back1': isDark}">
    <div>
      <div>简介</div>
      <pre v-html="briefDesc"></pre>
    </div>
    <div v-for="(item, index) in introduction" :key="index">
      <div>{{item.ti}}</div>
      <pre v-html="item.txt"></pre>
    </div>
    <dl v-for="(item, index) in topicData" :key="index">
      <dt>{{item.mainTitle}}</dt>
      <dd v-for="(con, index) in content" :key="index" v-html="con.content"></dd>
    </dl>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArtistDesc } from '@/api/artist'
export default {
  name: 'artist_id_desc',
  data () {
    return {
      introduction: [],
      briefDesc: '',
      topicData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  activated () {
    this._getArtistDesc()
  },
  methods: {
    async _getArtistDesc () {
      this.loading = true
      let { introduction, briefDesc, topicData } = await getArtistDesc({ id: this.$route.params.id, platform: this.$route.query.platform })
      this.introduction = introduction
      this.briefDesc = briefDesc
      this.topicData = topicData
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.desc {
  padding: 20px;
  dl {
    margin-bottom: 20px;
  }
  dd {
    line-height: 1.4;
    color: #777;
  }
}
.dark-back1 {
  color: #adafb2;
}
</style>
