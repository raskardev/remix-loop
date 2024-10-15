import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles.css?url";
import geistMono from "./fonts/GeistMonoVF.woff?url";
import geistSans from "./fonts/GeistVF.woff?url";

export const meta: MetaFunction = () => {
  return [
    { title: "Loop" },
    { description: "Loop the store for modern people" },
    {
      keywords: [
        "clothes",
        "clothing",
        "modern",
        "women",
        "men",
        "shopping",
        "online",
        "store",
        "shop",
        "fashion",
        "style",
        "trends",
      ],
    },
    {
      authors: [
        {
          name: "Alejandro Vidal",
          url: "https://github.com/alevidals",
        },
      ],
    },
    { creator: "Alejandro Vidal" },
    {
      property: "og:image",
      content: "/og.png",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: geistSans },
  { rel: "stylesheet", href: geistMono },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased text-white dark mx-12">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
