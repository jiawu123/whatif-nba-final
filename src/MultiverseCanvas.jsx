import React from "react";

const tokens = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 23) % 100}%`,
  top: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * -0.7}s`,
  size: `${10 + (index % 5) * 5}px`,
  spin: index % 2 === 0 ? "1" : "-1"
}));

export function MultiverseCanvas({ leftColor, rightColor, intensity }) {
  const glowOpacity = 0.28 + intensity * 0.24;
  const tokenOpacity = 0.24 + intensity * 0.18;
  const tokenDuration = `${9 - intensity * 2}s`;

  return (
    <div
      className="pixiLayer cssMotionLayer"
      style={{
        "--left-color": leftColor,
        "--right-color": rightColor,
        "--glow-opacity": glowOpacity,
        "--token-opacity": tokenOpacity,
        "--token-duration": tokenDuration
      }}
      aria-hidden="true"
    >
      <div className="courtGlow courtGlowLeft" />
      <div className="courtGlow courtGlowRight" />
      <div className="courtLines">
        <span />
        <span />
        <span />
        <span />
      </div>
      {tokens.map((token) => (
        <i
          key={token.id}
          className="floatToken"
          style={{
            "--x": token.left,
            "--y": token.top,
            "--delay": token.delay,
            "--size": token.size,
            "--spin": token.spin
          }}
        />
      ))}
    </div>
  );
}
