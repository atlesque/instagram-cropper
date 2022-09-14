const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350
const BG_COLOR = '#0A0A0A'
const FILE_SUFFIX = 'instagram'

const canvas = document.getElementById('imageCanvas')
const ctx = canvas.getContext('2d')
const downloadLink = document.querySelector('#downloadLink')

function handleImage (rawImage) {
  const reader = new FileReader()
  reader.onload = function (event) {
    const img = new Image()
    img.onload = function () {
      // setup canvas size
      canvas.width = CANVAS_WIDTH
      canvas.height = CANVAS_HEIGHT

      // draw frame
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      )

      const isVerticalImage = img.height >= img.width
      const resizedImgWidth = isVerticalImage ?
        CANVAS_HEIGHT * (img.width / img.height) :
        CANVAS_WIDTH
      const resizedImgHeight = isVerticalImage ? CANVAS_HEIGHT : CANVAS_WIDTH * (img.height / img.width)
      const canvasCenterWidth = isVerticalImage ? (CANVAS_WIDTH - resizedImgWidth) / 2 : 0
      const canvasCenterHeight = isVerticalImage ? 0 : (CANVAS_HEIGHT - resizedImgHeight) / 2

      // draw image
      ctx.drawImage(
        img,
        canvasCenterWidth,
        canvasCenterHeight,
        resizedImgWidth,
        resizedImgHeight
      )

      // show download link
      downloadLink.style.display = 'block'
      downloadLink.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(rawImage)
}

const lastTarget = null

function isFile (evt) {
  const dt = evt.dataTransfer

  for (const i = 0; i < dt.types.length; i++) {
    if (dt.types[i] === 'Files') {
      return true
    }
  }
  return false
}

window.addEventListener('dragenter', function (e) {
  if (isFile(e)) {
    lastTarget = e.target
    document.querySelector('#dropzone').style.visibility = ''
    document.querySelector('#dropzone').style.opacity = 1
    document.querySelector('#textnode').style.fontSize = '48px'
  }
})

window.addEventListener('dragleave', function (e) {
  e.preventDefault()
  if (e.target === document || e.target === lastTarget) {
    document.querySelector('#dropzone').style.visibility = 'hidden'
    document.querySelector('#dropzone').style.opacity = 0
    document.querySelector('#textnode').style.fontSize = '42px'
  }
})

window.addEventListener('dragover', function (e) {
  e.preventDefault()
})

const handleFileUpload = file => {
  const fileNameWithoutExtension = (file.name.match(/.+(?=\.)/g) || [])[0]
  const fileExtension = (file.name.match(/([^\.]*)$/g) || [])[0]
  downloadLink.setAttribute('download', `${fileNameWithoutExtension}-${FILE_SUFFIX}.${fileExtension}`)
  handleImage(file)
}

window.addEventListener('drop', function (e) {
  e.preventDefault()
  document.querySelector('#dropzone').style.visibility = 'hidden'
  document.querySelector('#dropzone').style.opacity = 0
  document.querySelector('#textnode').style.fontSize = '42px'
  if (e.dataTransfer.files.length === 1) {
    handleFileUpload(e.dataTransfer.files[0])
  }
})

const imageLoader = document.getElementById('imageLoader')
imageLoader.addEventListener('change', (e) => {
  handleFileUpload(e.target.files[0])
}, false)

