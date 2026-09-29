"use client";

import {
  FABRICS,
  FABRIC_COLORS,
  COLLAR_TYPES,
  PLACKETS,
  BUTTON_STYLES,
  BUTTON_COLORS,
  CUFFS,
  SLEEVES,
  CHEST_POCKETS,
  SIDE_POCKETS,
  EMBROIDERY_TYPES,
  EMBROIDERY_COLORS,
  CONTRAST_COLORS,
  STITCH_COLORS,
  MONOGRAM_COLORS,
} from "@/config/customThobe";

export default function ThobePreview({ config }) {
  const fabric = FABRICS.find((f) => f.id === config.fabric) || FABRICS[0];
  const colorObj =
    FABRIC_COLORS.find((c) => c.id === config.fabricColor) || FABRIC_COLORS[0];
  const colorHex = colorObj.hex;

  const collar = COLLAR_TYPES.find((c) => c.id === config.collarType) || COLLAR_TYPES[0];
  const placket = PLACKETS.find((p) => p.id === config.placket) || PLACKETS[0];
  const buttonStyle = BUTTON_STYLES.find((b) => b.id === config.buttonStyle) || BUTTON_STYLES[0];
  const buttonColorObj =
    BUTTON_COLORS.find((b) => b.id === config.buttonColor) || BUTTON_COLORS[0];
  const buttonHex =
    buttonColorObj.hex ||
    colorHex;
  const cuff = CUFFS.find((c) => c.id === config.cuff) || CUFFS[0];
  const sleeve = SLEEVES.find((s) => s.id === config.sleeve) || SLEEVES[0];
  const chestPocket = CHEST_POCKETS.find((p) => p.id === config.chestPocket) || CHEST_POCKETS[0];
  const sidePocket = SIDE_POCKETS.find((p) => p.id === config.sidePocket) || SIDE_POCKETS[0];
  const embroidery = EMBROIDERY_TYPES.find((e) => e.id === config.embroidery) || EMBROIDERY_TYPES[0];
  const embColorObj =
    EMBROIDERY_COLORS.find((e) => e.id === config.embroideryColor) || EMBROIDERY_COLORS[0];
  const embColor = embColorObj.hex || colorHex;

  const stitchColorObj =
    STITCH_COLORS.find((s) => s.id === config.stitchColor) || STITCH_COLORS[0];
  const stitchHex = stitchColorObj.hex || colorHex;

  const monogramColorObj =
    MONOGRAM_COLORS.find((m) => m.id === config.monogramColor) || MONOGRAM_COLORS[0];
  const monogramHex = monogramColorObj.hex;

  // Contrast color for collar
  const collarContrastObj =
    CONTRAST_COLORS.find((c) => c.id === config.collarContrastColor) || CONTRAST_COLORS[0];
  const collarContrastHex =
    config.collarContrast === "contrast-color" || config.collarContrast === "contrast-fabric"
      ? collarContrastObj.hex
      : colorHex;

  // Shade helper
  const shade = (hex, percent) => {
    try {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, Math.min(255, (num >> 16) + amt));
      const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
      const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    } catch (e) {
      return hex;
    }
  };

  const darkShade = shade(colorHex, -25);
  const deepShade = shade(colorHex, -40);
  const lightShade = shade(colorHex, 15);

  // Fit width modifiers
  const fitW =
    config.fit === "slim" ? 0.85 :
    config.fit === "comfort" ? 1.05 :
    config.fit === "relaxed" ? 1.12 : 1;

  // Texture opacity
  const textureOpacity =
    fabric.texture === "textured" ? 0.22 :
    fabric.texture === "luxurious" ? 0.14 :
    fabric.texture === "smooth" ? 0.06 : 0.03;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 300 550"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="tex" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            {fabric.texture === "textured" && (
              <>
                <line x1="0" y1="0" x2="6" y2="6" stroke={darkShade} strokeWidth="0.3" opacity="0.6" />
                <line x1="6" y1="0" x2="0" y2="6" stroke={darkShade} strokeWidth="0.3" opacity="0.6" />
              </>
            )}
            {fabric.texture === "smooth" && (
              <circle cx="3" cy="3" r="0.5" fill={lightShade} opacity="0.5" />
            )}
            {fabric.texture === "luxurious" && (
              <>
                <rect x="0" y="0" width="3" height="3" fill={lightShade} opacity="0.2" />
                <rect x="3" y="3" width="3" height="3" fill={deepShade} opacity="0.15" />
              </>
            )}
          </pattern>

          <linearGradient id="foldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lightShade} stopOpacity="0.3" />
            <stop offset="50%" stopColor={colorHex} stopOpacity="0" />
            <stop offset="100%" stopColor={deepShade} stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="shadowSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={deepShade} stopOpacity="0.5" />
            <stop offset="25%" stopColor={colorHex} stopOpacity="0" />
            <stop offset="75%" stopColor={colorHex} stopOpacity="0" />
            <stop offset="100%" stopColor={deepShade} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Mannequin (faded) */}
        <g opacity="0.06">
          <circle cx="150" cy="45" r="22" fill="#000" />
          <rect x="140" y="65" width="20" height="22" rx="3" fill="#000" />
          <rect x="125" y="87" width="50" height="90" rx="5" fill="#000" />
          <rect x="130" y="177" width="40" height="120" rx="5" fill="#000" />
        </g>

        <g>
          {/* Main Body */}
          <path
            d={`
              M ${135 - (1 - fitW) * 25},110
              Q 150,105 ${165 + (1 - fitW) * 25},110
              L ${185 * fitW + 15},135
              L ${195 * fitW + 10},175
              L ${200 * fitW + 5},415
              Q 155,425 ${100 * fitW},415
              L ${95 * fitW},175
              L ${105 * fitW - 10},135
              Z
            `}
            fill={colorHex}
            stroke={darkShade}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <path
            d={`
              M ${135 - (1 - fitW) * 25},110
              Q 150,105 ${165 + (1 - fitW) * 25},110
              L ${185 * fitW + 15},135
              L ${195 * fitW + 10},175
              L ${200 * fitW + 5},415
              Q 155,425 ${100 * fitW},415
              L ${95 * fitW},175
              L ${105 * fitW - 10},135
              Z
            `}
            fill="url(#tex)"
            opacity={textureOpacity}
          />

          <path
            d={`
              M ${135 - (1 - fitW) * 25},110
              Q 150,105 ${165 + (1 - fitW) * 25},110
              L ${185 * fitW + 15},135
              L ${195 * fitW + 10},175
              L ${200 * fitW + 5},415
              Q 155,425 ${100 * fitW},415
              L ${95 * fitW},175
              L ${105 * fitW - 10},135
              Z
            `}
            fill="url(#foldGrad)"
            opacity="0.25"
          />

          <path
            d={`
              M ${135 - (1 - fitW) * 25},110
              Q 150,105 ${165 + (1 - fitW) * 25},110
              L ${185 * fitW + 15},135
              L ${195 * fitW + 10},175
              L ${200 * fitW + 5},415
              Q 155,425 ${100 * fitW},415
              L ${95 * fitW},175
              L ${105 * fitW - 10},135
              Z
            `}
            fill="url(#shadowSide)"
          />

          {/* Center fold line */}
          <line x1={150 * fitW} y1="125" x2={150 * fitW} y2="415" stroke={darkShade} strokeWidth="0.4" opacity="0.3" />

          {/* ===== SIDE SLITS ===== */}
          {(config.sideDesign === "standard-slit" || config.sideDesign === "deep-slit") && (
            <>
              <line x1={95 * fitW + 5} y1={380} x2={95 * fitW + 5} y2="415" stroke={deepShade} strokeWidth="1.5" />
              <line x1={200 * fitW} y1={380} x2={200 * fitW} y2="415" stroke={deepShade} strokeWidth="1.5" />
            </>
          )}
          {config.sideDesign === "deep-slit" && (
            <>
              <line x1={95 * fitW + 5} y1={340} x2={95 * fitW + 5} y2="415" stroke={deepShade} strokeWidth="1.5" />
              <line x1={200 * fitW} y1={340} x2={200 * fitW} y2="415" stroke={deepShade} strokeWidth="1.5" />
            </>
          )}

          {/* ===== LEFT SLEEVE ===== */}
          <path
            d={`
              M ${105 * fitW - 10},135
              L ${60 * fitW},175
              L ${50 * fitW},320
              Q ${55 * fitW},340 ${75 * fitW},340
              L ${95 * fitW},185
            `}
            fill={colorHex}
            stroke={darkShade}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d={`
              M ${105 * fitW - 10},135
              L ${60 * fitW},175
              L ${50 * fitW},320
              Q ${55 * fitW},340 ${75 * fitW},340
              L ${95 * fitW},185
            `}
            fill="url(#tex)"
            opacity={textureOpacity}
          />

          {/* ===== RIGHT SLEEVE ===== */}
          <path
            d={`
              M ${185 * fitW + 15},135
              L ${240 * fitW - 10},175
              L ${250 * fitW - 10},320
              Q ${245 * fitW - 10},340 ${225 * fitW - 10},340
              L ${205 * fitW},185
            `}
            fill={colorHex}
            stroke={darkShade}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d={`
              M ${185 * fitW + 15},135
              L ${240 * fitW - 10},175
              L ${250 * fitW - 10},320
              Q ${245 * fitW - 10},340 ${225 * fitW - 10},340
              L ${205 * fitW},185
            `}
            fill="url(#tex)"
            opacity={textureOpacity}
          />

          {/* ===== CUFFS ===== */}
          {cuff.id === "standard" && (
            <>
              <rect x={53 * fitW} y={318} width={20 * fitW} height="16" fill={colorHex} stroke={darkShade} strokeWidth="1" />
              <rect x={227 * fitW - 10} y={318} width={20 * fitW} height="16" fill={colorHex} stroke={darkShade} strokeWidth="1" />
            </>
          )}
          {cuff.id === "french" && (
            <>
              <rect x={50 * fitW} y={312} width={24 * fitW} height="24" fill={colorHex} stroke={darkShade} strokeWidth="1.5" />
              <rect x={226 * fitW - 10} y={312} width={24 * fitW} height="24" fill={colorHex} stroke={darkShade} strokeWidth="1.5" />
              <line x1={50 * fitW} y1={324} x2={74 * fitW} y2={324} stroke={deepShade} strokeWidth="0.5" />
              <line x1={226 * fitW - 10} y1={324} x2={250 * fitW - 10} y2={324} stroke={deepShade} strokeWidth="0.5" />
            </>
          )}
          {cuff.id === "royal" && (
            <>
              <rect x={48 * fitW} y={310} width={26 * fitW} height="26" fill={lightShade} stroke={darkShade} strokeWidth="1.5" />
              <rect x={226 * fitW - 10} y={310} width={26 * fitW} height="26" fill={lightShade} stroke={darkShade} strokeWidth="1.5" />
              <line x1={48 * fitW} y1={318} x2={74 * fitW} y2={318} stroke="#C8A96B" strokeWidth="1.5" />
              <line x1={226 * fitW - 10} y1={318} x2={252 * fitW - 10} y2={318} stroke="#C8A96B" strokeWidth="1.5" />
            </>
          )}

          {/* Cuff buttons */}
          {config.cuffButton !== "none" && (
            <>
              <circle cx={63 * fitW} cy={327} r="2" fill={buttonHex} stroke={darkShade} strokeWidth="0.5" />
              <circle cx={237 * fitW - 10} cy={327} r="2" fill={buttonHex} stroke={darkShade} strokeWidth="0.5" />
            </>
          )}

          {/* ===== COLLAR ===== */}
          <g>
            {collar.id === "mandarin" && (
              <>
                <path d="M 140,108 L 160,108 L 160,126 L 140,126 Z" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <line x1="140" y1="118" x2="160" y2="118" stroke={darkShade} strokeWidth="0.5" opacity="0.4" />
              </>
            )}
            {collar.id === "classic" && (
              <>
                <path d="M 140,108 L 150,128 L 150,108 Z" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <path d="M 160,108 L 150,128 L 150,108 Z" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
              </>
            )}
            {collar.id === "royal" && (
              <>
                <rect x="136" y="105" width="28" height="22" rx="2" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <rect x="136" y="105" width="28" height="4" fill={deepShade} />
                <circle cx="150" cy="119" r="1.5" fill="#C8A96B" />
              </>
            )}
            {collar.id === "round" && (
              <>
                <ellipse cx="150" cy="120" rx="18" ry="10" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <ellipse cx="150" cy="120" rx="14" ry="7" fill="none" stroke={darkShade} strokeWidth="0.5" opacity="0.5" />
              </>
            )}
            {collar.id === "band" && (
              <>
                <rect x="140" y="108" width="20" height="16" rx="2" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <line x1="150" y1="108" x2="150" y2="124" stroke={darkShade} strokeWidth="0.5" />
              </>
            )}
            {collar.id === "emirati" && (
              <>
                <rect x="135" y="105" width="30" height="20" rx="3" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <circle cx="143" cy="115" r="1" fill={deepShade} />
                <circle cx="157" cy="115" r="1" fill={deepShade} />
              </>
            )}
            {collar.id === "custom" && (
              <>
                <path d="M 137,108 L 163,108 L 158,125 L 142,125 Z" fill={collarContrastHex} stroke={darkShade} strokeWidth="1.5" />
                <circle cx="150" cy="116" r="1.5" fill={deepShade} />
              </>
            )}
          </g>

          {/* ===== PLACKET ===== */}
          {placket.id !== "hidden" && (
            <>
              <rect
                x={placket.id === "minimal" ? 147 : placket.id === "half" ? 145 : 143}
                y="126"
                width={placket.id === "minimal" ? 6 : placket.id === "half" ? 10 : 14}
                height={placket.id === "full" ? 285 : placket.id === "half" ? 130 : 220}
                fill={colorHex}
                stroke={darkShade}
                strokeWidth="1"
              />
              <line
                x1="150"
                y1="126"
                x2="150"
                y2={placket.id === "full" ? 411 : placket.id === "half" ? 256 : 346}
                stroke={darkShade}
                strokeWidth="0.3"
                opacity="0.5"
              />
            </>
          )}

          {/* ===== BUTTONS ===== */}
          {placket.id !== "hidden" && (
            <g>
              {Array.from({
                length: placket.id === "full" ? 8 : placket.id === "half" ? 5 : 4,
              }).map((_, i) => {
                const stepY = placket.id === "full" ? 34 : placket.id === "half" ? 30 : 55;
                const isHidden = buttonStyle.id === "hidden";
                return (
                  <circle
                    key={i}
                    cx={150}
                    cy={140 + i * stepY}
                    r={buttonStyle.id === "premium-metal" ? "3.5" : "3"}
                    fill={buttonHex}
                    stroke={darkShade}
                    strokeWidth="0.6"
                    opacity={isHidden ? 0.4 : 1}
                  />
                );
              })}
            </g>
          )}

          {/* ===== CHEST POCKETS ===== */}
          {(chestPocket.id === "left" || chestPocket.id === "both") && (
            <>
              <rect x={112 * fitW} y="185" width="24" height="32" rx="1" fill="none" stroke={darkShade} strokeWidth="1.2" />
              <line x1={112 * fitW} y1="188" x2={136 * fitW} y2="188" stroke={darkShade} strokeWidth="0.6" />
            </>
          )}
          {(chestPocket.id === "right" || chestPocket.id === "both") && (
            <>
              <rect x={164 * fitW} y="185" width="24" height="32" rx="1" fill="none" stroke={darkShade} strokeWidth="1.2" />
              <line x1={164 * fitW} y1="188" x2={188 * fitW} y2="188" stroke={darkShade} strokeWidth="0.6" />
            </>
          )}

          {/* ===== SIDE POCKETS ===== */}
          {(sidePocket.id === "left" || sidePocket.id === "both") && (
            <path
              d={`M ${98 * fitW},260 L ${118 * fitW},265`}
              stroke={darkShade}
              strokeWidth="1.5"
              fill="none"
            />
          )}
          {(sidePocket.id === "right" || sidePocket.id === "both") && (
            <path
              d={`M ${202 * fitW},260 L ${182 * fitW},265`}
              stroke={darkShade}
              strokeWidth="1.5"
              fill="none"
            />
          )}

          {/* ===== EMBROIDERY ===== */}
          {embroidery.id !== "none" && (
            <g opacity="0.9">
              {(embroidery.id === "minimal" || embroidery.id === "chest") && (
                <circle cx="150" cy="225" r="8" fill="none" stroke={embColor} strokeWidth="1.5" />
              )}
              {embroidery.id === "collar" && (
                <g stroke={embColor} strokeWidth="1" fill="none">
                  <path d="M 140,110 L 160,110 L 160,122 L 140,122" />
                  <circle cx="150" cy="116" r="2" fill={embColor} />
                </g>
              )}
              {embroidery.id === "cuff" && (
                <>
                  <circle cx={63 * fitW} cy={327} r="4" fill="none" stroke={embColor} strokeWidth="1" />
                  <circle cx={237 * fitW - 10} cy={327} r="4" fill="none" stroke={embColor} strokeWidth="1" />
                </>
              )}
              {embroidery.id === "custom" && (
                <g stroke={embColor} strokeWidth="1" fill="none">
                  <circle cx="150" cy="225" r="10" />
                  <circle cx="150" cy="225" r="6" />
                  <path d="M 150,215 L 150,235 M 140,225 L 160,225" />
                </g>
              )}
            </g>
          )}

          {/* ===== MONOGRAM ===== */}
          {config.monogramText && (
            <text
              x={config.monogramPlacement === "chest" ? "150" : config.monogramPlacement === "cuff" ? `${63 * fitW}` : "150"}
              y={config.monogramPlacement === "chest" ? "270" : config.monogramPlacement === "cuff" ? "328" : "280"}
              textAnchor="middle"
              fontSize={config.monogramPlacement === "cuff" ? "6" : "12"}
              fill={monogramHex}
              fontFamily="serif"
              fontWeight="700"
              letterSpacing="2"
            >
              {config.monogramText.toUpperCase()}
            </text>
          )}

          {/* ===== HEM ===== */}
          <line
            x1={100 * fitW}
            y1="415"
            x2={200 * fitW + 5}
            y2="415"
            stroke={deepShade}
            strokeWidth="1.5"
            opacity="0.6"
          />
        </g>

        {/* Labels */}
        <text x="150" y="470" textAnchor="middle" fontSize="10" fill="#999" fontFamily="serif" letterSpacing="3" fontWeight="600">
          {(collar.name || "").toUpperCase()}
        </text>
        <text x="150" y="485" textAnchor="middle" fontSize="8" fill="#BBB" fontFamily="serif" letterSpacing="2">
          {(fabric.name || "").toUpperCase()} • {(colorObj.name || "").toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
