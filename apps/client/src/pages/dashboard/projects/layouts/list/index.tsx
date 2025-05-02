import { motion } from "framer-motion";

import { CreateProjectListItem } from "./components/create-item";

export const ProjectListView = () => {
  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateProjectListItem />
      </motion.div>
    </div>
  );
};
