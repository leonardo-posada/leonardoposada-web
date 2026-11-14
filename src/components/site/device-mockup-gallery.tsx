import type { Project } from "@/lib/site";
import { PhoneMockup } from "./phone-mockup";
import { DesktopMockup } from "./desktop-mockup";

export function DeviceMockupGallery({ name, config }: {
  name: string;
  config: NonNullable<Project["desktopMockup"]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8">
      <DesktopMockup name={name} screen={config.screen} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <DesktopMockup name={name} variant="front" screen={config.frontScreen} />
        <DesktopMockup name={name} variant="right-tilted" screen={config.rightTiltedScreen} />
      </div>
      <DesktopMockup name={name} variant="right" screen={config.rightScreen} />
      {/* Sharp silhouette remains in the catalog and assets for future reuse. */}
      <DesktopMockup name={name} variant="left-silhouette-soft-light" screen={config.leftSilhouetteSoftLightScreen} />
      <PhoneMockup name={name} screen={config.phoneScreen} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <PhoneMockup name={name} variant="top" screen={config.phoneTopScreen} />
        <PhoneMockup name={name} variant="right" screen={config.phoneRightScreen} />
        <PhoneMockup name={name} variant="top-low" screen={config.phoneTopLowScreen} />
        <PhoneMockup name={name} variant="left" screen={config.phoneLeftScreen} />
      </div>
    </div>
  );
}
