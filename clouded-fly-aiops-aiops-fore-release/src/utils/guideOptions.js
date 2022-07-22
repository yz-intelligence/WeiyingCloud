/**
 * 首页新手指导配置
 * @param {Boolean} hasSystem 是否有系统管理权限
 */
export function homeGuideOptions(hasSystem) {
  const commonSteps = [
    {
      intro: `维鹰云主要包含首页、监控源管理、事件订阅、事件处理、事件分析、${
        hasSystem ? '系统管理六' : '五'
      }大功能板块。`,
      position: 'bottom',
      tooltipClass: 'hidePrevBtn hideSkipBtn'
    },
    {
      intro: '首页主要用来展示当日事件概览以及近期事件发生、响应、处理情况分析。',
      element: '#menu_Dashboard',
      disableInteraction: true,
      position: 'bottom',
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    },
    {
      intro:
        '监控源管理主要用来对接各监控工具或者云平台，使得事件统一发送到维鹰云，集中管理您的事件，统一分析处理；另外也可以在此进行维护期设置，避免变更维护期间告警风暴的侵扰。',
      element: '#menu_BLT2GPQ6QW7TSF7LLV8DGRSE1WNVE947',
      position: 'bottom',
      disableInteraction: true,
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    },
    {
      intro: '事件订阅主要用来配置事件的订阅策略，使得事件能及时通知到相关干系人；支持查看事件的通知记录。',
      element: '#menu_ServiceConfig',
      disableInteraction: true,
      position: 'bottom',
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    },
    {
      intro:
        '事件处理包括实时事件和事件档案。实时事件作为运维人员的一线值班台，支持事件实时刷新；事件档案是系统接收到的所有事件的存档。',
      element: '#menu_EventCenter',
      disableInteraction: true,
      position: 'bottom',
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    },
    {
      intro: '事件分析主要用来对系统接收的所有事件进行分析和统计，生成相关事件报表。',
      element: '#menu_EventStatement',
      position: 'bottom',
      disableInteraction: true,
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    }
  ]
  const adminStep = [
    {
      intro: '系统管理主要用来对用户、角色权限、系统配置信息等进行管理。',
      element: '#menu_SystemManager',
      position: 'bottom',
      disableInteraction: true,
      highlightClass: 'menu--highlight',
      tooltipClass: 'hideSkipBtn'
    }
  ]
  const lastStep = [
    {
      intro: '现在我们将会生成模拟测试事件，带您熟悉维鹰云完整的标准化的事件处理流程。',
      tooltipClass: 'hideSkipBtn pageEnd'
    }
  ]
  const steps = [...commonSteps, ...(hasSystem ? adminStep : []), ...lastStep]
  const options = {
    keyboardNavigation: false,
    doneLabel: '进入监控源接入',
    nextLabel: '下一步',
    prevLabel: '上一步',
    skipLabel: '跳出',
    showStepNumbers: true,
    exitOnOverlayClick: false,
    showButtons: true,
    showBullets: false,
    steps
  }
  return options
}

// 测试监控源接入
export const monitorAccess = {
  doneLabel: '实时事件',
  keyboardNavigation: false,
  exitOnOverlayClick: false,
  tooltipClass: 'hidePrevBtn hideNextBtn',
  skipLabel: '跳出',
  showStepNumbers: true,
  showBullets: false,
  steps: [
    {
      step: 4,
      intro: '点击【测试接入】生成模拟事件。',
      element: '#introTestBtn',
      tooltipClass: 'hideBtn'
    },
    {
      step: 5,
      intro: '接入成功，前往实时事件查看已接入的事件。',
      tooltipClass: 'hideSkipBtn hidePrevBtn pageEnd'
    }
  ]
}

