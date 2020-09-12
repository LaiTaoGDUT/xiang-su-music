<template>
  <div class="comment-wrapper">
    <div class="comment">
      <comment :commentData="commentData" :commentType="3" :sourceId="$route.params.id" :platform="$route.query.platform"></comment>
      <infinite-loading forceUseInfiniteWrapper=".ant-layout-content" :identifier="infiniteId" @infinite="loadmore" />
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment/index.vue'
import { getAlbumComment } from '@/api/comment'

export default {
  name: 'album_id_comment',
  data () {
    return {
      commentData: null,
      limit: 20,
      offset: 0,
      infiniteId: +new Date(),
      refresh: false
    }
  },
  activated () {
    this.offset = 0
    this.commentData = null
    this.infiniteId++
  },
  components: {
    Comment
  },
  methods: {
    async loadmore ($state) {
      let id = this.$route.params.id
      let platform = this.$route.query.platform
      let res = await getAlbumComment(id, this.limit, this.offset, platform)
      if (res.comments.length) {
        if (this.commentData) {
          this.commentData.comments.push(...res.comments)
        } else {
          this.commentData = res
        }
      }
      $state.loaded()
      if (res.more) {
        this.offset += this.limit
      } else {
        $state.complete()
      }
    }
  }
}
</script>

<style scoped>
.comment-wrapper {
  padding: 20px;
}

.comment-wrapper dt {
  padding-bottom: 15px;
}

.comment-wrapper dt {
  border-bottom: 1px solid #f3f5f9;
}

.comment-wrapper dd:not(:last-child) {
  border-bottom: 1px solid #f3f5f9;
}

.comment >>> .ant-comment-actions {
  float: right;
  margin: 0;
}

.comment a {
  color: #006fe3;
}
</style>
