import {useEffect} from "react"

type ThemeProviderProps = {
    children: React.ReactNode
}

export function ThemeProvider({children}: ThemeProviderProps) {
    useEffect(() => {
        const root = window.document.documentElement

        function updateTheme() {
            root.classList.remove("light", "dark")

            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const systemTheme = isDark ? "dark" : "light"

            root.classList.add(systemTheme)
        }

        // Set initial theme
        updateTheme()

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change", updateTheme)

        return () => {
            mediaQuery.removeEventListener("change", updateTheme)
        }
    }, [])

    return <>{children}</>
}