// 实时事件教程配置1
// 实时事件
export function realTimeGuideOptions1(refs) {
  const options = {
    keyboardNavigation: false,
    doneLabel: '跳出',
    nextLabel: '下一步',
    prevLabel: '上一步',
    skipLabel: '跳出',
    showStepNumbers: true,
    exitOnOverlayClick: false,
    showBullets: false,
    steps: [
      {
        element: refs.table.$el,
        stepId: 1,
        intro: '已接入的事件将会展示在这里。',
        disableInteraction: true,
        highlightClass: 'intro__highlight',
        tooltipClass: 'hidePrevBtn hideSkipBtn'
      },
      {
        element: refs.listSetOpenBtn,
        stepId: 2,
        intro: '点击按钮打开列表设置。',
        tooltipClass: 'hideBtn'
      },
      {
        element: '#placeholder',
        stepId: 3,
        intro: '设置事件列表展示的字段，可以通过拖动标签进行排序。',
        highlightClass: 'd-none isDialog',
        disableInteraction: true,
        tooltipClass: 'hidePrevBtn hideSkipBtn'
      },
      {
        element: '#placeholder',
        stepId: 4,
        intro: '设置新接收到的事件是否播放告警音，支持不同级别的事件播放不同的告警音。',
        highlightClass: 'd-none isDialog',
        disableInteraction: true,
        tooltipClass: 'hidePrevBtn hideSkipBtn'
      },
      {
        element: '#placeholder',
        stepId: 5,
        intro: '设置事件列表是否自动刷新，以及刷新间隔。',
        highlightClass: 'd-none isDialog',
        disableInteraction: true,
        tooltipClass: 'hidePrevBtn hideSkipBtn'
      },
      {
        element: refs.listSetSubmitBtn.$el,
        stepId: 6,
        intro: '已经关闭自动刷新，点击确定，使更改的设置生效。',
        highlightClass: 'd-none isDialog hideHelper',
        tooltipClass: 'hideBtn'
      }
    ]
  }
  return options
}

