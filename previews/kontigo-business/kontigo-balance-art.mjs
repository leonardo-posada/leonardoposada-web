// Decorative isometric comparison; heights share a baseline and amount scale.
export function renderBalanceArt() {
  const mount=document.createElement('div');
  mount.className='portfolio-balance-art';
  const prism=(x,height,color,id,label,value)=>{
    const bottom=158,top=bottom-height;
    let filaments='';
    for(let i=0;i<12;i++){
      const xx=x+5+i*3.5, yy=bottom-height*.52+((i*13)%18);
      filaments+=`<path d="M${xx} ${bottom-4}V${yy}" stroke="${color}" stroke-width=".7" opacity="${.4+(i%3)*.2}"/>`;
    }
    if (id === 'balance-out') {
      const water = bottom-height*.44;
      filaments = `<path d="M${x+1} ${water} C${x+16} ${water-9} ${x+28} ${water+16} ${x+48} ${water+8} L${x+48} 167 L${x+1} 157Z" fill="url(#${id}-liquid)"/><path d="M${x+1} ${water} C${x+16} ${water-9} ${x+28} ${water+16} ${x+48} ${water+8}l20 -10 C${x+50} ${water+2} ${x+37} ${water-14} ${x+21} ${water-10}Z" fill="${color}" fill-opacity=".7"/><path d="M${x+1} ${water} C${x+16} ${water-9} ${x+28} ${water+16} ${x+48} ${water+8}" fill="none" stroke="#e5d8ff" stroke-width="1.4" stroke-opacity=".8"/>`;
    }
    return `<defs><linearGradient id="${id}-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ede5ff" stop-opacity=".7"/><stop offset=".5" stop-color="${color}" stop-opacity=".65"/><stop offset="1" stop-color="${color}" stop-opacity=".2"/></linearGradient><linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop stop-color="${color}" stop-opacity=".55"/><stop offset=".55" stop-color="${color}" stop-opacity=".06"/><stop offset="1" stop-color="${color}" stop-opacity=".025"/></linearGradient></defs>
    <defs>
      <linearGradient id="${id}-reflection" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="${color}" stop-opacity=".36"/>
        <stop offset=".3" stop-color="${color}" stop-opacity=".18"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M${x} 158l48 10 21 -11 -3 37 -20 10 -43 -9Z" fill="url(#${id}-reflection)" filter="url(#balance-floor-soft)"/>
    <path d="M${x+5} 161l39 8 -2 33 -35 -8Z" fill="url(#${id}-reflection)" opacity=".5" filter="url(#balance-floor-soft)"/>
    <path d="M${x} 158l48 10 21 -11" fill="none" stroke="${color}" stroke-width="3" stroke-opacity=".4" filter="url(#balance-contact)"/>
    <path d="M${x+21} ${top-10}V148l48 9M${x} 158l21 -10" fill="none" stroke="${color}" stroke-opacity=".12" stroke-width=".5"/>
    <path d="M${x} ${top}l21 -10 48 9 -21 11Z" fill="${color}" fill-opacity=".1" stroke="${color}" stroke-opacity=".32" stroke-width=".4"/>
    <path d="M${x} ${top}l48 10V168l-48 -10Z" fill="url(#${id})" stroke="${color}" stroke-opacity=".28" stroke-width=".4"/>
    <path d="M${x+48} ${top+10}l21 -11V157l-21 11Z" fill="${color}" fill-opacity=".035" stroke="${color}" stroke-opacity=".22" stroke-width=".4"/>
    <g filter="url(#balance-inner-light)" opacity=".65">${filaments}</g><g opacity=".8">${filaments}</g>
    <path d="M${x+3} ${top+3}l8 2V158l-8 -2Z" fill="white" fill-opacity=".13" filter="url(#balance-inner-light)"/>
    <path d="M${x+51} ${top+9}l4 -2V164l-4 2Z" fill="white" fill-opacity=".16" filter="url(#balance-glass-soft)"/>
    <path d="M${x+1} ${top+2}V157l47 10" fill="none" stroke="${color}" stroke-width="4" opacity=".5" filter="url(#balance-bloom)"/><path d="M${x+1} 157l47 10 20 -10" fill="none" stroke="${color}" stroke-opacity=".6" stroke-width="1" filter="url(#balance-glass-soft)"/>
    <text x="${x+33}" y="195" text-anchor="middle" fill="#a3a3a3" font-family="Geist" font-size="10">${label}</text><text x="${x+33}" y="211" text-anchor="middle" fill="#e5e5e5" font-family="Geist" font-size="12">${value}</text>`;
  };
  mount.innerHTML=`<svg viewBox="0 0 260 225" role="img" aria-label="Comparación de entradas: 120.200 USDc y salidas: 72.600 USDc"><defs><filter id="balance-inner-light" x="-50%" y="-30%" width="200%" height="160%"><feGaussianBlur stdDeviation="2"/></filter><filter id="balance-glass-soft" x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation=".65"/></filter><filter id="balance-floor-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2 3"/></filter><filter id="balance-contact" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="balance-bloom" x="-80%" y="-100%" width="260%" height="300%"><feGaussianBlur stdDeviation="6"/></filter></defs><path d="M-30 168L240 222M-10 145L280 203M-30 192L140 226M-10 225L220 112M45 235L260 129M105 235L280 149M165 235L290 174" stroke="#fff" stroke-opacity=".055" fill="none"/>${prism(40,118,'#ff8904','balance-in','Entradas','120,2k')}${prism(150,118*72.6/120.2,'#b77aff','balance-out','Salidas','72,6k')}</svg>`;
  // Keep every label above the complete floor and both light pools.
  const svg = mount.querySelector('svg');
  svg.querySelectorAll('text').forEach(label => svg.append(label));
  document.querySelector('.balance').append(mount);
}
