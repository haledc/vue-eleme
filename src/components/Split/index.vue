<template>
  <div class="split"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Split extends Vue {}
</script>

<style lang="stylus" scoped>
.split
  width: 100%
  height: 16px
  border-top: 1px solid rgba(7, 17, 27, 0.1)
  border-bottom: 1px solid rgba(7, 17, 27, 0.1)
  background: #f3f5f7
</style>
