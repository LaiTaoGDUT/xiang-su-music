<template>
  <div>
    <canvas id="wrap" height="640" width="640" ></canvas>
    <div class="avatar-wrapper" v-if="Object.keys(current_song).length"  @click="changeModel">
      <img :src="`${current_song.avatar}`" class="avatar" :class="{'paused' : !playing}" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setInterval } from 'timers'
export default {
  data () {
    return {
      context: null,
      mediaElementSource: null,
      analyser: null,
      gradient: '',
      curModel: 0,
      width: 0,
      height: 0,
      timer0: null,
      timer1: null,
      timer2: null,
      timer3: null,
      colorChangeTimer: null, // 定时器，用于确定颜色的渐变
      colorHeight: 0 // 当前颜色的色彩高度
    }
  },
  props: {
    canvasHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters('play', ['source', 'current_song', 'playing']),
    ...mapGetters('App', ['showView']),
    gradientColorHeight () {
      return (this.colorHeight + 40) % 360
    }
  },
  watch: {
    source (newVal) {
      this.$nextTick(() => {
        this.audioDom = document.getElementById(newVal)
      })
    },
    showView (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.audioDom = document.getElementById(this.source)
          this.initGlow()
          this['drawSpectrum' + this.curModel]()
        })
        this.colorChangeTimer = setTimeout(this.setColorTimer, 500)
      } else {
        cancelAnimationFrame(this['timer' + this.curModel])
        clearTimeout(this.colorChangeTimer)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.wrap = document.getElementById('wrap')
    })
  },
  methods: {
    changeModel () {
      cancelAnimationFrame(this['timer' + this.curModel])
      this.curModel = (this.curModel + 1) % 4
      this['drawSpectrum' + this.curModel]()
    },
    setColorTimer () {
        this.colorHeight = (this.colorHeight + 2) % 360
        if (this.colorHeight % 6 == 0) {
          this.$emit('changeColorHeight', this.colorHeight)
        }
        this.colorChangeTimer = setTimeout(this.setColorTimer, 500)
    },
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
      // 不含最大值，含最小值
    },
    // 获取一个数组的所有波峰和波谷
    getCrestAndTrough (arr) {
        let i = 0
        let crest = [], trough = []
        while (i < arr.length - 1) {
          while (i < arr.length - 1 && arr[i] >= arr[i + 1]) {
            i++
          }
          trough.push(i)
          while (i < arr.length - 1 && arr[i] <= arr[i + 1]) {
            i++
          }
          crest.push(i)
        }
        return [crest, trough]
    },
    initGlow () {
      let AudioContext = window.AudioContext || window.webkitAudioContext
      let context = new AudioContext()
      if (!this.mediaElementSource) {
        try {
          if (!(this.audioDom instanceof window.Node)) return
          this.mediaElementSource = context.createMediaElementSource(
            this.audioDom
          )
          this.analyser = context.createAnalyser()
          this.mediaElementSource.connect(this.analyser)
          this.analyser.connect(context.destination)
          this.analyser.fftSize = 2048 / 2
        } catch (error) {
          console.log(error)
        }
      }
    },
    drawSpectrum0 () {
      let { width, height } = this.wrap
      let ctx = this.wrap.getContext('2d')
      // 创建数据
      const output = new Uint8Array(460)
      const du = 2 // 圆心到两条射线距离所成的角度
      const potInt = { x: width / 2, y: height / 2 } // 起始坐标
      const R = 150 // 半径
      const W = 3 // 射线的宽度
      const L = 35 // 射线的长度
      ctx.lineWidth = W
      ctx.lineCap = 'round'
      const _this = this;
      (function drawSpectrum () {
        _this.analyser.getByteFrequencyData(output) // 获取频i域数据
        ctx.clearRect(0, 0, _this.wrap.width, _this.wrap.height)
        for (let i = 0; i < 180; i++) {
          let value = output[i + 100] / 4
          let Rv1 = R - value
          let Rv2 = R + value

          // 画线段阴影
          // i * du / 180 从 0 增加到 2，三角函数内部从0到2Π
          // 对应的正弦值从0到1再到0再到-1再到0，对应的余弦值从1到0到-1到0再到1，
          // 参见正弦函数图
          // 即线段总数和线段之间的度数间隔之和需要等于360才能满足条件
          _this.gradient = ctx.createLinearGradient(
            Math.sin(((i * du) / 180) * Math.PI) * R + potInt.x,
            -Math.cos(((i * du) / 180) * Math.PI) * R + potInt.y,
            Math.sin(((i * du) / 180) * Math.PI) * (Rv2 + L) + potInt.x,
            -Math.cos(((i * du) / 180) * Math.PI) * (Rv2 + L) + potInt.y
          )
          _this.gradient.addColorStop(0, 'hsla(' + _this.colorHeight + ', 60%, 70%, 0.4)')
          _this.gradient.addColorStop(0.3, 'hsla(' + _this.colorHeight + ', 60%, 70%, 0.4)')
          _this.gradient.addColorStop(0.7, 'hsla(' + _this.gradientColorHeight + ', 60%, 70%, 0.2)')
          _this.gradient.addColorStop(1, 'hsla(' + _this.gradientColorHeight + ', 60%, 70%, 0)')
          ctx.strokeStyle = _this.gradient
          ctx.beginPath()
            ctx.moveTo(
              Math.sin(((i * du) / 180) * Math.PI) * R + potInt.x,
              -Math.cos(((i * du) / 180) * Math.PI) * R + potInt.y
            )
            ctx.lineTo(
              Math.sin(((i * du) / 180) * Math.PI) * (Rv2 + L) + potInt.x,
              -Math.cos(((i * du) / 180) * Math.PI) * (Rv2 + L) + potInt.y
            )
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath()
          if (i % 3 == 0) {
            let diff = Rv1 + 20 > R ? R : Rv1 + 20
            ctx.arc(
              Math.sin(((i * du) / 180) * Math.PI) * diff + potInt.y,
              -Math.cos(((i * du) / 180) * Math.PI) * diff + potInt.x,
              2,
              0,
              Math.PI * 2,
              false
            )
            ctx.fillStyle = 'hsl(' + _this.colorHeight + ', 60%, 70%)'
          }
          ctx.fill()
          ctx.closePath()

          // 画线段
          _this.gradient = ctx.createLinearGradient(
            Math.sin(((i * du) / 180) * Math.PI) * R + potInt.x,
            -Math.cos(((i * du) / 180) * Math.PI) * R + potInt.y,
            Math.sin(((i * du) / 180) * Math.PI) * Rv2 + potInt.x,
            -Math.cos(((i * du) / 180) * Math.PI) * Rv2 + potInt.y
          )
          _this.gradient.addColorStop(0, 'hsl(' + _this.colorHeight + ', 60%, 70%)')
          _this.gradient.addColorStop(0.5, 'hsl(' + (_this.colorHeight + 25) + ', 60%, 70%)')
          _this.gradient.addColorStop(1, 'hsl(' + _this.gradientColorHeight + ', 60%, 70%)')
          ctx.strokeStyle = _this.gradient
          ctx.beginPath()
            ctx.moveTo(
              Math.sin(((i * du) / 180) * Math.PI) * R + potInt.x,
              -Math.cos(((i * du) / 180) * Math.PI) * R + potInt.y
            )
            ctx.lineTo(
              Math.sin(((i * du) / 180) * Math.PI) * Rv2 + potInt.x,
              -Math.cos(((i * du) / 180) * Math.PI) * Rv2 + potInt.y
            )
          ctx.stroke()
          ctx.closePath()
        }
        _this.timer0 = requestAnimationFrame(drawSpectrum)
      })()
    },
    drawSpectrum3 () {
      let { width, height } = this.wrap
      let ctx = this.wrap.getContext('2d')
      // 创建数据
      const output = new Uint8Array(460)
      const du = 2 // 圆心到两条射线距离所成的角度
      const potInt = { x: width / 2, y: height / 2 } // 起始坐标
      const R = 150 // 半径
      const W = 2 // 射线的宽度
      ctx.lineCap = 'round'
      ctx.lineWidth = W
      let _output = []
      const _this = this
      // 获取两个坐标的重点坐标
      function getMidPoint (low, high) {
        let mid = {}
        mid.x = Math.floor((Math.sin(((low * du) / 180) * Math.PI) * (R + Math.floor(_output[low] / 4)) + potInt.x + Math.sin(((high * du) / 180) * Math.PI) * (R + _output[high] / 4) + potInt.x) / 2)
        mid.y = Math.floor((potInt.y - Math.cos(((low * du) / 180) * Math.PI) * (R + Math.floor(_output[low] / 4)) + potInt.y - Math.cos(((high * du) / 180) * Math.PI) * (R + _output[high] / 4)) / 2)
        return mid
      }
      (function drawSpectrum () {
        _this.analyser.getByteFrequencyData(output) // 获取频域数据
        _output = output.slice(100)
        ctx.clearRect(0, 0, _this.wrap.width, _this.wrap.height)
        let [crest, trough] = _this.getCrestAndTrough(_output.slice(0, 180))
        if (trough.length > crest.length) trough.pop()  // 让波谷和波峰数量相等
        let gradient = ctx.createRadialGradient(potInt.x, potInt.y, 130, potInt.x, potInt.y, 200)
        gradient.addColorStop(0, 'hsla(' + _this.colorHeight + ', 60%, 70%, 0.9)')
        gradient.addColorStop(1, 'hsla(' + (_this.colorHeight + 30) + ', 60%, 70%, 0.3)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(
          potInt.y,
          potInt.x,
          130,
          0,
          Math.PI * 2,
          false
        )
        ctx.arc(
          potInt.y,
          potInt.x,
          135,
          0,
          Math.PI * 2,
          false
        )
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        let beginPoint = getMidPoint(trough[0], crest[0])
        ctx.moveTo(
          beginPoint.x,
          beginPoint.y
        )
        let i = 1, isLow = false
        while (i < trough.length) {
          let midPoint, endPoint
          if (!isLow) {
            midPoint = {   // 参考点
              x: Math.sin(((crest[i - 1] * du) / 180) * Math.PI) * (R + Math.floor(_output[crest[i - 1]] / 4)) + potInt.x,
              y: -Math.cos(((crest[i - 1] * du) / 180) * Math.PI) * (R + Math.floor(_output[crest[i - 1]] / 4)) + potInt.y
            }
            endPoint = getMidPoint(crest[i - 1], trough[i])
          } else {
            midPoint = {   // 参考点
              x: Math.sin(((trough[i] * du) / 180) * Math.PI) * (R + Math.floor(_output[trough[i]] / 4)) + potInt.x,
              y: -Math.cos(((trough[i] * du) / 180) * Math.PI) * (R + Math.floor(_output[trough[i]] / 4)) + potInt.y
            }
            endPoint = getMidPoint(crest[i], trough[i])
            i++
          }
          isLow = !isLow
          ctx.quadraticCurveTo(
            midPoint.x,
            midPoint.y,
            endPoint.x,
            endPoint.y
            )
        }
        let ee = getMidPoint(crest[i - 1], trough[0])
        ctx.quadraticCurveTo(  // 参考点是最后一个波峰
          Math.sin(((crest[i - 1] * du) / 180) * Math.PI) * (R + Math.floor(_output[crest[i - 1]] / 4)) + potInt.x,
          -Math.cos(((crest[i - 1] * du) / 180) * Math.PI) * (R + Math.floor(_output[crest[i - 1]] / 4)) + potInt.y,
          ee.x,
          ee.y
        )
        ctx.quadraticCurveTo(  // 参考点是第一个波谷
          Math.sin(((trough[0] * du) / 180) * Math.PI) * (R + Math.floor(_output[trough[0]] / 4)) + potInt.x,
          -Math.cos(((trough[0] * du) / 180) * Math.PI) * (R + Math.floor(_output[trough[0]] / 4)) + potInt.y,
          beginPoint.x,
          beginPoint.y
        )
        ctx.fill()
        _this.timer1 = requestAnimationFrame(drawSpectrum)
      })()
    },
    drawSpectrum2 () {
      let { width, height } = this.wrap
      let ctx = this.wrap.getContext('2d')
      // 创建数据
      const output = new Uint8Array(460)
      const du = 3 // 圆心到两条射线距离所成的角度
      const potInt = { x: width / 2, y: height / 2 } // 起始坐标
      const R = 150 // 半径
      const _this = this;
      (function drawSpectrum () {
        _this.analyser.getByteFrequencyData(output) // 获取频i域数据
        ctx.clearRect(0, 0, _this.wrap.width, _this.wrap.height)
          ctx.beginPath()
          ctx.arc(
            potInt.y,
            potInt.x,
            145,
            0,
            Math.PI * 2,
            false
          )
          ctx.strokeStyle = 'hsl(' + _this.colorHeight + ', 60%, 70%)'
          ctx.stroke()
          ctx.closePath()
        for (let i = 0; i < 120; i++) {
          let value = output[i + 100] / 4
          let Rv1 = R + value

          ctx.beginPath()
          ctx.arc(
            Math.sin(((i * du) / 180) * Math.PI) * Rv1 + potInt.y,
            -Math.cos(((i * du) / 180) * Math.PI) * Rv1 + potInt.x,
            3,
            0,
            Math.PI * 2,
            false
          )
          ctx.fillStyle = 'hsl(' + _this.colorHeight + ', 60%, 70%)'
          ctx.fill()
          ctx.closePath()
        }
        _this.timer2 = requestAnimationFrame(drawSpectrum)
      })()
    },
    drawSpectrum1 () {
      let { width, height } = this.wrap
      let ctx = this.wrap.getContext('2d')
      const potInt = { x: width / 2, y: height / 2 } // 起始坐标
      // 创建数据
      const output = new Uint8Array(460)
      let circleSet = []  // 存储圆环的数组
      const runSpeed = 0.5  // 圆环的移动速度
      const minSplit = 20  // 每个圆环的最小间隔
      const maxSplit = 60  // 每个圆环的最大间隔
      const minRange = 130  // 圆环的最小半径
      const maxRange = 250 // 圆环最大能到达的半径
      const maxCircleNum = Math.floor((maxRange - minRange) / minSplit)  // 同时存在的圆环最大数量6
      const minCircleNum = Math.floor((maxRange - minRange) / maxSplit)  // 同时存在的圆环最小数量2
      let generateCircleTime = Math.ceil(minSplit / runSpeed) // 间隔多少帧判断圆环数量是否需要变化
      let circleGenerateSpeed
      let curCircleNum
      class Circle {
        constructor (context, speed, pole, radius, range) {
          this.ctx = context
          this.speed = speed
          this.pole = pole
          this.radius = radius
          this.range = range
          this.end = false
          this.__restart()
        }

        __restart () {
          this.r = this.radius
          this.ballRadius = Math.floor(5 + Math.random() * 3)
          this.ballAngle = Math.random() * Math.PI * 2 // 小球的位置用角度表示，随机产生
          this.ballPoint || (this.ballPoint = [0, 0])
          this.ballPoint[0] = Math.cos(this.ballAngle) * this.r // 根据空心圆的半径计算小球的坐标
          this.ballPoint[1] = Math.sin(this.ballAngle) * this.r
        }

        __lerp (src, dst, coeff) {
          return src + (dst - src) * coeff
        }

        __update () {
          if (this.r - this.range > 0.0001) {  // 空心圆超过一定范围就会失活
            this.end = true
          } else {
            this.r += this.speed
            this.ballAngle += 0.01
            this.ballPoint[0] = Math.cos(this.ballAngle) * this.r
            this.ballPoint[1] = Math.sin(this.ballAngle) * this.r
            this.opacity = this.__lerp(1, 0, this.r / this.range)
          }
        }

        render () {
          if (this.end) return
          this.__update()
          // 绘制空心圆
          this.ctx.lineWidth = 3
          this.ctx.strokeStyle = 'hsla(' + _this.colorHeight + ', 60%, 70%,' + this.opacity + ')'
          this.ctx.beginPath()
          this.ctx.arc(this.pole[0], this.pole[1], this.r, 0, Math.PI * 2)
          this.ctx.stroke()
          // 绘制小球
          this.ctx.strokeStyle = 'hsla(' + _this.colorHeight + ', 60%, 70%, 0)'
          this.ctx.fillStyle = 'hsla(' + _this.colorHeight + ', 60%, 70%,' + this.opacity + ')'
          this.ctx.beginPath()
          this.ctx.arc(this.pole[0] + this.ballPoint[0], this.pole[1] + this.ballPoint[1], this.ballRadius, 0, Math.PI * 2)
          this.ctx.stroke()
          this.ctx.fill()
        }
      }
      const _this = this;
      (function drawSpectrum () {
        if (generateCircleTime != 0) {
          generateCircleTime--
        } else {
          _this.analyser.getByteFrequencyData(output) // 获取频率数据
          // 将0到256的平均值映射为1到8，用来控制圆环数量的变化
          circleGenerateSpeed = Math.ceil(output.slice(0, 128).reduce((sum, a) => sum + a) / 128 / 32)
          if (circleGenerateSpeed > 6)  curCircleNum = maxCircleNum
          else if (circleGenerateSpeed > 5) curCircleNum = maxCircleNum - 1
          else if (circleGenerateSpeed > 4) curCircleNum = maxCircleNum - 2
          else if (circleGenerateSpeed > 3) curCircleNum = maxCircleNum - 3
          else curCircleNum = minCircleNum
          // curCircleNum = maxCircleNum - minCircleNum - 1 + circleGenerateSpeed
          circleSet = circleSet.filter(circle => circle.end == false)
          if (curCircleNum > circleSet.length) {
            circleSet.push(new Circle(ctx, runSpeed, [potInt.x, potInt.y], minRange, maxRange, _this.colorHeight))
            generateCircleTime = Math.ceil((maxRange - minRange) / curCircleNum / runSpeed)
          }
        }
        ctx.clearRect(0, 0, _this.wrap.width, _this.wrap.height)
        circleSet.forEach(circle => circle.render())
        _this.timer3 = requestAnimationFrame(drawSpectrum)
      })()
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
#wrap,
.avatar-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1111;
  transform: translate(-50%, -50%);
  -webkit-app-region: no-drag;
}
.avatar-wrapper {
  width: 640px;
  height: 640px;
  display: flex;
  align-items: center;
  justify-content: center;
  .avatar {
    border-radius: 50%;
    width: 260px;
    height: 260px;
    z-index: -1;
    animation: rotate 20s linear infinite both;
    &.paused {
      animation-play-state: paused;
    }
  }
}
</style>
