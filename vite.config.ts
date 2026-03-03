import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * Vite plugin: watches tailwind.config.ts and invalidates all CSS modules
 * when it changes, triggering a full reload in dev mode.
 *
 * Root cause: Vite's module graph does not track the dependency between
 * CSS files and tailwind.config.ts (a TypeScript file loaded via jiti at
 * PostCSS time). Without this, color/token changes in the config have no
 * effect until the dev server is fully restarted.
 *
 * Fix: configureServer explicitly registers tailwind.config.ts with Vite's
 * chokidar watcher. Without this, handleHotUpdate never fires — the file
 * is outside Vite's module graph and would otherwise be invisible to HMR.
 */
function tailwindHotReload(): Plugin {
  return {
    name: 'tailwind-hot-reload',
    configureServer(server) {
      server.watcher.add(resolve('tailwind.config.js'))
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('tailwind.config')) {
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (mod.id?.endsWith('.css')) {
            server.moduleGraph.invalidateModule(mod)
          }
        }
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindHotReload()],
})
