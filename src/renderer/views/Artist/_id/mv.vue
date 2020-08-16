<template>
  <div>
    <ul class="mvs">
      <mv-item
        class="mv-item"
        v-for="(mv) in mvs"
        :mv="mv"
        :key="mv.id"
      />
    </ul>
  </div>
</template>

<script>
import mvItem from '@/components/Common/mv-item'
import { getArtistMV } from '@/api/artist'
import { normalMV } from '@/utils/video'

export default {
  name: 'artist_id_mv',
  data () {
    return {
      mvs: []
    }
  },
  components: {
    mvItem
  },
  activated () {
    this._getArtistMv(this.$route.params.id, this.$route.query.platform)
  },
  methods: {
    async _getArtistMv (id, platform) {
      this.mvs = []
      let params = {
        id,
        limit: this.limit,
        offset: this.offset,
        platform
      }
      let { mvs, hasMore } = await getArtistMV(params)
      let arr = mvs.map(mv => {
        return normalMV(mv, '400y224')
      })
      this.mvs = this.mvs.concat(arr)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./../../../styles/mixins";

  .mvs {
    .grid-layout(15px);
    padding: 15px;
  }
</style>
