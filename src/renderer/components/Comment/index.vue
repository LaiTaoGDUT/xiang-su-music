<template>
  <div :class="{'dark-back1': isDark}">
    <div class='comment_num' v-if="commentData">
      <span style="font-size: 20px; margin-right: 15px;">听友评论</span>
      <span style="color: grey; font-size: 14px">（已有{{ commentData.total }}条评论）</span>
    </div>
    <div class="comment-wrapper" v-if="commentData">
      <dl v-if="commentData.hotComments.length">
        <dt>热门评论</dt>
        <dd v-for="(comment, index) in commentData.hotComments" :key="`hot_${comment.commentId}_${index}`">
          <comment-item :comment="comment" @shrink-screen="$emit('shrink-screen')" @likeComment="handleLikeComment"/>
        </dd>
      </dl>
      <dl v-if="commentData.topComments.length">
        <dt>精彩评论</dt>
        <dd v-for="(comment, index) in commentData.topComments" :key="`top_${comment.commentId}_${index}`">
          <comment-item :comment="comment" @shrink-screen="$emit('shrink-screen')" @likeComment="handleLikeComment"/>
        </dd>
      </dl>
      <dl v-if="commentData.comments.length">
        <dt>全部评论（{{ commentData.total }}）</dt>
        <dd v-for="(comment, index) in commentData.comments" :key="`all_${comment.commentId}_${index}`">
          <comment-item :comment="comment" @shrink-screen="$emit('shrink-screen')" @likeComment="handleLikeComment"/>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import Loading from '@/components/Common/loading'
import { likeComment } from '@/api/comment'
import { mapGetters } from 'vuex'
export default {
  props: {
    commentData: {
      type: Object,
      default () {
        return null
      }
    },
    commentType: {
      type: Number,
      default: 0
    },
    sourceId: {
      type: [Number, String],
      default: 0
    },
    platform: {
      type: String,
      dafault: 'netease'
    }
  },
  components: {
    Loading, CommentItem
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    handleLikeComment (comment) {
      if (this.sourceId == 6) { // 因为接口暂时无法获取动态的threadId，所以暂时无法给动态点赞
        return
      }
      if (this.platform == 'qq') {
        this.$message.error('暂时不支持跨平台点赞呢！')
        return
      }
      likeComment(this.sourceId, comment.commentId, !comment.liked, this.commentType, this.platform).then(res => {
        comment.liked = !comment.liked
        comment.likedCount = comment.liked ? comment.likedCount + 1 : comment.likedCount - 1
      }).catch(() => {
        this.$message.error('你的点赞好像被外星人抢走了！？')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.comment_num {
  line-height: 1;
  font-size: 18px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
  padding-bottom: 10px;
  margin-top: 8px;
}

.dark-back1 {
  background: transparent !important;
  color: #dcdde4;
  .comment_num {
    border-bottom: 1px solid #39393b;
  }
  .comment-wrapper {
    dt {
      color: #dcdde4;
      border-bottom: 1px solid #1c1e22;
      padding-bottom: 10px;
    }
  }
}
</style>
