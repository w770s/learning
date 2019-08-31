import Banner from './banner.jpeg'
import style from './index.scss'
function OtherImg() {
    var root = document.getElementById('root')

    var Img = new Image()

    Img.src = Banner

    Img.classList.add(style.avator)

    root.appendChild(Img)
}

// module.exports = Img

export default OtherImg
