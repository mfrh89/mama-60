import { motion } from 'framer-motion'

// Hochformat
import img01 from '../assets/images/slider/0BA55596-3FC6-4E37-936B-02257D76920A_1_105_c.jpeg'
import img02 from '../assets/images/slider/1B40DC92-7957-48F3-99C3-590EA6F477AD_1_105_c.jpeg'
import img03 from '../assets/images/slider/270B99D3-D580-40B5-8133-69BB245DDC76_1_105_c.jpeg'
import img04 from '../assets/images/slider/3601D8BF-6543-4C42-B461-885DA5F145B7_1_105_c.jpeg'
import img05 from '../assets/images/slider/3A1770BE-C6FF-4471-B62D-0285C1F58931_1_105_c.jpeg'
import img06 from '../assets/images/slider/479AB252-08E5-45DB-95D7-6BB0CCD7CD44_1_105_c.jpeg'
import img07 from '../assets/images/slider/4A415C12-84B2-4ED6-B400-6FE97671D3D5_1_105_c.jpeg'
import img08 from '../assets/images/slider/5B448116-0F6C-4599-9283-25FA43190F32_1_105_c.jpeg'
import img09 from '../assets/images/slider/9CF48ED3-2B78-4B58-BCC0-1E92EB331A8A_1_105_c.jpeg'
import img10 from '../assets/images/slider/AE83D20A-7655-4544-9F0F-DF40EC9D119C_1_105_c.jpeg'
import img11 from '../assets/images/slider/D5AD29FC-DCB2-4784-96BC-E28618A61380_1_105_c.jpeg'

// Querformat
import img12 from '../assets/images/slider/73A05E8C-E586-4D1B-9E21-7034A6D67056_1_105_c.jpeg'
import img13 from '../assets/images/slider/9BB39477-0527-4947-9B98-B7034B3B9554_1_105_c.jpeg'
import img14 from '../assets/images/slider/C0814C30-FAC0-47EC-B52C-5B0717D8A429_1_105_c.jpeg'
import img15 from '../assets/images/slider/ED57CFBD-71CD-464D-A891-710934C9D54E_1_105_c.jpeg'
import img16 from '../assets/images/slider/EE8D388A-C5C4-457B-A7B2-352B86EE1B7E_1_105_c.jpeg'
import img17 from '../assets/images/slider/F5CC1C4A-BF24-43E9-AA50-BFAC968F02C5_1_105_c.jpeg'

const images = [
  { src: img01, orientation: 'portrait' },
  { src: img12, orientation: 'landscape' },
  { src: img02, orientation: 'portrait' },
  { src: img03, orientation: 'portrait' },
  { src: img13, orientation: 'landscape' },
  { src: img04, orientation: 'portrait' },
  { src: img05, orientation: 'portrait' },
  { src: img14, orientation: 'landscape' },
  { src: img06, orientation: 'portrait' },
  { src: img07, orientation: 'portrait' },
  { src: img15, orientation: 'landscape' },
  { src: img08, orientation: 'portrait' },
  { src: img09, orientation: 'portrait' },
  { src: img16, orientation: 'landscape' },
  { src: img10, orientation: 'portrait' },
  { src: img11, orientation: 'portrait' },
  { src: img17, orientation: 'landscape' },
]

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function ImageMarquee() {
  const duplicatedImages = [...images, ...images]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full h-full overflow-hidden flex items-center"
    >
      <div className="flex animate-marquee items-center">
        {duplicatedImages.map((image, index) => {
          const rand1 = seededRandom(index * 1.5)
          const rand2 = seededRandom(index * 2.3)
          const rand3 = seededRandom(index * 3.7)
          const rand4 = seededRandom(index * 4.1)
          
          const offsetY = (rand1 - 0.5) * 160
          const offsetX = (rand2 - 0.5) * 40
          const marginH = 8 + rand3 * 48
          const scale = 0.75 + rand4 * 0.5
          
          // Größe je nach Orientierung
          const isLandscape = image.orientation === 'landscape'
          const baseWidth = isLandscape ? 384 : 256
          const baseHeight = isLandscape ? 256 : 384
          const width = baseWidth * scale
          const height = baseHeight * scale
          
          return (
            <div
              key={index}
              className="flex-shrink-0 rounded-lg overflow-hidden bg-charcoal/5 border border-charcoal/5 relative"
              style={{ 
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                marginLeft: `${marginH}px`,
                marginRight: `${marginH}px`,
                width: `${width}px`,
                height: `${height}px`,
                boxShadow: '0 12px 50px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src={image.src}
                alt={`Memory ${(index % images.length) + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
