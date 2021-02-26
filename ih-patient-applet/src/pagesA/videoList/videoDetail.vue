<template>
    <view>
        <uni-video
            :induction="item.content"
            :src="item.url"
            :show-mute-btn="true"
            :videoTitle="item.titleName"
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
                item: {}
            }
        },
        onLoad(options){
            console.log(options);
            this.item = JSON.parse(options.item)
            if(this.item.isImVideo){
                this.item.url = decodeURIComponent(this.item.url)
            }
            console.log(this.item);
        }
    }
</script>

