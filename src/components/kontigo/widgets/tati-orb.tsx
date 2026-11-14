'use client';
import {useEffect,useRef} from 'react';
import styles from './tati-orb.module.css';
import {satinOrbFragment} from './orb/satin-shader';

/** Native Kontigo Orb material rendered directly in WebGL; snapshots retain Kontigo Orb on unsupported GPUs. */
export function TatiOrb({size=120,isDark,animated=true,readLevel}:{size?:number;isDark?:boolean;animated?:boolean;readLevel?:()=>number}){
 const host=useRef<HTMLSpanElement>(null),canvas=useRef<HTMLCanvasElement>(null),fallback=useRef<HTMLImageElement>(null);
 const props=useRef({animated,readLevel});props.current={animated,readLevel};
 const resync=useRef(()=>{});
 useEffect(()=>{
  const el=host.current,surface=canvas.current,poster=fallback.current;if(!el||!surface||!poster)return;
  const theme=el.closest<HTMLElement>('[data-theme]');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let gl:WebGLRenderingContext|null=null,program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null;
  let shaders:WebGLShader[]=[],uniforms:Record<string,WebGLUniformLocation|null>={};
  let disposed=false,lost=false,visible=true,raf=0,last=0,time=0,voice=0,dark=false,cssSize=0;
  const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;last=0};
  const release=()=>{if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);shaders.forEach(s=>gl!.deleteShader(s))}buffer=null;program=null;shaders=[]};
  const showFallback=()=>{el.dataset.renderer='fallback';surface.style.opacity='0';poster.style.opacity='1'};
  function render(){
   if(!gl||!program||lost||!cssSize)return;
   gl.viewport(0,0,surface!.width,surface!.height);gl.useProgram(program);
   gl.uniform2f(uniforms.resolution,surface!.width,surface!.height);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.energy,reduced.matches?0:voice);gl.uniform1f(uniforms.dark,dark?1:0);
   gl.drawArrays(gl.TRIANGLES,0,3);
  }
  const running=()=>!disposed&&!lost&&!!program&&!!cssSize&&visible&&!document.hidden&&props.current.animated&&!reduced.matches;
  function frame(now:number){
   raf=0;if(!running()){last=0;return}
   const delta=last?Math.min((now-last)/1000,.04):0;last=now;
   const sample=props.current.readLevel?.()??0;const target=Number.isFinite(sample)?Math.max(0,Math.min(1,sample)):0;
   voice+=(target-voice)*(1-Math.exp(-delta/(target>voice ? .09 : .32)));
   time+=delta*(props.current.readLevel?1+voice*1.8:1);render();raf=requestAnimationFrame(frame);
  }
  function sync(){
   dark=theme?.getAttribute('data-theme')==='dark';poster!.src=dark?'/work/kontigo/widgets/orb-dark.png':'/work/kontigo/widgets/orb-light.png';
   if(reduced.matches)voice=0;
   if(running()){if(!raf)raf=requestAnimationFrame(frame)}else stop();
   render();
  }
  function resize(){
   cssSize=Math.min(el!.clientWidth,el!.clientHeight);
   if(cssSize){const pixels=Math.max(1,Math.round(cssSize*Math.min(devicePixelRatio||1,2)));if(surface!.width!==pixels||surface!.height!==pixels){surface!.width=pixels;surface!.height=pixels}}
   sync();
  }
  function init(){
   try{
    gl=surface!.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
    if(!gl){showFallback();return}
    release();
    const compile=(type:number,source:string)=>{const shader=gl!.createShader(type);if(!shader)throw Error('Shader unavailable');shaders.push(shader);gl!.shaderSource(shader,source);gl!.compileShader(shader);if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS))throw Error(gl!.getShaderInfoLog(shader)||'Shader compilation failed');return shader};
    const vertex=compile(gl.VERTEX_SHADER,'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}');
    const precision=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT)?.precision?'highp':'mediump';
    const fragment=compile(gl.FRAGMENT_SHADER,satinOrbFragment.replace('precision highp float;',`precision ${precision} float;`));
    program=gl.createProgram();if(!program)throw Error('Program unavailable');gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Program link failed');gl.useProgram(program);
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const location=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
    uniforms=Object.fromEntries(['resolution','time','energy','dark'].map(name=>[name,gl!.getUniformLocation(program!,name)]));
    lost=false;el!.dataset.renderer='webgl';surface!.style.opacity='1';poster!.style.opacity='0';resize();
   }catch{release();showFallback()}
  }
  const contextLost=(event:Event)=>{event.preventDefault();lost=true;stop();showFallback()};
  const restored=()=>{if(!disposed)init()};
  surface.addEventListener('webglcontextlost',contextLost);surface.addEventListener('webglcontextrestored',restored);
  const observer=new ResizeObserver(resize);observer.observe(el);
  const intersection=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync()});intersection.observe(el);
  const themes=new MutationObserver(sync);if(theme)themes.observe(theme,{attributes:true,attributeFilter:['data-theme']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.addEventListener('resize',resize);
  resync.current=sync;init();sync();
  return()=>{disposed=true;stop();observer.disconnect();intersection.disconnect();themes.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);window.removeEventListener('resize',resize);surface.removeEventListener('webglcontextlost',contextLost);surface.removeEventListener('webglcontextrestored',restored);release();resync.current=()=>{}};
 },[]);
 useEffect(()=>resync.current(),[animated,readLevel]);
 return <span ref={host} className={styles.orb} style={{width:size,height:size}} data-theme={isDark===undefined?undefined:isDark?'dark':'light'} data-kontigo-orb="true" data-renderer="fallback" aria-hidden="true"><img ref={fallback} src="/work/kontigo/widgets/orb-light.png" alt=""/><canvas ref={canvas}/></span>;
}
