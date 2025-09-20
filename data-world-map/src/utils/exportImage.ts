export async function exportCardAsPng(node: HTMLElement, fileName = 'map-card.png', scale = 3) {
  if (!node) return;
  const svg = node.querySelector('svg');
  const titleEl = node.querySelector('.world-map-title') as HTMLElement | null;
  const valueBar = node.querySelector('.valuebar-container') as HTMLElement | null;
  if (!svg) return console.warn('No SVG found inside node');

  const svgRect = svg.getBoundingClientRect();
  const origEls = Array.from(svg.querySelectorAll('*')) as Element[];
  const cloneSvg = svg.cloneNode(true) as SVGElement;

  const w = Math.max(1, Math.round(svgRect.width));
  const h = Math.max(1, Math.round(svgRect.height));
  cloneSvg.setAttribute('width', String(w));
  cloneSvg.setAttribute('height', String(h));
  if (!cloneSvg.getAttribute('viewBox')) cloneSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const cloneEls = Array.from(cloneSvg.querySelectorAll('*')) as Element[];
  for (let i = 0; i < origEls.length; i++) {
    const o = origEls[i];
    const c = cloneEls[i];
    if (!o || !c) continue;
    const cs = window.getComputedStyle(o as Element);
    let cssText = '';
    for (let j = 0; j < cs.length; j++) {
      const prop = cs[j];
      try { const val = cs.getPropertyValue(prop); if (val) cssText += `${prop}:${val};`; } catch (e) { }
    }
    if (cssText) c.setAttribute('style', cssText);
  }

  const serializer = new XMLSerializer();
  let svgSource = serializer.serializeToString(cloneSvg as Node);
  if (!svgSource.match(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
    svgSource = svgSource.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const cardRect = node.getBoundingClientRect();
  const svgClientRect = svg.getBoundingClientRect();
  const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;
  const valueRect = valueBar ? valueBar.getBoundingClientRect() : null;

  const canvasW = Math.max(1, Math.round(cardRect.width * scale));
  const canvasH = Math.max(1, Math.round(cardRect.height * scale));

  const img = new Image();
  const svgBlob = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgSource);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sx = Math.round((svgClientRect.left - cardRect.left) * scale);
    const sy = Math.round((svgClientRect.top - cardRect.top) * scale);
    const sw = Math.max(1, Math.round(svgClientRect.width * scale));
    const sh = Math.max(1, Math.round(svgClientRect.height * scale));
    ctx.drawImage(img, sx, sy, sw, sh);

    if (titleEl && titleRect) {
      const cs = window.getComputedStyle(titleEl);
      const fontSize = parseFloat(cs.fontSize || '18') * scale;
      const fontWeight = cs.fontWeight || '600';
      const fontFamily = cs.fontFamily || 'sans-serif';
      ctx.fillStyle = cs.color || '#000';
      ctx.textAlign = 'center';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const tx = Math.round((titleRect.left + titleRect.width / 2 - cardRect.left) * scale);
  const ty = Math.round((titleRect.top - cardRect.top + (titleRect.height * 0.75)) * scale);
      ctx.fillText(titleEl.textContent || '', tx, ty);
    }

    if (valueBar && valueRect) {
      const segments = Array.from(valueBar.querySelectorAll('.valuebar-segment')) as HTMLElement[];
      for (const seg of segments) {
        const r = seg.getBoundingClientRect();
        const x = Math.round((r.left - cardRect.left) * scale);
        const y = Math.round((r.top - cardRect.top) * scale);
        const w = Math.max(1, Math.round(r.width * scale));
        const h = Math.max(1, Math.round(r.height * scale));
        const bg = window.getComputedStyle(seg).backgroundColor || '#eee';
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, w, h);
      }
      const labels = Array.from(valueBar.querySelectorAll('.valuebar-small')) as HTMLElement[];
      ctx.fillStyle = window.getComputedStyle(valueBar).color || '#000';
      ctx.textAlign = 'center';
      for (const label of labels) {
        const r = label.getBoundingClientRect();
        const lx = Math.round((r.left + r.width / 2 - cardRect.left) * scale);
        const ly = Math.round((r.top - cardRect.top + r.height * 0.8) * scale);
        const cs = window.getComputedStyle(label);
        const fontSize = parseFloat(cs.fontSize || '12') * scale;
        const fontFamily = cs.fontFamily || 'sans-serif';
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillText(label.textContent || '', lx, ly);
      }
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = fileName;
    a.click();
  };
  img.onerror = (e) => console.error('SVG image load error', e);
  img.src = svgBlob;
}

export default exportCardAsPng;
