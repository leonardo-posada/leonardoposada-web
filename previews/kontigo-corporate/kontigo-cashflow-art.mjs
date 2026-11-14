// Portfolio illustration: daily totals and their four simulated collection channels.
export function renderCashflowArt() {
  const incoming = [2.1,2.5,3.2,4.1,3.6,2.8,2.3,2.6,3.9,5.8,4.7,3.2,2.9,3.5,4.1,6.2,5.1,3.8,3.1,3.6,4.6,5.2,4.3,3.5,2.8,3.2,4.8,6.4,5.3,3.9,3.1];
  const outgoing = [1.2,1.4,1.1,1.6,2.3,1.8,1.3,1.5,2.1,3.3,4.7,3.6,2.2,1.7,1.4,1.9,2.8,2.1,1.6,1.2,1.5,2.4,3.8,4.5,3.3,2.1,1.8,2.6,4.2,3.4,2.2];
  const plot = document.querySelector('[data-chart-view="lines"]');
  if (!plot) throw Error('Line chart missing');
  const W=640,H=340,bottom=318, x=i=>12+i*616/30, y=v=>bottom-v/7*290;
  const curve = values => {
    const points=values.map((v,i)=>[x(i),y(v)]);
    return points.reduce((d,p,i)=> i===0?`M${p[0]},${p[1]}`:d+` C${(points[i-1][0]+p[0])/2},${points[i-1][1]} ${(points[i-1][0]+p[0])/2},${p[1]} ${p[0]},${p[1]}`,'');
  };
  const orange='#ff8904',purple='#b77aff';
  let body=`<defs><linearGradient id="cash-area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${orange}" stop-opacity=".13"/><stop offset="1" stop-color="${orange}" stop-opacity="0"/></linearGradient><filter id="cash-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
  // Persist an inspection state in the static portfolio preview, without a tooltip.
  const activeDay = 21;
  body += `<rect x="${x(activeDay)-50}" y="16" width="100" height="${bottom-16}" rx="5" fill="white" fill-opacity=".045"/><path d="M${x(activeDay)} 16 V${bottom}" stroke="white" stroke-opacity=".3" stroke-width="1" stroke-dasharray="3 4"/>`;
  [2,4,6].forEach(v=>body+=`<path d="M12 ${y(v)} H628" stroke="white" stroke-opacity=".065" stroke-dasharray="2 6"/><text x="628" y="${y(v)-6}" text-anchor="end" fill="#777" font-size="9" font-family="Geist">${v}k</text>`);
  body+=`<path d="${curve(incoming)} L628 ${bottom} L12 ${bottom}Z" fill="url(#cash-area)"/>`;
  // Four independently changing components sum to the incoming total each day.
  for(let channel=0;channel<4;channel++) {
    const values=incoming.map((v,i)=>{const weights=[0,1,2,3].map(c=>1+.65*Math.sin(i*.36+c*1.7));return v*weights[channel]/weights.reduce((a,b)=>a+b,0)});
    body+=`<path d="${curve(values)}" fill="none" stroke="#b9bec5" stroke-opacity="${.23+channel*.07}" stroke-width=".9" stroke-dasharray="2 3"/>`;
  }
  [[outgoing,purple],[incoming,orange]].forEach(([values,color])=>{
    body+=`<path d="${curve(values)}" fill="none" stroke="${color}" stroke-width="5" opacity=".13" filter="url(#cash-glow)"/><path d="${curve(values)}" fill="none" stroke="${color}" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
  });
  [9,15,27].forEach(i=>body+=`<path d="M${x(i)} ${y(incoming[i])+7} V${bottom}" stroke="${orange}" stroke-opacity=".5" stroke-dasharray="2 4"/><circle cx="${x(i)}" cy="${bottom}" r="2" fill="${orange}"/><circle cx="${x(i)}" cy="${y(incoming[i])}" r="4" fill="#111" stroke="${orange}" stroke-width="2"/><text x="${x(i)}" y="${y(incoming[i])-12}" text-anchor="middle" fill="#eee" font-size="10" font-family="Geist">${incoming[i].toFixed(1)}k</text>`);
  body+=`<path d="M12 ${bottom}H628" stroke="#666" stroke-width=".7"/>`;
  [[incoming,orange],[outgoing,purple]].forEach(([values,color]) => {
    body += `<circle cx="${x(activeDay)}" cy="${y(values[activeDay])}" r="9" fill="${color}" fill-opacity=".12"/><circle cx="${x(activeDay)}" cy="${y(values[activeDay])}" r="4" fill="#111" stroke="${color}" stroke-width="1.5"/>`;
  });
  plot.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="Entradas y salidas diarias de octubre; líneas punteadas: cuatro canales de cobro simulados">${body}</svg>`;
  plot.style.cssText='height:340px!important;min-height:340px!important;max-height:340px!important;display:block;flex:none';
  document.querySelectorAll('.overview-grid .stats strong').forEach((el,i)=>el.textContent=[incoming,outgoing][i].reduce((a,b)=>a+b*1000,0).toLocaleString('es-VE',{minimumFractionDigits:2})+' USDc');
  const note=document.createElement('span');note.textContent='··· Canales de cobro';note.style.cssText='font-size:10px;color:#858585;margin-left:auto';document.querySelector('.chart-controls').append(note);
}
