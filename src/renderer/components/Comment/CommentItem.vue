<template>
  <a-comment class="comment">
    <template slot="actions">
      <span>
        <a-icon type="like" :theme="comment.liked?'filled':'outlined'" />
        <span v-if="comment.likedCount">({{comment.likedCount}})</span>
      </span>
      <span>分享</span>
      <span>回复</span>
    </template>
    <div slot="author" @click="$emit('shrink-screen')">
      <router-link :disabled="comment.platform == 'qq'" :to="`/user?id=${comment.user.userId}`">{{comment.user.nickname}}:</router-link>
    </div>
    <div slot="avatar" @click="$emit('shrink-screen')">
      <router-link :disabled="comment.platform == 'qq'" :to="`/user?id=${comment.user.userId}`">
        <img v-lazy="`${comment.user.avatarUrl}?param=32y32`" class="avatar" />
      </router-link>
    </div>
    <span slot="datetime">{{moment(comment.time).format('YYYY年MM月DD日 HH:mm')}}</span>
    <div slot="content">
      <p v-html="normalComment(comment.content)"></p>
      <template v-if="comment.beReplied && comment.beReplied.length">
        <div
          @click="$emit('shrink-screen')"
          class="beReplied"
          v-for="(reply, index) in comment.beReplied"
          :key="`${reply.beRepliedCommentId}_${index}`"
        >
          <router-link :disabled="comment.platform == 'qq'" :to="`/user?id=${reply.user.userId}`">@{{reply.user.nickname}}</router-link>
          <span v-html="normalComment(reply.content)"></span>
        </div>
      </template>
    </div>
  </a-comment>
</template>

<script>
import moment from 'moment'
import { getEmoji } from '@/api/emoji.js'
import { encodeHtml } from '@/utils/dom.js'
export default {
  data () {
    return {
      moment
    }
  },
  props: {
    comment: {
      type: Object
    }
  },
  methods: {
    normalComment (content) {
      if (!content) return
      let _offset = 0
      let str =  content.replace(/(.*?)\[(.+?)\]/g, (match, p1, p2, offset) => {
        let imgUrl = getEmoji(p2)
        _offset = offset + p1.length + p2.length + 2
        if (!imgUrl) return encodeHtml(match)
        return `${encodeHtml(p1)}<img src=${imgUrl} />`
      })
      return _offset > 0 ? str + encodeHtml(content.slice(_offset)) : encodeHtml(content.slice(_offset))
    }
  }
}
</script>

<style scoped>
.comment-wrapper dt {
  padding-bottom: 15px;
}

.comment-wrapper dt {
  border-bottom: 1px solid #e6e6e6;
}

.comment-wrapper dd:not(:last-child) {
  border-bottom: 1px solid #e6e6e6;
}

.comment >>> .ant-comment-actions {
  float: right;
  margin: 0;
}

.beReplied {
  background: rgba(232, 232, 232, 0.5);
  padding: 3px 6px;
  border-radius: 3px;
}
</style>
