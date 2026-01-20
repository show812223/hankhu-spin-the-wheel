import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#7EB8DA',    // 柔和天藍
          secondary: '#F8B4C4',  // 櫻花粉
          accent: '#B5EAD7',     // 薄荷綠
          success: '#98D8C8',    // 青瓷綠
          warning: '#FFE5B4',    // 奶油黃
          error: '#F7CAC9',      // 玫瑰粉
          background: '#FDF9F6', // 米白色背景
          surface: '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})
