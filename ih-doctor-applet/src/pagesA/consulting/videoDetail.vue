<template>
    <view>
        <uni-video
            :src="videoSrc"
            :show-mute-btn="true"
            :enable-play-gesture="true"
        >
        </uni-video>
    </view>
</template>

<script>
    export default {
        name: "videoDetail",
        data(){
            return{
                videoSrc: ''
            }
        },
        onLoad(options){
            this.videoSrc = decodeURIComponent(options.videoSrc)
            console.log(this.videoSrc);
        }
    }
</script>

