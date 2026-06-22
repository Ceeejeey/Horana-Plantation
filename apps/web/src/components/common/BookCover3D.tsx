import { useMemo, useState } from "react";
import coverImage from "../../assets/cover_page/HORANA Cover Story Image and MockUp_page-0001.jpg";
import annualReportPdf from "../../assets/pdf/annual-report/Horana AR 2025-26.pdf";
import { PDFViewerModal } from "./PDFViewerModal";

const SPINE_WIDTH = 48; // Total thickness of the book
const COVER_THICKNESS = 4; // Thickness of the cover boards
const PAGE_BLOCK_THICKNESS = 40; // Thickness of the pages inside
const INNER_PAGE_VERT_INSET = 5; // Top/bottom inset so pages sit inside the cover boards
const INNER_PAGE_RIGHT_INSET = 4; // Uniform right inset for all inner sheets

export function BookCover3D({ parallax }: { parallax: { x: number; y: number } }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Smooth interactive 3D rotation based on cursor parallax
  const shellTransform = useMemo(() => {
    const baseY = 15; // Beautiful default 3D angle
    const baseX = 5;  // Default X tilt
    const y = baseY + parallax.x * 8.0;
    const x = baseX - parallax.y * 8.0;
    const lift = isHovered ? -10 : 0; // Lift the book slightly when opened
    return `translateY(${lift}px) rotateX(${x}deg) rotateY(${y}deg)`;
  }, [parallax.x, parallax.y, isHovered]);

  // Specular sheen highlight that sweeps across the cover based on cursor
  const sheenTransform = useMemo(() => {
    const tx = parallax.x * 80;
    const ty = parallax.y * 80;
    return `translateX(${tx}px) translateY(${ty}px) rotate(-15deg) scale(1.5)`;
  }, [parallax.x, parallax.y]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = annualReportPdf;
    link.download = "Horana_AR_2025-26.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="book-container">
        <div
          className={`book-outer ${isHovered ? "is-open" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsHovered((open) => !open)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          tabIndex={0}
          role="button"
          aria-label="Open book preview"
        >
          {/* Realistic Dual Shadows */}
          <div className="book-shadow-soft" aria-hidden />
          <div className="book-shadow-crisp" aria-hidden />

          {/* 3D Book Shell */}
          <div
            className={`book-shell ${isHovered ? "is-open" : ""}`}
            style={{ transform: shellTransform }}
          >
            {/* 1. SOLID BACK COVER */}
            <div className="book-back-cover">
              <div className="book-back-face" />
              {/* Back Cover 3D Edges */}
              <div className="book-back-edge book-back-edge--top" />
              <div className="book-back-edge book-back-edge--bottom" />
              <div className="book-back-edge book-back-edge--right" />
            </div>

            {/* 2. ROUNDED SPINE */}
            <div className="book-spine">
              <div className="book-spine-skin" />
              <div className="book-spine-ribs">
                <span className="spine-rib" />
                <span className="spine-rib" />
                <span className="spine-rib" />
                <span className="spine-rib" />
                <span className="spine-rib" />
              </div>
              <div className="book-spine-gold-text">
                <span>ANNUAL REPORT 2025/26</span>
              </div>
            </div>

            {/* 3. SOLID PAGE BLOCK */}
            <div className="book-inner-sheet book-page-block">
              <div className="book-pages-top" />
              <div className="book-pages-bottom" />
              <div className="book-pages-fore" />
            </div>

            {/* 4. STATIONARY CORE PAGE (With Interactive Buttons) */}
            <div className="book-inner-sheet book-inside-page">
              <div className="book-inside-highlight" aria-hidden />
              <div className="book-inside-paper-texture" aria-hidden />
              <div className="book-inside-border" aria-hidden />
              
              <div className="book-inside-content">
                <div className="book-inside-header">
                  <p className="book-inside-corp">HORANA PLANTATIONS PLC</p>
                  <div className="book-inside-divider" />
                  <h3 className="book-inside-title">6 CAPITALS JOURNEY</h3>
                  <p className="book-inside-subtitle">Interactive Annual Report 2025/26</p>
                </div>

                <div className="buttons-container">
                  <button
                    type="button"
                    className="book-btn read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsViewerOpen(true);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    Read Book
                  </button>
                  <button
                    type="button"
                    className="book-btn download-btn"
                    onClick={handleDownload}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download PDF
                  </button>
                </div>

                <div className="book-inside-footer">
                  <p>Every Move Matters</p>
                </div>
              </div>
            </div>

            {/* 5. FLYLEAF PAGE TWO (The 6 Capitals Intro) */}
            <div className={`book-inner-sheet book-flyleaf book-flyleaf--two ${isHovered ? "is-open" : ""}`}>
              <div className="book-flyleaf-front">
                <div className="book-inside-paper-texture" />
                <div className="book-inside-border" />
                <div className="flyleaf-content">
                  <h4 className="flyleaf-title">THE SIX CAPITALS</h4>
                  <p className="flyleaf-intro">Our value creation model is built upon six pillars of growth:</p>
                  <ul className="capitals-list">
                    <li><span className="bullet">✦</span> Financial Capital</li>
                    <li><span className="bullet">✦</span> Manufactured Capital</li>
                    <li><span className="bullet">✦</span> Intellectual Capital</li>
                    <li><span className="bullet">✦</span> Human Capital</li>
                    <li><span className="bullet">✦</span> Social & Relationship Capital</li>
                    <li><span className="bullet">✦</span> Natural Capital</li>
                  </ul>
                </div>
                <div className="page-curl-highlight" />
              </div>
              <div className="book-flyleaf-back">
                <div className="book-inside-paper-texture" />
                <div className="page-fold-shade page-fold-shade--light" aria-hidden />
                <div className="page-curl-highlight back" />
              </div>
              <div className="page-shadow-overlay page-shadow-overlay--light" />
            </div>

            {/* 6. FLYLEAF PAGE ONE (Elegant Endpaper & Title) */}
            <div className={`book-inner-sheet book-flyleaf book-flyleaf--one ${isHovered ? "is-open" : ""}`}>
              <div className="book-flyleaf-front">
                <div className="book-inside-paper-texture" />
                <div className="endpaper-pattern">
                  <div className="endpaper-logo-watermark" />
                  <div className="endpaper-gold-seal">
                    <span className="seal-star">★</span>
                    <span className="seal-text">HORANA PLANTATIONS</span>
                    <span className="seal-star">★</span>
                  </div>
                </div>
                <div className="page-curl-highlight" />
              </div>
              <div className="book-flyleaf-back">
                <div className="book-inside-paper-texture" />
                <div className="page-fold-shade page-fold-shade--medium" aria-hidden />
                <div className="flyleaf-content flyleaf-content-first">
                  <p className="flyleaf-first-p">ANNUAL REPORT</p>
                  <h2 className="flyleaf-huge-year">2025/26</h2>
                  <div className="flyleaf-line" />
                  <p className="flyleaf-first-sub">INTEGRATED REPORTING FRAMEWORK</p>
                </div>
                <div className="page-curl-highlight back" />
              </div>
              <div className="page-shadow-overlay page-shadow-overlay--medium" />
            </div>

            {/* 7. FRONT COVER (Hinged at the spine joint) */}
            <div className={`book-front-cover-hinge ${isHovered ? "is-open" : ""}`}>
              <div className="book-front-cover">
                {/* Front Face (Cover Image + Specular Sheen + Gold Border) */}
                <div
                  className="book-front-face"
                  style={{
                    backgroundImage: `url(${coverImage})`,
                  }}
                >
                  <div className="book-front-sheen" style={{ transform: sheenTransform }} />
                  <div className="page-curl-shadow" />
                </div>

                {/* Inside Face of Front Cover */}
                <div className="book-front-inside">
                  <div className="book-front-inside-paper" />
                  <div className="page-fold-shade page-fold-shade--deep" aria-hidden />
                  <div className="book-front-inside-joint" />
                  <div className="page-curl-highlight back" />
                </div>

                {/* Front Cover 3D Edges */}
                <div className="book-front-edge book-front-edge--top" />
                <div className="book-front-edge book-front-edge--bottom" />
                <div className="book-front-edge book-front-edge--right" />
              </div>
            </div>

            {/* Cover Cast Shadow onto page block */}
            <div className="book-inner-sheet book-cover-cast-shadow" aria-hidden />
          </div>
        </div>
      </div>
      <style>{bookStyles}</style>
      <PDFViewerModal 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        pdfUrl={annualReportPdf}
      />
    </>
  );
}

const bookStyles = `
  .book-container {
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1800px;
    perspective-origin: 50% 40%;
    width: 100%;
    padding: 64px 20px 54px;
    overflow: visible;
  }

  .book-outer {
    position: relative;
    width: 360px;
    height: 480px;
    cursor: pointer;
    outline: none;
    overflow: visible;
  }

  /* Soft floor shadow */
  .book-shadow-soft {
    position: absolute;
    bottom: -46px;
    left: -5%;
    width: 110%;
    height: 64px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 75%);
    filter: blur(16px);
    transform: rotateX(80deg);
    transition: transform 1.2s cubic-bezier(0.25, 1, 0.3, 1), opacity 1.2s ease, filter 1.2s ease;
    pointer-events: none;
    opacity: 0.9;
    z-index: 1;
  }

  /* Sharp ambient occlusion contact shadow */
  .book-shadow-crisp {
    position: absolute;
    bottom: -15px;
    left: 8%;
    width: 84%;
    height: 16px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
    filter: blur(4px);
    transition: transform 1.2s cubic-bezier(0.25, 1, 0.3, 1), opacity 1.2s ease;
    pointer-events: none;
    z-index: 2;
  }

  /* Shadow transitions on hover */
  .book-outer.is-open .book-shadow-soft {
    transform: rotateX(80deg) scale(1.18) translateY(24px) translateX(12px);
    opacity: 0.35;
    filter: blur(24px);
  }

  .book-outer.is-open .book-shadow-crisp {
    transform: scale(1.05) translateY(12px) translateX(8px);
    opacity: 0.12;
  }

  /* The 3D Book Shell */
  .book-shell {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 1.1s cubic-bezier(0.25, 1, 0.3, 1);
    overflow: visible;
  }

  /* 1. SOLID BACK COVER (Z-centered) */
  .book-back-cover {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: translateZ(-${(PAGE_BLOCK_THICKNESS + COVER_THICKNESS) / 2}px);
  }

  .book-back-face {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #143a21 0%, #0a1f13 60%, #061409 100%);
    border-radius: 0 4px 4px 0;
    box-shadow:
      -12px 12px 32px rgba(0, 0, 0, 0.45),
      inset 4px 0 12px rgba(0, 0, 0, 0.3);
  }

  /* Back Cover 3D Edges (Dark Green) */
  .book-back-edge {
    position: absolute;
    background: linear-gradient(90deg, #0a1f13, #143a21, #0a1f13);
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.4);
  }

  .book-back-edge--top {
    top: -1.5px;
    left: 0;
    right: 0;
    height: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateX(90deg);
  }

  .book-back-edge--bottom {
    bottom: -1.5px;
    left: 0;
    right: 0;
    height: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateX(90deg);
  }

  .book-back-edge--right {
    top: 0;
    bottom: 0;
    right: -1.5px;
    width: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateY(90deg);
  }

  /* 2. ROUNDED SPINE */
  .book-spine {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -${SPINE_WIDTH / 2}px;
    width: ${SPINE_WIDTH}px;
    transform-style: preserve-3d;
    transform-origin: center center;
    transform: rotateY(-90deg);
  }

  .book-spine-skin {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      #0a1f13 0%,
      #143a21 20%,
      #1a4d2e 50%,
      #143a21 80%,
      #0a1f13 100%
    );
    border-radius: 3px 0 0 3px;
    box-shadow:
      inset 0 0 10px rgba(0, 0, 0, 0.6),
      inset 1px 0 2px rgba(255, 255, 255, 0.1);
  }

  /* 3D Spine raised ribs */
  .book-spine-ribs {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 30px 0;
    pointer-events: none;
  }

  .spine-rib {
    height: 4px;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(229, 192, 121, 0.7) 40%,
      rgba(229, 192, 121, 0.9) 60%,
      rgba(0, 0, 0, 0.5) 100%
    );
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .book-spine-gold-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    white-space: nowrap;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: rgba(197, 160, 89, 0.85);
    text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.8);
    pointer-events: none;
  }

  /* Shared geometry for all inner sheets (page block, core page, flyleaves, shadow) */
  .book-inner-sheet {
    position: absolute;
    top: ${INNER_PAGE_VERT_INSET}px;
    bottom: ${INNER_PAGE_VERT_INSET}px;
    left: 0;
    width: calc(100% - ${INNER_PAGE_RIGHT_INSET}px);
  }

  /* 3. SOLID PAGE BLOCK */
  .book-page-block {
    transform-style: preserve-3d;
    transform: translateZ(0px);
  }

  /* Top Page Edge */
  .book-pages-top {
    position: absolute;
    top: -${PAGE_BLOCK_THICKNESS / 2}px;
    left: 0;
    right: 0;
    height: ${PAGE_BLOCK_THICKNESS}px;
    background: linear-gradient(
      90deg,
      #9e833f 0%,
      #E5C079 25%,
      #c2a750 50%,
      #E5C079 75%,
      #9e833f 100%
    );
    transform-origin: center center;
    transform: rotateX(90deg);
    box-shadow: inset 0 -3px 8px rgba(0, 0, 0, 0.25);
  }

  /* Bottom Page Edge */
  .book-pages-bottom {
    position: absolute;
    bottom: -${PAGE_BLOCK_THICKNESS / 2}px;
    left: 0;
    right: 0;
    height: ${PAGE_BLOCK_THICKNESS}px;
    background: linear-gradient(
      90deg,
      #9e833f 0%,
      #E5C079 25%,
      #c2a750 50%,
      #E5C079 75%,
      #9e833f 100%
    );
    transform-origin: center center;
    transform: rotateX(90deg);
    box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.25);
  }

  /* Fore Page Edge */
  .book-pages-fore {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -${PAGE_BLOCK_THICKNESS / 2}px;
    width: ${PAGE_BLOCK_THICKNESS}px;
    background: 
      linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, transparent 15%, transparent 85%, rgba(0, 0, 0, 0.3) 100%),
      repeating-linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.12) 0px,
      rgba(0, 0, 0, 0.12) 1px,
      transparent 1px,
      transparent 3px
      ),
      linear-gradient(
      90deg,
      #9e833f 0%,
      #E5C079 30%,
      #f8e5ad 50%,
      #E5C079 70%,
      #9e833f 100%
      );
    transform-origin: center center;
    transform: rotateY(90deg);
    border-radius: 1px 0 0 1px;
    box-shadow: inset 3px 0 6px rgba(0, 0, 0, 0.15);
  }

  /* 4. STATIONARY CORE PAGE */
  .book-inside-page {
    background: linear-gradient(145deg, #fffefb 0%, #fdfbf7 45%, #f8f5ef 100%);
    border-radius: 0 3px 3px 0;
    transform: translateZ(${PAGE_BLOCK_THICKNESS / 2}px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.6),
      0 4px 20px rgba(255, 255, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    display: flex;
    z-index: 9;
    overflow: hidden;
  }

  .book-inside-paper-texture {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.7) 0%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.003) 0px,
        rgba(0, 0, 0, 0.003) 1px,
        transparent 1px,
        transparent 2px
      );
    opacity: 0.75;
    pointer-events: none;
  }

  .book-inside-border {
    position: absolute;
    inset: 12px 12px 12px calc(12px + ${SPINE_WIDTH}px);
    border: 1px solid rgba(197, 160, 89, 0.35);
    border-radius: 2px;
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  /* Soft paper highlight instead of spine shadow */
  .book-inside-highlight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background:
      radial-gradient(
        ellipse 85% 70% at 58% 38%,
        rgba(255, 255, 255, 0.85) 0%,
        rgba(255, 252, 245, 0.35) 45%,
        transparent 72%
      ),
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        transparent 35%,
        transparent 65%,
        rgba(229, 192, 121, 0.06) 100%
      );
    opacity: 0.65;
    transition: opacity 1s ease;
  }

  .book-outer.is-open .book-inside-highlight {
    opacity: 1;
    background:
      radial-gradient(
        ellipse 90% 75% at 52% 42%,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 250, 240, 0.45) 40%,
        transparent 75%
      ),
      linear-gradient(
        160deg,
        rgba(255, 255, 255, 0.55) 0%,
        transparent 30%,
        transparent 70%,
        rgba(229, 192, 121, 0.08) 100%
      );
  }

  .book-inside-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 28px 20px 28px calc(20px + ${SPINE_WIDTH}px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
  }

  .book-inside-header {
    text-align: center;
    width: 100%;
  }

  .book-inside-corp {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #a6842b;
  }

  .book-inside-divider {
    width: 40px;
    height: 1.5px;
    background-color: rgba(197, 160, 89, 0.4);
    margin: 8px auto;
  }

  .book-inside-title {
    font-family: Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #112d17;
    margin-top: 4px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .book-inside-subtitle {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    color: #666;
    margin-top: 2px;
  }

  .book-inside-footer {
    font-family: Georgia, serif;
    font-size: 11px;
    font-style: italic;
    color: #a6842b;
  }

  /* 5 & 6. FLYLEAF PAGES (Interactive fanning layers) */
  .book-flyleaf {
    transform-style: preserve-3d;
    transform-origin: left center;
    z-index: 4;
    pointer-events: none;
  }

  .book-flyleaf-front,
  .book-flyleaf-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    box-shadow:
      inset 14px 0 24px rgba(0, 0, 0, 0.04),
      1px 1px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .book-flyleaf-front {
    background: #fdfbf7;
    border-radius: 0 3px 3px 0;
    transform: rotateY(0deg);
  }

  .book-flyleaf-back {
    background: #fbf9f3;
    border-radius: 3px 0 0 3px;
    transform: rotateY(180deg);
    box-shadow: inset -14px 0 24px rgba(0, 0, 0, 0.04);
  }

  /* Realistic Paper Curl Highlight */
  .page-curl-highlight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(0, 0, 0, 0.05) 55%,
      rgba(255, 255, 255, 0) 70%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    transition: background-position 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    z-index: 10;
  }

  .page-curl-highlight.back {
    background: linear-gradient(
      -90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.25) 50%,
      rgba(0, 0, 0, 0.08) 55%,
      rgba(255, 255, 255, 0) 70%
    );
    background-size: 200% 100%;
    background-position: 0% 0;
  }

  .book-outer.is-open .page-curl-highlight {
    background-position: -100% 0;
  }

  .book-outer.is-open .page-curl-highlight.back {
    background-position: 100% 0;
  }

  /* Shadow between pages */
  .page-shadow-overlay {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    z-index: 1;
    border-radius: 0 3px 3px 0;
  }

  .page-shadow-overlay--light {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.06) 0%,
      rgba(0, 0, 0, 0.03) 30%,
      transparent 65%
    );
  }

  .page-shadow-overlay--medium {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.12) 0%,
      rgba(0, 0, 0, 0.06) 35%,
      transparent 70%
    );
  }

  .book-outer.is-open .page-shadow-overlay--light {
    opacity: 1;
  }

  .book-outer.is-open .page-shadow-overlay--medium {
    opacity: 1;
  }

  /* Turned-page gray: darkest on right (spine), fades toward left */
  .page-fold-shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 6;
    opacity: 0;
    transition: opacity 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    border-radius: inherit;
  }

  .book-outer.is-open .page-fold-shade {
    opacity: 1;
  }

  /* Outermost turned page (cover inside) — strongest gray */
  .page-fold-shade--deep {
    background: linear-gradient(
      to left,
      rgba(72, 68, 62, 0.55) 0%,
      rgba(110, 105, 98, 0.38) 18%,
      rgba(155, 148, 138, 0.2) 42%,
      rgba(235, 230, 220, 0.08) 68%,
      rgba(253, 251, 247, 0) 100%
    );
    box-shadow: inset -6px 0 14px rgba(0, 0, 0, 0.12);
  }

  /* Middle turned page — medium gray */
  .page-fold-shade--medium {
    background: linear-gradient(
      to right,
      rgba(88, 84, 78, 0.42) 0%,
      rgba(125, 118, 108, 0.26) 22%,
      rgba(175, 168, 158, 0.12) 48%,
      rgba(245, 242, 236, 0.04) 72%,
      rgba(253, 251, 247, 0) 100%
    );
    box-shadow: inset 6px 0 12px rgba(0, 0, 0, 0.08);
  }

  /* Inner turned page — lightest gray */
  .page-fold-shade--light {
    background: linear-gradient(
      to right,
      rgba(100, 96, 90, 0.28) 0%,
      rgba(140, 133, 124, 0.14) 28%,
      rgba(200, 194, 186, 0.06) 55%,
      rgba(253, 251, 247, 0) 100%
    );
    box-shadow: inset 5px 0 10px rgba(0, 0, 0, 0.05);
  }

  .book-outer.is-open .book-flyleaf-back {
    background: linear-gradient(135deg, #ece8e0 0%, #f5f2ec 45%, #fdfbf7 100%);
  }

  .book-outer.is-open .book-front-inside {
    background: linear-gradient(135deg, #e2ddd4 0%, #eeeae2 40%, #f6f4ee 100%);
  }

  .book-outer.is-open .book-flyleaf-front {
    background: linear-gradient(135deg, #f3f0ea 0%, #faf8f4 50%, #fdfbf7 100%);
  }

  /* Flyleaf Specific Content Styles */
  .flyleaf-content {
    position: relative;
    padding: 32px 24px 32px calc(24px + ${SPINE_WIDTH}px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
  }

  .flyleaf-title {
    font-family: Georgia, serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: #112d17;
    border-bottom: 1px solid rgba(197, 160, 89, 0.3);
    padding-bottom: 6px;
    margin-bottom: 12px;
    text-align: center;
  }

  .flyleaf-intro {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 11px;
    line-height: 1.5;
    color: #555;
    margin-bottom: 14px;
    text-align: center;
  }

  .capitals-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .capitals-list li {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #2c4a32;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bullet {
    color: #E5C079;
    font-size: 10px;
  }

  /* Endpaper marbled design (Flyleaf One Front) */
  .endpaper-pattern {
    position: absolute;
    inset: 0;
    background-color: #0b2118;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(197, 160, 89, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(197, 160, 89, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, #0b2118 0%, #112d17 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .endpaper-logo-watermark {
    position: absolute;
    width: 140px;
    height: 140px;
    border: 1px solid rgba(197, 160, 89, 0.08);
    border-radius: 50%;
    transform: rotate(45deg);
  }

  .endpaper-gold-seal {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(197, 160, 89, 0.35);
    padding: 16px;
    border-radius: 50%;
    background-color: rgba(11, 33, 24, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .seal-text {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #E5C079;
    text-align: center;
    margin: 4px 0;
    width: 70px;
  }

  .seal-star {
    color: #E5C079;
    font-size: 6px;
  }

  /* Flyleaf One Back (First Title Page) */
  .flyleaf-content-first {
    align-items: center;
    text-align: center;
  }

  .flyleaf-first-p {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: #8a6f27;
  }

  .flyleaf-huge-year {
    font-family: Georgia, serif;
    font-size: 36px;
    font-weight: 700;
    color: #112d17;
    margin: 8px 0;
    letter-spacing: 0.05em;
  }

  .flyleaf-line {
    width: 60px;
    height: 1px;
    background-color: #E5C079;
    margin-bottom: 12px;
  }

  .flyleaf-first-sub {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #666;
  }

  /* Flyleaf Layer Positioning */
  .book-flyleaf--one {
    transform: translateZ(10.5px);
  }

  .book-flyleaf--two {
    transform: translateZ(9.8px);
  }

  /* Closed State (Default) */
  .book-flyleaf--one {
    transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
  }
  .book-flyleaf--two {
    transition: transform 1.1s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  /* Opened State (Hovered) */
  .book-flyleaf--one.is-open {
    transform: translateZ(${(PAGE_BLOCK_THICKNESS + COVER_THICKNESS) / 2 + 2}px) rotateY(-135deg);
    transition: transform 1.4s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
  }

  .book-flyleaf--two.is-open {
    transform: translateZ(${(PAGE_BLOCK_THICKNESS + COVER_THICKNESS) / 2 + 1}px) rotateY(-115deg);
    transition: transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }

  /* 7. FRONT COVER HINGE CONTAINER */
  .book-front-cover-hinge {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform-origin: left center;
    transform: translateZ(${(PAGE_BLOCK_THICKNESS + COVER_THICKNESS) / 2}px);
    transition: transform 1.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
    z-index: 10;
  }

  .book-front-cover-hinge.is-open {
    transform: translateZ(${(PAGE_BLOCK_THICKNESS + COVER_THICKNESS) / 2 + 3}px) rotateY(-155deg);
    transition: transform 1.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  /* Solid 3D Front Cover Board */
  .book-front-cover {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
  }

  .book-front-face {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    border-radius: 0 4px 4px 0;
    backface-visibility: hidden;
    transform: translateZ(${COVER_THICKNESS / 2}px);
    box-shadow:
      2px 0 4px rgba(0, 0, 0, 0.15),
      inset -1px 0 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
    filter: saturate(1.2) contrast(1.3);
  }


  /* Specular glossy sheen that moves with the cursor */
  .book-front-sheen {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 0.25) 48%,
      rgba(255, 255, 255, 0.45) 50%,
      rgba(255, 255, 255, 0.25) 52%,
      rgba(255, 255, 255, 0) 65%
    );
    pointer-events: none;
    transition: transform 0.1s ease-out;
  }


 

  /* Dynamic shadow on the cover as it turns */
  .page-curl-shadow {
    position: absolute;
    inset: 0;
    border-radius: 0 4px 4px 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.02) 40%,
      rgba(255, 255, 255, 0.1) 70%,
      rgba(0, 0, 0, 0.15) 90%,
      rgba(0, 0, 0, 0.35) 100%
    );
    opacity: 0;
    transition: opacity 1.2s ease;
    pointer-events: none;
  }

  .book-outer.is-open .page-curl-shadow {
    opacity: 1;
  }

  /* Inside Cover Paper Face */
  .book-front-inside {
    position: absolute;
    inset: 0;
    background: #f6f4ee;
    border-radius: 4px 0 0 4px;
    transform: rotateY(180deg) translateZ(${COVER_THICKNESS / 2}px);
    backface-visibility: hidden;
    overflow: hidden;
    box-shadow: inset -14px 0 28px rgba(0, 0, 0, 0.06);
  }

  .book-front-inside-paper {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.005) 0px,
        rgba(0,0,0,0.005) 1px,
        transparent 1px,
        transparent 2px
      );
    box-shadow: inset -20px 0 40px rgba(0, 0, 0, 0.08);
  }

  /* Spine joint crease on inside cover */
  .book-front-inside-joint {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 14px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08));
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* Front Cover 3D Edges (Cream/White to match cover face) */
  .book-front-edge {
    position: absolute;
    background: linear-gradient(90deg, #e5e2da, #fcfaf4, #e5e2da);
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.15);
  }

  .book-front-edge--top {
    top: -1.5px;
    left: 0;
    right: 0;
    height: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateX(90deg);
  }

  .book-front-edge--bottom {
    bottom: -1.5px;
    left: 0;
    right: 0;
    height: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateX(90deg);
  }

  .book-front-edge--right {
    top: 0;
    bottom: 0;
    right: -1.5px;
    width: ${COVER_THICKNESS}px;
    transform-origin: center center;
    transform: rotateY(90deg);
  }

  /* Light edge glow on page block only (behind core page, not on top of it) */
  .book-cover-cast-shadow {
    background: linear-gradient(
      90deg,
      rgba(229, 192, 121, 0.06) 0%,
      rgba(255, 255, 255, 0.04) 25%,
      transparent 55%
    );
    transform: translateZ(${PAGE_BLOCK_THICKNESS / 2 - 0.5}px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease 0.15s;
    z-index: 2;
    border-radius: 0 3px 3px 0;
  }

  .book-outer.is-open .book-cover-cast-shadow {
    opacity: 0.6;
    transition: opacity 0.4s ease 0.2s;
  }

  /* BUTTONS CONTAINER */
  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 80%;
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.6s ease 0.6s,
      transform 0.7s cubic-bezier(0.25, 1, 0.3, 1) 0.6s;
    z-index: 5;
  }

  .book-outer.is-open .buttons-container {
    opacity: 1;
    transform: translateY(0);
  }

  .book-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 18px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 220ms cubic-bezier(0.25, 1, 0.3, 1), box-shadow 220ms ease, background-color 220ms ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  .read-btn {
    background-color: #112d17;
    color: #ffffff;
    border: 1px solid rgba(197, 160, 89, 0.25);
  }

  .read-btn:hover {
    background-color: #173d1f;
    transform: translateY(-2.5px);
    box-shadow: 
      0 6px 16px rgba(17, 45, 23, 0.35),
      0 0 0 1px rgba(197, 160, 89, 0.4);
  }

  .download-btn {
    background-color: #ffffff;
    color: #222222;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .download-btn:hover {
    background-color: #fbfbf9;
    color: #000000;
    transform: translateY(-2.5px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }

  /* RESPONSIVE FIXES */
  @media (max-width: 640px) {
    .book-outer {
      width: 240px;
      height: 328px;
    }

    .book-spine {
      width: 20px;
      left: -10px;
    }

    .book-back-cover {
      transform: translateZ(-8.5px);
    }

    .book-back-edge--top { height: ${COVER_THICKNESS}px; top: -1.5px; }
    .book-back-edge--bottom { height: ${COVER_THICKNESS}px; bottom: -1.5px; }
    .book-back-edge--right { width: ${COVER_THICKNESS}px; right: -1.5px; }

    .book-inner-sheet {
      left: 0;
      width: calc(100% - 4px);
    }

    .book-pages-top { height: 14px; top: -7px; }
    .book-pages-bottom { height: 14px; bottom: -7px; }
    .book-pages-fore { width: 14px; right: -7px; }

    .book-inside-page {
      transform: translateZ(7px);
    }

    .book-inside-border {
      inset: 12px 12px 12px 32px;
    }

    .book-inside-content {
      padding: 18px 12px 18px 32px;
    }

    .flyleaf-content {
      padding: 24px 16px 24px 36px;
    }

    .book-inside-title {
      font-size: 13px;
    }

    .book-inside-corp {
      font-size: 8px;
    }

    .book-inside-subtitle {
      font-size: 9px;
    }

    .book-flyleaf--one {
      transform: translateZ(8.5px);
    }

    .book-flyleaf--two {
      transform: translateZ(7.8px);
    }

    .book-flyleaf--one.is-open {
      transform: translateZ(10.5px) rotateY(-130deg);
    }

    .book-flyleaf--two.is-open {
      transform: translateZ(9.8px) rotateY(-110deg);
    }

    .book-front-cover-hinge {
      transform: translateZ(8.5px);
    }

    .book-front-cover-hinge.is-open {
      transform: translateZ(11.5px) rotateY(-145deg);
    }

    .book-front-edge--top { height: ${COVER_THICKNESS}px; top: -1.5px; }
    .book-front-edge--bottom { height: ${COVER_THICKNESS}px; bottom: -1.5px; }
    .book-front-edge--right { width: ${COVER_THICKNESS}px; right: -1.5px; }

    .book-cover-cast-shadow {
      transform: translateZ(7.5px);
    }

    .buttons-container {
      gap: 8px;
      width: 85%;
    }

    .book-btn {
      padding: 9px 12px;
      font-size: 11px;
    }
  }

  /* ACCESSIBILITY: REDUCED MOTION */
  @media (prefers-reduced-motion: reduce) {
    .book-shell,
    .book-front-cover-hinge,
    .book-flyleaf,
    .book-shadow-soft,
    .book-shadow-crisp,
    .buttons-container,
    .page-curl-shadow,
    .page-fold-shade,
    .page-shadow-overlay,
    .book-inside-highlight,
    .book-cover-cast-shadow {
      transition: none !important;
      animation: none !important;
    }

    .book-outer.is-open .page-fold-shade,
    .book-outer.is-open .page-shadow-overlay--light,
    .book-outer.is-open .page-shadow-overlay--medium {
      opacity: 1;
    }

    .book-front-cover-hinge.is-open {
      transform: translateZ(10.5px) rotateY(-145deg) !important;
    }

    .book-flyleaf--one.is-open {
      transform: translateZ(10.5px) rotateY(-130deg) !important;
    }

    .book-flyleaf--two.is-open {
      transform: translateZ(9.8px) rotateY(-110deg) !important;
    }

    .book-outer.is-open .buttons-container {
      opacity: 1;
      transform: none;
    }
  }
`;
