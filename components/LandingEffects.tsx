"use client";

import { useEffect } from "react";

const CHARS =
  "漢字日本語学習練習文書読書勉強東京大阪京都水火木金土山川空海雨雪風電話友達食飲仕事会社学校電車".split(
    "",
  );

const sentences = [
  {
    jp: "毎日日本語を\n勉強しています",
    en: "I study Japanese every day",
    typed: "毎日日本語を勉強しています",
  },
  {
    jp: "東京は\nとても大きい都市です",
    en: "Tokyo is a very large city",
    typed: "東京はとても大きい都市です",
  },
  {
    jp: "友達と\n一緒に食べました",
    en: "I ate together with a friend",
    typed: "友達と一緒に食べました",
  },
];

export default function LandingEffects() {
  useEffect(() => {
    const canvas = document.getElementById(
      "falling-canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Col = {
      x: number;
      y: number;
      speed: number;
      char: string;
      opacity: number;
      size: number;
    };

    let cols: Col[] = [];
    let rafId = 0;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numCols = Math.floor(canvas.width / 36);
      cols = Array.from({ length: numCols }, (_, i) => ({
        x: i * 36 + 18,
        y: Math.random() * -canvas.height,
        speed: 0.4 + Math.random() * 0.8,
        char: CHARS[Math.floor(Math.random() * CHARS.length)] ?? "漢",
        opacity: 0.3 + Math.random() * 0.7,
        size: 14 + Math.floor(Math.random() * 10),
      }));
    };

    const drawFalling = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const col of cols) {
        ctx.globalAlpha = col.opacity;
        ctx.fillStyle = "#E85D3A";
        ctx.font = `${col.size}px "Noto Sans JP", sans-serif`;
        ctx.fillText(col.char, col.x, col.y);

        col.y += col.speed;
        if (col.y > canvas.height + 40) {
          col.y = -40;
          col.char = CHARS[Math.floor(Math.random() * CHARS.length)] ?? "漢";
          col.speed = 0.4 + Math.random() * 0.8;
        }
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(drawFalling);
    };

    initCanvas();
    drawFalling();
    window.addEventListener("resize", initCanvas);

    const screen2 = document.getElementById("screen2");
    const typingText = document.getElementById("typing-text");
    const gradeBadge = document.getElementById("grade-badge");
    const sentenceJp = document.getElementById("sentence-jp");
    const sentenceEn = document.getElementById("sentence-en");

    let sentenceIdx = 0;
    let onScreen2 = false;
    let screenToggleInterval: ReturnType<typeof setInterval> | undefined;
    let screenStartTimeout: ReturnType<typeof setTimeout> | undefined;

    const typeAnimation = (text: string, callback: () => void) => {
      if (!typingText) return;
      typingText.textContent = "";
      let i = 0;
      const interval = setInterval(() => {
        typingText.textContent += text[i];
        i += 1;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(callback, 400);
        }
      }, 60);
    };

    const runScreen2Cycle = () => {
      if (!typingText || !gradeBadge || !sentenceJp || !sentenceEn) return;

      const s = sentences[sentenceIdx % sentences.length];
      if (!s) return;

      sentenceJp.innerHTML = s.jp.replace("\n", "<br>");
      sentenceEn.textContent = s.en;
      typingText.textContent = "";
      gradeBadge.classList.remove("show");

      setTimeout(() => {
        typeAnimation(s.typed, () => {
          gradeBadge.textContent = "○";
          gradeBadge.style.color = "#60a5fa";
          gradeBadge.classList.add("show");
          sentenceIdx += 1;
          setTimeout(() => {
            gradeBadge.classList.remove("show");
            setTimeout(runScreen2Cycle, 600);
          }, 1800);
        });
      }, 800);
    };

    if (screen2) {
      screenStartTimeout = setTimeout(() => {
        screen2.classList.add("visible");
        runScreen2Cycle();

        screenToggleInterval = setInterval(() => {
          onScreen2 = !onScreen2;
          if (onScreen2) {
            screen2.style.opacity = "1";
            screen2.style.pointerEvents = "auto";
          } else {
            screen2.style.opacity = "0";
            screen2.style.pointerEvents = "none";
          }
        }, 12000);
      }, 3000);
    }

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [
              ...entry.target.parentElement!.querySelectorAll(
                ".reveal:not(.visible)",
              ),
            ];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, idx * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", initCanvas);
      if (screenStartTimeout) clearTimeout(screenStartTimeout);
      if (screenToggleInterval) clearInterval(screenToggleInterval);
      observer.disconnect();
    };
  }, []);

  return <canvas id="falling-canvas" aria-hidden="true" />;
}