// 实时事件教程配置2
export function realTimeGuideOptions2(vm, id) {
  const options = {
    keyboardNavigation: false,
    doneLabel: '进入事件档案',
    nextLabel: '下一步',
    prevLabel: '上一步',
    skipLabel: '跳出',
    showStepNumbers: true,
    exitOnOverlayClick: false,
    showButtons: true,
    showBullets: false,
    steps: [
      {
        element: `.event_${id} .el-table__expand-column .cell`,
        stepId: 7,
        intro: '点击事件展开详情信息。',
        tooltipClass: 'hideBtn'
      },
      {
        element: `.event_${id} + tr .el-table__expanded-cell`,
        stepId: 8,
        intro: '这里可以看到事件详情，如果事件经过压缩则会出现降噪记录。',
        tooltipClass: 'hidePrevBtn hideSkipBtn',
        disableInteraction: true
      },
      {
        element: `#action-current_${id}`,
        stepId: 9,
        intro: '点击按钮展开对事件的操作。',
        tooltipClass: 'hideBtn'
      },
      {
        element: `.guide-menu-${id}`,
        stepId: 10,
        intro: '可以对事件进行查看详情，响应，备注，合并，转派，关闭操作。',
        tooltipClass: 'hidePrevBtn hideSkipBtn',
        disableInteraction: true
      },
      {
        element: `.guide-menu-item-response-${id}`,
        stepId: 11,
        intro: '响应事件，标记事件已经开始处理。<br/>点击【响应】，响应事件。',
        tooltipClass: 'hideBtn'
      },
      {
        element: `.guide-menu-item-remark-${id}`,
        stepId: 12,
        intro:
          '事件处理过程中，可以随时将处理情况通过备注功能记录下来，作为后续相似事件的处理参考。<br/>点击【备注】进行事件备注。',
        tooltipClass: 'hideBtn'
      },
      {
        element: '#placeholder',
        stepId: 13,
        intro: '点击【确定】，记录事件备注',
        tooltipClass: 'hideBtn',
        highlightClass: 'd-none'
      },
      {
        stepId: 14,
        intro: '对于相互之间有关联的事件可以通过合并功能将多条关联事件合并在一起进行统一处理，减少事件列表信息干扰。',
        tooltipClass: 'hidePrevBtn hideSkipBtn'
      },
      {
        element: `.event_${vm.guideEventCtrl.level3Id} .el-table-column--selection`,
        stepId: 15,
        intro: '选中一条故障级别的事件。',
        tooltipClass: 'hideBtn'
      },
      {
        element: `.event_${vm.guideEventCtrl.level4Id} .el-table-column--selection`,
        stepId: 16,
        intro: '选中一条事故级别的事件。',
        tooltipClass: 'hideBtn'
      },
      {
        element: '#guide-multiple-dropdown',
        stepId: 17,
        intro: '点击批量操作按钮，展开操作。',
        tooltipClass: 'hideBtn'
      },
      {
        element: '#guide-multiple-dropdown-merge',
        stepId: 18,
        intro: '点击【合并】进行事件合并。',
        tooltipClass: 'hideBtn'
      },
      {
        stepId: 19,
        intro: '点击【合并】，将两条事件合并到一条新的事件',
        position: 'top',
        tooltipClass: 'hideBtn',
        highlightClass: 'd-none'
      },
      {
        element: `.event_${id} .el-table__expand-column`, // 这里只是用来占位，element会被替换
        stepId: 20,
        intro: '事件列表只展示合并后的事件，被合并的事件默认不展示，点击合并事件，查看事件的合并记录。',
        tooltipClass: 'hideBtn'
      },
      {
        element: `#placeholder`, // 这里只是用来占位，element会被替换
        stepId: 21,
        intro: '在这里可以看到该合并事件的合并记录',
        tooltipClass: 'hidePrevBtn hideSkipBtn',
        disableInteraction: true
      },
      {
        element: `.guide-menu-item-detail-${id}`,
        stepId: 22,
        intro: '点击【详情】',
        tooltipClass: 'hideBtn',
        position: 'left'
      },
      {
        element: `#placeholder`, // 这里只是用来占位，element会被替换
        stepId: 23,
        intro: '这里可以看到此事件的所有字段信息。',
        tooltipClass: 'hidePrevBtn hideSkipBtn',
        disableInteraction: true,
        highlightClass: 'd-none'
      },
      {
        element: `#placeholder`, // 这里只是用来占位，element会被替换
        stepId: 24,
        intro: '这里是以时间轴方式展示的事件操作记录。',
        disableInteraction: true,
        highlightClass: 'd-none',
        tooltipClass: 'hideSkipBtn'
      },
      {
        element: `#placeholder`, // 这里只是用来占位，element会被替换
        stepId: 25,
        intro: '可以添加标签对事件进行分类标记。点击添加标签按钮。',
        tooltipClass: 'hideBtn',
        highlightClass: 'd-none'
      },
      {
        element: `#eventDetailSaveTagBtn`, // 这里只是用来占位，element会被替换
        stepId: 26,
        intro: '点击【确定】，生成标签。',
        tooltipClass: 'hideBtn',
        highlightClass: 'd-none'
      },
      {
        element: `.guide-menu-item-transfer-${id}`,
        stepId: 27,
        tooltipClass: 'hideBtn',
        intro: '如果事件需要他人协助处理，可以将事件转派给其它用户。点击【转派】。'
      },
      {
        element: '#eventTransferMain',
        stepId: 28,
        tooltipClass: 'hidePrevBtn hideSkipBtn',
        intro: '可以选择转派的用户并且填写备注。',
        disableInteraction: true,
        highlightClass: 'd-none'
      },
      {
        element: `.guide-menu-item-close-${id}`,
        stepId: 29,
        tooltipClass: 'hideBtn',
        intro: '处理完成后需要及时将事件关闭，点击【关闭】。'
      },
      {
        element: '#eventCloseSubmitBtn',
        stepId: 30,
        tooltipClass: 'hideBtn',
        intro:
          '关闭事件时可以对事件的有效性进行判定，需要记录事件的处理意见，处理意见会作为后续的处理参考。点击【确定】关闭事件。'
      },
      {
        stepId: 31,
        intro: '关闭的事件不在实时事件展示，可以在事件档案查看所有已关闭的事件。',
        tooltipClass: 'hideSkipBtn hidePrevBtn pageEnd'
      }
    ]
  }
  return options
}

export const eventRecordGuideOptions = {
  doneLabel: '下一步',
  nextLabel: '下一步',
  prevLabel: '上一步',
  exitOnOverlayClick: false,
  keyboardNavigation: false,
  showStepNumbers: true,
  skipLabel: '跳出',
  showBullets: false,
  steps: [
    {
      intro: '已关闭的事件将会显示在这里。',
      element: '#recordTable',
      disableInteraction: true,
      tooltipClass: 'hideSkipBtn hidePrevBtn'
    },
    {
      intro: '历史事件支持查询和导出。',
      element: '#recordActions',
      disableInteraction: true,
      tooltipClass: 'hideSkipBtn hidePrevBtn pageEnd'
    }
  ]
}
