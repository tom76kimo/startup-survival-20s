export type ToastKind = 'good' | 'bad' | 'warn'

export function showToast(anchor: HTMLElement, text: string, kind: ToastKind) {
  const r = anchor.getBoundingClientRect()

  const el = document.createElement('div')
  el.className = `deltaToast ${kind}`
  el.textContent = text

  // Position near the value cell (right side)
  el.style.left = `${Math.min(window.innerWidth - 10, r.right) - 6}px`
  el.style.top = `${r.top - 6}px`

  document.body.appendChild(el)

  // Trigger animation
  requestAnimationFrame(() => {
    el.classList.add('show')
  })

  const remove = () => el.remove()
  setTimeout(remove, 950)
}
