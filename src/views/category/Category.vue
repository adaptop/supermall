<template>
  <div class="category">
    <div id="vs">

    </div>
  </div>
</template>

<script>
  import Player from 'xgplayer'
  export default {
    name: "Category",
    mounted() {
      const player = new Player({
        id: 'vs',
        url: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
        height: 195,
        width: 375,
        autoplay: true,
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
        defaultPlaybackRate: 1,
      })
    }
  }
</script>

<style scoped>
</style>
