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

const CH = 68;
const R = 3.5,
  GAP = 3,
  STEP = R * 2 + GAP;

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

function makeDots(cw: number) {
  const cols = Math.floor(cw / STEP);
  const rows = Math.floor(CH / STEP);
  const d: { tx: number; ty: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      d.push({ tx: GAP + c * STEP + R, ty: GAP + r * STEP + R });
  return d;
}

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
  cssWidth: number,
  color: string,
  onDone: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const dots = makeDots(cssWidth).map((d) => ({
    ...d,
    sx: d.tx + (Math.random() - 0.5) * cssWidth,
    sy: d.ty - CH - Math.random() * CH * 1.5,
    delay: Math.random() * 250,
  }));

  const t0 = performance.now();

  function frame(now: number) {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
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
        (d.sx + (d.tx - d.sx) * p) * dpr,
        (d.sy + (d.ty - d.sy) * p) * dpr,
        R * dpr,
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
  cssWidth: number,
  color: string,
  onDone: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const dots = makeDots(cssWidth).map((d) => ({
    ...d,
    ex: d.tx + (Math.random() - 0.5) * cssWidth,
    ey: d.ty - CH * 0.8 - Math.random() * CH * 1.5,
    delay: Math.random() * 250,
  }));

  const t0 = performance.now();

  function frame(now: number) {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    let remaining = 0;

    dots.forEach((d) => {
      const e = now - t0 - d.delay;
      if (e < 0) {
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(d.tx * dpr, d.ty * dpr, R * dpr, 0, Math.PI * 2);
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
          (d.tx + (d.ex - d.tx) * p) * dpr,
          (d.ty + (d.ey - d.ty) * p) * dpr,
          R * dpr,
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cssWidthRef = useRef<number>(300);
  const [visible, setVisible] = useState(false);

  const txt = textColor(color);
  const border = darkerBorder(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    // RAF stellt sicher, dass das Layout auf Mobile fertig gerendert ist
    const raf = requestAnimationFrame(() => {
      const dpr = window.devicePixelRatio || 1;
      const cw = wrapper.getBoundingClientRect().width || 300;
      cssWidthRef.current = cw;

      // Canvas in physischen Pixeln setzen, CSS-Größe separat
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(CH * dpr);
      canvas.style.width = cw + "px";
      canvas.style.height = CH + "px";

      assembleAnim(canvas, cw, color, () => {
        setVisible(true);
        const t = setTimeout(handleClose, 3200);
        return () => clearTimeout(t);
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose() {
    if (!canvasRef.current) return;
    setVisible(false);
    disperseAnim(canvasRef.current, cssWidthRef.current, color, onRemove);
  }

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", height: CH }}
    >
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

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

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
        <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ color: txt, flexShrink: 0 }}>{icon}</div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                color: txt,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.8,
                color: txt,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {message}
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          style={{
            color: txt,
            flexShrink: 0,
            marginLeft: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            padding: "4px 8px",
          }}
        >
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
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100vw - 32px)", // ← Kern-Fix: volle Breite minus 16px je Seite
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto", width: "100%" }}>
            <Toast {...t} onRemove={() => removeToast(t.id)} />
          </div>
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
