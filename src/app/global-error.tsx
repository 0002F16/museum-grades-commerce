"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          color: "rgb(25,28,31)",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 500 }}>Something went wrong</h1>
        <p style={{ color: "rgba(25,28,31,0.6)", maxWidth: 420 }}>
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            height: 47,
            padding: "0 2.5rem",
            backgroundColor: "rgb(25,28,31)",
            color: "white",
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
