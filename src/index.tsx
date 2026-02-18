import {Toaster} from "@/components/ui/sonner"
import {App} from "@/features/app"
import "@/styles/index.css"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

// @ts-expect-error Types don't exist
import "@fontsource-variable/inter"
// @ts-expect-error Types don't exist
import "@fontsource/cascadia-code"
// @ts-expect-error Types don't exist
import "@fontsource-variable/gelasio"

const root = document.getElementById("root") as HTMLDivElement

createRoot(root).render(
    <StrictMode>
        <App />
        <Toaster />
    </StrictMode>,
)
