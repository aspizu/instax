import {ThemeProvider} from "@/components/theme-provider"
import {Toaster} from "@/components/ui/sonner"
import {App} from "@/features/app"
import {CropDialog} from "@/features/crop-dialog"
import "@/styles/globals.css"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
            <Toaster />
            <CropDialog />
        </ThemeProvider>
    </StrictMode>
)
