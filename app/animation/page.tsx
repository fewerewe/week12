"use client";

import { useEffect, useRef, useState } from "react";
import basketballImage from "./assets/basketball.png";
import faceImage from "./assets/face.png";
import fieldImage from "./assets/field.jpg";
import footballImage from "./assets/football.png";
import volleyballImage from "./assets/volleyball.png";

type BallType = "none" | "basketball" | "football" | "volleyball" | "face";

type BallOption = {
  type: BallType;
  label: string;
  shortcut: string;
  image?: string;
};

type Motion = {
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
  angle: number;
  spin: number;
};

const balls: BallOption[] = [
  { type: "none", label: "None", shortcut: "1" },
  { type: "basketball", label: "Basketball", shortcut: "2", image: basketballImage.src },
  { type: "football", label: "Football", shortcut: "3", image: footballImage.src },
  { type: "volleyball", label: "Volleyball", shortcut: "4", image: volleyballImage.src },
  { type: "face", label: "Face", shortcut: "5", image: faceImage.src },
];

const ballDiameter = 100;

export default function AnimationPage() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({
    x: 0,
    y: 0,
    xDirection: 1,
    yDirection: 1,
    angle: 0,
    spin: 0,
  });
  const [fieldSize, setFieldSize] = useState({ width: 640, height: 480 });
  const [running, setRunning] = useState(false);
  const [ballType, setBallType] = useState<BallType>("none");
  const [position, setPosition] = useState({ x: 0, y: 0, angle: 0 });

  const size = Math.min(ballDiameter, fieldSize.width, fieldSize.height);
  const xMax = Math.max(0, fieldSize.width - size);
  const yMax = Math.max(0, fieldSize.height - size);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const updateSize = () => {
      setFieldSize({
        width: field.clientWidth,
        height: field.clientHeight,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        setRunning((current) => !current);
      } else {
        const ball = balls.find((option) => option.shortcut === event.key);
        if (ball) setBallType(ball.type);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!running || fieldSize.width === 0 || fieldSize.height === 0) return;

    let frameId = 0;
    let previousTime = 0;

    const animate = (time: number) => {
      if (previousTime !== 0) {
        const delta = Math.min((time - previousTime) / 1000, 0.05);
        const current = motion.current;
        current.x += current.xDirection * 70.7 * delta;
        current.y += current.yDirection * 70.7 * delta;

        let hitEdge = false;
        if (current.x >= xMax || current.x <= 0) {
          current.x = Math.max(0, Math.min(current.x, xMax));
          current.xDirection *= -1;
          hitEdge = true;
        }
        if (current.y >= yMax || current.y <= 0) {
          current.y = Math.max(0, Math.min(current.y, yMax));
          current.yDirection *= -1;
          hitEdge = true;
        }
        if (hitEdge) {
          current.spin = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 4);
        }

        current.angle += current.spin * delta * 25;
        setPosition({ x: current.x, y: current.y, angle: current.angle });
      }

      previousTime = time;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [running, fieldSize.height, fieldSize.width, xMax, yMax]);

  const selectedBall = balls.find((ball) => ball.type === ballType) ?? balls[0];

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-5 text-center text-3xl font-bold text-gray-900">
        ANIMATION
      </h1>

      <div
        ref={fieldRef}
        className="relative mx-auto aspect-[4/3] w-full max-w-[640px] overflow-hidden rounded-lg border-4 border-gray-900 bg-cover bg-center"
        style={{ backgroundImage: `url(${fieldImage.src})` }}
        aria-label="Animation field"
      >
        <div
          className="absolute rounded-full border border-black bg-cover bg-center"
          style={{
            left: position.x,
            top: position.y,
            width: size,
            height: size,
            backgroundColor: selectedBall.image ? "white" : "lightblue",
            backgroundImage: selectedBall.image
              ? `url(${selectedBall.image})`
              : "none",
            transform: `rotate(${position.angle}deg)`,
          }}
        />
      </div>

      <div className="mx-auto mt-3 flex max-w-[640px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          aria-pressed={running}
          onClick={() => setRunning((current) => !current)}
          className={`rounded-lg px-5 py-3 text-lg font-semibold text-white transition ${
            running
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {running ? "Pause" : "Play"}
        </button>

        <div className="flex flex-wrap gap-2">
          {balls.map((ball) => (
            <button
              key={ball.type}
              type="button"
              aria-pressed={ballType === ball.type}
              onClick={() => setBallType(ball.type)}
              className={`rounded-lg border px-3 py-2 font-medium transition ${
                ballType === ball.type
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {ball.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-sm text-gray-500">
        Space: play/pause · 1–5: select a ball
      </p>
    </section>
  );
}
