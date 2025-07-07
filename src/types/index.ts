/**
 * Common types used throughout the application
 */

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

export interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
}

export type Theme = "light" | "dark" | "system"

export interface AppConfig {
    theme: Theme
    apiUrl: string
    version: string
}
