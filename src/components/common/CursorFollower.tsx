import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CursorFollower: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse coordinates for immediate precise center dot
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer targeting halo
  const springConfig = { damping: 25, stiffness: 260, mass: 0.5 };
  const haloX = useSpring(mouseX, springConfig);
  const haloY = useSpring(mouseY, springConfig);

  // Smooth trailing ambient glow
  const ambientConfig = { damping: 35, stiffness: 100, mass: 1 };
  const ambientX = useSpring(mouseX, ambientConfig);
  const ambientY = useSpring(mouseY, ambientConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if device uses fine pointer (mouse / trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect hover on clickable/interactive items
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, .cursor-pointer, .glass-card, .leaflet-interactive, .leaflet-control, summary'
        );
        setIsHovered(!!interactive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Ambient soft glow trailer */}
      <motion.div
        style={{
          x: ambientX,
          y: ambientY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-72 h-72 rounded-full bg-amber-500/[0.035] blur-3xl pointer-events-none"
      />

      {/* Smooth outer tactical ring */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'rgba(20, 184, 166, 0.75)' : 'rgba(245, 158, 11, 0.45)',
          backgroundColor: isHovered ? 'rgba(20, 184, 166, 0.08)' : 'rgba(245, 158, 11, 0.02)',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="absolute w-8 h-8 rounded-full border border-amber-400/40 pointer-events-none flex items-center justify-center backdrop-blur-[0.5px] shadow-[0_0_12px_rgba(0,0,0,0.4)]"
      >
        {/* Targeting notch indicators when hovering interactive targets */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 45 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full absolute inset-0 border border-dashed border-teal-400/40 rounded-sm"
          />
        )}
      </motion.div>

      {/* Immediate center laser point */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.65 : isHovered ? 1.3 : 1,
          backgroundColor: isHovered ? '#2dd4bf' : '#fbbf24',
          boxShadow: isHovered
            ? '0 0 10px rgba(45, 212, 191, 0.9)'
            : '0 0 8px rgba(251, 191, 36, 0.85)',
        }}
        transition={{ duration: 0.1 }}
        className="absolute w-2 h-2 rounded-full pointer-events-none"
      />
    </div>
  );
};
