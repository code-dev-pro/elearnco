import React from "react";
import { motion } from "framer-motion";

const customEase = [0.6, -0.05, 0.01, 0.99];
const AnimatedFeedback = ({
  message,
  isVisible,
  duration = 0.5,
  onAnimationComplete,
}) => {
   
 
    return (
    <motion.div
      initial={{ opacity: 0, pointerEvents: "none" }}
      animate={isVisible ? { opacity: 1, pointerEvents: "auto", } : { opacity: 0 }}
      transition={{ duration: duration }}
      
      style={{
        position: "absolute",
        zIndex: 9999,
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
       
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Overlay */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            zIndex: 9998,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {/* Message */}
      <motion.div
        initial={{
          opacity: 0,
          transform: "translateX(-50%) translateY(200px)",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateX(-50%) translateY(0px)"
            : "translateX(-50%) translateY(200px)",
        }}
        transition={{ duration: duration, ease: customEase }}
        style={{
          position: "absolute",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "20px",
          zIndex: 9999,
          top: "50%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {message}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedFeedback;
