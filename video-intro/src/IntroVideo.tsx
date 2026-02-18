import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ===== COLOR PALETTE (Neo-Brutalist) =====
const COLORS = {
  bg: "#1a1a2e",
  primary: "#66d9ef",
  secondary: "#ffd93d",
  accent: "#a8e6cf",
  pink: "#ff6b9d",
  orange: "#ff8c00",
  white: "#f8f8f2",
  border: "#e8e8e8",
};

// ===== SCENE 1: GLITCH NAME REVEAL =====
const NameReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitchChars = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const name = "KAUSHIK REDDY";

  const revealProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayName = name
    .split("")
    .map((char, i) => {
      const charProgress = interpolate(
        revealProgress,
        [i / name.length, (i + 1) / name.length],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      if (char === " ") return " ";
      if (charProgress < 1) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    })
    .join("");

  const nameOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 80 } });

  const lineWidth = interpolate(frame, [55, 75], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          zIndex: 2,
        }}
      />

      {/* Floating grid */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${COLORS.primary}15 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.primary}15 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: interpolate(frame, [0, 20], [0, 0.5], {
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [0, 90], [20, -20])}px)`,
        }}
      />

      {/* Name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `scale(${nameScale})`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 110,
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: "0.05em",
          textShadow: `0 0 40px ${COLORS.primary}80, 0 0 80px ${COLORS.primary}40`,
          zIndex: 3,
        }}
      >
        {displayName}
      </div>

      {/* Underline */}
      <div
        style={{
          width: lineWidth,
          height: 6,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
          marginTop: 15,
          borderRadius: 3,
          boxShadow: `0 0 20px ${COLORS.primary}80`,
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};

// ===== SCENE 2: TITLE & TAGLINE =====
const TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [15, 30], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}30, transparent 70%)`,
          left: "10%",
          top: "20%",
          filter: "blur(60px)",
          transform: `scale(${1 + Math.sin(frame * 0.05) * 0.1})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.secondary}25, transparent 70%)`,
          right: "15%",
          bottom: "25%",
          filter: "blur(60px)",
          transform: `scale(${1 + Math.cos(frame * 0.05) * 0.1})`,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 2 }}>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 70,
            fontWeight: 800,
            color: COLORS.secondary,
            transform: `scale(${titleSpring})`,
            textShadow: `0 0 30px ${COLORS.secondary}60`,
          }}
        >
          Data Analyst & AI Engineer
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.white,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginTop: 25,
            letterSpacing: "0.1em",
          }}
        >
          HIGH-PERFORMANCE SYSTEMS / GENERATIVE AI / PREDICTIVE ANALYTICS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===== SCENE 3: SKILLS FLYING IN =====
const SkillsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const skills = [
    { name: "Python", color: COLORS.primary, icon: "🐍" },
    { name: "Rust", color: COLORS.orange, icon: "⚙️" },
    { name: "React", color: COLORS.primary, icon: "⚛️" },
    { name: "Gen AI", color: COLORS.secondary, icon: "🤖" },
    { name: "PyTorch", color: COLORS.pink, icon: "🔥" },
    { name: "FastAPI", color: COLORS.accent, icon: "⚡" },
    { name: "Docker", color: COLORS.primary, icon: "🐳" },
    { name: "AWS", color: COLORS.orange, icon: "☁️" },
    { name: "Voice AI", color: COLORS.pink, icon: "🎙️" },
    { name: "MLOps", color: COLORS.accent, icon: "♾️" },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          fontFamily: "system-ui, sans-serif",
          fontSize: 50,
          fontWeight: 800,
          color: COLORS.white,
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        TECH STACK
      </div>

      {/* Skill badges */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: 1200,
          marginTop: 60,
        }}
      >
        {skills.map((skill, i) => {
          const delay = i * 4;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 10, stiffness: 120 },
          });
          const rotation = interpolate(frame - delay, [0, 10], [-15, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={skill.name}
              style={{
                background: skill.color,
                color: "#000",
                fontFamily: "system-ui, sans-serif",
                fontSize: 30,
                fontWeight: 700,
                padding: "18px 35px",
                border: "4px solid #000",
                boxShadow: "6px 6px 0 #000",
                transform: `scale(${s}) rotate(${rotation}deg)`,
                borderRadius: 4,
              }}
            >
              {skill.icon} {skill.name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===== SCENE 4: PROJECT HIGHLIGHTS =====
const ProjectHighlights: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const projects = [
    { name: "Thrill AI", desc: "Voice-First Hospitality OS", color: COLORS.primary },
    { name: "Aegis", desc: "Zero-Trust Security Framework", color: COLORS.secondary },
    { name: "SwasthyaSahayak", desc: "AI Medical Triage", color: COLORS.accent },
    { name: "Nano", desc: "Voice Financial OS for India", color: COLORS.pink },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 80,
          fontFamily: "system-ui, sans-serif",
          fontSize: 50,
          fontWeight: 800,
          color: COLORS.white,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        FEATURED PROJECTS
      </div>

      <div style={{ display: "flex", gap: 30, marginTop: 60 }}>
        {projects.map((project, i) => {
          const delay = i * 8;
          const slideX = interpolate(frame - delay, [0, 15], [200, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={project.name}
              style={{
                width: 350,
                padding: 35,
                background: "#16213e",
                border: `4px solid ${project.color}`,
                boxShadow: `8px 8px 0 ${project.color}50`,
                borderRadius: 4,
                opacity,
                transform: `translateX(${slideX}px) scale(${scale})`,
              }}
            >
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: project.color,
                  marginBottom: 10,
                }}
              >
                {project.name}
              </div>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 22,
                  color: COLORS.white,
                  opacity: 0.8,
                }}
              >
                {project.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===== SCENE 5: CALL TO ACTION =====
const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });

  const ctaOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [20, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseGlow = Math.sin(frame * 0.15) * 20 + 40;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}20, transparent 70%)`,
          filter: `blur(${pulseGlow}px)`,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 2 }}>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 90,
            fontWeight: 900,
            color: COLORS.white,
            transform: `scale(${nameScale})`,
            textShadow: `0 0 ${pulseGlow}px ${COLORS.primary}60`,
          }}
        >
          KAUSHIK REDDY
        </div>

        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 30,
            color: COLORS.secondary,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            marginTop: 20,
            letterSpacing: "0.15em",
          }}
        >
          LET'S BUILD SOMETHING AMAZING
        </div>

        {/* CTA button */}
        <div
          style={{
            display: "inline-block",
            marginTop: 40,
            padding: "20px 50px",
            background: COLORS.primary,
            color: "#000",
            fontFamily: "system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            border: "4px solid #000",
            boxShadow: "6px 6px 0 #000",
            borderRadius: 4,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          kaushikreddy.me
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===== MAIN COMPOSITION =====
export const IntroVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Scene 1: Name Reveal (0-90 frames = 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <NameReveal />
      </Sequence>

      {/* Scene 2: Title (90-150 frames = 3-5s) */}
      <Sequence from={90} durationInFrames={60}>
        <TitleReveal />
      </Sequence>

      {/* Scene 3: Skills (150-210 frames = 5-7s) */}
      <Sequence from={150} durationInFrames={60}>
        <SkillsShowcase />
      </Sequence>

      {/* Scene 4: Projects (210-270 frames = 7-9s) */}
      <Sequence from={210} durationInFrames={60}>
        <ProjectHighlights />
      </Sequence>

      {/* Scene 5: CTA (270-300 frames = 9-10s) */}
      <Sequence from={270} durationInFrames={30}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
