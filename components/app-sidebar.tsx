"use client";

import * as React from "react";
import {
  AudioWaveform,
  Search,
  Sparkles,
  Command,
  Info,
  GalleryVerticalEnd,
  HeartHandshake,
  RadioTower,
  Settings2,
  Factory,
  MapPin,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProject } from "@/components/nav-project";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import mgLogoWhite from "@/public/MG-LOGO-WHITE.png";
import mgLogoBlack from "@/public/MG-LOGO-BLACK.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ModeToggle";
import { ROUTES } from "@/lib/constants";

const data = {
  user: {
    name: "Ola Nordmann",
    email: "m@example.com",
    avatar: "/MG-LOGO-BLACK.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Meierier",
      url: ROUTES.HOME.path,
      icon: Factory,
    },
    {
      title: "Merkevarer",
      url: ROUTES.BRANDS.path,
      icon: Sparkles,
    },
    {
      title: "Meierikoder",
      url: ROUTES.DAIRYCODES.path,
      icon: Search,
    },
    {
      title: "Lokale meierier",
      url: ROUTES.LOCAL_DAIRIES.path,
      icon: MapPin,
    },
  ],
  project: [
    {
      name: "Om oss",
      url: ROUTES.ABOUT.path,
      icon: Info,
    },
    {
      name: "Media",
      url: ROUTES.MEDIA.path,
      icon: RadioTower,
    },
    {
      name: "Bidra",
      url: ROUTES.CONTRIBUTE.path,
      icon: HeartHandshake,
    },
    {
      name: "Innstillinger",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Lysmodus",
          url: "#",
          component: ModeToggle,
        },
        {
          title: "Språk",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = React.useState(mgLogoBlack);
  const isLightTheme = theme === "light" || resolvedTheme === "light";
  React.useEffect(() => {
    if (isLightTheme) {
      setImageSrc(mgLogoBlack);
    } else {
      setImageSrc(mgLogoWhite);
    }
  }, [isLightTheme]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center space-x-2">
                <Image src={imageSrc} alt="Meieriguiden" width={24} height={24} />

                <span className="truncate font-mono text-base">Meieriguiden.no</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProject project={data.project} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
