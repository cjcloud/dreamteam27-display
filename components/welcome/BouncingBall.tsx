'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const BALL_SIZE = 90; // px, matches the football27-animate.svg render size
const REST_MARGIN = 56; // px above the bottom edge where the ball comes to rest
const GRAVITY = 2300; // px/s^2
const VERTICAL_RESTITUTION = 0.56; // fraction of vertical speed kept after each ground bounce
const GROUND_FRICTION = 0.8; // fraction of horizontal speed kept after each ground bounce
const AIR_DRAG = 0.998; // per-frame horizontal decay while airborne
const WALL_RESTITUTION = 0.55; // fraction of horizontal speed kept after a wall bounce
const BOUNCE_STOP_VY = 90; // px/s - once a bounce's vertical speed drops below this, the
// ball is considered to have stopped bouncing and switches to rolling on the ground
const ROLL_DECAY_PER_SEC = 0.28; // fraction of rolling speed kept per second (friction) -
// lower AIR_DRAG-like continuous decay so the ball keeps rolling for a while once grounded
const ROLL_SETTLE_VX = 6; // px/s - below this while rolling, the ball is considered settled

/**
 * A physics-driven bounce: gravity pulls the ball down and it loses energy on
 * each bounce off the floor (and off the left/right edges). Once the bounces
 * have died down, the ball switches to a rolling phase where only ground
 * friction slows it - so it keeps rolling and spinning along the bottom of
 * the screen for a while before finally coming to rest, rather than stopping
 * the instant it stops bouncing. Runs once on mount and stops updating once
 * the ball has settled, so it never loops.
 */
export default function BouncingBall() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const ball = ballRef.current;
    if (!stage || !ball) return;

    const { width, height } = stage.getBoundingClientRect();
    const floorY = height - BALL_SIZE - REST_MARGIN;
    const restX = width / 2 - BALL_SIZE / 2;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || floorY <= 0 || width <= 0) {
      ball.style.transform = `translate(${Math.max(restX, 0)}px, ${Math.max(floorY, 0)}px) rotate(0deg)`;
      return;
    }

    let x = Math.min(Math.max(width * 0.1, 0), width - BALL_SIZE);
    let y = -BALL_SIZE - 60;
    let vx = Math.min(320, Math.max(180, width * 0.28));
    let vy = 0;
    let rotation = 0;
    let phase: 'falling' | 'rolling' | 'settled' = 'falling';
    let lastTime: number | null = null;
    let rafId = 0;

    const bounceOffWalls = () => {
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx) * WALL_RESTITUTION;
      } else if (x >= width - BALL_SIZE) {
        x = width - BALL_SIZE;
        vx = -Math.abs(vx) * WALL_RESTITUTION;
      }
    };

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.032);
      lastTime = time;

      if (phase === 'falling') {
        vy += GRAVITY * dt;
        x += vx * dt;
        y += vy * dt;
        vx *= AIR_DRAG;

        // Bounce off the floor, losing energy vertically and horizontally.
        if (y >= floorY) {
          y = floorY;
          const bouncingDown = vy > 0;
          if (bouncingDown) {
            vy = -vy * VERTICAL_RESTITUTION;
            vx *= GROUND_FRICTION;
          }
          // Once vertical bounces have died down, switch to rolling: the
          // ball stays on the ground and only horizontal friction applies,
          // so it keeps travelling (and spinning) for a while longer.
          if (Math.abs(vy) < BOUNCE_STOP_VY) {
            vy = 0;
            phase = 'rolling';
          }
        }

        bounceOffWalls();
        // Rolling rotation: angular speed follows horizontal speed (radius = size/2).
        rotation += (vx * dt * 180) / (Math.PI * (BALL_SIZE / 2));
      } else if (phase === 'rolling') {
        y = floorY;
        x += vx * dt;
        vx *= Math.pow(ROLL_DECAY_PER_SEC, dt);
        bounceOffWalls();
        rotation += (vx * dt * 180) / (Math.PI * (BALL_SIZE / 2));

        if (Math.abs(vx) < ROLL_SETTLE_VX) {
          vx = 0;
          phase = 'settled';
        }
      }

      ball.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

      if (phase !== 'settled') {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={stageRef} className="welcome-ball-stage" aria-hidden="true">
      <div ref={ballRef} className="welcome-ball-physics">
        <Image src="/images/football27-animate.svg" alt="" width={BALL_SIZE} height={BALL_SIZE} priority />
      </div>
    </div>
  );
}
