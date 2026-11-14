"use client";

import Image from "next/image";
import welcomeLayout from "./investments/welcome-layout.json";
import { useEffect, useRef, useState } from "react";
import { KontigoMockupBackground } from "@/components/site/kontigo-mockup-background";
import { PhoneMockup } from "@/components/site/phone-mockup";
import { InvestmentsCoinCarousel } from "./investments/illustrations/investments-coin-carousel";
import { observeSceneVisibility } from "./investments/animations/observe-scene-visibility";
import styles from "./investment-widgets.module.css";

function RewardModel({ kind }: { kind: "koin" | "trophy" }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false, loading = false, active = false;
    let sync = () => {}, cleanup = () => {};
    const stop = observeSceneVisibility(element, visible => {
      active = visible;
      sync();
      if (!visible || loading) return;
      loading = true;
      void Promise.all([
        import("three"),
        kind === "koin" ? import("./investments/koin-lab/koin-v1-model").then(m => m.createKoinV1) : import("./investments/premios/trophy-model").then(m => m.createTrophy),
        fetch("/cards/kontigo-logomark.svg").then(r => { if (!r.ok) throw Error("Missing official mark"); return r.text(); }),
      ]).then(([THREE, createModel, svg]) => {
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, .1, 20);
        camera.position.set(0, kind === "trophy" ? .15 : 0, 4.3);
        camera.lookAt(0, kind === "trophy" ? -.03 : 0, 0);
        const model = createModel(renderer, svg);
        scene.environment = model.environment;
        scene.add(model.group, new THREE.AmbientLight(0xffffff, .45));
        const key = new THREE.DirectionalLight(0xfff4df, 2.2); key.position.set(-3, 4, 5);
        const fill = new THREE.DirectionalLight(0xe3ebff, .9); fill.position.set(4, -1, -4); scene.add(key, fill);
        element.appendChild(renderer.domElement);
        const resize = () => { renderer.setSize(element.clientWidth, element.clientHeight); };
        const observer = new ResizeObserver(resize); observer.observe(element); resize();
        const reduced = matchMedia("(prefers-reduced-motion: reduce)");
        let raf = 0, last = performance.now(), yaw = -.32;
        const frame = (now: number) => {
          raf = 0;
          if (!reduced.matches) yaw += Math.min((now - last) / 1000, .05) * (kind === "koin" ? .56 : .32);
          last = now;
          model.group.rotation.set(kind === "koin" ? -.3 : .1, yaw, kind === "koin" ? -.12 : 0);
          renderer.render(scene, camera);
          if (active && !reduced.matches) raf = requestAnimationFrame(frame);
        };
        sync = () => { cancelAnimationFrame(raf); raf = 0; if (active) { last = performance.now(); raf = requestAnimationFrame(frame); } };
        reduced.addEventListener("change", sync); sync();
        cleanup = () => { cancelAnimationFrame(raf); observer.disconnect(); reduced.removeEventListener("change", sync); model.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
      }).catch(() => { if (!disposed) setFailed(true); });
    });
    return () => { disposed = true; stop(); cleanup(); };
  }, [kind]);
  return <div ref={host} className={styles.model} role="img" aria-label={kind === "koin" ? "KOIN oficial girando en 3D" : "Trofeo oficial de Premios girando en 3D"}>{failed && <span className={styles.fallback}>{kind === "koin" ? "KOIN" : "Premios"}</span>}</div>;
}

export function KontigoRewardWidgets() {
  return <div className={styles.rewards} data-kontigo-rewards><KontigoMockupBackground /><div className={styles.pair}><RewardModel kind="koin" /><RewardModel kind="trophy" /></div></div>;
}

function InvestmentsWelcome() {
  return <div className={styles.screen} data-investments-welcome>
    <Image src="/work/kontigo/screens/investments-welcome-interface.png" alt="Bienvenido a Inversiones — pantalla original de Kontigo" fill sizes="(min-width: 1280px) 900px, 85vw" />
    <div className={styles.coinSlot} style={{left:welcomeLayout.x,top:welcomeLayout.y,width:welcomeLayout.width,height:welcomeLayout.height}}><InvestmentsCoinCarousel finish="gold" /></div>
  </div>;
}

export function KontigoInvestmentsPhone() {
  return <PhoneMockup hideCaption name="Kontigo · Bienvenido a Inversiones" variant="front" background="kontigo" outlineBackground framingScale={1.18} screenContent={<InvestmentsWelcome />} />;
}
