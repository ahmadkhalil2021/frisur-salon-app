"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

// ================= TYPES =================

type ToastType = "success" | "error" | "info" | "warning";

type ToastData = {
  id: number;
  title: string;
  message: string;
  color: string;
  icon: string;
};

type ShowToastInput = {
  title: string;
  message: string;
  type?: ToastType;
};

type ToastContextType = {
  showToast: (data: ShowToastInput) => void;
};

// ================= CONSTANTS =================

const CW = 300,
  CH = 68;
const R = 3.5,
  GAP = 3,
  STEP = R * 2 + GAP;
const COLS = Math.floor(CW / STEP),
  ROWS = Math.floor(CH / STEP);

// ================= UTILS =================

function luma(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function textColor(hex: string) {
  return luma(hex) > 160 ? "#111" : "#fff";
}

function darkerBorder(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.round(v * 0.7))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function makeDots() {
  const d: { tx: number; ty: number }[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      d.push({ tx: GAP + c * STEP + R, ty: GAP + r * STEP + R });
  return d;
}

// simple spring function (damped)
function spring(t: number, stiffness = 170, damping = 26) {
  const mass = 1;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    );
  }

  return 1 - Math.exp(-w0 * t);
}

// ================= ANIMATION =================

function assembleAnim(
  canvas: HTMLCanvasElement,
  color: string,
  onDone: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dots = makeDots().map((d) => ({
    ...d,
    sx: d.tx + (Math.random() - 0.5) * CW,
    sy: d.ty - CH - Math.random() * CH * 1.5,
    delay: Math.random() * 250,
  }));

  const t0 = performance.now();

  function frame(now: number) {
    ctx!.clearRect(0, 0, CW, CH);
    let done = 0;

    dots.forEach((d) => {
      const e = now - t0 - d.delay;
      if (e < 0) return;

      const t = Math.min(e / 600, 1);
      const p = spring(t);

      ctx!.globalAlpha = Math.min(t * 2.5, 1);
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.arc(
        d.sx + (d.tx - d.sx) * p,
        d.sy + (d.ty - d.sy) * p,
        R,
        0,
        Math.PI * 2,
      );
      ctx!.fill();

      if (t >= 1) done++;
    });

    ctx!.globalAlpha = 1;

    if (done >= dots.length) {
      onDone();
      return;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function disperseAnim(
  canvas: HTMLCanvasElement,
  color: string,
  onDone: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dots = makeDots().map((d) => ({
    ...d,
    ex: d.tx + (Math.random() - 0.5) * CW,
    ey: d.ty - CH * 0.8 - Math.random() * CH * 1.5,
    delay: Math.random() * 250,
  }));

  const t0 = performance.now();

  function frame(now: number) {
    ctx!.clearRect(0, 0, CW, CH);
    let remaining = 0;

    dots.forEach((d) => {
      const e = now - t0 - d.delay;

      if (e < 0) {
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(d.tx, d.ty, R, 0, Math.PI * 2);
        ctx!.fill();
        remaining++;
        return;
      }

      const t = Math.min(e / 500, 1);
      const p = t * t;
      const a = 1 - t;

      if (a > 0) {
        ctx!.globalAlpha = a;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(
          d.tx + (d.ex - d.tx) * p,
          d.ty + (d.ey - d.ty) * p,
          R,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
        remaining++;
      }
    });

    ctx!.globalAlpha = 1;

    if (remaining > 0) requestAnimationFrame(frame);
    else onDone();
  }

  requestAnimationFrame(frame);
}

// ================= COMPONENT =================

function Toast({
  title,
  message,
  color,
  icon,
  onRemove,
}: ToastData & { onRemove: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(false);

  const txt = textColor(color);
  const border = darkerBorder(color);

  useEffect(() => {
    if (!canvasRef.current) return;

    assembleAnim(canvasRef.current, color, () => {
      setVisible(true);
      // eslint-disable-next-line react-hooks/immutability
      const t = setTimeout(handleClose, 3200);
      return () => clearTimeout(t);
    });
  }, []);

  function handleClose() {
    if (!canvasRef.current) return;
    setVisible(false);
    disperseAnim(canvasRef.current, color, onRemove);
  }

  return (
    <div style={{ position: "relative", width: 300, height: 68 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 10,
          background: color,
          border: `1px solid ${border}`,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ position: "absolute", inset: 0 }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          opacity: visible ? 1 : 0,
        }}
      >
        <div style={{ display: "flex", gap: 10, flex: 1 }}>
          <div style={{ color: txt }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 600, color: txt }}>{title}</div>
            <div style={{ fontSize: 12, opacity: 0.8, color: txt }}>
              {message}
            </div>
          </div>
        </div>

        <button onClick={handleClose} style={{ color: txt }}>
          ×
        </button>
      </div>
    </div>
  );
}

// ================= CONTEXT =================

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const TYPES = {
    success: { color: "#10b981", icon: "✓" },
    error: { color: "#ef4444", icon: "✕" },
    info: { color: "#0ea5e9", icon: "i" },
    warning: { color: "#f59e0b", icon: "!" },
  };

  function showToast({ title, message, type = "info" }: ShowToastInput) {
    const id = Date.now();
    const t = TYPES[type];

    setToasts((prev) => [
      { id, title, message, color: t.color, icon: t.icon },
      ...prev,
    ]);
  }

  function removeToast(id: number) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
