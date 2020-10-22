<template>
  <div class="wrap one-element-wrap">
    <client-only>
      <VueSimpleSpinner
        :size="spinnerSize"
        :line-size="spinnerLineSize"
        :line-fg-color="spinnerColor"
        :speed="spinnerSpeed"
      />
    </client-only>
  </div>
</template>

<script>

import spinnerSettings from '@/settings/spinner'

export default {

  components: {
    VueSimpleSpinner: () => process.browser ? import('vue-simple-spinner') : null
  },

  name: 'Loading',

  data() {
    return {
      spinnerColor: spinnerSettings.color,
      spinnerSize: spinnerSettings.big_size,
      spinnerLineSize: spinnerSettings.line_size,
      spinnerSpeed: spinnerSettings.speed,
    }
  },
}
</script>