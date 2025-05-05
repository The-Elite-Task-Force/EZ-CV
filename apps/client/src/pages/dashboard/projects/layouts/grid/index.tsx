import { motion } from "framer-motion";

import { CreateProjectCard } from "./components/create-card";

export const ProjectsGridView = () => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateProjectCard />
      </motion.div>
    </div>
  );
};
