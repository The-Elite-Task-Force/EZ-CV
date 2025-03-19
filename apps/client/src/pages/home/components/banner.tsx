/* eslint-disable lingui/no-unlocalized-strings */

import { GithubLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export const Banner = () => (
  <motion.a
    href="https://github.com/The-Elite-Task-Force/EZ-CV/discussions"
    target="_blank"
    whileHover={{ height: 48 }}
    initial={{ opacity: 0, y: -50, height: 32 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
    className="hidden w-screen items-center justify-center gap-x-2 bg-zinc-800 text-xs font-bold leading-relaxed text-red-500 lg:flex"
  >
    <GithubLogo weight="bold" size={14} className="shrink-0" />
    <span>
      Please be aware this version is in beta State. All data will be potentialy lost when the final
      version is released. Click here to join the discussion.
    </span>
  </motion.a>
);
