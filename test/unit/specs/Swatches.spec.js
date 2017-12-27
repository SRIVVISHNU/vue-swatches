import Vue from 'vue'
import { mount } from 'vue-test-utils'
import rgb from 'rgb'

import Swatches from 'src/Swatches'
import presets from 'src/presets'

const DEFAULT_BACKGROUND_COLOR = '#FFFFFF'
const DEFAULT_MAX_HEIGHT = 300

const completPresetExample = {
  swatches: ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0'],
  borderRadius: '0',
  rowLength: 6,
  swatchSize: 18,
  spacingSize: 90,
  maxHeight: 80
}

const defaultComponent = mount(Swatches)

describe('Props', () => {
  describe('background-color', () => {
    const testColor = '#333'
    test('default background-color are shown', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          backgroundColor: DEFAULT_BACKGROUND_COLOR
        }
      })
      expect(componentWrapper.html())
      .toEqual(defaultComponent.html())
    })
    describe('When Popover mode is enabled', () => {
      test('background color should render color passed as a prop', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            backgroundColor: testColor
          }
        })
        const container = componentWrapper.find('.vue-swatches__container').element
        expect(rgb(container.style.backgroundColor))
        .toEqual(rgb(testColor))
      })
    })

    describe('When Inline mode is enabled', () => {
      test('background color should render color passed as a prop', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: true,
            backgroundColor: testColor
          }
        })
        const container = componentWrapper.find('.vue-swatches__container').element
        expect(rgb(container.style.backgroundColor))
        .toEqual(rgb(testColor))
      })
    })
  })

  describe('close-on-select', () => {
    test('default close-on-select is set to true', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          closeOnSelect: true
        }
      })
      expect(componentWrapper.html())
      .toEqual(defaultComponent.html())
    })
    describe('When Popover mode is enabled', () => {
      test('should close the popover if true', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            closeOnSelect: true
          }
        })
        componentWrapper.vm.showPopover()
        const container = componentWrapper.find('.vue-swatches__container')
        const swatch = componentWrapper.find('.vue-swatches__swatch')
        swatch.trigger('click')
        expect(container.hasStyle('display', 'none'))
        .toBeTruthy()
      })
      test('should not close the popover if false', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            closeOnSelect: false
          }
        })
        componentWrapper.vm.showPopover()
        const container = componentWrapper.find('.vue-swatches__container')
        const swatch = componentWrapper.find('.vue-swatches__swatch')
        swatch.trigger('click')
        expect(container.hasStyle('display', 'none'))
        .not.toBeTruthy()
      })
    })
  })

  describe('colors', () => {
    test('default swatches are shown', () => {
      const presetComponent = mount(Swatches, {
        propsData: {
          colors: 'simple'
        }
      })
      return Vue.nextTick()
      .then(() => {
        expect(presetComponent.html())
        .toEqual(defaultComponent.html())
      })
    })
    describe('When custom colors are passed as a prop', () => {
      test('given array colors are shown', () => {
        const colors = ['#e31432', '#a156e2', '#eca23e']
        const rgbColors = colors.map(c => rgb(c))
        const componentWrapper = mount(Swatches, {
          propsData: {
            colors
          }
        })
        const swatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch'))
        const swatchesColors = swatches.map(s => rgb(s.style.backgroundColor))
        expect(swatchesColors)
        .toEqual(rgbColors)
      })
      test('given nested array colors are shown', () => {
        const colors = [
          ['#e31432', '#a156e2', '#eca23e'],
          ['#a2341e', '$ef86ff', '#eiaea3'],
          ['#eec451', '$3321de', '#166002']
        ]
        const rgbColors = colors.map(row => {
          return row.map(s => rgb(s))
        })
        const componentWrapper = mount(Swatches, {
          propsData: {
            colors
          }
        })
        const swatchesRows = componentWrapper.element.querySelectorAll('.vue-swatches__row')
        const swatchesColors = []

        swatchesRows.forEach(swatchElement => {
          const swatchesNodeList = Array.from(swatchElement.querySelectorAll('.vue-swatches__swatch'))
          const rgbSwatches = swatchesNodeList.map(s => rgb(s.style.backgroundColor))
          swatchesColors.push(rgbSwatches)
        })

        expect(swatchesColors)
        .toEqual(rgbColors)
      })
    })
    describe('When preset name is passed as a prop', () => {
      test('preset colors are shown', () => {
        const presetNameTest = 'material-simple'
        const rgbColors = presets[presetNameTest].swatches.map(c => rgb(c))
        const componentWrapper = mount(Swatches, {
          propsData: {
            colors: presetNameTest
          }
        })
        const swatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch'))
        const swatchesColors = swatches.map(s => rgb(s.style.backgroundColor))
        expect(swatchesColors)
        .toEqual(rgbColors)
      })
    })
  })

  describe('exceptions && exception-mode', () => {
    test('default exceptions are set to []', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          exceptions: []
        }
      })
      expect(componentWrapper.html())
      .toEqual(defaultComponent.html())
    })
    test('default exception-mode are set to disabled', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          exceptionMode: 'disabled'
        }
      })
      expect(componentWrapper.html())
      .toEqual(defaultComponent.html())
    })
    describe('When swatches array is simple', () => {
      test('exceptions should be hidden if exception-mode is hidden', () => {
        const colors = ['#a23e41', '#e31432', '#a156e2', '#aeccea', '#5f0f2a', '#eca23e', '#12313a']
        const rgbColors = colors.map(c => rgb(c))
        const exceptions = ['#E31432', '#A156E2', '#ECA23E'] // Also the case shouldn't matter
        const rgbExceptions = exceptions.map(e => rgb(e))
        const trueRgbExceptions = rgbColors.filter(c => rgbExceptions.indexOf(c) !== -1)
        const componentWrapper = mount(Swatches, {
          propsData: {
            exceptionMode: 'hidden',
            colors,
            exceptions
          }
        })
        const exceptionSwatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch--is-exception'))
        const hiddenSwatches = exceptionSwatches.filter(s => s.style.display === 'none')
        const hiddenSwatchesColors = hiddenSwatches.map(s => rgb(s.style.backgroundColor))

        return Vue.nextTick()
        .then(() => {
          expect(hiddenSwatchesColors)
          .toEqual(trueRgbExceptions)
        })
      })
      test('exceptions should be disabled if exception-mode is disabled', () => {
        const colors = ['#a23e41', '#e31432', '#a156e2', '#aeccea', '#5f0f2a', '#eca23e', '#12313a']
        const rgbColors = colors.map(c => rgb(c))
        const exceptions = ['#e31432', '#a156e2', '#eca23e']
        const rgbExceptions = exceptions.map(e => rgb(e))
        const trueRgbExceptions = rgbColors.filter(c => rgbExceptions.indexOf(c) !== -1)
        const componentWrapper = mount(Swatches, {
          propsData: {
            exceptionMode: 'disabled',
            colors,
            exceptions
          }
        })
        const exceptionSwatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch--is-exception'))
        const disabledSwatches = exceptionSwatches.filter(s => s.style.cursor === 'not-allowed')
        const disabledSwatchesColors = disabledSwatches.map(s => rgb(s.style.backgroundColor))

        return Vue.nextTick()
        .then(() => {
          expect(disabledSwatchesColors)
          .toEqual(trueRgbExceptions)
        })
      })
    })
    describe('When swatches array is nested', () => {
      test('exceptions should be hidden if exception-mode is hidden', () => {
        const colors = [
          ['#e31432', '#ef86ff', '#166002'],
          ['#a2341e', '$a156e2', '#eiaea3'],
          ['#eec451', '$3321de', '#eca23e']
        ]
        const rgbColors = colors.map(row => {
          return row.map(s => rgb(s))
        })
        const flattenedRgbColors = [].concat(...rgbColors)
        const exceptions = ['#e31432', '#a156e2', '#eca23e']
        const rgbExceptions = exceptions.map(e => rgb(e))
        const trueRgbExceptions = flattenedRgbColors.filter(c => rgbExceptions.indexOf(c) !== -1)
        const componentWrapper = mount(Swatches, {
          propsData: {
            exceptionMode: 'hidden',
            colors,
            exceptions
          }
        })
        const exceptionSwatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch--is-exception'))
        const hiddenSwatches = exceptionSwatches.filter(s => s.style.display === 'none')
        const hiddenSwatchesColors = hiddenSwatches.map(s => rgb(s.style.backgroundColor))

        return Vue.nextTick()
        .then(() => {
          expect(hiddenSwatchesColors)
          .toEqual(trueRgbExceptions)
        })
      })
      test('exceptions should be disabled if exception-mode is disabled', () => {
        const colors = [
          ['#e31432', '#ef86ff', '#166002'],
          ['#a2341e', '$a156e2', '#eiaea3'],
          ['#eec451', '$3321de', '#eca23e']
        ]
        const rgbColors = colors.map(row => {
          return row.map(s => rgb(s))
        })
        const flattenedRgbColors = [].concat(...rgbColors)
        const exceptions = ['#e31432', '#a156e2', '#eca23e']
        const rgbExceptions = exceptions.map(e => rgb(e))
        const trueRgbExceptions = flattenedRgbColors.filter(c => rgbExceptions.indexOf(c) !== -1)
        const componentWrapper = mount(Swatches, {
          propsData: {
            exceptionMode: 'disabled',
            colors,
            exceptions
          }
        })
        const exceptionSwatches = Array.from(componentWrapper.element.querySelectorAll('.vue-swatches__swatch--is-exception'))
        const disabledSwatches = exceptionSwatches.filter(s => s.style.cursor === 'not-allowed')
        const disabledSwatchesColors = disabledSwatches.map(s => rgb(s.style.backgroundColor))

        return Vue.nextTick()
        .then(() => {
          expect(disabledSwatchesColors)
          .toEqual(trueRgbExceptions)
        })
      })
    })
  })

  describe('inline', () => {
    test('inline default is set to false', () => {
      const noInlineComponent = mount(Swatches, {
        propsData: {
          inline: false
        }
      })
      expect(noInlineComponent.html())
      .toEqual(defaultComponent.html())
    })
    describe('When inline prop is true', () => {
      test('should not render the trigger', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: true
          }
        })
        const trigger = componentWrapper.find({ ref: 'trigger-wrapper' })
        expect(trigger.exists())
        .not.toBeTruthy()
      })
      test('should render swatches visible', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: true
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')
        expect(container.hasStyle('display', 'none'))
        .not.toBeTruthy()
      })
    })
    describe('When inline prop is fale (Popover)', () => {
      test('should render the trigger', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: false
          }
        })
        const trigger = componentWrapper.find({ ref: 'trigger-wrapper' })
        expect(trigger.exists())
        .toBeTruthy()
      })
      test('shoukd render swatches not visible', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: false
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')
        expect(container.hasStyle('display', 'none'))
        .toBeTruthy()
      })
    })
  })

  describe('max-height', () => {
    test('default max-height is set to 300', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          maxHeight: DEFAULT_MAX_HEIGHT
        }
      })
      return Vue.nextTick()
      .then(() => {
        expect(componentWrapper.html())
        .toEqual(defaultComponent.html())
      })
    })
    test('container should have a height greater than zero by default', () => {
      const componentWrapper = mount(Swatches)
      const container = componentWrapper.find('.vue-swatches__container')
      const heightWithUnit = `${container.element.style.height.toString().replace(/px/, '')}px`

      return Vue.nextTick()
      .then(() => {
        expect(heightWithUnit)
        .not.toEqual('0px')
      })
    })
    describe('When Inline mode is enabled', () => {
      test('should not have a max-height value especified', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: true
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')
        expect(container.element.style.maxHeight)
        .toEqual('')
      })
    })
    describe('When Popover mode is enabled', () => {
      test('should update the max-height if prop is passed', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: false,
            maxHeight: 120
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')

        return Vue.nextTick()
        .then(() => {
          expect(container.element.style.maxHeight)
          .toEqual('120px')
        })
      })
      test('should update the max-height if preset specify one', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: false,
            colors: completPresetExample
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')

        return Vue.nextTick()
        .then(() => {
          expect(container.element.style.maxHeight)
          .toEqual(`${completPresetExample.maxHeight}px`)
        })
      })
      test('should priorize the max-height from the prop over the preset one', () => {
        const componentWrapper = mount(Swatches, {
          propsData: {
            inline: false,
            colors: completPresetExample,
            maxHeight: 250
          }
        })
        const container = componentWrapper.find('.vue-swatches__container')

        return Vue.nextTick()
        .then(() => {
          expect(container.element.style.maxHeight)
          .toEqual(`250px`)
        })
      })
    })
  })

  describe('shapes', () => {
    test('default shape is set to squares', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          shape: 'squares'
        }
      })
      expect(componentWrapper.html())
      .toEqual(defaultComponent.html())
    })
    test('trigger should render as circle if prop is circles', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          shapes: 'circles',
          inline: false
        }
      })
      const trigger = componentWrapper.find('.vue-swatches__trigger')

      expect(trigger.element.style.borderRadius)
      .toEqual('50%')
    })
  })

  describe('popover-to', () => {
    test('default popover-to is set to right', () => {
      const componentWrapper = mount(Swatches, {
        propsData: {
          popoverTo: 'right'
        }
      })
      return Vue.nextTick()
      .then(() => {
        expect(componentWrapper.html())
        .toEqual(defaultComponent.html())
      })
    })
  })
})