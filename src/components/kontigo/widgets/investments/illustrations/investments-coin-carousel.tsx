"use client";

import { useEffect, useRef, useState } from "react";
import { observeSceneVisibility } from "../animations/observe-scene-visibility";
import styles from "./investments-coin-carousel.module.css";

const tickers = ["AAPL", "BTC", "NVDA", "ETH", "TSLA", "SOL", "AMZN", "USDC", "NFLX", "COIN"];
let sources: Promise<string[]> | undefined;
function loadSources() {
  sources ??= Promise.all(["/cards/kontigo-logomark.svg", ...tickers.map(t=>`/investments/coin-marks/${t}.svg`)].map(async url=>{
    const response=await fetch(url);if(!response.ok)throw new Error(`Unable to load ${url}`);return response.text();
  })).catch(error=>{sources=undefined;throw error;});
  return sources;
}

export function InvestmentsCoinCarousel({ finish = "gold" }: { finish?: "gold" | "silver" | "reference" }) {
  const host=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const element=host.current,surface=canvas.current;if(!element||!surface)return;
    let disposed=false,loading=false,visible=false;
    let scene: ReturnType<typeof import("./investments-coin-carousel-scene").createInvestmentCoinCarousel> | undefined;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync=async()=>{
      scene?.setActive(visible);
      if(disposed||loading||scene||!visible)return;
      loading=true;
      try {
        const [module,[mark,...logos]]=await Promise.all([import("./investments-coin-carousel-scene"),loadSources()]);
        if(disposed||!visible)return;
        scene=module.createInvestmentCoinCarousel(surface,mark,logos,{
          finish,
          reducedMotion:motion.matches,
          onReady:()=>{element.dataset.ready="true";},
          onError:()=>{if(!disposed)setFailed(true);},
        });
        scene.setActive(visible);
      }catch{if(!disposed)setFailed(true);}finally{loading=false;}
    };
    const stop=observeSceneVisibility(element,value=>{visible=value;void sync();});
    const change=()=>scene?.setReducedMotion(motion.matches);
    motion.addEventListener("change",change);
    return()=>{disposed=true;stop();motion.removeEventListener("change",change);scene?.dispose();};
  },[finish]);
  return <div ref={host} className={styles.art} data-investment-coins data-finish={finish} role="group" aria-label="Carrusel de monedas de Apple, Bitcoin, NVIDIA, Ethereum, Tesla, Solana, Amazon, USDc, Netflix y Coinbase">
    <canvas ref={canvas} className={styles.canvas} tabIndex={0} data-no-tab-swipe="true" aria-label="Girar monedas: arrastra horizontalmente o usa las flechas izquierda y derecha" />
    {failed && <div className={styles.fallback} aria-hidden="true">{tickers.map(t=><span key={t}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/investments/coin-marks/${t}.svg`} alt="" /></span>)}</div>}
  </div>;
}
