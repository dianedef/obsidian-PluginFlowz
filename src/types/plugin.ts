import type { TPluginStatus } from './status'

export interface IPlugin {
    id: string
    title: string
    description: string
    repository?: string
    url?: string
    status: TPluginStatus[]
    tags: string[]
    rating: number
    activate: boolean
    note?: string
} 