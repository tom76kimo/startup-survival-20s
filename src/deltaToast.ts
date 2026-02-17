export type ToastKind = 'good' | 'bad' | 'warn'

export function showToast(anchor: HTMLElement, text: string, kind: ToastKind) {
  const r = anchor.getBoundingClientRect()

  const el = document.createElement('div')
  el.className = `deltaToast ${kind}`
  el.textContent = text

  // Position centered above the number (less likely to overlap other UI)
  const cx = r.left + r.width / 2
  el.style.left = `${cx}px`
  el.style.top = `${r.top}px`

  document.body.appendChild(el)

  requestAnimationFrame(() => {
    el.classList.add('show')
  })

  setTimeout(() => el.remove(), 900)
}
