import type { Routes } from "../functions/routing";

export type MenuItem = {
    route: Routes,
    text: string,
    graphic: string,
    handler: () => void,
}
