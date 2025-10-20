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
          logout: 'Sign out',
          signUp: 'Sign up',
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
          searchPlaceholder: 'Search for products, brands, and categories',
          searchCta: 'Search',
          categoriesTitle: 'Featured Categories',
          categoriesDescription:
            'Hand-picked collections to jumpstart your shopping journey.',
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
          signInTitle: 'Welcome back',
          signInDescription: 'Access your orders, manage addresses, and enjoy member perks.',
          signInCta: 'Sign in',
          signUpTitle: 'Create your Ecom Lab account',
          signUpDescription:
            'Unlock curated recommendations and upgrade to VIP tiers with invite codes.',
          signUpCta: 'Create account',
          signInInstead: 'Sign in instead',
          createAccount: 'Create one',
          signInDescriptionShort: 'Access your personalised dashboard.',
          noAccount: 'New to Ecom Lab?',
          haveAccount: 'Already a member?',
          emailLabel: 'Email address',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter a secure password',
          confirmPasswordLabel: 'Confirm password',
          confirmPasswordPlaceholder: 'Re-enter your password',
          fullNameLabel: 'Full name',
          tierLabel: 'Membership tier',
          inviteCodeLabel: 'VIP invite code',
          inviteCodeHelp:
            'Use the provided invite code to unlock VIP or Super VIP benefits during onboarding.',
          demoAccounts:
            'Use the following demo accounts to explore tier-based experiences:',
          tiers: {
            basic: 'Basic',
            vip: 'VIP',
            superVip: 'Super VIP',
          },
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
