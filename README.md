# sukashi

## Project setup
```
npm install
node download.js # downloads font from Google Fonts
```

change accepted file types in `src-cordova/platforms/android/android.json`. add 2 MIME types (`image/heic`, `image/heif`) like following:

```
"/manifest/application/activity": [
  {
    "xml": "<intent-filter><data android:mimeType=\"image/jpeg\" /><data android:mimeType=\"image/heic\" /><data android:mimeType=\"image/heif\" /><action android:name=\"android.intent.action.SEND\" /><category android:name=\"android.intent.category.DEFAULT\" /></intent-filter>", ## THIS LINE
    "count": 1
  }
]
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
