import SliderZoomView from 'echarts/lib/component/dataZoom/SliderZoomView'
import { bind, each } from 'zrender/lib/core/util'
import * as graphic from 'echarts/lib/util/graphic'
import { parsePercent } from 'echarts/lib/util/number'
import { enableHoverEmphasis } from 'echarts/lib/util/states'
import { createSymbol, symbolBuildProxies } from 'echarts/lib/util/symbol'
import { deprecateLog } from 'echarts/lib/util/log'
import { createTextStyle } from 'echarts/lib/label/labelStyle'
var Rect = graphic.Rect // Constants

var DEFAULT_FRAME_BORDER_WIDTH = 1

SliderZoomView.prototype._renderHandle = function () {
  try {
    var thisGroup = this.group
    var displayables = this._displayables
    var handles = (displayables.handles = [null, null])
    var handleLabels = (displayables.handleLabels = [null, null])
    var sliderGroup = this._displayables.sliderGroup
    var size = this._size
    var dataZoomModel = this.dataZoomModel
    var api = this.api
    var borderRadius = dataZoomModel.get('borderRadius') || 0
    var brushSelect = dataZoomModel.get('brushSelect')
    var filler = (displayables.filler = new Rect({
      silent: brushSelect,
      style: {
        fill: dataZoomModel.get('fillerColor')
      },
      textConfig: {
        position: 'inside'
      }
    }))
    sliderGroup.add(filler) // Frame border.

    sliderGroup.add(
      new Rect({
        silent: true,
        subPixelOptimize: true,
        shape: {
          x: 0,
          y: 0,
          width: size[0],
          height: size[1],
          r: borderRadius
        },
        style: {
          stroke:
            dataZoomModel.get('dataBackgroundColor') || // deprecated option
            dataZoomModel.get('borderColor'),
          lineWidth: DEFAULT_FRAME_BORDER_WIDTH,
          fill: 'rgba(0,0,0,0)'
        }
      })
    ) // Left and right handle to resize

    each(
      [0, 1],
      function (handleIndex) {
        var iconStr = dataZoomModel.get('handleIcon')

        if (!symbolBuildProxies[iconStr] && iconStr.indexOf('path://') < 0 && iconStr.indexOf('image://') < 0) {
          // Compatitable with the old icon parsers. Which can use a path string without path://
          iconStr = 'path://' + iconStr

          if (process.env.NODE_ENV !== 'production') {
            deprecateLog("handleIcon now needs 'path://' prefix when using a path string")
          }
        }

        var path = createSymbol(iconStr, -1, 0, 2, 2, null, true)
        path.attr({
          cursor: getCursor(this._orient),
          draggable: true,
          drift: bind(this._onDragMove, this, handleIndex),
          ondragend: bind(this._onDragEnd, this),
          onmouseover: bind(this._showDataInfo, this, true),
          onmouseout: bind(this._showDataInfo, this, false),
          z2: 5
        })
        var bRect = path.getBoundingRect()
        var handleSize = dataZoomModel.get('handleSize')
        this._handleHeight = parsePercent(handleSize, this._size[1])
        this._handleWidth = (bRect.width / bRect.height) * this._handleHeight
        path.setStyle(dataZoomModel.getModel('handleStyle').getItemStyle())
        path.style.strokeNoScale = true
        path.rectHover = true
        path.ensureState('emphasis').style = dataZoomModel.getModel(['emphasis', 'handleStyle']).getItemStyle()
        enableHoverEmphasis(path)
        var handleColor = dataZoomModel.get('handleColor') // deprecated option
        // Compatitable with previous version

        if (handleColor != null) {
          path.style.fill = handleColor
        }

        sliderGroup.add((handles[handleIndex] = path))
        var textStyleModel = dataZoomModel.getModel('textStyle')
        thisGroup.add(
          (handleLabels[handleIndex] = new graphic.Text({
            silent: true,
            invisible: true,
            style: createTextStyle(textStyleModel, {
              x: 0,
              y: 0,
              text: '',
              verticalAlign: 'middle',
              align: 'center',
              fill: textStyleModel.getTextColor(),
              font: textStyleModel.getFont()
            }),
            z2: 10
          }))
        )
      },
      this
    ) // Handle to move. Only visible when brushSelect is set true.

    var actualMoveZone = filler

    if (brushSelect) {
      var moveHandleHeight = parsePercent(dataZoomModel.get('moveHandleSize'), size[1])
      var moveHandle_1 = (displayables.moveHandle = new graphic.Rect({
        style: dataZoomModel.getModel('moveHandleStyle').getItemStyle(),
        silent: true,
        shape: {
          r: [0, 0, 2, 2],
          y: size[1] - 0.5,
          height: moveHandleHeight
        }
      }))
      var iconSize = moveHandleHeight * 0.8
      var moveHandleIcon = (displayables.moveHandleIcon = createSymbol(
        dataZoomModel.get('moveHandleIcon'),
        -iconSize / 2,
        -iconSize / 2,
        iconSize,
        iconSize,
        '#fff',
        true
      ))
      moveHandleIcon.silent = true
      moveHandleIcon.y = size[1] + moveHandleHeight / 2 - 0.5
      moveHandle_1.ensureState('emphasis').style = dataZoomModel
        .getModel(['emphasis', 'moveHandleStyle'])
        .getItemStyle()
      var moveZoneExpandSize = Math.min(size[1] / 2, Math.max(moveHandleHeight, 10))
      actualMoveZone = displayables.moveZone = new graphic.Rect({
        invisible: true,
        shape: {
          y: size[1] - moveZoneExpandSize,
          height: moveHandleHeight + moveZoneExpandSize
        }
      })
      actualMoveZone
        .on('mouseover', function () {
          api.enterEmphasis(moveHandle_1)
        })
        .on('mouseout', function () {
          api.leaveEmphasis(moveHandle_1)
        })
      sliderGroup.add(moveHandle_1)
      sliderGroup.add(moveHandleIcon)
      sliderGroup.add(actualMoveZone)
    }
    actualMoveZone.attr({
      draggable: true,
      cursor: dataZoomModel.get('cursor') || getCursor(this._orient),
      drift: bind(this._onDragMove, this, 'all'),
      ondragstart: bind(this._showDataInfo, this, true),
      ondragend: bind(this._onDragEnd, this),
      onmouseover: bind(this._showDataInfo, this, true),
      onmouseout: bind(this._showDataInfo, this, false)
    })
  } catch (error) {
    console.log('error', error)
  }
}

function getCursor(orient) {
  return orient === 'vertical' ? 'ns-resize' : 'ew-resize'
}
