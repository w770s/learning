<template>
    <view class='emoji-wrapper'>
        <view class='emoji-content'>
            <swiper indicator-dots='true' class='emoji-content-swiper'>
                <block>
                    <view style='display: inline-block;'
                          v-for="(currentEmojiArr,index) in currentAlbumKeys" :key="index">
                        <swiper-item>
                            <view class='emoji-content-item'
                                  v-for="(currentEmojiKey,inde) in currentEmojiArr"
                                  :key="currentEmojiKey" @tap='emojiTap(currentEmojiKey)'>
                                <img :src="emojiList[currentAlbum][currentEmojiKey].img"
                                     :class="[currentAlbum == 'emoji' ? 'emoji-content-img-emoji' : 'emoji-content-img-other']"
                                ></img>
                            </view>
                        </swiper-item>
                    </view>
                </block>
            </swiper>
        </view>
        <view class='emoji-album'>
            <!-- <view class='emoji-album-left' wx:for="albumArr" wx:for-item="album" wx:key="album.album" data-album="album.album" @tap='switchAlbum'>
             <img src='album.img' class='album.album == currentAlbum ? "emoji-album-left-img album-active" : "emoji-album-left-img"'></img>
           </view>  -->
            <view class='emoji-album-left' v-for="(album,index) in albumArr"
                  :key="album.album" @tap='switchAlbum(album.album)'>
                <img :src="localAlbumImages[index].img"
                     :class="[album.album == currentAlbum ? 'emoji-album-left-img album-active' : 'emoji-album-left-img']"/>
            </view>
            <view class='emoji-send' @tap='emojiSend'>发送</view>
        </view>
    </view>
</template>

<script>
    import EmojiObj from '@/util/emojimap.js'

    export default {
        name: "emoji",
        computed: {},
        data() {
            return {
                localAlbumImages: [{
                    img:'http://file.aihuihc.com/patient/patientImages/images/album-emoji.png',
                },{
                    img:'http://file.aihuihc.com/patient/patientImages/images/album-ajtd.png',
                },{
                    img:'http://file.aihuihc.com/patient/patientImages/images/album-xxy.png',
                },{
                    img:'http://file.aihuihc.com/patient/patientImages/images/album-lt.png'
                }],
                albumArr: [],
                currentAlbum: 'emoji',
                emojiList: {},
                currentAlbumKeys: [] //存储每一类别的key
            }
        },
        mounted() {
            let currentAlbumKeys = this.splitAlbumKeys(Object.keys(EmojiObj.emojiList[this.currentAlbum]), this.currentAlbum == 'emoji' ? 23 : 10)
            this.albumArr = EmojiObj.albumArr
            this.emojiList = EmojiObj.emojiList
            this.currentAlbumKeys = currentAlbumKeys
        },
        methods: {
            /**
             * 切换emoji类别
             */
            switchAlbum(album) {
                let currentAlbum = album
                // 提前跟新一次，下面分类需要用到
                this.currentAlbum = currentAlbum
                let currentAlbumKeys = this.splitAlbumKeys(Object.keys(this.emojiList[currentAlbum]), currentAlbum == 'emoji' ? 23 : 10, currentAlbum)
                this.currentAlbumKeys = currentAlbumKeys
                console.log(this.currentAlbumKeys,currentAlbum,this.emojiList);
            },
            /**
             * 每页显示固定个数
             * arr数据源数组，space每个数组最大容量
             * [[], [], []]
             */
            splitAlbumKeys(arr, space, currentAlbum) {
                const delta = space || 23
                let result = [],
                    factor = Math.ceil(arr.length / delta),
                    begin = 0,
                    end = 1
                if (factor == 1) {
                    result = [[...arr]]
                } else {
                    for (let i = 1; i < factor; i++) {
                        let temp = []
                        temp = [...arr.slice(begin, i * delta)]
                        begin = i * delta
                        result.push(temp)
                    }
                    result.push([...arr.slice(delta * (factor - 1), arr.length)])
                }
                if (currentAlbum == 'emoji' || this.currentAlbum == 'emoji') { // 只有emoji才添加删除按钮
                    result.map((cata, index) => {
                        if (index != (result.length - 1)) {
                            cata.push('[删除]')
                        }
                    })
                    // console.log(result)
                }
                return result
            },
            /**
             * 单击emoji
             */
            emojiTap(emoji) {
                if (!emoji) return
                console.log(emoji)
                this.$emit("EmojiClick", emoji)
            },
            /**
             * 发送emoji
             */
            emojiSend() {
                this.$emit("EmojiSend")
            }
        }
    }
</script>

<style lang="scss" scoped>
    .emoji-wrapper {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }

    /*内容  */
    .emoji-content {
        width: 100%;
        height: 400rpx;
        /* padding-top: 30rpx; */
        padding-left: 20rpx;
        box-sizing: border-box;
    }

    .emoji-content-swiper {
        width: 100%;
        height: 100%;
    }

    .emoji-content-item {
        display: inline-block;
        margin: 17rpx;
    }

    .emoji-content-img-emoji {
        width: 56rpx;
        height: 56rpx;
    }

    .emoji-content-img-other {
        width: 100rpx;
        height: 100rpx;
    }

    /*底部类别  */
    .emoji-album {
        width: 100%;
        height: 88rpx;
        border-top: 2rpx solid #999;
        box-sizing: border-box;
        background-color: #fff;
    }

    .emoji-album-left {
        display: inline-block;
        height: 100%;
    }

    .emoji-album-left-img {
        width: 88rpx;
        height: 100%;
        padding: 8rpx 10rpx;
        box-sizing: border-box;
        border-right: 2rpx soild #999
    }

    .emoji-send {
        width: 88rpx;
        height: 100%;
        line-height: 88rpx;
        background-color: #0091e4;
        text-align: center;
        float: right;
        color: #fff;
    }

    .album-active {
        background-color: #aaa;
    }
</style>
