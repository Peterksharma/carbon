"use client";

import { clamp, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Head from "next/head";
import React, { useState } from "react";
import { Features, MacbookScroll } from "./components";

function Gradient() {
  const { scrollYProgress } = useScroll();

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  const style = {
    opacity: clamp(0, 1, progress * 4),
  };

  return (
    <div className="background" style={style}>
      <div className="gradient" />
    </div>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden">
      <MacbookScroll showGradient={true} />
    </section>
  );
}

function Overview() {
  return (
    <motion.section id="overview" className="relative" {...fadeIn}>
      <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
        <h2 className="nx-text-4xl font-semibold tracking-tighter lg:nx-text-5xl xl:nx-text-6xl lg:text-center dark:text-white">
          The{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-white  dark:to-white bg-clip-text text-transparent">
            open core
          </span>{" "}
          for your digital operations
        </h2>
        <p className="mx-auto mt-4 text-lg font-medium text-black/60 dark:text-white/60 lg:max-w-3xl lg:text-xl lg:text-center">
          Every business is unique. Carbon gives you the basic building blocks
          to build your own proprietary business systems with the best in
          modern, open-source software.
        </p>
        <Features showIcons />
      </div>
    </motion.section>
  );
}

function OpenSource() {
  return (
    <section id="open-source" className="relative">
      <div className="relative mt-20 border-t border-zinc-200 dark:border-zinc-900 bg-white/10 dark:bg-black/10 py-20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] dark:shadow-[inset_10px_-50px_94px_0_rgb(50,50,50,0.2)] backdrop-blur">
        <div className="mx-auto w-full lg:max-w-7xl px-2.5">
          <div className="mx-auto text-center">
            <h2 className="text-zinc-800 dark:text-white font-display text-4xl font-semibold leading-tight  sm:text-5xl sm:leading-tight tracking-tighter">
              Proudly Open Source
            </h2>
            <p className="mt-5 text-zinc-600 dark:text-zinc-300 sm:text-lg font-medium">
              Our source code is available on GitHub - feel free to use, modify,
              or contribute!
            </p>
          </div>
          <div className="flex items-center justify-center py-10">
            <a
              href="https://github.com/barbinbrad/carbon"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center">
                <div className="flex h-10 items-center space-x-2 rounded-md border border-zinc-600 dark:border-none bg-zinc-800 dark:bg-black p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                  <p className="font-medium text-white">Star</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Carbon ERP</title>
        <meta
          name="og:description"
          content="Carbon is an open-source, high-performance ERP"
        />
      </Head>

      <section>
        <Gradient />
        <Hero />
        <Overview />
        <OpenSource />
      </section>
    </>
  );
}

const fadeIn = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};
