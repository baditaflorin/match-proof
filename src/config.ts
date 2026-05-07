declare const __APP_VERSION__: string
declare const __APP_COMMIT__: string

export const APP_VERSION = __APP_VERSION__
export const BUILD_COMMIT = __APP_COMMIT__
export const REPO_OWNER = import.meta.env.VITE_REPO_OWNER ?? 'baditaflorin'
export const REPO_NAME = import.meta.env.VITE_REPO_NAME ?? 'match-proof'
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`
export const PAYPAL_URL = 'https://www.paypal.com/paypalme/florinbadita'
export const PAGES_URL = `https://${REPO_OWNER}.github.io/${REPO_NAME}/`
