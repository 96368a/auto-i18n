import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'

import theme from 'daisyui/functions/variables'
// import theme from 'daisyui/src/theming/index'
import { defineConfig, presetAttributify, presetIcons, presetWind } from 'unocss'

export default defineConfig({
  presets: [
    presetDaisy({
      // themes: ['fantasy --default', 'dracula --prefersdark'],
    }),
    presetWind(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    theme,
  },
  separators: [':'],
})
