<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn-dropdown stretch flat auto-close no-caps>
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <img src="../public/icon.png" style="display: block; height: 2rem; margin-right: 0.75rem;" />
              <div>Sukashi</div>
            </div>
          </template>
          <q-list>
            <q-item @click="aboutModal = true" clickable>
              <q-item-section>
                <q-item-label>{{ $t('ABOUT_THIS_APP_HEADING') }}</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item-label header>Language</q-item-label>
            <q-item clickable v-ripple @click="selectLanguage('ja')">
              <q-item-section avatar side>
                <q-icon v-if="$i18n.locale === 'ja'" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Japanese (日本語)</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="selectLanguage('en')">
              <q-item-section avatar side>
                <q-icon v-if="$i18n.locale === 'en'" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>English</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-space />

        <q-separator dark vertical />
        <q-btn stretch flat :label="$t('OPEN_IMAGE_BUTTON_LABEL')" @click="openGallery" />
      </q-toolbar>

    </q-header>

    <q-page-container>
      <q-page :style-fn="styleFn">
        <EditorComponent v-if="imgSrc" :key="imgSrc.substring(0, 5000)" :imgSrc="imgSrc" :exif="exif" :config="editorConfig" ref="editor" @image-loaded="suggestSize" @image-exported="onImageExported" @save-finished="onSaveFinished" @editor-size-changed="suggestSize" />
        <div v-else :style="{ height: '100%', paddingTop: '35vh', paddingLeft: '10vw', paddingRight: '10vw', textAlign: 'center' }">
          {{ $t('OPEN_IMAGE_GUIDE_TEXT') }}
          <template v-if="isSafari || isIPhoneBrowser || isIPadBrowser">
            <div>
              <br>
              <b>{{ $t('IOS_NOT_SUPPORTED_TEXT') }}</b>
            </div>
          </template>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated>
      <q-toolbar>
        <q-btn-dropdown stretch flat :label="$t('SELECT_THEME_BUTTON_LABEL')" auto-close>
          <q-list>
            <q-item-label header>{{ $t('SELECT_THEME_GUIDE_LABEL') }}</q-item-label>
            <q-item v-for="(name, index) in Object.keys(watermark)" :key="`${index}`" clickable @click="selectTheme(name)">
              <q-item-section avatar side>
                <q-icon v-if="theme === name" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ watermark[name].name }}</q-item-label>
                <!--<q-item-label caption>February 22, 2016</q-item-label>-->
              </q-item-section>
              <!--<q-item-section side>
                <q-icon name="info" />
              </q-item-section>-->
            </q-item>
          </q-list>

        </q-btn-dropdown>

        <q-btn-dropdown stretch flat :label="$t('EDIT_BUTTON_LABEL')" auto-close>
          <q-list separator>
            <q-item-label header>{{ $t('EDIT_GUIDE_LABEL') }}</q-item-label>

            <q-item clickable v-ripple @click="openCropModal">
              <q-item-section avatar side>
                <q-icon name="crop_rotate" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('CROP_ROTATE_LABEL') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="returnToOriginalPosition">
              <q-item-section avatar side>
                <q-icon name="restart_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('RESET_TO_INITIAL_POSITION_LABEL') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="brightnessModal = true">
              <q-item-section avatar side>
                <q-icon name="brightness_medium" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('BRIGHTNESS_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="saturateModal = true">
              <q-item-section avatar side>
                <q-icon name="local_florist" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('SATURATE_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="contrastModal = true">
              <q-item-section avatar side>
                <q-icon name="contrast" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('CONTRAST_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="grayscaleModal = true">
              <q-item-section avatar side>
                <q-icon name="filter_b_and_w" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('GRAYSCALE_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="sepiaModal = true">
              <q-item-section avatar side>
                <q-icon name="cake" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('SEPIA_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="fontSizeModal = true">
              <q-item-section avatar side>
                <q-icon name="format_size" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('FONT_SIZE_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>


            <q-item-label header>EXIF</q-item-label>
            <q-item tag="label" v-ripple>
              <q-item-section side top>
                <q-checkbox v-model="preferConvertedFocalLength" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('PREFER_35MM_CONVERTED_FOCAL_LENGTH_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('PREFER_35MM_CONVERTED_FOCAL_LENGTH_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section side top>
                <q-checkbox v-model="showShotDate" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('SHOW_SHOT_DATE_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('SHOW_SHOT_DATE_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="openManufacturerEditModal">
              <q-item-section avatar side>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('EDIT_MANUFACTURER_LABEL') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="openModelEditModal">
              <q-item-section avatar side>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('EDIT_MODEL_LABEL') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item-label header>{{ $t('ADDITIONAL_WATERMARK_GUIDE_LABEL') }}</q-item-label>
            <q-item tag="label" v-ripple @click="setupTwitterAccount">
              <q-item-section avatar side>
                <q-icon v-if="additional === 'twitter'" color="primary" name="done" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('TWITTER_WATERMARK_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('TWITTER_WATERMARK_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple @click="setAdditional('sukashi')">
              <q-item-section avatar side>
                <q-icon v-if="additional === 'sukashi'" color="primary" name="done" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('SUKASHI_WATERMARK_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('SUKASHI_WATERMARK_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item-label header>{{ $t('FONT_SELECT_GUIDE_LABEL') }}</q-item-label>
            <q-item v-for="(f, index) in fonts" :key="index" clickable v-ripple @click="selectFont(f.family)">
              <q-item-section avatar side>
                <q-icon v-if="font === f.family" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label :style="{ fontFamily: `'${f.family}'` }">{{ f.family }}</q-item-label>
                <q-item-label caption v-if="f.example" :style="{ fontFamily: `'${f.family}'` }">{{ f.example }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-space />
        <q-separator dark vertical />

        <q-btn-dropdown stretch flat :label="$t('EXPORT_BUTTON_LABEL')">
          <q-list separator>
            <q-item-label header>{{ $t('FORMAT_GUIDE_LABEL') }}</q-item-label>
            <q-item v-for="(f, index) in formats" :key="index" clickable v-ripple @click="selectFormat(f.value)">
              <q-item-section avatar side>
                <q-icon v-if="format === f.value" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ f.label }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-slider v-model="jpegQuality" :min="0" :max="100"/>
                <q-item-label caption>{{ $t('JPEG_QUALITY_HINT') }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                {{ jpegQuality < 100 ? '&nbsp;' : '' }}{{ jpegQuality }}
              </q-item-section>
            </q-item>

            <q-item-label header>{{ $t('SELECT_SIZE_GUIDE_LABEL') }}</q-item-label>
            <q-item v-for="(s, index) in exportSizesForThisImage" :key="index" clickable v-ripple @click="selectSize(s.value, s.disabled)" :disable="s.disabled">
              <q-item-section avatar side>
                <q-icon v-if="size === s.value" color="primary" name="done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t(s.label) }}</q-item-label>
                <q-item-label caption>{{ s.expectedSize }}<span v-if="s.recommended">{{ s.expectedSize ? ', ' : '' }}<b>{{ $t('RECOMMENDED_TEXT') }}</b></span></q-item-label>
              </q-item-section>
            </q-item>

            <q-item-label header>{{ $t('SAVE_GUIDE_TEXT') }}</q-item-label>
            <q-item clickable v-ripple @click="save">
              <q-item-section avatar side>
                <q-icon name="save_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('SAVE_BUTTON_TEXT') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple v-if="isAndroidApp" :disable="shareOnly">
              <q-item-section side top>
                <q-checkbox v-model="openShareSheetAfterSaving" :disable="shareOnly" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('OPEN_SHARE_MENU_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('OPEN_SHARE_MENU_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple v-if="isAndroidApp" :disable="!openShareSheetAfterSaving">
              <q-item-section side top>
                <q-checkbox v-model="shareOnly" :disable="!openShareSheetAfterSaving" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('SHARE_ONLY_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('SHARE_ONLY_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple v-if="isAndroidApp">
              <q-item-section side top>
                <q-checkbox v-model="supportDevelopmentByHashtag" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t('SUPPORT_DEVELOPMENT_HASHTAG_LABEL') }}</q-item-label>
                <q-item-label caption>
                  {{ $t('SUPPORT_DEVELOPMENT_HASHTAG_HINT') }}
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>          
        </q-btn-dropdown>
      </q-toolbar>
    </q-footer>

    <q-file v-show="false" v-model="file" ref="file" accept="image/jpeg,image/jpg,image/heif,image/heic,image/heif-sequence,image/heic-sequence,.jpg,.jpeg,.heic,.heif" max-files="1" @update:model-value="fileUpdate" />

    <q-dialog v-model="manufacturerPrompt" persistent @update:model-value="updateManufacturer">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('EDIT_MANUFACTURER_LABEL') }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section v-if="exif.Make">
          <span class="text-body1">{{ $t('EXIF_SUGGESTION') }} "{{ exif.Make }}" ({{ $t('EXIF_VALUE_TEXT') }})</span>
        </q-card-section>

        <q-card-section cla ss="q-pt-none">
          <q-input dense v-model="manufacturerOverride" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-if="exif.Make" flat :label="$t('USE_SUGGESTED_BUTTON_LABEL')" @click="manufacturerOverride = exif.Make" v-close-popup />
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modelPrompt" persistent @update:model-value="updateModel">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('EDIT_MODEL_LABEL') }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section v-if="exif.Model">
          <span class="text-body1">{{ $t('EXIF_SUGGESTION') }} "{{ exif.Model }}" ({{ $t('EXIF_VALUE_TEXT') }})</span>
        </q-card-section>

        <q-card-section cla ss="q-pt-none">
          <q-input dense v-model="modelOverride" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-if="exif.Model" flat :label="$t('USE_SUGGESTED_BUTTON_LABEL')" @click="modelOverride = exif.Model" v-close-popup />
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="twitterPrompt" persistent @update:model-value="updateTwitterSetting">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('TWITTER_ACCOUNT_SETTING_HEADING') }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section cla ss="q-pt-none">
          <q-checkbox v-model="isTwitterAccountWatermarkEnabled" :label="$t('ENABLED_TEXT')" />
        </q-card-section>

        <q-card-section cla ss="q-pt-none">
          <div class="text-subtitle1">{{ $t('TWITTER_ACCOUNT_SETTING_SCREEN_NAME_LABEL') }}</div>

          <q-input v-model="twitterAccount" :hint="$t('TWITTER_ACCOUNT_SETTING_SCREEN_NAME_HINT')">
            <template v-slot:prepend>
              @
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="saveDialog" persistent class="backdrop-opacity-1">
      <q-card style="min-width: 350px; min-height: 350px;">
        <q-inner-loading
          :showing="true"
          :label="$t('WAITING_EXPORT_DIALOG_TEXT')"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </q-dialog>

    <q-dialog v-model="exportPrompt">
      <q-card style="min-width: 80%;">
        <q-card-section>
          <div class="text-h6">{{ $t('EXPORT_COMPLETED_HEADING') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <img :src="blobUrl" class="exported-image">
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body2">{{ $t('EXPORT_COMPLETED_TEXT') }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="noExifAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('NO_EXIF_FOUND_HEADING') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('NO_EXIF_FOUND_TEXT') }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="aboutModal">
      <q-card style="max-height: 70vh">
        <q-card-section>
          <div class="text-h6">{{ $t('ABOUT_THIS_APP_HEADING') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <img src="../public/icon.png" style="width: 60%; display: block; margin: 0 auto;" />
          <div style="text-align: center; font-weight: bold;">
            Sukashi App {{ versionNumber }}
          </div>
          <div style="text-align: center;">
            Developed by <a href="https://twitter.com/chiisama14" target="_blank">@chiisama14</a> (<a href="https://milky.blue" target="_blank">milky.blue</a>)
            <br>
            Powered by <a href="https://vuejs.org/" target="_blank">Vue</a>, <a href="https://quasar.dev/" target="_blank">Quasar</a> and <a href="https://cordova.apache.org/" target="_blank">Cordova</a> for Native App
            <br>
            <br>
            <a href="https://milky.blue/sukashi" target="_blank">Web App</a> | <a href="https://play.google.com/store/apps/details?id=app.sukashi" target="_blank">Android App</a>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">{{ $t('ABOUT_FONTS_USED_IN_THIS_APP_HEADING') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>{{ $t('ABOUT_FONTS_USED_IN_THIS_APP_DESCRIPTION') }}</div>
        </q-card-section>
        
        <q-card-section v-for="f in fonts" :key="f" class="q-pt-none">
          <div class="text-subtitle2">{{ f.family }}</div>
          <pre style="white-space: pre-wrap; word-break: break-word;"><code>{{ f.license }}
          
{{ licenses[f.type] }}</code></pre>
        </q-card-section>

        <q-separator inset />

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cropModal" class="crop-modal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('CROP_ROTATE_LABEL') }}</div>
        </q-card-section>

        <div style="max-height: 70vh">
          <img ref="cropTargetImage" :src="originalImgSrc">
        </div>

        <q-card-actions align="right">
          <q-btn flat icon="rotate_90_degrees_cw" color="primary" @click="rotateCropImage" />
          <q-btn flat :label="$t('CANCEL_TEXT')" color="primary" @click="closeCropModal(false)" />
          <q-btn flat :label="$t('DONE_TEXT')" color="primary" @click="closeCropModal(true)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="brightnessModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          <q-icon name="brightness_medium" size="md" class="q-mr-sm" />
          {{ $t('BRIGHTNESS_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <div class="q-mr-sm">
            <q-btn flat stack icon="restart_alt" @click="brightnessRaw = 100" :label="$t('RESET_TEXT')" style="width: 6rem;" />
          </div>
          <q-slider v-model="brightnessRaw" class="q-px-sm" :min="0" :max="200" />
          <div class="text-weight-bold" style="width: 5rem; text-align: right;">{{ brightnessRaw }} %</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="saturateModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          <q-icon name="local_florist" size="md" class="q-mr-sm" />
          {{ $t('SATURATE_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <div class="q-mr-sm">
            <q-btn flat stack icon="restart_alt" @click="saturateRaw= 100" :label="$t('RESET_TEXT')" style="width: 6rem;" />
          </div>
          <q-slider v-model="saturateRaw" class="q-px-sm" :min="0" :max="200" />
          <div class="text-weight-bold" style="width: 5rem; text-align: right;">{{ saturateRaw }} %</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="contrastModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          <q-icon name="contrast" size="md" class="q-mr-sm" />
          {{ $t('CONTRAST_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <div class="q-mr-sm">
            <q-btn flat stack icon="restart_alt" @click="contrastRaw = 100" :label="$t('RESET_TEXT')" style="width: 6rem;" />
          </div>
          <q-slider v-model="contrastRaw" class="q-px-sm" :min="0" :max="200" />
          <div class="text-weight-bold" style="width: 5rem; text-align: right;">{{ contrastRaw }} %</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="grayscaleModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          <q-icon name="filter_b_and_w" size="md" class="q-mr-sm" />
          {{ $t('GRAYSCALE_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <div class="q-mr-sm">
            <q-btn flat stack icon="restart_alt" @click="grayscaleRaw = 0" :label="$t('RESET_TEXT')" style="width: 6rem;" />
          </div>
          <q-slider v-model="grayscaleRaw" class="q-px-sm" :min="0" :max="100" />
          <div class="text-weight-bold" style="width: 5rem; text-align: right;">{{ grayscaleRaw }} %</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sepiaModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          <q-icon name="cake" size="md" class="q-mr-sm" />
          {{ $t('SEPIA_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <div class="q-mr-sm">
            <q-btn flat stack icon="restart_alt" @click="sepiaRaw = 0" :label="$t('RESET_TEXT')" style="width: 6rem;" />
          </div>
          <q-slider v-model="sepiaRaw" class="q-px-sm" :min="0" :max="100" />
          <div class="text-weight-bold" style="width: 5rem; text-align: right;">{{ sepiaRaw }} %</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="fontSizeModal" position="bottom" class="backdrop-opacity-0">
      <q-card style="width: 100%">
        <q-card-section class="text-subtitle1 text-weight-bold">
          {{ $t('FONT_SIZE_TEXT') }}
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <q-btn flat round icon="text_decrease" @click="fontSize -= 5" class="q-mr-sm" />
          <q-space />
          <div class="text-weight-bold" style="text-align: center;">{{ fontSize }} %</div>
          <q-space />
          <q-btn flat round icon="text_increase" @click="fontSize += 5" class="q-mr-sm" />
        </q-card-section>
      </q-card>
    </q-dialog>   

  </q-layout>
</template>

<script>
import canvasSize from 'canvas-size'
import heic2any from 'heic2any'
import exifr from 'exifr'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

import watermark from './watermark'
import { licenses, fontFamily } from './resources/fonts'

import EditorComponent from './components/EditorComponent.vue'
import { debounce } from 'quasar'

export default {
  name: 'LayoutDefault',

  components: {
    EditorComponent
  },
  computed: {
    versionNumber() {
      return window.versionNumber || ''
    },
    watermark() {
      return watermark
    },
    licenses() {
      return licenses
    },
    fonts() {
      return fontFamily
    },
    formats() {
      return [ {
        label: 'PNG',
        value: 'png'
      }, {
        label: 'JPEG',
        value: 'jpg'
      } ]
    },
    exportSizes() {
      return [ {
        label: 'ORIGINAL_SIZE_TEXT',
        value: 100
      }, {
        label: '75%',
        value: 75
      }, {
        label: '50%',
        value: 50
      }, {
        label: '25%',
        value: 25
      } ]
    },
    editorConfig() {
      return {
        themeName: this.theme,
        fontName: this.font,
        preferConvertedFocalLength: this.preferConvertedFocalLength,
        showShotDate: this.showShotDate,
        format: this.format,
        jpegQuality: this.jpegQuality,
        size: this.size,
        openShareSheetAfterSaving: this.openShareSheetAfterSaving,
        additional: this.additional,
        supportDevelopmentByHashtag: this.supportDevelopmentByHashtag,
        shareOnly: this.shareOnly,
        twitterAccount: this.twitterPrompt ? '' : this.twitterAccount, // prompt が開いている間も送ってしまうと、一文字変更ごとにイベントが発生してサーバ代がかかるので

        brightness: this.brightness,
        saturate: this.saturate,
        contrast: this.contrast,
        grayscale: this.grayscale,
        sepia: this.sepia,
        fontSize: this.fontSize,
      }
    }
  },
  data() {
    return {
      file: null,
      theme: window.localStorage['theme'] || 'standard',
      font: window.localStorage['font'] || 'Lato',
      format: window.localStorage['format'] || 'jpg',
      size: 100,
      preferConvertedFocalLength: window.localStorage['preferConvertedFocalLength'] ? window.localStorage['preferConvertedFocalLength'] === 'true' : true,
      showShotDate: window.localStorage['showShotDate'] ? window.localStorage['showShotDate'] === 'true' : true,
      jpegQuality: window.localStorage['jpegQuality'] ? parseInt(window.localStorage['jpegQuality']) : 100,
      openShareSheetAfterSaving: window.localStorage['openShareSheetAfterSaving'] ? window.localStorage['openShareSheetAfterSaving'] === 'true' : true,
      supportDevelopmentByHashtag: window.localStorage['supportDevelopmentByHashtag'] ? window.localStorage['supportDevelopmentByHashtag'] === 'true' : true,
      additional: window.localStorage['additional'] ? window.localStorage['additional'] : 'none',
      manufacturerOverride: null,
      modelOverride: null,
      twitterAccount: window.localStorage['twitterAccount'] ? window.localStorage['twitterAccount'] : '',
      shareOnly: window.localStorage['shareOnly'] ? window.localStorage['shareOnly'] === 'true' : false,
      language: window.localStorage['locale'] || window.navigator.language,

      // model
      isTwitterAccountWatermarkEnabled: false,
      brightnessRaw: 100,
      saturateRaw: 100,
      contrastRaw: 100,
      grayscaleRaw: 0,
      sepiaRaw: 0,
      fontSize: 100,

      brightness: 100,
      saturate: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,

      cropper: null,
      cropData: null,
      cropDataTmp: null,

      //
      exif: null,
      originalImgSrc: null,
      imgSrc: null,
      blobUrl: null,

      //
      manufacturerPrompt: false,
      modelPrompt: false,
      twitterPrompt: false,
      exportPrompt: false,
      noExifAlert: false,
      saveDialog: false,
      aboutModal: false,
      cropModal: false,
      brightnessModal: false,
      saturateModal: false,
      contrastModal: false,
      grayscaleModal: false,
      sepiaModal: false,
      fontSizeModal: false,

      //
      exportSizesForThisImage: null,
      sizeManuallyChanged: false,
    }
  },
  watch: {
    preferConvertedFocalLength() {
      window.localStorage['preferConvertedFocalLength'] = this.preferConvertedFocalLength
    },
    showShotDate() {
      window.localStorage['showShotDate'] = this.showShotDate
    },
    jpegQuality() {
      window.localStorage['jpegQuality'] = this.jpegQuality
    },
    openShareSheetAfterSaving(newValue) {
      if (!newValue) {
        this.shareOnly = false
      }

      window.localStorage['openShareSheetAfterSaving'] = this.openShareSheetAfterSaving
    },
    shareOnly(newValue) {
      if (newValue) {
        this.openShareSheetAfterSaving = true
      }

      window.localStorage['shareOnly'] = this.shareOnly
    },
    supportDevelopmentByHashtag() {
      window.localStorage['supportDevelopmentByHashtag'] = this.supportDevelopmentByHashtag
    },
    exportPrompt(newValue) {
      if (!newValue) {
        if (this.blobUrl) {
          URL.revokeObjectURL(this.blobUrl)
          this.blobUrl = null
        }
      }
    },
    brightnessRaw(newValue) { this.updateFilterFn.bind(this)('brightness', newValue) },
    saturateRaw(newValue) { this.updateFilterFn.bind(this)('saturate', newValue) },
    contrastRaw(newValue) { this.updateFilterFn.bind(this)('contrast', newValue) },
    grayscaleRaw(newValue) { this.updateFilterFn.bind(this)('grayscale', newValue) },
    sepiaRaw(newValue) { this.updateFilterFn.bind(this)('sepia', newValue) },
  },
  methods: {
    styleFn(offset) {
      return { 
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
        overflow: 'hidden'
      }
    },
    openGallery() {
      this.$refs.file.pickFiles()
    },
    selectTheme(theme) {
      this.theme = theme
      window.localStorage['theme'] = theme
    },
    selectFont(font) {
      this.font = font
      window.localStorage['font'] = font
    },
    selectFormat(format) {
      this.format = format
      window.localStorage['format'] = format
    },
    selectSize(size, disabled) {
      if (disabled) {
        return
      }

      this.size = size
      this.sizeManuallyChanged = true
    },
    setAdditional(additional) {
      if (this.additional === additional) {
        this.additional = 'none'
      } else {
        this.additional = additional
      }

      window.localStorage['additional'] = this.additional
    },
    selectLanguage(locale) {
      this.$i18n.locale = locale
      window.localStorage['locale'] = locale
    },
    returnToOriginalPosition() {
      this.$refs.editor.returnToOriginalPosition()
    },
    onImageLoaded() {
      this.cropData = null
      
      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
      }

      const manufacturerSuggestion = window.localStorage[`suggestion/${this.exif.Make}/${this.exif.Model}/manufacturer`]

      if (manufacturerSuggestion) {
        this.$refs.editor.setManufacturer(manufacturerSuggestion)
      }

      const modelSuggestion = window.localStorage[`suggestion/${this.exif.Make}/${this.exif.Model}/model`]

      if (modelSuggestion) {
        this.$refs.editor.setModel(modelSuggestion)
      }
    },
    updateFilterFn: debounce(function (key, value) {
      this[key] = value
    }, 100),
    onImageExported(blobUrl) {
      this.blobUrl = blobUrl
      this.exportPrompt = true
    },
    openManufacturerEditModal() {
      this.manufacturerOverride = this.$refs.editor.getManufacturer()
      this.manufacturerPrompt = true
    },
    openModelEditModal() {
      this.modelOverride = this.$refs.editor.getModel()
      this.modelPrompt = true
    },
    setupTwitterAccount() {
      this.isTwitterAccountWatermarkEnabled = this.additional === 'twitter'
      this.twitterPrompt = true
    },
    openCropModal() {
      this.cropModal = true

      this.$nextTick(() => {
        const { naturalHeight, naturalWidth } = this.$refs.cropTargetImage

        this.cropper = new Cropper(this.$refs.cropTargetImage, {
          viewMode: 1,
          data: this.cropData || {
            x: 0,
            y: 0,
            height: naturalHeight,
            width: naturalWidth,
            rotate: 0,
            scaleX: 1,
            scaleY: 1
          },
          crop: this.onCrop
        })
      })
    },
    onCrop(event) {
      this.cropDataTmp = event.detail
    },
    closeCropModal(submit) {
      if (submit) {
        this.cropData = this.cropDataTmp

        this.imgSrc = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
        this.$nextTick(() => this.onImageLoaded())
      }

      this.cropModal = false

      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
      }
    },
    rotateCropImage() {
      this.cropper.rotate(90)
/*
      回転させたときに全体が表示されるようにしたい、、、ができなかったので一旦保留
      const { naturalHeight, naturalWidth } = this.$refs.cropTargetImage

      this.cropper.setData({
        x: 0,
        y: 0,
        height: naturalHeight,
        width: naturalWidth,
        rotate: 90,
        scaleX: 1,
        scaleY: 1
      })

      const containerSize = this.cropper.getContainerData()
      let zoomRatio = Math.min(containerSize.width / naturalWidth, containerSize.height / naturalHeight)

      if (this.cropDataTmp.rotate < 90) {
        // do nothing
      } else if (this.cropDataTmp.rotate < 180) {
        zoomRatio *= Math.min(naturalWidth, naturalHeight) / Math.max(naturalWidth, naturalHeight)
      } else if (this.cropDataTmp.rotate < 270) {
        // do nothing
      } else {
        zoomRatio *= Math.min(naturalWidth, naturalHeight) / Math.max(naturalWidth, naturalHeight)
      }

      console.log(this.cropDataTmp.rotate, zoomRatio)
      this.cropper.zoomTo(zoomRatio, { x: containerSize.width / 2, y: containerSize.height / 2 })*/
    },
    updateManufacturer() {
      const changed = this.$refs.editor.getManufacturer() !== this.manufacturerOverride

      if (!changed) {
        return
      }

      this.$refs.editor.setManufacturer(this.manufacturerOverride)

      window.localStorage[`suggestion/${this.exif.Make}/${this.exif.Model}/manufacturer`] = this.manufacturerOverride
    },
    updateModel() {
      const changed = this.$refs.editor.getModel() !== this.modelOverride

      if (!changed) {
        return
      }

      this.$refs.editor.setModel(this.modelOverride)

      window.localStorage[`suggestion/${this.exif.Make}/${this.exif.Model}/model`] = this.modelOverride
    },
    updateTwitterSetting() {
      if (this.isTwitterAccountWatermarkEnabled) {
        this.additional = 'twitter'
      } else {
        if (this.additional !== 'sukashi') {
          this.additional = 'none'
        }
      }

      window.localStorage['additional'] = this.additional
      window.localStorage['twitterAccount'] = this.twitterAccount
    },
    async fileUpdate() {
      this.exif = await exifr.parse(this.file)
      console.log('exifr', this.exif)

      const hasExif = this.exif ? (this.exif.Make || this.exif.Model || this.exif.ModifyDate || this.exif.DateTimeOriginal) : false

      if (!hasExif) {
        // EXIF データが無いとみなす
        this.exif = null
        this.originalImgSrc = null
        this.imgSrc = null
        this.noExifAlert = true

        return
      }

      const reader = new FileReader()
      const isHEIC = this.file.name.toLowerCase().endsWith('.heic') || this.file.name.toLowerCase().endsWith('.heif')

      reader.onload = e => {
        this.originalImgSrc = e.target.result
        this.imgSrc = e.target.result
        this.$nextTick(() => this.onImageLoaded())
      }

      if (isHEIC) {
        const converted = await heic2any({
          blob: this.file,
          toType: 'image/png',
          multiple: true
        })

        reader.readAsDataURL(converted[0])
      } else {
        reader.readAsDataURL(this.file)
      }

      //this.imgSrc = window.URL.createObjectURL(this.file)
    },
    suggestSize() {
      if (this.sizeManuallyChanged) {
        return
      }

      const originalSize = this.$refs.editor.getOriginalSize()

      this.exportSizesForThisImage = window.deepCopy(this.exportSizes)

      const recommendedCandidates = [ ]

      for (const size of this.exportSizesForThisImage) {
        const width = Math.floor(originalSize.width * size.value / 100)
        const height = Math.floor(originalSize.height * size.value / 100)

        const result = canvasSize.test({
          width: originalSize.width * size.value / 100,
          height: originalSize.height * size.value / 100
        })

        size.expectedSize = `${ width } x ${ height } px`
        size.expectedLongSide = Math.max(width, height)

        if (result) {
          recommendedCandidates.push(size)
        } else {
          size.disabled = true
        }
      }

      let candidate = null

      for (const size of recommendedCandidates) {
        // 4K 解像度以上の中で最小のものを推奨とする。recommendedCandidates は大きい順で入っているので、candidate を更新していけば条件を満たすものが見つかる
        if (size.expectedLongSide > 3840) {
          candidate = size
        }
      }

      if (candidate == null) {
        // 4K 解像度を満たす選択肢がない場合、一番大きいもの
        candidate = recommendedCandidates[0]
      }

      candidate.recommended = true

      if (this.size !== candidate.value) {
        this.size = candidate.value
      }
    },
    async save() {
      this.saveDialog = true

      await this.$refs.editor.save()
    },
    onSaveFinished() {
      this.saveDialog = false
    },
    async onIntentReceived({ detail }) {
      const dataUrl = `data:${detail.type};base64,${detail.data}`

      this.exif = await exifr.parse(dataUrl)
      console.log('exifr', this.exif)

      const hasExif = this.exif ? (this.exif.Make || this.exif.Model || this.exif.ModifyDate || this.exif.DateTimeOriginal) : false

      if (!hasExif) {
        // EXIF データが無いとみなす
        this.exif = null
        this.originalImgSrc = null
        this.imgSrc = null
        this.noExifAlert = true

        return
      }

      const isHEIC = detail.type !== 'image/jpeg'

      if (isHEIC) {
        const reader = new FileReader()

        reader.onload = e => {
          this.originalImgSrc = e.target.result
          this.imgSrc = e.target.result
          this.$nextTick(() => this.onImageLoaded())
        }

        const bin = window.atob(detail.data)
        const byteArr = new Array(bin.length)

        for (let i = 0; i < bin.length; i++) {
          byteArr[i] = bin.charCodeAt(i)
        }

        const uint8Arr = new Uint8Array(byteArr)

        const converted = await heic2any({
          blob: new Blob(uint8Arr, {
            type: detail.type
          }),
          toType: 'image/png',
          multiple: true
        })

        reader.readAsDataURL(converted)
      } else {
        this.originalImgSrc = dataUrl
        this.imgSrc = dataUrl
        this.$nextTick(() => this.onImageLoaded())
      }
    }
  },
  mounted() {
    // migration
    if (!this.openShareSheetAfterSaving && this.shareOnly) {
      // 本来設定できないパターン
      this.openShareSheetAfterSaving = false
      this.shareOnly = false
    }

    if (this.font === 'F5.6') {
      this.font = 'Lato'
    }

    this.exportSizesForThisImage = window.deepCopy(this.exportSizes)

    window.addEventListener('intent', this.onIntentReceived)
  },
  unmounted() {
    window.removeEventListener('intent', this.onIntentReceived)
  }
}
</script>

<style>
/*
  Quasar animation bug fix
  https://github.com/quasarframework/quasar/issues/13959
*/
body.desktop .q-focus-helper {
  transition: none !important
}

body.desktop .q-focus-helper:before, body.desktop .q-focus-helper:after {
  transition: none !important
}
</style>

<style lang="stylus">
#app {
  overflow: hidden;
}

.crop-modal {
  img {
    display: block;
    max-width: 100%;  
  }
  
  .q-dialog__backdrop {
    background-color: rgba(0, 0, 0, 0.9) !important;
    backdrop-filter: blur(2px);
  }
}

.backdrop-opacity-1 {
  .q-dialog__backdrop {
    background-color: #ddd !important;
  }
}

.backdrop-opacity-0 {
  .q-dialog__backdrop {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}

.exported-image {
  width: 100%;
  max-height: 50%;
}
</style>