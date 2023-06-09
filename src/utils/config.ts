import { ThemingProps } from '@chakra-ui/react'
import { Chain } from '@wagmi/chains'

export const SITE_NAME = 'Matryoshka'
export const SITE_DESCRIPTION = 'gCFA in an NFT'
export const SITE_URL = 'https://w3hc.org'
export const THEME_INITIAL_COLOR = 'dark'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'W3HC'
export const SOCIAL_GITHUB = 'w3hc/nexth'

const mantletestnet: Chain = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'Mantle Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BIT',
    symbol: 'BIT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Mantle Testnet Explorer', url: 'https://explorer.testnet.mantle.xyz' },
  },
  testnet: true,
}

export const ETH_CHAINS = [mantletestnet]
export const alchemyId = process.env.NEXT_PUBLIC_ARBITRUM_ALCHEMY_ID

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
