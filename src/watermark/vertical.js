export default {
  name: 'Vertical',
  /*landscape: {*/
    width: 1.05,
    height: 1,
    frames: [
      { width: 0.05, height: 1 }
    ],
    frameColor: '#000',
    initialPoint: {
      x: 0.05,
      y: 0
    },
    information: [
      {
        type: 'model',
        position: {
          x: 0,
          y: 1
        },
        size: '2.5bw',
        transform: 'rotate(270deg)',
        transformOrigin: 'top left',
        width: '100bh',
        height: '5bw',
        color: '#fff',
        paddingLeft: '50fs'
      },
      {
        type: 'exif',
        position: {
          x: 0,
          y: 1
        },
        size: '1.8bw',
        transform: 'rotate(270deg)',
        transformOrigin: 'top left',
        width: '100bh',
        height: '5bw',
        color: '#fff',
        textAlign: 'right',
        paddingRight: '50fs'
      },
      {
        type: 'additional',
        position: {
          x: 0,
          y: '100bh - 1.2bh - 3.5bh'
        },
        size: '1.6bh',
        height: '3.5bh',
        color: '#fff',
        paddingRight: '50fs',
        textAlign: 'right'
      }
    ]
  /*},
  portrait: {
    width: 1,
    height: 1.1,
    frames: [
      { width: 1, height: 0.1, top: 1 }
    ],
    frameColor: '#fff',
    initialPoint: {
      x: 0,
      y: 0
    },
    information: [
      {
        type: 'model',
        position: {
          x: 0.03,
          y: 1.015
        },
        size: 0.7
      },
      {
        type: 'exif',
        position: {
          x: 0.03,
          y: 1.055
        },
        size: 0.5,
        color: '#999'
      }
    ]
  }*/
}