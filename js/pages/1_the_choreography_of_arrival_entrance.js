window.PAGES = window.PAGES || {};
window.PAGES['1_the_choreography_of_arrival_entrance'] = () => `
# 1. The Choreography of Arrival (Entrance)
Instead of a sudden pop-in or a basic slide-up, elements should manifest through a "blurred focal reveal." This mimics how the human eye adjusts to light and depth, lowering cognitive load.
*   **Initial State:** Pushed back in Z-space (scale 0.95), dropped slightly on the Y-axis (30px), with a 10px Gaussian blur.
*   **Animation:** Staggered sequence (60ms between each card) pulling them forward into absolute clarity.
*   **The Physics:** \`type: "spring", mass: 0.8, stiffness: 200, damping: 22\` (This creates a crisp, damp landing with zero lingering wobble).

### 2. The Reactive Canvas (Spotlight & Dimming)
When a user hovers over a specific section (e.g., HPI or ROS), the interface should acknowledge their intent.
*   **Spotlight Reveal:** A subtle, dynamic radial gradient tracks the user's cursor *inside* the card's border, revealing a premium shimmer effect.
*   **Focus Mode (Sibling Dimming):** When one card is hovered, the surrounding cards subtly recess back into the canvas (scale: 0.98, opacity: 0.5, blur: 1px). This naturally guides the physician's eye to the active section.

### 3. Magnetic Affordance (Action Buttons)
Inside the cards, actionable icons (like "Edit" or "Expand") shouldn't just change color. They should feature a magnetic pull. When the cursor gets within 20px of the button, the button subtly translates toward the cursor, creating an irresistible tactile pull.

---

### The Implementation Spec (React + Framer Motion + Tailwind)

\`\`\`tsx
import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// --- Physics Constants ---
const SPRINGS = {
  entrance: { type: "spring", mass: 0.8, stiffness: 200, damping: 22 },
  hover: { type: "spring", mass: 0.5, stiffness: 400, damping: 30 },
  tap: { type: "spring", mass: 0.4, stiffness: 500, damping: 25 },
};

const TEMPLATE_SECTIONS = [
  { id: "cc", title: "Chief Complaint", summary: "Patient reports sudden onset of sharp chest pain." },
  { id: "hpi", title: "History of Present Illness", summary: "Pain started 2 hours ago, radiating to left arm. No shortness of breath." },
  { id: "ros", title: "Review of Systems", summary: "Cardiovascular: Positive for chest pain. Negative for palpitations." },
  { id: "vitals", title: "Vitals", summary: "BP: 140/90, HR: 98, Temp: 98.6°F, SpO2: 99%" },
  { id: "pe", title: "Physical Exam", summary: "Heart: Regular rate and rhythm. Lungs: Clear to auscultation bilaterally." },
];

export default function TemplatePreview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-12 text-slate-200 font-sans flex justify-center">
      <motion.div 
        className="w-full max-w-2xl flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-medium tracking-tight text-white mb-2"
            initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={SPRINGS.entrance}
          >
            Clinical Encounter
          </motion.h1>
          <motion.p 
            className="text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Template Preview • Internal Medicine
          </motion.p>
        </div>

        {TEMPLATE_SECTIONS.map((section, index) => {
          const isHovered = hoveredIndex === index;
          const isAnotherHovered = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <motion.div
              key={section.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
                visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
              }}
              transition={SPRINGS.entrance}
              animate={{
                scale: isHovered ? 1.02 : isAnotherHovered ? 0.98 : 1,
                opacity: isAnotherHovered ? 0.4 : 1,
                filter: isAnotherHovered ? "blur(2px)" : "blur(0px)",
              }}
              className="relative group w-full"
            >
              <InteractiveCard title={section.title} summary={section.summary} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function InteractiveCard({ title, summary }: { title: string; summary: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98, transition: SPRINGS.tap }}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/5 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
    >
      {/* Dynamic Cursor Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate\`
            radial-gradient(
              400px circle at \${mouseX}px \${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          \`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 tracking-wide uppercase mb-2">
            {title}
          </h3>
          <p className="text-slate-400 text-base leading-relaxed">
            {summary}
          </p>
        </div>
        
        {/* Magnetic Action Icon */}
        <MagneticButton>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </MagneticButton>
      </div>
    </motion.div>
  );
}

// Magnetic Button Component for cutting-edge tactile feel
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 }); // 0.2 governs the strength of the magnetic pull
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
      className="p-2 -m-2" // Expand hit area
    >
      {children}
    </motion.div>
  );
}
\`\`\`

### Why this specific design system works for Medical UI:
1. **The Depth Mapping (\`scale\` & \`blur\`)**: By scaling sibling elements down to \`0.98\` and applying a \`2px blur\` when a physician hovers over a specific card, we use spatial mechanics to direct focus. It reduces visual noise precisely when the user needs to concentrate on reading a dense block of text.
2. **The Spotlight (\`useMotionTemplate\`)**: The subtle radial gradient mapped to \`mouseX\`/\`mouseY\` provides immediate, localized feedback. It removes the need for heavy, jarring background color changes on hover, maintaining a sterile, premium aesthetic.
3. **The Physics Payload (\`damping: 22, stiffness: 200\`)**: Standard CSS \`ease-in-out\` feels lifeless and robotic. Framer Motion springs respect momentum. The high stiffness combined with moderate damping means the UI reacts instantly but settles gracefully without feeling like a toy.
</SYSTEM_MESSAGE>
`;
