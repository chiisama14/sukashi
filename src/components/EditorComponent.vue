<template>
  <div class="editor-component">
    <img v-if="imgSrc" :src="imgSrc" ref="image" @load="loadExif" :style="{ display: 'none' }" />
    <img src="../../public/icon.png" :style="{ display: 'none' }" ref="logo" />
    <template v-if="exif">
      <div class="editor-content" ref="preview" :style="[ contentMargin, { transform: `scale(${scale})`, transformOrigin: 'top left', width: `${editorWidth}px`, height: `${editorHeight}px`, fontFamily: config.fontName } ]">
        <img :src="imgSrc" ref="draggableImage" class="interact absolute" :style="[ initialPointStyle, interactStyle, imgFilter ]" />
        <!--<canvas ref="canvas" class="interact absolute" :style="[ initialPointStyle, interactStyle ]" />-->
        <div class="frame absolute" v-for="(frame, index) in theme.frames" :key="index" :style="frameStyle(frame)" />
        <div class="info absolute" v-for="(info, index) in theme.information" :key="index" :style="informationStyle(info)" v-html="getInfo(info.type)" />
      </div>
    </template>
  </div>
</template>

<script>
import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/actions/gesture'
import '@interactjs/modifiers'
import '@interactjs/dev-tools'
import interact from '@interactjs/interact'

import { Parser } from 'expr-eval'

import http from '../utils/http'
import EXIF from 'exif-js'
import * as describe from '../exif/describe'

import watermark from '../watermark'

import html2canvas from '../../../html2canvas'

