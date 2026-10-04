import { Hero } from "@/components/site/hero";
import { SelectedWork } from "@/components/site/selected-work";
import { ActiveProjectPill } from "@/components/site/active-project-pill";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <ActiveProjectPill />
    </>
  );
}
