import { writable, get } from 'svelte/store'

const opSystem = writable('')

const customOpSystem = {
    subscribe: opSystem.subscribe,
    getOpSystem: () => {
        const appVer = window.navigator.appVersion;

        if (appVer.includes('Windows')) {
            opSystem.set('windows')
        }
        if (appVer.includes('Macintosh')) {
            opSystem.set('macintosh')
        }
    }
}

export default customOpSystem
