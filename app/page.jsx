"use client";

import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

const steps = [
  { id: "home", type: "screen", image: "/home.jpg" },
  { id: "intro", type: "screen", image: "/intro.jpg" },
  {
    id: "q1",
    type: "question",
    image: "/1.jpg",
    choices: [
      { id: "A", label: "Create my own peaceful home cafe moment with soft music and quiet to center my energy" },
      { id: "B", label: "Start my day with energetic playlist" },
      { id: "C", label: "Text my friends to see who's free to hang out today" },
      { id: "D", label: "Write down journal to start the day" }
    ]
  },
  {
    id: "q2",
    type: "question",
    image: "/2.jpg",
    choices: [
      { id: "A", label: "Enjoy the silence. It's a chance to be present" },
      { id: "B", label: "Going back home, I need my hype playlist" },
      { id: "C", label: "Make a mini podcast by voice-recording a message to my friends" },
      { id: "D", label: "Listen to nearby gossip" }
    ]
  },
  {
    id: "q3",
    type: "question",
    image: "/3.jpg",
    choices: [
      { id: "A", label: "Pausing in a quiet spot to breathe and reset" },
      { id: "B", label: "Soaking in the city's energy from crowds to noise" },
      { id: "C", label: "Chatting with sellers at a random grocery store" },
      { id: "D", label: "Heading straight to a pop-up I spotted nearby" }
    ]
  },
  {
    id: "q4",
    type: "question",
    image: "/4.jpg",
    choices: [
      { id: "A", label: "A light and fresh meal" },
      { id: "B", label: "Something new I've never tried" },
      { id: "C", label: "My comfort restaurant" },
      { id: "D", label: "The trending place everyone is talking about" }
    ]
  },
  {
    id: "q5",
    type: "question",
    image: "/5.jpg",
    choices: [
      { id: "A", label: "Find a quiet spot with a book to unwind" },
      { id: "B", label: "Go kart to boost my adrenaline" },
      { id: "C", label: "Grab snacks and chill with friends" },
      { id: "D", label: "Switch into creative mode" }
    ]
  },
  {
    id: "q6",
    type: "question",
    image: "/6.jpg",
    choices: [
      { id: "A", label: "\"Hmm... honestly I just want a cozy night in.\"" },
      { id: "B", label: "\"I'm picking an outfit already\"" },
      { id: "C", label: "\"If it's with my people then I'm down\"" },
      { id: "D", label: "\"I want to know the vibe because I might want something new\"" }
    ]
  },
  {
    id: "q7",
    type: "question",
    image: "/7.jpg",
    choices: [
      { id: "A", label: "Gently avoid the interaction" },
      { id: "B", label: "Respond quickly" },
      { id: "C", label: "Friendly conversation" },
      { id: "D", label: "Try to guess what they want before they even say it" }
    ]
  },
  {
    id: "q8",
    type: "question",
    image: "/8.jpg",
    choices: [
      { id: "A", label: "Curl up with peace and blankets" },
      { id: "B", label: "Do a quick dance challenge" },
      { id: "C", label: "Have a late-night snack" },
      { id: "D", label: "Scroll TikTok for something inspiring" }
    ]
  },
  { id: "result", type: "result", image: null }
];

