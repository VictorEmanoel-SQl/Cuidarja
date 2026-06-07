// Previne comportamento padrão de zoom em múltiplos toques
let last = 0;
document.addEventListener('touchstart', e => e.touches.length > 1 && e.preventDefault(), { passive: false });
document.addEventListener('touchend', e => (performance.now() - last < 300) ? e.preventDefault() : last = performance.now());