"use client";

import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────── Mascot States ──────────────────────── */
type MascotMood = "idle" | "watching" | "curious" | "shocked" | "thinking" | "focused" | "celebrating";

interface MascotProps {
  currentStep: string;
}

function getMood(step: string): MascotMood {
  switch (step) {
    case "request": return "watching";
    case "response": return "curious";
    case "drift": return "shocked";
    case "cloud": return "thinking";
    case "patch": return "focused";
    case "done": return "celebrating";
    default: return "idle";
  }
}

const moodEmoji: Record<MascotMood, string> = {
  idle: "👋",
  watching: "👀",
  curious: "🤔",
  shocked: "😱",
  thinking: "🧠",
  focused: "🔧",
  celebrating: "🎉",
};

const moodColor: Record<MascotMood, string> = {
  idle: "from-purple-500/20 to-violet-500/20",
  watching: "from-blue-500/20 to-cyan-500/20",
  curious: "from-amber-500/20 to-yellow-500/20",
  shocked: "from-red-500/20 to-orange-500/20",
  thinking: "from-purple-500/30 to-violet-500/30",
  focused: "from-emerald-500/20 to-green-500/20",
  celebrating: "from-emerald-500/30 to-cyan-500/30",
};

const moodBorder: Record<MascotMood, string> = {
  idle: "border-purple-500/30",
  watching: "border-blue-500/30",
  curious: "border-amber-500/30",
  shocked: "border-red-500/40",
  thinking: "border-purple-500/40",
  focused: "border-emerald-500/30",
  celebrating: "border-emerald-500/50",
};

const moodGlow: Record<MascotMood, string> = {
  idle: "shadow-purple-500/10",
  watching: "shadow-blue-500/10",
  curious: "shadow-amber-500/10",
  shocked: "shadow-red-500/15",
  thinking: "shadow-purple-500/20",
  focused: "shadow-emerald-500/10",
  celebrating: "shadow-emerald-500/20",
};

/* Eye positions for different moods */
function Eyes({ mood }: { mood: MascotMood }) {
  // Shocked: wide open, centered
  if (mood === "shocked") {
    return (
      <div className="flex gap-2.5 justify-center mt-3">
        <motion.div
          className="h-3.5 w-3.5 rounded-full bg-white border border-white/30"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
        <motion.div
          className="h-3.5 w-3.5 rounded-full bg-white border border-white/30"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      </div>
    );
  }

  // Thinking: looking up-right
  if (mood === "thinking") {
    return (
      <div className="flex gap-2.5 justify-center mt-3">
        <div className="h-2.5 w-2 rounded-full bg-white relative">
          <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-white" />
        </div>
        <div className="h-2.5 w-2 rounded-full bg-white relative">
          <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
    );
  }

  // Default: blinking
  return (
    <div className="flex gap-2.5 justify-center mt-3">
      <motion.div
        className="h-2.5 w-2.5 rounded-full bg-white"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
      />
      <motion.div
        className="h-2.5 w-2.5 rounded-full bg-white"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
      />
    </div>
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === "shocked") {
    return (
      <motion.div
        className="mt-1 mx-auto h-2 w-2.5 rounded-full bg-white/70"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      />
    );
  }
  if (mood === "celebrating") {
    return (
      <motion.div className="mt-1 mx-auto" animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
        <svg className="h-2.5 w-3.5" viewBox="0 0 14 10" fill="none">
          <path d="M1 5C1 5 3 9 7 9C11 9 13 5 13 5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    );
  }
  // Default: small smile
  return (
    <div className="mt-1 mx-auto">
      <svg className="h-1.5 w-3" viewBox="0 0 12 6" fill="none">
        <path d="M1 5C1 5 3 1 6 1C9 1 11 5 11 5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SpeechBubble({ mood }: { mood: MascotMood }) {
  const phrases: Record<MascotMood, string> = {
    idle: "I'm watching your APIs!",
    watching: "A request? Let's see...",
    curious: "Hmm, what's the response?",
    shocked: "FIELD RENAMED! 😱",
    thinking: "AI on it... analyzing...",
    focused: "Patching in-memory...",
    celebrating: "All safe! No crash! 🎉",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.9 }}
      key={mood}
      className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-xl px-3 py-2 text-[10px] text-zinc-300 whitespace-nowrap font-medium shadow-lg"
    >
      {phrases[mood]}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2 w-2 bg-white/[0.08] border-r border-b border-white/[0.1] rotate-45" />
    </motion.div>
  );
}

export function PolyMascot({ currentStep }: MascotProps) {
  const mood = getMood(currentStep);

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <SpeechBubble mood={mood} />
      </AnimatePresence>

      {/* Hexagon body */}
      <motion.div
        className={`relative w-20 h-[72px] bg-gradient-to-br ${moodColor[mood]} border ${moodBorder[mood]} shadow-lg ${moodGlow[mood]} transition-all duration-500`}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
        animate={
          mood === "celebrating"
            ? { y: [0, -8, 0], rotate: [0, -5, 5, 0] }
            : mood === "shocked"
            ? { scale: [1, 1.05, 1] }
            : { y: [0, -3, 0] }
        }
        transition={
          mood === "celebrating"
            ? { repeat: Infinity, duration: 0.6 }
            : mood === "shocked"
            ? { repeat: Infinity, duration: 0.5 }
            : { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }
      >
        {/* Face inside hexagon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Eyes mood={mood} />
          <Mouth mood={mood} />
        </div>

        {/* Highlight */}
        <div className="absolute top-2 left-3 h-2 w-1.5 rounded-full bg-white/10 rotate-12" />
      </motion.div>

      {/* Little feet */}
      <div className="flex gap-4 mt-0.5">
        <motion.div
          className="h-1.5 w-2.5 rounded-full bg-white/15"
          animate={mood === "celebrating" ? { y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.3, repeatType: "reverse" }}
        />
        <motion.div
          className="h-1.5 w-2.5 rounded-full bg-white/15"
          animate={mood === "celebrating" ? { y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.3, repeatType: "reverse", delay: 0.15 }}
        />
      </div>

      {/* Name tag */}
      <span className="text-[9px] text-zinc-600 font-medium mt-1.5 tracking-wider uppercase">
        Poly
      </span>

      {/* Mood label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={mood}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          className="text-[9px] text-zinc-500 mt-0.5"
        >
          {moodEmoji[mood]} {mood}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