const questionCount = steps.filter((s) => s.type === "question").length;

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const sparkleCtrl = useRef(null);
  const sceneRef = useRef(null);

  const winner = useMemo(() => {
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = entries[0][1];
    const list = entries.filter(([, v]) => v === top).map(([k]) => k);
    return list[0] || "A";
  }, [scores]);

  const step = steps[current];
  const bgImage = step.type === "result" ? `/${winner}.jpg` : step.image;

  useEffect(() => {
    const urls = new Set();
    steps.forEach((s) => {
      if (s.type === "question" && s.image) urls.add(s.image);
    });
    ["/A.jpg", "/B.jpg", "/C.jpg", "/D.jpg"].forEach((u) => urls.add(u));
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    gsap.fromTo(
      sceneRef.current,
      { opacity: 0, scale: 1.01 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
    if (sparkleCtrl.current) {
      const mode = step.id === "home" ? "home" : step.id === "intro" ? "intro" : "none";
      sparkleCtrl.current.setMode(mode);
    }
  }, [current, step]);

  function choose(id, evt) {
    const nextStep = steps[current + 1];
    if (nextStep?.image) {
      const img = new Image();
      img.src = nextStep.image;
    }
    setScores((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const rect = evt?.currentTarget?.getBoundingClientRect();
    if (rect && sparkleCtrl.current) {
      sparkleCtrl.current.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function resetGame() {
    setScores({ A: 0, B: 0, C: 0, D: 0 });
    setCurrent(0);
  }

  async function shareResult() {
    const url = `/${winner}.jpg`;
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], `${winner}.jpg`, { type: blob.type || "image/jpeg" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My result",
          text: "Try this quiz!"
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "My result",
          text: "Try this quiz!",
          url
        });
      } else {
        alert(`Sharing not supported here. Save this image instead: ${url}`);
      }
    } catch (err) {
      console.error(err);
      alert("Share failed. Please try again.");
    }
  }

  function handleScreenClick() {
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  }

  const paddingClass =
    step.id === "q1"
      ? "pb-12"
      : step.id === "q2" || step.id === "q7"
      ? "pb-28"
      : step.id === "q6"
      ? "pb-24"
      : "pb-32";

  const answeredQuestions = steps.slice(0, current).filter((s) => s.type === "question").length;
  const progressRaw =
    step.type === "question"
      ? (answeredQuestions + 1) / questionCount
      : step.type === "result"
      ? 1
      : answeredQuestions / questionCount;
  const progress = Math.max(0, Math.min(1, progressRaw));

  return (
    <div className="relative min-h-screen">
      <SparkleCanvas ref={sparkleCtrl} />
      <TrailCanvas />
      <div className="grain" />
      <div
        ref={sceneRef}
        className="scene"
        onClick={step.type === "screen" ? handleScreenClick : undefined}
      >
        <div
          className="bg"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="aurora" />

        {step.type === "question" && (
          <div className="absolute left-1/2 top-16 z-20 w-[72%] max-w-md -translate-x-1/2">
            <div className="h-2.5 rounded-full bg-white/50 shadow-[0_6px_18px_rgba(0,0,0,0.15)] backdrop-blur-sm">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, backgroundColor: "#FFB5B1" }}
              />
            </div>
          </div>
        )}

        {step.type !== "result" && (
          <div
            className={`relative z-10 flex w-full flex-col items-center justify-end gap-2.5 px-4 ${paddingClass} pt-4 floating`}
          >
            <div className="grid w-full max-w-[340px] grid-cols-2 gap-3">
              {step.type === "question" &&
                step.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={(e) => choose(choice.id, e)}
                    className="relative w-full rounded-3xl bg-[#557E5A] px-2.5 py-2 text-[12px] font-semibold text-white shadow-[0_10px_18px_rgba(0,0,0,0.22),0_0_16px_rgba(85,126,90,0.32),0_0_30px_rgba(85,126,90,0.16)] transition hover:brightness-110 active:translate-y-[1px]"
                  >
                    {choice.label}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step.type === "result" && (
          <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4">
            <div className="pointer-events-auto grid w-full max-w-xl grid-cols-2 gap-2.5">
              <button
                onClick={resetGame}
                className="choice mini relative w-full rounded-3xl bg-[#557E5A] px-3 py-2 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(0,0,0,0.24),0_0_20px_rgba(85,126,90,0.36),0_0_38px_rgba(85,126,90,0.18)] transition hover:brightness-110 active:translate-y-[1px]"
              >
                ↩ Back to Home
              </button>
              <button
                onClick={shareResult}
                className="choice mini relative w-full rounded-3xl bg-[#557E5A] px-3 py-2 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(0,0,0,0.24),0_0_20px_rgba(85,126,90,0.36),0_0_38px_rgba(85,126,90,0.18)] transition hover:brightness-110 active:translate-y-[1px]"
              >
                ✨ Share Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SparkleCanvas = forwardRef(function SparkleCanvas(_, ref) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctrl = setupSparkles(canvasRef.current);
    if (ref) {
      ref.current = ctrl;
    }
    return () => {
      if (ref) ref.current = null;
    };
  }, [ref]);

  return <canvas ref={canvasRef} className="sparkle-layer" />;
});

function setupSparkles(canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let baseSpawn = 0;
  const maxParticles = 120;
  const colors = [
    { r: 255, g: 232, b: 160 },
    { r: 255, g: 210, b: 120 },
    { r: 255, g: 255, b: 210 }
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn(count = 1, origin) {
    for (let i = 0; i < count; i++) {
      if (particles.length >= maxParticles) break;
      const baseX = origin?.x ?? Math.random() * canvas.width;
      const baseY = origin?.y ?? Math.random() * canvas.height;
      particles.push({
        x: baseX + (Math.random() - 0.5) * 14,
        y: baseY + (Math.random() - 0.5) * 14,
        r: Math.random() * 2 + 0.6,
        vy: -0.08 - Math.random() * 0.35,
        vx: (Math.random() - 0.5) * 0.28,
        a: Math.random() * 0.7 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.a > 0 && p.y > -14);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random() - 0.5) * 0.01;
      p.vy += (Math.random() - 0.5) * 0.01;
      p.a -= 0.0035;
      ctx.beginPath();
      const { r, g, b } = p.color;
      const flicker = Math.max(0, Math.min(1, p.a + (Math.random() - 0.5) * 0.06));
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(${r},${g},${b},${flicker})`;
      ctx.shadowColor = "rgba(255,215,140,0.5)";
      ctx.shadowBlur = 12;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (baseSpawn > 0) spawn(baseSpawn);
    requestAnimationFrame(tick);
  }

  function setMode(mode) {
    if (mode === "home") baseSpawn = 3;
    else if (mode === "intro") baseSpawn = 1;
    else baseSpawn = 0;
  }

  function burst(x, y, opts = {}) {
    const count = opts.count ?? 28;
    spawn(count, { x, y });
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(tick);

  return { setMode, burst };
}

function TrailCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let points = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function onMove(e) {
      points.push({ x: e.clientX, y: e.clientY, a: 0.5, r: 3 });
      if (points.length > 120) points.shift();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      points = points
        .map((p) => ({ ...p, a: p.a - 0.01, r: p.r * 0.985 }))
        .filter((p) => p.a > 0.02);
      points.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,215,170,${p.a})`;
        ctx.shadowColor = "rgba(255,215,170,0.6)";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="trail-layer" />;
}
