import { motion } from "framer-motion";
import { cn } from "lib/utils";
import { GridItemProps } from "schemas";
import { variants } from "schemas/dashboard/const";

const GridItem = ({ size, children }: GridItemProps) => {
  return (
    <motion.div
      initial={{
        scale: 0.2,
        y: 120,
        opacity: 0,
      }}
      className={cn(
        variants({
          size,
          className: "bg-transparent",
        })
      )}
    >
      {children}
    </motion.div>
  );
};

export default GridItem;
