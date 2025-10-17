import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  en: {
    translation: {
      layout: {
        brand: 'Ecom Lab',
        nav: {
          home: 'Home',
          products: 'Products',
          account: 'Account',
          orders: 'Orders',
        },
        actions: {
          cart: 'Cart',
          login: 'Login',
        },
        footer: '© {{year}} Ecom Lab. All rights reserved.',
        sidebar: {
          overview: 'Overview',
          orders: 'Orders',
          afterSale: 'After-Sale Service',
          addresses: 'Addresses',
        },
      },
      pages: {
        home: {
          title: 'Welcome to Ecom Lab',
          description:
            'Discover curated campaigns, hero banners, and personalized product highlights here.',
        },
        products: {
          title: 'Product Listing',
          description:
            'Filtering, sorting, and pagination capabilities will be implemented in this module.',
        },
        cart: {
          title: 'Shopping Cart Under Construction',
          description:
            'The cart will sync state across pages and surface detailed promotion breakdowns.',
        },
        auth: {
          title: 'Sign In / Sign Up Coming Soon',
          description:
            'Form validation and JWT authentication workflows will be integrated here.',
        },
        account: {
          overview: {
            title: 'Account Overview',
            description: 'User summary information will be displayed here.',
          },
          orders: {
            title: 'Order History',
            description: 'Order list and details will be rendered in this section.',
          },
          afterSale: {
            title: 'After-Sale Service',
            description: 'Return and support processes will be configured here.',
          },
          addresses: {
            title: 'Address Book',
            description: 'Manage shipping addresses from this screen.',
          },
        },
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

export default i18n
