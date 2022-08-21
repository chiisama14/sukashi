export default {
  name: 'Artistic 1',
  landscape: {
    width: 1.2,
    height: 1.2,
    frames: [
      { width: 1.2, height: 0.1, top: 0 }, // 上
      { width: 1.2, height: 0.25, bottom: 0 }, // 下
      { width: 0.1, height: 1, top: 0, left: 0 }, // 左
      { width: 0.1, height: 1, top: 0, right: 0 }, // 右
    ],
    frameColor: '#fff',
    initialPoint: {
      x: 0.1,
      y: 0.1
    },
    information: [
      {
        type: 'model',
        position: {
          x: 'center',
          y: {
            normal: '100bh',
            additional: '98bh'
          }
        },
        size: '6bh',
        height: '8bh',
      },
      {
        type: 'exif',
        position: {
          x: 'center',
          y: {
            normal: '110.5bh',
            additional: '107.5bh'
          }
        },
        size: '3.5bh',
        height: '5bh',
        color: '#999'
      },
      {
        type: 'additional',
        position: {
          x: 'center',
          y: '118bh - 3bh'
        },
        size: '1.6bh',
        height: '3bh',
        color: '#999',
      }
    ]
  },
  portrait: {
    width: 1.2,
    height: 1.08,
    frames: [
      { width: 1.2, height: 0.1, top: 0 }, // 上
      { width: 1.2, height: 0.25, bottom: 0 }, // 下
      { width: 0.1, height: 1, top: 0, left: 0 }, // 左
      { width: 0.1, height: 1, top: 0, right: 0 }, // 右
    ],
    frameColor: '#fff',
    initialPoint: {
      x: 0.1,
      y: 0.1
    },
    information: [
      {
        type: 'model',
        position: {
          x: 'center',
          y: {
            normal: '90bh',
            additional: '87.8bh'
          }
        },
        size: '4.5bh',
        height: '6bh',
      },
      {
        type: 'exif',
        position: {
          x: 'center',
          y: {
            normal: '98bh',
            additional: '96bh'
          }
        },
        size: '2.5bh',
        height: '4bh',
        color: '#999'
      },
      {
        type: 'additional',
        position: {
          x: 'center',
          y: '105.7bh - 3bh'
        },
        size: '1.6bh',
        height: '3bh',
        color: '#999',
      }
    ]
  }
}