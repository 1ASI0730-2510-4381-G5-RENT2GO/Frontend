import { ref, onMounted } from 'vue'

const theme = ref('light')

export function useTheme() {
    function setTheme(val) {
        theme.value = val
        localStorage.setItem('theme', val)
        document.documentElement.classList.toggle('dark', val === 'dark')
    }

    onMounted(() => {
        const fromLS = localStorage.getItem('theme')
        if (fromLS) setTheme(fromLS)
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
        else setTheme('light')
    })

    return {
        theme,
        setTheme,
    }
}