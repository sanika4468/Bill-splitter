import React, { useEffect, useRef } from 'react';
import { AnimationSettings } from '../types';

interface Props {
  settings: AnimationSettings;
  themeId: string;
}

const FOOD_EMOJIS = ['🍕', '☕', '🍔', '🍜', '🌮', '🍣', '🥟', '🍹', '🍰', '🧋', '🥑', '🥐', '🍷'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  type: 'emoji' | 'doodle';
  emoji: string;
  doodleIndex: number;
  wobblePhase: number;
}

export const BackgroundFoodAnimation: React.FC<Props> = ({ settings, themeId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!settings.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle count based on density
    let count = 16;
    if (settings.density === 'low') count = 10;
    if (settings.density === 'high') count = 26;

    let speedMul = 1;
    if (settings.speed === 'slow') speedMul = 0.5;
    if (settings.speed === 'fast') speedMul = 1.6;

    const isDark =
      themeId.includes('dark') ||
      themeId === 'blue' ||
      document.documentElement.classList.contains('dark');

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * speedMul,
        vy: (-0.3 - Math.random() * 0.35) * speedMul,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015 * speedMul,
        size: 26 + Math.random() * 18,
        opacity: isDark ? 0.22 : 0.16,
        type: settings.style === 'doodles' ? 'doodle' : 'emoji',
        emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
        doodleIndex: i % 6,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }

    // Function to draw hand-crafted vector doodles on canvas
    const drawDoodle = (
      c: CanvasRenderingContext2D,
      index: number,
      size: number,
      strokeColor: string
    ) => {
      c.strokeStyle = strokeColor;
      c.lineWidth = 2.2;
      c.lineCap = 'round';
      c.lineJoin = 'round';

      const s = size / 2;

      c.beginPath();
      switch (index) {
        case 0: // Pizza slice doodle
          c.moveTo(-s * 0.7, -s * 0.6);
          c.quadraticCurveTo(0, -s * 0.8, s * 0.7, -s * 0.6);
          c.lineTo(0, s * 0.8);
          c.closePath();
          c.stroke();
          // Pepperoni
          c.beginPath();
          c.arc(0, -s * 0.1, s * 0.22, 0, Math.PI * 2);
          c.stroke();
          break;

        case 1: // Steaming Chai / Coffee Cup doodle
          // Mug
          c.moveTo(-s * 0.6, -s * 0.4);
          c.lineTo(s * 0.6, -s * 0.4);
          c.lineTo(s * 0.45, s * 0.6);
          c.quadraticCurveTo(0, s * 0.75, -s * 0.45, s * 0.6);
          c.closePath();
          c.stroke();
          // Handle
          c.beginPath();
          c.arc(s * 0.6, 0, s * 0.3, -Math.PI / 2, Math.PI / 2);
          c.stroke();
          // Steam
          c.beginPath();
          c.moveTo(-s * 0.2, -s * 0.6);
          c.quadraticCurveTo(-s * 0.4, -s * 0.8, -s * 0.2, -s * 1.0);
          c.moveTo(s * 0.2, -s * 0.6);
          c.quadraticCurveTo(s * 0.4, -s * 0.8, s * 0.2, -s * 1.0);
          c.stroke();
          break;

        case 2: // Samosa / Dumpling doodle
          c.moveTo(0, -s * 0.8);
          c.lineTo(s * 0.75, s * 0.6);
          c.quadraticCurveTo(0, s * 0.4, -s * 0.75, s * 0.6);
          c.closePath();
          c.stroke();
          // Crisp fold
          c.beginPath();
          c.moveTo(0, -s * 0.4);
          c.lineTo(0, s * 0.4);
          c.stroke();
          break;

        case 3: // Burger doodle
          // Top bun
          c.beginPath();
          c.arc(0, -s * 0.1, s * 0.6, Math.PI, 0);
          c.closePath();
          c.stroke();
          // Patty
          c.beginPath();
          c.roundRect(-s * 0.65, 0, s * 1.3, s * 0.25, [3]);
          c.stroke();
          // Bottom bun
          c.beginPath();
          c.arc(0, s * 0.3, s * 0.6, 0, Math.PI);
          c.closePath();
          c.stroke();
          break;

        case 4: // Cocktail glass doodle
          c.moveTo(-s * 0.7, -s * 0.6);
          c.lineTo(s * 0.7, -s * 0.6);
          c.lineTo(0, s * 0.1);
          c.closePath();
          c.moveTo(0, s * 0.1);
          c.lineTo(0, s * 0.7);
          c.moveTo(-s * 0.4, s * 0.7);
          c.lineTo(s * 0.4, s * 0.7);
          c.stroke();
          break;

        case 5: // Little heart & sparkle doodle
        default:
          c.beginPath();
          c.moveTo(0, 0);
          c.bezierCurveTo(-s * 0.5, -s * 0.5, -s * 0.8, 0, 0, s * 0.6);
          c.bezierCurveTo(s * 0.8, 0, s * 0.5, -s * 0.5, 0, 0);
          c.stroke();
          // Sparkle
          c.beginPath();
          c.moveTo(s * 0.5, -s * 0.6);
          c.lineTo(s * 0.5, -s * 0.8);
          c.moveTo(s * 0.4, -s * 0.7);
          c.lineTo(s * 0.6, -s * 0.7);
          c.stroke();
          break;
      }
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobblePhase += dt * 1.4;
        p.x += p.vx * dt * 60 + Math.sin(p.wobblePhase) * 0.25;
        p.y += p.vy * dt * 60;
        p.rotation += p.rotationSpeed * dt * 60;

        if (p.y < -50) {
          p.y = height + 40;
          p.x = Math.random() * width;
        } else if (p.y > height + 50) {
          p.y = -40;
        }

        if (p.x < -50) p.x = width + 40;
        else if (p.x > width + 50) p.x = -40;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (settings.style === 'doodles') {
          const strokeColor = isDark ? '#f1f5f9' : '#475569';
          drawDoodle(ctx, p.doodleIndex, p.size, strokeColor);
        } else {
          ctx.font = `${p.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.enabled, settings.style, settings.density, settings.speed, themeId]);

  if (!settings.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
