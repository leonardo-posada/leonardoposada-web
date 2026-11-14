import { Section } from './section';
import { DesktopMockup } from './desktop-mockup';
import { PhoneMockup } from './phone-mockup';
import { LuxuryMedia } from './luxury-motion';

export function KontigoWebsiteGallery() {
  return <Section className="pb-24 md:pb-32 [&_figcaption]:hidden">
    <div className="col-span-2 md:col-span-4"><LuxuryMedia>
      <DesktopMockup name="Kontigo Website · Splash" variant="front" fitFront background="kontigo" outlineBackground screen={{src:'/work/kontigo/screens/website-splash-6k.webp',alt:'Kontigo Website — splash de entrada'}} />
    </LuxuryMedia></div>
    <div className="col-span-2 md:col-span-2"><LuxuryMedia>
      <DesktopMockup name="Kontigo Website · Home" variant="front" fitFront background="kontigo" outlineBackground screen={{src:'/work/kontigo/screens/website-home-still-6k.webp',alt:'Kontigo Website — home desktop'}} />
    </LuxuryMedia></div>
    <div className="col-span-2 md:col-span-2"><LuxuryMedia>
      <PhoneMockup name="Kontigo Website · Mobile" variant="top-low" background="kontigo" perspectiveOutline screen={{src:'/work/kontigo/screens/website-home-mobile-no-banner.webp',alt:'Kontigo Website — home en mobile'}} />
    </LuxuryMedia></div>
    <div className="col-span-2 md:col-span-4"><LuxuryMedia>
      <DesktopMockup name="Kontigo Website · Depositar" variant="right" background="kontigo" outlineBackground fullResolution screen={{src:'/work/kontigo/screens/website-slide-deposit-500.webp',alt:'KontigoCash — sección Depositar con calculadora'}} />
    </LuxuryMedia></div>
  </Section>;
}
