export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string; // e.g., "2026-10-23"
  time: string; // e.g., "09:00 AM"
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2026",
    slug: "react-summit-us-2026",
    location: "New York, NY, USA",
    date: "2026-10-23",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "KubeCon + CloudNativeCon NA 2026",
    slug: "kubecon-cloudnativecon-na-2026",
    location: "Chicago, IL, USA",
    date: "2026-11-16",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "AWS re:Invent 2026",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV, USA",
    date: "2026-11-30",
    time: "08:30 AM",
  },
  {
    image: "/images/event4.png",
    title: "Next.js Conf 2026",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA, USA (Hybrid)",
    date: "2026-10-14",
    time: "09:30 AM",
  },
  {
    image: "/images/event5.png",
    title: "GitHub Universe 2026",
    slug: "github-universe-2026",
    location: "San Francisco, CA, USA",
    date: "2026-09-29",
    time: "09:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "ETHGlobal Hackathon: Bangkok 2026",
    slug: "ethglobal-bangkok-2026",
    location: "Bangkok, Thailand",
    date: "2026-08-08",
    time: "10:00 AM",
  },
  {
    image: "/images/event-full.png",
    title: "Open Source Summit North America 2026",
    slug: "oss-na-2026",
    location: "Vancouver, Canada",
    date: "2026-06-22",
    time: "09:00 AM",
  },
];

export default events;
