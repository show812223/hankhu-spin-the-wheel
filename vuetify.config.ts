import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#7C3AED',      // Electric Purple
          secondary: '#A78BFA',    // Soft Purple
          accent: '#06B6D4',       // Cyan
          success: '#10B981',      // Emerald
          warning: '#F59E0B',      // Amber
          error: '#F43F5E',        // Rose
          background: '#0F0F23',   // Deep Dark
          surface: '#1A1A2E',      // Card Surface
          'on-background': '#E2E8F0',
          'on-surface': '#E2E8F0',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
    },
    VCard: {
      rounded: 'xl',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VChip: {
      rounded: 'lg',
    },
  },
})
