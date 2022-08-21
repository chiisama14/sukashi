export default {
  name: 'Vertical 2',
  /*landscape: {*/
    width: 1.07,
    height: 1,
    frames: [
      { width: 0.08, height: 1, left: 1 }
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
          x: 1.075,
          y: 0
        },
        size: '2.5bw',
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
        width: '100bh',
        height: '5bw',
        color: '#000',
        paddingLeft: '50fs'
      },
      {
        type: 'exif',
        position: {
          x: 1.0425,
          y: 0
        },
        size: '1.8bw',
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
        width: '100bh',
        height: '4bw',
        color: '#999',
        paddingLeft: '50fs'
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
        paddingLeft: '50fs',
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