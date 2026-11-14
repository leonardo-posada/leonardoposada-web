"use client";

import {useEffect,useId,useRef,useState} from 'react';
import {animate,motion,useInView,useMotionValue,useReducedMotion,useTransform,type MotionValue} from 'framer-motion';
import {Wallet,PiggyBank,CreditCard,CurrencyCircleDollar,Plus,Microphone} from '@phosphor-icons/react';
import {TatiOrb} from './tati-orb';
import {KontigoMockupBackground} from '@/components/site/kontigo-mockup-background';
import styles from './widget-showcase.module.css';

// Original Kontigo DS dock progress mapping, shared by navbar and composer.
const range=(p:number,start:number,end:number)=>{const t=Math.max(0,Math.min(1,(p-start)/(end-start)));return t*t*(3-2*t);};
const collapse=(p:number)=>range(p,0,.46)*(1-range(p,.46,1));
const WIDTH=448;

function DockItem({index,progress,children}:{index:number;progress:MotionValue<number>;children:React.ReactNode}){
  const slot=(WIDTH-88)/4;
  const offset=index===0?-(WIDTH/2-4-slot/2):index===1?-(32+slot/2):index===3?32+slot/2:index===4?WIDTH/2-4-slot/2:0;
  const x=useTransform(progress,p=>-offset*range(p,0,.46));
  const opacity=useTransform(progress,p=>1-range(p,index===2?.43:.03,index===2?.58:.30));
  const scale=useTransform(progress,[0,.3,.43,.56,1],index===2?[1,1,1.12,.65,.65]:[1,1,1,1,1]);
  return <motion.div className={styles.slot} style={{flex:index===2?'0 0 48px':1,x,opacity,scale}}>{children}</motion.div>;
}

function InputBorder(){
  const id=useId();
  return <svg className={styles.border} aria-hidden="true"><defs>
    <linearGradient id={`${id}-color`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#bd9ce9"/><stop offset=".5" stopColor="#ff8000"/><stop offset="1" stopColor="#bd9ce9"/></linearGradient>
    <filter id={`${id}-soft`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
    <mask id={`${id}-gap`} maskUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%"><rect className={`${styles.ring} ${styles.gap}`} pathLength={100} stroke="#fff" strokeWidth={16} filter={`url(#${id}-soft)`}/></mask>
  </defs><rect className={styles.ring} stroke={`url(#${id}-color)`} strokeWidth={1.5} mask={`url(#${id}-gap)`}/></svg>;
}

export function KontigoWidgetShowcase(){
  const host=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null);
  const inView=useInView(host,{amount:.15});
  const reduced=useReducedMotion();
  const [visible,setVisible]=useState(true);
  const progress=useMotionValue(0);
  useEffect(()=>{const sync=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',sync);return()=>document.removeEventListener('visibilitychange',sync);},[]);
  useEffect(()=>{
    const el=host.current!;
    const resize=()=>{if(world.current)world.current.style.transform=`translate(-50%,-50%) scale(${Math.min((el.clientWidth-32)/600,(el.clientHeight-24)/560)})`;};
    resize();const observer=new ResizeObserver(resize);observer.observe(el);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!inView||!visible||reduced)return;
    progress.set(0);
    const animation=animate(progress,[0,0,1,1,0,0],{duration:8.2,times:[0,.3,.4,.8,.9,1],ease:'linear',repeat:Infinity});
    return()=>animation.stop();
  },[inView,visible,reduced,progress]);
  const navInset=useTransform(progress,p=>(WIDTH-56)/2*collapse(p));
  const glassOpacity=useTransform(progress,p=>1-range(p,.4,.58));
  const halo=useTransform(progress,p=>range(p,.22,.44)*(1-range(p,.55,.82))*.35);
  const composerInset=useTransform(progress,p=>(WIDTH-88)/2*collapse(p));
  const composerOpacity=useTransform(progress,p=>range(p,.43,.58));
  const inputContentOpacity=useTransform(progress,p=>range(p,.64,.96));
  return <div id="kontigo-widgets" ref={host} data-kontigo-widgets data-theme="dark" className={styles.frame} role="img" aria-label="Widgets de Kontigo AI: esfera animada y navbar transformándose en input y de vuelta">
    <KontigoMockupBackground/>
    <div ref={world} className={styles.world}>
      <div className={styles.heroOrb}><TatiOrb size={420} isDark animated={inView&&visible}/></div>
      <div className={styles.dock} aria-hidden="true">
        <motion.div className={styles.capsule} style={{left:navInset,right:navInset,opacity:glassOpacity}}/>
        <motion.div className={styles.halo} style={{left:navInset,right:navInset,opacity:halo}}/>
        <div className={styles.items}>
          <DockItem index={0} progress={progress}><span className={`${styles.tab} ${styles.active}`}><Wallet size={24} weight="fill"/></span></DockItem>
          <DockItem index={1} progress={progress}><span className={styles.tab}><PiggyBank size={24} weight="fill"/></span></DockItem>
          <DockItem index={2} progress={progress}><span className={styles.tab}><TatiOrb size={48} isDark animated={inView&&visible}/></span></DockItem>
          <DockItem index={3} progress={progress}><span className={styles.tab}><CreditCard size={24} weight="fill"/></span></DockItem>
          <DockItem index={4} progress={progress}><span className={styles.tab}><CurrencyCircleDollar size={24} weight="fill"/></span></DockItem>
        </div>
        <motion.div className={styles.composer} style={{left:composerInset,right:composerInset,opacity:composerOpacity}}>
          <InputBorder/>
          <motion.div className={styles.inputContent} style={{opacity:inputContentOpacity}}>
            <span className={styles.attach}><Plus size={16} weight="light"/></span>
            <span className={styles.placeholder}>Pregunta a Tati</span>
            <Microphone size={20} weight="light"/>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </div>;
}
