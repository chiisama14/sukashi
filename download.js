const GetGoogleFonts = require('get-google-fonts')

const url = [
  'https://fonts.googleapis.com/css2',
  '?family=Cardo:ital,wght@0,400;0,700;1,400',
  '&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800',
  '&family=Gentium+Book+Plus:ital,wght@0,400;0,700;1,400;1,700',
  '&family=Ibarra+Real+Nova:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700',
  '&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  '&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900',
  '&family=Literata:ital,opsz,wght@0,7..72,200;0,7..72,300;0,7..72,400;0,7..72,500;0,7..72,600;0,7..72,700;0,7..72,800;0,7..72,900;1,7..72,200;1,7..72,300;1,7..72,400;1,7..72,500;1,7..72,600;1,7..72,700;1,7..72,800;1,7..72,900',
  '&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  '&family=PT+Sans+Narrow:wght@400;700',
  '&family=Source+Serif+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900',
  '&family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700',
  '&display=swap',
  '&subset=latin'
].join('')

new GetGoogleFonts().download(url, {
  outputDir: './public/fonts/google-fonts'
}).then(() => {
  console.log('Done!')
}).catch(() => {
  console.log('Whoops!')
})
