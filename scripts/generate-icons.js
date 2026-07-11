const pngToIco = require('png-to-ico')
const { Jimp } = require('jimp')
const { writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')

const source = resolve(__dirname, '../build/icon-source.png')
const squaredPath = resolve(__dirname, '../build/icon-square.png')
const destination = resolve(__dirname, '../build/icon.ico')

async function main() {
  const image = await Jimp.read(source)
  const side = Math.max(image.width, image.height)

  const canvas = new Jimp({ width: side, height: side, color: 0x00000000 })
  canvas.composite(image, Math.round((side - image.width) / 2), Math.round((side - image.height) / 2))
  await canvas.write(squaredPath)

  const icoBuffer = await pngToIco(squaredPath)
  await writeFile(destination, icoBuffer)
  console.log(`Generated ${destination}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
