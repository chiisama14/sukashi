export default {
  name: 'Standard',
  /*landscape: {
    width: 1,
    height: 1,
    initialPoint: {
      x: 0,
      y: 0
    },
    information: [
      {
        type: 'model',
        position: {
          x: 0.02,
          y: 0.92
        },
        size: 0.6,
        color: '#fff'
      },
      {
        type: 'exif',
        position: {
          x: 0.02,
          y: 0.96
        },
        size: 0.4,
        color: '#fff'
      }
    ]
  }, 
  portrait: {*/
    width: 1,
    height: 1,
    initialPoint: {
      x: 0,
      y: 0
    },
    information: [
      {
        type: 'model',
        position: {
          x: 0,
          y: '100bh - 0.7bh - 3.5bh - 3bh'
        },
        size: '2.4bh',
        height: '3bh',
        color: '#fff',
        paddingLeft: '50fs'
      },
      {
        type: 'exif',
        position: {
          x: 0,
          y: '100bh - 0.7bh - 3.5bh'
        },
        size: '1.6bh',
        height: '3.5bh',
        color: '#fff',
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
        paddingRight: '50fs',
        textAlign: 'right'
      }
    ]
  //}
}
