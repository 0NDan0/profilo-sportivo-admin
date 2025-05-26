/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/merge";
import { CloseIcon } from "../icons/icons";

type AnimatedDivProps = {
    clickablePart?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    showDiv?: boolean;
    setShowDiv?: (show: boolean) => void;
    navText?: string;
    onlyClose?: boolean;
    externalClassName?: string;
    doubleClick?: boolean;
};

const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  clickablePart,
  doubleClick,
  children,
  className,
  showDiv,
  setShowDiv,
  navText,
  externalClassName,
}) => {
  const [show, setShow] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);

  // Rileva tastiera
  useEffect(() => {
    const handleResize = () => {
      setKeyboardVisible(window.innerHeight < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Da prop esterna
  useEffect(() => {
    if (showDiv) {
      setShow(true);
    } else {
      setShow(false);
    }
    setShowDiv?.(false);
  }, [showDiv]);

  // Blocca scroll sotto
  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  const handleBackgroundClick = () => {
    if (doubleClick) {
      if (!clickedOnce) {
        setClickedOnce(true);
      } else {
        setShow(false);
        setShowDiv?.(false);
        setClickedOnce(false);
      }
    } else {
      setShow(false);
      setShowDiv?.(false);
    }
  };

  const handleOpen = () => {
    setShow(true);
    setClickedOnce(false); // reset se riapri
  };

  return (
    <div className={cn("relative", externalClassName)}>
      <div onClick={handleOpen}>{clickablePart}</div>

      {show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[200]"
          onClick={handleBackgroundClick}
        ></div>
      )}

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: show || keyboardVisible ? 0 : "100%" }}
        exit={{ y: "100%" }}
        transition={{ stiffness: 100, damping: 15 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-black text-white rounded-t-2xl shadow-lg z-[500] pt-[12px] px-[11px] min-h-40 flex items-center flex-col",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {navText ? (
          <div className="flex items-center justify-between pl-[20px] w-full pr-[11px]">
            <p className="text-[19px]">{navText}</p>
            <div
              onClick={() => {
                setShow(false);
                setShowDiv?.(false);
                setClickedOnce(false);
              }}
              className="cursor-pointer"
            >
              <CloseIcon width={42} height={42} />
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-5 w-full pb-[80px]">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedDiv;