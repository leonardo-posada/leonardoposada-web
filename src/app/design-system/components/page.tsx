import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, Plus, Star } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import { TextArrow } from "@/components/ui/text-arrow";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const metadata: Metadata = {
  title: "Components · Design System",
};

function Example({
  title,
  code,
  children,
}: {
  title: string;
  code?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {code && (
          <CardDescription className="text-xs">{code}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md bg-muted p-6 flex flex-wrap items-center gap-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function StateRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-24 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <>
      {/* Button */}
      <div className="col-span-2 md:col-span-4">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Button
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example title="Variants" code='variant="default | secondary | outline | ghost | link"'>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </Example>

          <Example title="Sizes" code='size="sm | default | lg | icon"'>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add">
              <Plus weight="light" />
            </Button>
          </Example>

          <Example title="With icon">
            <Button>
              Continue
              <ArrowRight weight="light" />
            </Button>
            <Button variant="outline">
              <Check weight="light" />
              Confirm
            </Button>
          </Example>

          <Example title="Disabled">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
          </Example>
        </div>
      </div>

      {/* TextLink · Nav */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          TextLink · nav variant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example title="States" code="default · hover · active (pressed)">
            <div className="flex flex-col gap-4 w-full">
              <StateRow label="Default">
                <TextLink variant="nav" href="#">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Hover">
                <TextLink variant="nav" href="#" pseudo="hover">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Active">
                <TextLink variant="nav" href="#" pseudo="active">
                  Textlink
                </TextLink>
              </StateRow>
            </div>
          </Example>

          <Example title="Icon placement" code="no icon · leading · trailing">
            <div className="flex flex-col gap-4 w-full">
              <StateRow label="No icon">
                <TextLink variant="nav" href="#">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Leading icon">
                <TextLink
                  variant="nav"
                  href="#"
                  leadingIcon={<ArrowRight weight="light" className="size-4" />}
                >
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Trailing icon">
                <TextLink
                  variant="nav"
                  href="#"
                  trailingIcon={
                    <ArrowUpRight weight="light" className="size-4" />
                  }
                >
                  Textlink
                </TextLink>
              </StateRow>
            </div>
          </Example>
        </div>
      </div>

      {/* TextLink · Prominent */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          TextLink · prominent variant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example title="States" code="default · hover · active (pressed)">
            <div className="flex flex-col gap-4 w-full">
              <StateRow label="Default">
                <TextLink variant="prominent" href="#">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Hover">
                <TextLink variant="prominent" href="#" pseudo="hover">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Active">
                <TextLink variant="prominent" href="#" pseudo="active">
                  Textlink
                </TextLink>
              </StateRow>
            </div>
          </Example>

          <Example title="Icon placement" code="no icon · leading · trailing">
            <div className="flex flex-col gap-4 w-full">
              <StateRow label="No icon">
                <TextLink variant="prominent" href="#">
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Leading icon">
                <TextLink variant="prominent" href="#" leadingIcon={<TextArrow />}>
                  Textlink
                </TextLink>
              </StateRow>
              <StateRow label="Trailing icon">
                <TextLink
                  variant="prominent"
                  href="#"
                  trailingIcon={<TextArrow />}
                >
                  Textlink
                </TextLink>
              </StateRow>
            </div>
          </Example>
        </div>
      </div>

      {/* Badge */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Badge
        </h2>
        <Example title="Variants" code='variant="default | secondary | outline | muted"'>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="muted">Muted</Badge>
          <Badge variant="outline">
            <Star weight="light" />
            With icon
          </Badge>
        </Example>
      </div>

      {/* Card */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Card
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Full composition</CardTitle>
              <CardDescription>
                Header, content, and footer slots.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards use rounded-xl, bg-card, border, and p-6 padding.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Primary action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header-only</CardTitle>
              <CardDescription>
                Lightweight pattern used across the DS.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Dialog
        </h2>
        <Example title="Modal dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent className="p-6">
              <DialogTitle>Design system dialog</DialogTitle>
              <DialogDescription className="mt-2">
                Built on Radix. Close button is baked in. Overlay uses the
                dimmer convention (bg-foreground/24, no blur).
              </DialogDescription>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Example>
      </div>

      {/* Separator */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Separator
        </h2>
        <Example title="Horizontal">
          <div className="w-full">
            <p className="text-sm">Section one</p>
            <Separator className="my-3" />
            <p className="text-sm">Section two</p>
          </div>
        </Example>
      </div>

      {/* AspectRatio */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          AspectRatio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                16 / 9
              </div>
            </AspectRatio>
          </Card>
          <Card className="overflow-hidden">
            <AspectRatio ratio={4 / 3}>
              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                4 / 3
              </div>
            </AspectRatio>
          </Card>
          <Card className="overflow-hidden">
            <AspectRatio ratio={1}>
              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                1 / 1
              </div>
            </AspectRatio>
          </Card>
        </div>
      </div>
    </>
  );
}
