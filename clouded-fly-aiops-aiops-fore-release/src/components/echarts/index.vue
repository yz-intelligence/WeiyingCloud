<template>
  <div class="echarts"></div>
</template>

<script>
import * as echarts from 'echarts'
import { debounce } from 'lodash'
import Vue from 'vue'

// enumerating ECharts events for now
const ACTION_EVENTS = [
  'legendselectchanged',
  'legendselected',
  'legendunselected',
  'datazoom',
  'datarangeselected',
  'timelinechanged',
  'timelineplaychanged',
  'restore',
  'dataviewchanged',
  'magictypechanged',
  'geoselectchanged',
  'geoselected',
  'geounselected',
  'pieselectchanged',
  'pieselected',
  'pieunselected',
  'mapselectchanged',
  'mapselected',
  'mapunselected',
  'axisareaselected',
  'focusnodeadjacency',
  'unfocusnodeadjacency',
  'brush',
  'brushselected'
]

const MOUSE_EVENTS = ['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'globalout']

export default {
  name: 'EChart',
  props: {
    options: Object,
    theme: [String, Object],
    initOptions: Object,
    group: String,
    autoResize: Boolean
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    width() {
      return this.delegateGet('width', 'getWidth')
    },
    height() {
      return this.delegateGet('height', 'getHeight')
    }
  },
  watch: {
    // use assign statements to tigger "options" and "group" setters
    options: {
      handler(options) {
        if (!this.chart && options) {
          this.init()
        } else {
          this.chart.setOption(this.options, true)
        }
      },
      deep: true
    },
    group(group) {
      this.chart.group = group
    },
    theme() {
      this.destroy()
      this.init()
    }
  },
  methods: {
    isDisposed() {
      return !!this.delegateGet('isDisposed', 'isDisposed')
    },
    computedOptions() {
      return this.delegateGet('computedOptions', 'getOption')
    },
    // provide a explicit merge option method
    mergeOptions(options, notMerge, lazyUpdate) {
      this.delegateMethod('setOption', options, notMerge, lazyUpdate)
    },
    // just delegates ECharts methods to Vue component
    // use explicit params to reduce transpiled size for now
    resize(options) {
      this.delegateMethod('resize', options)
    },
    dispatchAction(payload) {
      this.delegateMethod('dispatchAction', payload)
    },
    convertToPixel(finder, value) {
      return this.delegateMethod('convertToPixel', finder, value)
    },
    convertFromPixel(finder, value) {
      return this.delegateMethod('convertFromPixel', finder, value)
    },
    containPixel(finder, value) {
      return this.delegateMethod('containPixel', finder, value)
    },
    showLoading(type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading() {
      this.delegateMethod('hideLoading')
    },
    getDataURL(options) {
      return this.delegateMethod('getDataURL', options)
    },
    getConnectedDataURL(options) {
      return this.delegateMethod('getConnectedDataURL', options)
    },
    clear() {
      this.delegateMethod('clear')
    },
    dispose() {
      this.delegateMethod('dispose')
    },
    delegateMethod(name, ...args) {
      if (!this.chart) {
        Vue.util.warn(`Cannot call [${name}] before the chart is initialized. Set prop [options] first.`, this)
        return
      }
      return this.chart[name](...args)
    },
    delegateGet(name, method) {
      if (!this.chart) {
        Vue.util.warn(`Cannot get [${name}] before the chart is initialized. Set prop [options] first.`, this)
      }
      return this.chart[method]()
    },
    init() {
      if (this.chart) {
        return
      }

      let chart = echarts.init(this.$el, this.theme, this.initOptions)

      if (this.group) {
        chart.group = this.group
      }

      chart.setOption(this.options, true)

      // expose ECharts events as custom events
      ACTION_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)
        })
      })
      MOUSE_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)

          // for backward compatibility, may remove in the future
          this.$emit('chart' + event, params)
        })
      })

      if (this.autoResize) {
        this.__resizeHanlder = debounce(
          () => {
            chart.resize()
          },
          100,
          { leading: true }
        )
        window.addEventListener('resize', this.__resizeHanlder)
      }

      this.chart = chart
    },
    destroy() {
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }
      this.dispose()
      this.chart = null
    }
  },
  mounted() {
    // auto init if `options` is already provided
    if (this.options) {
      this.init()
    }
  },
  activated() {
    if (this.autoResize) {
      this.chart && this.chart.resize()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.destroy()
  },
  connect(group) {
    if (typeof group !== 'string') {
      group = group.map(chart => chart.chart)
    }
    echarts.connect(group)
  },
  disconnect(group) {
    echarts.disConnect(group)
  },
  registerMap(...args) {
    echarts.registerMap(...args)
  },
  registerTheme(...args) {
    echarts.registerTheme(...args)
  }
}
</script>