export default {
  name: 'EditorComponent',
  props: {
    imgSrc: String,
    config: Object
  },
  data() {
    return {
      imageWidth: null,
      imageHeight: null,
      editorWidth: null,
      editorHeight: null,
      scale: null,
      baseFontSize: null,
      landscape: null,
      
      // EXIF
      exif: null,
      manufacturer: null,
      model: null,
      shutterSpeed: null,
      fNumber: null,
      iso: null,

      // Twitter
      profileImgUrl: null,
      oldTwitterAccount: null,

      // interact position
      x: 0,
      y: 0,
      currentWidth: 0,
      currentHeight: 0,
      angle: 0,
      gestureStartAngle: 0,
      gestureScale: 1,
      gestureStartScale: 0,

      //
      isProcessing: false
    }
  },
  watch: {
    config() {
      this.init()
    },
    isProcessing(newValue) {
      if (!newValue) {
        this.$emit('save-finished')
      }
    }
  },
  computed: {
    theme() {
      if (!this.imageWidth || !this.imageHeight) {
        return null
      }

      const mode = this.imageWidth >= this.imageHeight ? 'landscape' : 'portrait'

      return watermark[this.config.themeName][mode] || watermark[this.config.themeName]
    },
    imgFilter() {
      const filters = [ ]

      if (this.config.brightness !== 100) {
        filters.push(`brightness(${this.config.brightness}%)`)
      }

      if (this.config.saturate !== 100) {
        filters.push(`saturate(${this.config.saturate}%)`)
      }

      if (this.config.contrast !== 100) {
        filters.push(`contrast(${this.config.contrast}%)`)
      }

      if (this.config.grayscale !== 0) {
        filters.push(`grayscale(${this.config.grayscale}%)`)
      }

      if (this.config.sepia !== 0) {
        filters.push(`sepia(${this.config.sepia}%)`)
      }


      return {
        'filter': filters.join(' ')
      }
    },
    focalLength() {
      if (!this.exif) {
        return null
      }

      if (this.config.preferConvertedFocalLength) {
        return this.exif.FocalLengthIn35mmFilm || this.exif.FocalLength
      } else {
        return this.exif.FocalLength
      }
    },
    lens() {
      let lensStr = this.exif.LensID || this.exif.LensModel || this.exif.Lens

      if (!lensStr) {
        return null
      }

      if (lensStr.match('unknown')) {
        return this.exif.LensModel || this.exif.Lens
      } else {
        return lensStr
      }
    },
    date() {
      if (!this.config.showShotDate) {
        return null
      }

      if (!this.exif.DateTimeOriginal) {
        return null
      }

      return this.exif.DateTimeOriginal.replace(/^(\d+):(\d+):(\d+)/, (_, $1, $2, $3) => `${$1}.${$2}.${$3}`)
    },
    initialPointStyle() {
      if (!this.theme) {
        return { }
      }

      return {
        top: (this.imageHeight * this.theme.initialPoint.y) + 'px',
        left: (this.imageWidth * this.theme.initialPoint.x) + 'px'
      }
    },
    interactStyle() {
      return {
        transform: `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg) scale(${this.gestureScale})`,
        width: this.currentWidth + 'px',
        height: this.currentHeight + 'px'
      }
    },
    baseSize() {
      return Math.max(this.imageWidth, this.imageHe)
    },
    contentMargin() {
      if (this.isProcessing || !this.scale) {
        return { }
      }

      return {
        margin: `calc(((100vh - 100px) - (${this.editorHeight}px * ${this.scale})) * 0.5) calc((100vw - (${this.editorWidth}px * ${this.scale})) * 0.5`
      }
    }
  },
  methods: {
    loadExif() {
      this.returnToOriginalPosition()

      const that = this

      EXIF.getData(this.$refs.image, function() {
        const exif = EXIF.getAllTags(this)

        if (Object.keys(exif).length === 0) {
          that.$emit('exif-not-found', exif)
          return
        }
        
        that.exif = exif

        console.log(exif, Object.keys(exif).length)

        const model = describe.model(exif.Make, exif.Model)

        if (!that.manufacturer) {
          that.manufacturer = model.manufacturer
        }

        if (!that.model) {
          that.model = model.model
        }

        that.shutterSpeed = describe.shutterSpeed(exif.ExposureTime)
        that.fNumber = exif.FNumber
        that.iso = exif.ISOSpeedRatings

        that.$emit('exif-loaded', exif)
      })
    },
    async init() {
      // エディター領域の表示倍率調整
      const { naturalWidth, naturalHeight } = this.$refs.image
      this.imageWidth = naturalWidth
      this.imageHeight = naturalHeight

      if (!this.currentWidth) {
        this.currentWidth = this.imageWidth
      }

      if (!this.currentHeight) {
        this.currentHeight = this.imageHeight
      }

      this.baseFontSize = Math.min(naturalWidth, naturalHeight) / 20

      const scaleX = window.innerWidth / (naturalWidth * this.theme.width)
      const scaleY = (window.innerHeight * 0.8) / (naturalHeight * this.theme.height)
      
      this.scale = Math.min(scaleX, scaleY)

      this.editorWidth = naturalWidth * this.theme.width
      this.editorHeight = naturalHeight * this.theme.height

      if (this.config.twitterAccount && this.config.twitterAccount !== this.oldTwitterAccount) {
        this.oldTwitterAccount = this.config.twitterAccount

        const res = await http(
          'https://sn3rdohofb.execute-api.ap-northeast-1.amazonaws.com/default/sukashi-twitter-integration',
          'post',
          {
            rpc: 'getProfileIcon',
            payload: {
              screenName: this.config.twitterAccount
            }
          }
        )

        this.profileImgUrl = res.url
      }

      this.$emit('editor-size-changed')
    },
    gestureStartListener(event) {
      this.gestureStartAngle = event.angle - this.angle
      this.gestureStartScale = event.scale / this.gestureScale
      //this.angle -= event.angle * (1 / this.scale)
    },
    gestureMoveListener (event) {
      this.angle = event.angle - this.gestureStartAngle
      this.gestureScale = event.scale / this.gestureStartScale

      this.dragMoveListener(event)
    },
    gestureEndListener() {
      //this.angle = event.angle
      //this.gestureScale = event.scale * this.gestureScale * (1 / this.scale)
    },
    dragMoveListener(event) {
      this.x = parseFloat(this.x) + event.dx * (1 / this.scale)
      this.y = parseFloat(this.y) + event.dy * (1 / this.scale)
    },
    resizeMoveListener(event) {
      this.currentWidth = event.rect.width * (1 / this.scale)
      this.currentHeight = event.rect.height * (1 / this.scale)

      this.x += event.deltaRect.left * (1 / this.scale)
      this.y += event.deltaRect.top * (1 / this.scale)
    },
    returnToOriginalPosition() {
      this.init()

      // interact
      this.x = 0
      this.y = 0
      this.angle = 0
      this.gestureScale = 1
    },
    getInfo(key) {
      const divider = ` <span style="font-weight: 100">･</span> `
      const elements = [ ]
      let ret

      switch (key) {
      case 'additional':
        switch (this.config.additional) {
          case 'twitter':
            if (this.config.twitterAccount) {
              return `<img class="icon" src="${this.profileImgUrl}">&nbsp;&nbsp;&nbsp;@${this.config.twitterAccount}`
            } else {
              return ''
            }
          case 'sukashi':
              return `<img class="icon" src="${this.$refs.logo.src}">&nbsp;&nbsp;&nbsp;#SukashiApp`
          default:
            return ''
        }
      case 'model':
        return `<span style="font-weight: bold">${this.manufacturer}</span> ${this.model}`
      case 'exif':
        if (this.fNumber) {
          elements.push(`<span style="font-style: italic">f</span>/${this.fNumber}`)
        }

        if (this.shutterSpeed) {
          elements.push(`${this.shutterSpeed}`)
        }

        if (this.iso) {
          elements.push(`ISO ${this.iso}`)
        }

        if (this.focalLength) {
          elements.push(`${this.focalLength}mm`)
        }

        ret =  elements.join(divider)

        if (this.date) {
          ret = `${this.date}&nbsp;&nbsp;|&nbsp;&nbsp;` + ret
        }

        return ret
      }
    },
    getManufacturer() {
      return this.manufacturer
    },
    setManufacturer(manufacturer) {
      this.manufacturer = manufacturer
    },
    getOriginalSize() {
      return {
        width: this.editorWidth,
        height: this.editorHeight
      }
    },
    getModel() {
      return this.model
    },
    setModel(model) {
      this.model = model
    },
    frameStyle(frame) {
      const ret = { }

      ret.width = ((this.imageWidth * (frame.width || 1)) + 2) + 'px'
      ret.height = ((this.imageHeight * (frame.height || 1)) + 2) + 'px'
      ret.backgroundColor = this.theme.frameColor || '#fff'

      if (frame.top !== undefined) {
        ret.top = (this.imageHeight * frame.top) + 'px'
      }

      if (frame.bottom !== undefined) {
        ret.bottom = (this.imageHeight * frame.bottom) + 'px'
      }

      if (frame.left !== undefined) {
        ret.left = (this.imageWidth * frame.left) + 'px'
      }

      if (frame.right !== undefined) {
        ret.right = (this.imageWidth * frame.right) + 'px'
      }

      return ret
    },
    informationStyle(info) {
      const ret = { }

      ret.top =  (() => {
        if (typeof info.position.y === 'object') {
          if (this.config.additional && this.config.additional !== 'none') {
            return this.interpretSize(info.position.y.additional)
          } else {
            return this.interpretSize(info.position.y.normal)
          }
        } else if (typeof info.position.y === 'number') {
          return this.imageHeight * info.position.y + 'px'
        } else {
          return this.interpretSize(info.position.y)
        }
      })()

      switch (info.position.x) {
      case 'center':
        ret.width = '100%'
        ret.left = 0
        ret.textAlign = 'center'
        break
      default:
        ret.left =  (() => {
          if (typeof info.position.x === 'number') {
            return this.imageWidth * info.position.x + 'px'
          } else {
            return this.interpretSize(info.position.x)
          }
        })()

        ret.textAlign = 'left'
        ret.width = '100%'
        break
      }

      ret.fontSize = (() => {
        if (typeof info.size === 'number') {
          return `calc(${this.baseFontSize * (info.size || 1) + 'px'} * ${this.config.fontSize / 100})`
        } else {
          return `calc(${this.interpretSize(info.size)} * ${this.config.fontSize / 100})`
        }
      })()

      ret.color = info.color || '#000'
      ret.width = info.width ? this.interpretSize(info.width) : '100%'
      ret.height = info.height ? this.interpretSize(info.height) : 'unset'

      if (info.textAlign) {
        ret.textAlign = info.textAlign
      }

      ret.transform = info.transform
      ret.transformOrigin = info.transformOrigin

      ret.paddingLeft = info.paddingLeft ? this.interpretSize(info.paddingLeft) : undefined
      ret.paddingRight = info.paddingRight ? this.interpretSize(info.paddingRight) : undefined
      ret.paddingTop = info.paddingTop ? this.interpretSize(info.paddingTop) : undefined
      ret.paddingBottom = info.paddingBottom ? this.interpretSize(info.paddingBottom) : undefined

      ret.lineHeight = ret.height

      return ret
    },
    async save() {
      this.isProcessing = true
      const prevScale = this.scale

      this.scale = 1

      const canvas = await html2canvas(this.$refs.preview, {
        width: this.editorWidth,
        height: this.editorHeight,
        windowWidth: this.editorWidth,
        windowHeight: this.editorHeight,
        scale: this.config.size / 100,
        useCORS: true,
        onclone: doc => {
          const elm = doc.querySelectorAll('.editor-content')[0]

          elm.style.margin = '0'
          elm.style.transform = 'none'
          elm.style.transformOrigin = ''
        }
      })

      const mimeType = this.config.format === 'jpg' ? 'image/jpeg' : 'image/png'
      const quality = this.config.jpegQuality / 100

      const now = new Date()
      const fileName = `sukashi_${now.getFullYear()}${('0' + (now.getMonth() + 1)).substr(-2)}${('0' + now.getDate()).substr(-2)}_${('0' + now.getHours()).substr(-2)}${('0' + now.getMinutes()).substr(-2)}${('0' + now.getSeconds()).substr(-2)}.${this.config.format}`

      if (this.isAndroidApp) {
        canvas.toBlob(blob => {
          const tempFilePath = window.cordova.file.externalCacheDirectory + fileName

          window.resolveLocalFileSystemURL(window.cordova.file.externalCacheDirectory, dirEntry => {
            dirEntry.getFile(fileName, {
              create: true,
              exclusive: true
            }, fileEntry => {
              fileEntry.createWriter(writer => {
                const reader = blob.stream().getReader()

                const processReader = function({ done, value }) {
                  if (done) {
                    if (this.config.shareOnly) {
                      this.scale = prevScale
                      this.isProcessing = false
                      this.share(tempFilePath)
                    } else {
                      window.cordova.plugins.CordovaAndroidMediaStore.store(tempFilePath.replace('file://', ''), mimeType, 'Pictures/sukashi', fileName, path => {
                        console.log(path)

                        this.scale = prevScale
                        this.isProcessing = false
                        this.share(tempFilePath)
                      }, this.handleExportError)
                    }

                    return
                  }

                  writer.onwriteend = () => reader.read().then(processReader)

                  writer.seek(writer.length)
                  writer.write(new Blob([ value.buffer ]))
                }.bind(this)

                reader.read().then(processReader)
              })

            }, this.handleExportError)
          }, this.handleExportError)
        }, mimeType, quality)
      /*} else if (this.isIOSApp) {
        canvas.toBlob(blob => {
          const tempFilePath = window.cordova.file.dataDirectory + fileName

          window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, dirEntry => {
            dirEntry.getFile(fileName, {
              create: true,
              exclusive: true
            }, fileEntry => {
              fileEntry.createWriter(writer => {
                const reader = blob.stream().getReader()

                const processReader = ({ done, value }) => {
                  if (done) {
                    if (this.config.shareOnly) {
                      this.scale = prevScale
                      this.isProcessing = false
                      this.share(tempFilePath)
                    } else {
                      window.DownloadImageToGallery.downloadWithLocalPath('/' + fileName, () =>{
                        this.scale = prevScale
                        this.isProcessing = false
                        this.share(tempFilePath)
                      }, this.handleExportError)
                    }

                    return
                  }

                  writer.onwriteend = () => reader.read().then(processReader)

                  writer.seek(writer.length)
                  writer.write(new Blob([ value.buffer ]))
                }

                reader.read().then(processReader)
              })

            }, this.handleExportError)
          }, this.handleExportError)
        }, mimeType, quality)
      */
      } else if (this.isIPadBrowser || this.isIPhoneBrowser) {
        canvas.toDataURL(url => {
          // iOS Browser の a タグダウンロードが上手くいかないので、Blob URL を作成して表示する
          //const url = URL.createObjectURL(blob) // revoke は App.vue 側で行う

          this.scale = prevScale
          this.isProcessing = false

          this.$emit('image-exported', url)
        }, mimeType, quality)
      } else {
        canvas.toBlob(function(blob) {
          { // "a" tag workaround
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)

            link.href = url
            link.download = fileName
            link.style.display = 'none'

            document.body.appendChild(link)

            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }

          this.scale = prevScale
          this.isProcessing = false
        }.bind(this), mimeType, quality)
      }
    },
    share(path, force = false) {
      if (!this.config.openShareSheetAfterSaving && !force) {
        return
      }

      if (this.isAndroidApp || this.isIOSApp) {
        window.plugins.socialsharing.shareWithOptions({
          message: this.config.supportDevelopmentByHashtag ? ' #SukashiApp' : '',
          files: [ path ]
        }, this.handleExportError, this.handleExportError)
      }
    },
    handleExportError(err) {
      console.log(err)
    },
    interpretSize(size) {
      const normalized = size
        .replace(/([\d\\.]+)bh/g, (_, $1) => parseFloat($1, 10) * this.imageHeight / 100)
        .replace(/([\d\\.]+)bw/g, (_, $1) => parseFloat($1, 10) * this.imageWidth / 100)
        .replace(/([\d\\.]+)fs/g, (_, $1) => parseFloat($1, 10) * this.baseFontSize / 100)
        .replace(/px/g, '')

      //console.log(size, normalized)

      return Parser.evaluate(normalized) + 'px'
    }
  },
  mounted() {
    // interact
    interact('.interact').draggable({
      listeners: {
        move: this.dragMoveListener
      }
    }).resizable({
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true
      },
      listeners: {
        move: this.resizeMoveListener,
      },
      modifiers: [
        interact.modifiers.aspectRatio({
          ratio: 'preserve'
        }),
      ],
    }).gesturable({
      listeners: {
        start: this.gestureStartListener,
        move: this.gestureMoveListener,
        end: this.gestureEndListener
      }
    })
  }
}
</script>

<style lang="stylus">
.editor-component {
  position: relative;
  height: 100%;

  .editor-content {
    box-shadow: 0 0 100px #888;
    //background: url('../assets/transparent.svg');
    background-size: 100px;
    overflow: hidden;

    .interact {
      touch-action: none;
    }

    .frame {
      background-color: black;
    }

    .info {
      user-select none;
      cursor normal;
    }

    .icon {
      height: 100%;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
}
</style>
