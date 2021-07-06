


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'TEST_PLAYER'

let header = $('header h2')
let cdThumb = $('.cd-thumb')
let audio = $('#audio')
let playBtn = $('.btn-toggle-play')
let player = $('.player')
let progress = $('.progress')
let nextBtn = $('.btn-next')
let prevBtn = $('.btn-prev')
let random = $('.btn-random')
let repeat = $('.btn-repeat')
let playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Save your tears',
            singer: 'The weeknd, Ariana Grande',
            path: '/songs/Save Your Tears - The Weeknd.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/04/23/2/f/5/3/1619153014739_640.jpg'

        },
        {
            name: 'Vung ky uc',
            singer: 'Chillies',
            path: './songs/Vung Ky Uc - Chillies.mp3',
            image: 'https://i.pinimg.com/originals/70/e1/9e/70e19eb7b1430b0266def4db1abc27be.jpg'

        }, {
            name: 'Qua khung cua so',
            singer: 'Chillies',
            path: 'songs/Qua Khung Cua So - Chillies.mp3',
            image: 'https://cdns-images.dzcdn.net/images/cover/b615b17c216747efa1e81fbb5d207a02/264x264.jpg'

        }, {
            name: 'Em dung khoc',
            singer: 'Chillies',
            path: 'songs/Em Dung Khoc - Chillies.mp3',
            image: 'https://popnable.com/images/songs/large/vietnam_top_50_em_dung_khoc_chillies_1619631634.jpg'

        },
        {
            name: 'Muon roi ma sao con',
            singer: 'Son Tung MTP',
            path: 'songs/Muon Roi Ma Sao Con - Son Tung M-TP.mp3',
            image: 'https://2sao.vietnamnetjsc.vn/images/2021/04/29/23/53/3.jpg'

        },
        {
            name: 'Sai Gon Hom Nay Mua',
            singer: 'JSOL_ Hoang Duyen',
            path: 'songs/Sai Gon Hom Nay Mua - JSOL_ Hoang Duyen.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/05/30/2/6/7/5/1622365032910_640.jpg'

        },
        {
            name: 'Duong Toi Cho Em Ve ',
            singer: 'Cukak Remix_ - buitr',
            path: 'songs/song7.mp3',
            image: 'https://i.scdn.co/image/ab67616d0000b2733d3e99518291fa13245d7ef3'

        },
        {
            name: 'The Playah Special',
            singer: 'Performance_ - Soobin',
            path: 'songs/The Playah Special Performance_ - Soobin.mp3',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/b/4/2/9/b4292439fdc63154c04a50f56d7da985.jpg'

        },


    ],
    setConfig: function (key1, value1) {
        this.config[key1] = value1
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        let html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = html.join('\n')
    },

    handleEvent: function () {
        let _this = this

        //cd thambnail quay 
        let cdPlay = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],
            {
                duration: 10000,
                iterations: Infinity
            })
        cdPlay.pause()




        //phong to/ thu nho
        let cd = $('.cd').offsetWidth
        document.onscroll = function () {
            cdWidth = cd - window.scrollY
            $('.cd').style.width = cdWidth > 0 ? cdWidth + 'px' : 0
            $('.cd').style.opacity = 1 - window.scrollY / 100
            // $('.cd').style.opacity = cdWidth/cd
        }

        //click button play/pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play();
            }

            //play/pause audio
            audio.onplay = function () {
                cdPlay.play()
                _this.isPlaying = true
                player.classList.add('playing')
            }
            audio.onpause = function () {
                cdPlay.pause()
                _this.isPlaying = false
                player.classList.remove('playing')
            }

            // progress bar run
            audio.ontimeupdate = function () {
                let crTime = audio.currentTime * 100
                let duration = audio.duration
                let a = crTime / duration
                if (a < 100) {
                    progress.value = a
                }
                else {
                    player.classList.remove('playing')
                    progress.value = 0
                }

            }


        }
        //tua bai hat
        progress.onchange = function (e) {
            let time = e.target.value
            let seekingTime = time * audio.duration / 100
            audio.currentTime = seekingTime
        }


        nextBtn.onclick = function () {
            if (_this.isRandom) {
                console.log('success')
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }


            if (_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
            _this.render()
            _this.moveToActiveSong()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                console.log('success')
                _this.randomSong()
            }
            else {
                _this.prevSong()
            }


            if (_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
            _this.render()
            _this.moveToActiveSong()
        }
        random.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            random.classList.toggle('active', _this.isRandom)
            // console.log(_this.isRandom)
        }

        repeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeat.classList.toggle('active', _this.isRepeat)
            // console.log(_this.isRepeat)
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
                audio.play()
            }
        }

        playlist.onclick = function (e) {
            let songElement = e.target.closest('.song:not(.active)')

            if (songElement && !e.target.closest('.option')) {
                if (songElement) {
                    console.log(songElement.dataset.index)
                    _this.currentIndex = Number.parseInt(songElement.dataset.index)
                    _this.loadCurrentSong()
                    if (_this.isPlaying) {
                        audio.play()
                    }
                    else {
                        audio.pause()
                    }
                    _this.render()
                    _this.moveToActiveSong()
                }

            }
            else if (e.target.closest('.option')) {
                console.log(123)
            }
            else {
                console.warn('dang active click con me may a')
            }
        }

    },
    moveToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            }
            )
        }, 200)
    },


    //dinh nghia thuoc tinh
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },


    //load bai hat len dashboard
    loadCurrentSong: function () {
        header.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function () {
        // this.isRandom = this.config.isRandom
        // this.isRepeat = this.config.isRepeat
        Object.assign(this, this.config)
    },


    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)

        this.currentIndex = newIndex
        // console.log(this.currentIndex)
        this.loadCurrentSong()
    },


    start: function () {

        this.loadConfig()

        //dinh nghia cac thuoc tinh cho object
        this.defineProperty()

        // Lang nghe, xu ly su kien
        this.handleEvent()

        //load current song len dashboard
        this.loadCurrentSong()

        //Load songs ra html
        this.render()

        random.classList.toggle('active', this.isRandom)
        repeat.classList.toggle('active', this.isRepeat)

    }

}

app.start()







