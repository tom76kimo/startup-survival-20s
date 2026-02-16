// With vite-plugin-pwa, this will be replaced by the plugin.
// We keep this module to make registration explicit.
import { registerSW } from 'virtual:pwa-register';

export function setupPWA() {
  registerSW({
    immediate: true,
  });
}
