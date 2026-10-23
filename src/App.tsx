import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line,
  Area, ReferenceLine, LabelList
} from 'recharts';
import {
  LayoutDashboard, Table as TableIcon, AlertCircle, BarChart3, TrendingUp,
  Activity, Target, Calendar, FolderKanban, Layers, Sparkles, Filter, X,
  HardHat, Building2, Database, Search, ChevronRight, ChevronDown, RefreshCw,
  Flame, ShieldAlert, Gauge, Globe, Clock, Award
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PALETA ARMÓNICA Y COLORIMETRÍA (Tema_propio.json)
// ═══════════════════════════════════════════════════════════════════════════
const THEME_BLUE       = '#448FF2';
const THEME_GREEN      = '#33A650';
const THEME_GOLD       = '#F2B807';
const THEME_ORANGE     = '#F25C05';
const THEME_RED        = '#F23838';
const THEME_CYAN       = '#46BCC6';
const THEME_LIME       = '#73E046';
const THEME_STEEL      = '#3599B8';
const THEME_TURQUOISE  = '#4AC5BB';
const THEME_SLATE      = '#5F6B6D';
const THEME_LIGHT_BLUE = '#A4DDEE';
const THEME_TEAL_DARK  = '#28738A';
const THEME_SEA_GREEN  = '#168980';
const THEME_CHARCOAL   = '#293537';
const THEME_PETROL     = '#1B4D5C';
const THEME_FOREST     = '#0F5C55';
const THEME_DARKEST    = '#1C2325';

const VMGA_GRADIENT   = `linear-gradient(135deg, ${THEME_PETROL} 0%, ${THEME_TEAL_DARK} 50%, ${THEME_BLUE} 100%)`;
const VMDERN_GRADIENT = `linear-gradient(135deg, ${THEME_FOREST} 0%, ${THEME_SEA_GREEN} 55%, ${THEME_GREEN} 100%)`;
const OCT_GRADIENT    = `linear-gradient(135deg, ${THEME_DARKEST} 0%, ${THEME_PETROL} 60%, ${THEME_TEAL_DARK} 100%)`;
const ALERT_GRADIENT  = `linear-gradient(135deg, #BB4A4A 0%, ${THEME_RED} 100%)`;
const HALLOWEEN_GRAD  = `linear-gradient(135deg, #FF7A00 0%, ${THEME_ORANGE} 55%, #C2410C 100%)`;

const SEM_COLOR_ALTO  = '#059669';
const SEM_COLOR_MEDIO = '#d97706';
const SEM_COLOR_BAJO  = '#e11d48';

// Ícono SVG de Calabaza para cabeceras de Octubre
const PumpkinBadge = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
    <span>OCTUBRE</span>
    <span
      role="img"
      aria-label="calabaza"
      style={{
        fontSize: 15,
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))',
        lineHeight: 1,
      }}
    >
      🎃
    </span>
  </span>
);

const MESES_CONFIG = [
  { num: 1,  label: 'Enero',     short: 'Ene', colDev: 'DEVENGADO_ENERO',     colProg: 'PROGRAMACION ENERO',     aliasesDev: ['MTO_DEVENGA_01', 'DEVENGADO_ENERO', 'DEVENGADO ENERO', 'DEV_ENE'],         aliasesProg: ['PROGRAMACION ENERO', 'PROGRAMACION_ENERO', 'PROG_ENERO', 'ENERO'] },
  { num: 2,  label: 'Febrero',   short: 'Feb', colDev: 'DEVENGADO_FEBRERO',   colProg: 'PROGRAMACION FEBRERO',   aliasesDev: ['MTO_DEVENGA_02', 'DEVENGADO_FEBRERO', 'DEVENGADO FEBRERO', 'DEV_FEB'],     aliasesProg: ['PROGRAMACION FEBRERO', 'PROGRAMACION_FEBRERO', 'PROG_FEBRERO', 'FEBRERO'] },
  { num: 3,  label: 'Marzo',     short: 'Mar', colDev: 'DEVENGADO_MARZO',     colProg: 'PROGRAMACION MARZO',     aliasesDev: ['MTO_DEVENGA_03', 'DEVENGADO_MARZO', 'DEVENGADO MARZO', 'DEV_MAR'],         aliasesProg: ['PROGRAMACION MARZO', 'PROGRAMACION_MARZO', 'PROG_MARZO', 'PROG_MARZO_TOTAL_MARZO', 'MARZO'] },
  { num: 4,  label: 'Abril',     short: 'Abr', colDev: 'DEVENGADO_ABRIL',     colProg: 'PROGRAMACION ABRIL',     aliasesDev: ['MTO_DEVENGA_04', 'DEVENGADO_ABRIL', 'DEVENGADO ABRIL', 'DEV_ABR'],         aliasesProg: ['PROGRAMACION ABRIL', 'PROGRAMACION_ABRIL', 'PROG_ABRIL', 'PROG_ABRIL_TOTAL_ABRIL', 'ABRIL'] },
  { num: 5,  label: 'Mayo',      short: 'May', colDev: 'DEVENGADO_MAYO',      colProg: 'PROGRAMACION MAYO',      aliasesDev: ['MTO_DEVENGA_05', 'DEVENGADO_MAYO', 'DEVENGADO MAYO', 'DEV_MAY'],           aliasesProg: ['PROGRAMACION MAYO', 'PROGRAMACION_MAYO', 'PROG_MAYO', 'PROG_ABRIL_MAYO', 'MAYO'] },
  { num: 6,  label: 'Junio',     short: 'Jun', colDev: 'DEVENGADO_JUNIO',     colProg: 'PROGRAMACION JUNIO',     aliasesDev: ['MTO_DEVENGA_06', 'DEVENGADO_JUNIO', 'DEVENGADO JUNIO', 'DEV_JUN'],         aliasesProg: ['PROGRAMACION JUNIO', 'PROGRAMACION_JUNIO', 'PROG_JUNIO', 'PROG_ABRIL_JUNIO', 'JUNIO'] },
  { num: 7,  label: 'Julio',     short: 'Jul', colDev: 'DEVENGADO_JULIO',     colProg: 'PROGRAMACION JULIO',     aliasesDev: ['MTO_DEVENGA_07', 'DEVENGADO_JULIO', 'DEVENGADO JULIO', 'DEV_JUL'],         aliasesProg: ['PROGRAMACION JULIO', 'PROGRAMACION_JULIO', 'PROG_JULIO', 'PROG_ABRIL_JULIO', 'JULIO'] },
  { num: 8,  label: 'Agosto',    short: 'Ago', colDev: 'DEVENGADO_AGOSTO',    colProg: 'PROGRAMACION AGOSTO',    aliasesDev: ['MTO_DEVENGA_08', 'DEVENGADO_AGOSTO', 'DEVENGADO AGOSTO', 'DEV_AGO'],       aliasesProg: ['PROGRAMACION AGOSTO', 'PROGRAMACION_AGOSTO', 'PROG_AGOSTO', 'PROG_ABRIL_AGOSTO', 'AGOSTO'] },
  { num: 9,  label: 'Setiembre', short: 'Set', colDev: 'DEVENGADO_SETIEMBRE', colProg: 'PROGRAMACION SETIEMBRE', aliasesDev: ['MTO_DEVENGA_09', 'DEVENGADO_SETIEMBRE', 'DEVENGADO SEPTIEMBRE', 'DEV_SET'], aliasesProg: ['PROGRAMACION SETIEMBRE', 'PROGRAMACION_SETIEMBRE', 'PROG_SETIEMBRE', 'PROG_ABRIL_SETIEMBRE', 'PROGRAMACION SEPTIEMBRE', 'SETIEMBRE', 'SEPTIEMBRE'] },
  { num: 10, label: 'Octubre',   short: 'Oct', colDev: 'DEVENGADO_OCTUBRE',   colProg: 'PROGRAMACION OCTUBRE',   aliasesDev: ['MTO_DEVENGA_10', 'DEVENGADO_OCTUBRE', 'DEVENGADO OCTUBRE', 'DEV_OCT'],     aliasesProg: ['TOTAL OCTUBRE', 'PROGRAMACION OCTUBRE', 'PROGRAMACION_OCTUBRE', 'PROG_OCTUBRE', 'PROG_ABRIL_OCTUBRE'] },
  { num: 11, label: 'Noviembre', short: 'Nov', colDev: 'DEVENGADO_NOVIEMBRE', colProg: 'PROGRAMACION NOVIEMBRE', aliasesDev: ['MTO_DEVENGA_11', 'DEVENGADO_NOVIEMBRE', 'DEVENGADO NOVIEMBRE', 'DEV_NOV'], aliasesProg: ['NOVIEMBRE', 'PROGRAMACION NOVIEMBRE', 'PROGRAMACION_NOVIEMBRE', 'PROG_NOVIEMBRE', 'PROG_ABRIL_NOVIEMBRE'] },
  { num: 12, label: 'Diciembre', short: 'Dic', colDev: 'DEVENGADO_DICIEMBRE', colProg: 'PROGRAMACION DICIEMBRE', aliasesDev: ['MTO_DEVENGA_12', 'DEVENGADO_DICIEMBRE', 'DEVENGADO DICIEMBRE', 'DEV_DIC'], aliasesProg: ['DICIEMBRE', 'PROGRAMACION DICIEMBRE', 'PROGRAMACION_DICIEMBRE', 'PROG_DICIEMBRE', 'PROG_ABRIL_DICIEMBRE'] },
];

const fmt = (v: any) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(Number(v) || 0);

const fmtC = (v: any) => {
  const n = Number(v) || 0;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}S/ ${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}S/ ${(abs / 1e3).toFixed(0)}k`;
  return `${sign}S/ ${abs.toFixed(0)}`;
};

const fmtM = (v: any) =>
  `S/ ${((Number(v) || 0) / 1e6).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`;

const formatPPConcat = (val: any) => {
  if (!val) return 'SIN DATO';
  const raw = String(val).trim().toUpperCase();
  if (!raw || raw === '-' || raw === 'NAN') return 'SIN DATO';
  if (raw.includes('9001') || raw.includes('ACCIONES CENTRALES')) return 'AC 9001';
  if (raw.includes('9002') || raw.includes('NO RESULTAN EN PRODUCTOS') || raw.includes('APNOP')) return 'APNOP 9002';
  const m = raw.match(/^0*(\d{1,4})/);
  if (m) {
    const num = m[1];
    if (num === '9001') return 'AC 9001';
    if (num === '9002') return 'APNOP 9002';
    return `PP ${num.padStart(3, '0')}`;
  }
  return raw.length > 16 ? raw.slice(0, 16) + '…' : raw;
};

const formatGGShort = (val: any) => {
  const s = String(val || '').trim().toUpperCase();
  if (s.includes('2.1') || s.includes('PERSONAL')) return '2.1 Personal';
  if (s.includes('2.2') || s.includes('PENSIONES')) return '2.2 Pensiones';
  if (s.includes('2.3') || s.includes('BIENES Y SERVICIOS')) return '2.3 Bienes y Serv.';
  if (s.includes('2.4') || s.includes('DONACIONES')) return '2.4 Donaciones y Transf.';
  if (s.includes('2.5') || s.includes('OTROS GASTOS')) return '2.5 Otros Gastos';
  if (s.includes('2.6') || s.includes('ACTIVOS NO FINANCIEROS')) return '2.6 Activos No Fin.';
  if (s.includes('2.7') || s.includes('ACTIVOS FINANCIEROS')) return '2.7 Activos Fin.';
  if (s.includes('2.8') || s.includes('SERVICIO DE LA DEUDA')) return '2.8 Deuda Pública';
  if (s.includes('2.0') || s.includes('RESERVA')) return '2.0 Reserva Conting.';
  return s.length > 22 ? s.slice(0, 22) + '…' : s;
};

// Base referencial de Ministerios del Poder Ejecutivo para el Ranking Nacional (cuando aún no carga o se complementa con SharePoint)
const INITIAL_MINISTERIOS_RANKING = [
  { sector: '36. TRANSPORTE Y COMUNICACIONES', short: 'MTC', pimGen: 14250000000, devGen: 11180000000, pimInv: 9850000000, devInv: 7920000000, pimProy: 9120000000, devProy: 7380000000 },
  { sector: '10. EDUCACION', short: 'MINEDU', pimGen: 18400000000, devGen: 14150000000, pimInv: 3420000000, devInv: 2680000000, pimProy: 3100000000, devProy: 2450000000 },
  { sector: '11. SALUD', short: 'MINSA', pimGen: 13890000000, devGen: 10520000000, pimInv: 2890000000, devInv: 2180000000, pimProy: 2650000000, devProy: 2010000000 },
  { sector: '37. VIVIENDA, CONSTRUCCION Y SANEAMIENTO', short: 'MVCS', pimGen: 5420000000, devGen: 4050000000, pimInv: 4120000000, devInv: 3150000000, pimProy: 3890000000, devProy: 2990000000 },
  { sector: '40. DESARROLLO E INCLUSION SOCIAL', short: 'MIDIS', pimGen: 6950000000, devGen: 5180000000, pimInv: 185000000, devInv: 141000000, pimProy: 150000000, devProy: 115000000 },
  { sector: '13. DESARROLLO AGRARIO Y RIEGO', short: 'MIDAGRI', pimGen: 3980000000, devGen: 2920000000, pimInv: 2450000000, devInv: 1820000000, pimProy: 2210000000, devProy: 1650000000 },
  { sector: '05. AMBIENTE', short: 'MINAM', pimGen: 1043800000, devGen: 749720000, pimInv: 262400000, devInv: 189500000, pimProy: 238900000, devProy: 173200000, isMinam: true },
  { sector: '38. PRODUCCION', short: 'PRODUCE', pimGen: 1290000000, devGen: 912000000, pimInv: 490000000, devInv: 348000000, pimProy: 445000000, devProy: 315000000 },
  { sector: '26. DEFENSA', short: 'MINDEF', pimGen: 8920000000, devGen: 6250000000, pimInv: 1150000000, devInv: 798000000, pimProy: 980000000, devProy: 682000000 },
  { sector: '07. INTERIOR', short: 'MININTER', pimGen: 11850000000, devGen: 8190000000, pimInv: 980000000, devInv: 665000000, pimProy: 810000000, devProy: 552000000 },
  { sector: '01. PRESIDENCIA CONSEJO DE MINISTROS', short: 'PCM', pimGen: 4680000000, devGen: 3180000000, pimInv: 2150000000, devInv: 1460000000, pimProy: 1980000000, devProy: 1350000000 },
  { sector: '16. ENERGIA Y MINAS', short: 'MINEM', pimGen: 1450000000, devGen: 965000000, pimInv: 890000000, devInv: 585000000, pimProy: 840000000, devProy: 552000000 },
  { sector: '09. ECONOMIA Y FINANZAS', short: 'MEF', pimGen: 32500000000, devGen: 21100000000, pimInv: 620000000, devInv: 398000000, pimProy: 540000000, devProy: 345000000 },
  { sector: '35. COMERCIO EXTERIOR Y TURISMO', short: 'MINCETUR', pimGen: 840000000, devGen: 538000000, pimInv: 295000000, devInv: 185000000, pimProy: 270000000, devProy: 169000000 },
];

const TTip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 14, boxShadow: '0 10px 32px rgba(28,35,37,0.18)', border: '1px solid #e2e8f0', zIndex: 999, maxWidth: 340 }}>
      <p style={{ fontWeight: 900, fontSize: 12, marginBottom: 8, color: THEME_DARKEST, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>{label}</p>
      {payload.map((e: any, i: number) => {
        const isPct = String(e.name || '').includes('%') || String(e.name || '').includes('Avance');
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 4, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color || THEME_BLUE }} />
              <span style={{ fontSize: 11, color: THEME_SLATE, fontWeight: 600 }}>{e.name}</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 11, background: '#f8fafc', padding: '2px 7px', borderRadius: 6, color: THEME_DARKEST, fontFamily: 'monospace' }}>
              {isPct ? `${Number(e.value).toFixed(1)}%` : fmt(e.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Componente visual de Embudo (Funnel) con resaltado especial para Sector Ambiental / MINAM
const FunnelRankingCard = ({ title, sub, items, grad }: any) => {
  const maxPct = Math.max(...items.map((x: any) => x.pct || 0), 100);
  return (
    <GCard grad={grad} icon={Award} title={title} sub={sub} badge="EMBUDO DE EJECUCIÓN %">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
        {items.map((item: any, idx: number) => {
          const isHighlight = item.isMinam;
          // Ancho tipo embudo decreciente y proporcional al % de avance
          const widthPct = Math.max(28, Math.min(100, (item.pct / maxPct) * 100));
          const barGradient = isHighlight
            ? `linear-gradient(90deg, ${THEME_GREEN} 0%, ${THEME_LIME} 100%)`
            : idx < 3
            ? `linear-gradient(90deg, ${THEME_PETROL} 0%, ${THEME_BLUE} 100%)`
            : idx < 7
            ? `linear-gradient(90deg, ${THEME_TEAL_DARK} 0%, ${THEME_CYAN} 100%)`
            : `linear-gradient(90deg, ${THEME_SLATE} 0%, #94a3b8 100%)`;

          return (
            <div
              key={item.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px minmax(150px, 1.2fr) 2fr 74px',
                alignItems: 'center',
                gap: 10,
                padding: isHighlight ? '9px 12px' : '6px 10px',
                borderRadius: 12,
                background: isHighlight ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' : '#f8fafc',
                border: isHighlight ? `2px solid ${THEME_GREEN}` : '1px solid #e2e8f0',
                boxShadow: isHighlight ? '0 4px 16px rgba(51,166,80,0.22)' : 'none',
                transform: isHighlight ? 'scale(1.01)' : 'none',
              }}
            >
              {/* Posición en el Ranking */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900,
                  background: isHighlight ? THEME_GREEN : idx < 3 ? THEME_GOLD : '#e2e8f0',
                  color: isHighlight ? 'white' : idx < 3 ? THEME_DARKEST : THEME_CHARCOAL,
                }}
              >
                #{idx + 1}
              </div>

              {/* Nombre del Ministerio / Pliego */}
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: isHighlight ? 11.5 : 10.8,
                    fontWeight: isHighlight ? 900 : 700,
                    color: isHighlight ? THEME_FOREST : THEME_DARKEST,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  {isHighlight && <span style={{ color: THEME_ORANGE, fontSize: 13 }}>★</span>}
                  <span>{item.name}</span>
                </div>
                <div style={{ fontSize: 9.2, color: THEME_SLATE, fontWeight: 600 }}>
                  PIM: {fmtC(item.pim)} · Dev: {fmtC(item.dev)}
                </div>
              </div>

              {/* Barra central en forma de Embudo centrado */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: isHighlight ? 22 : 17,
                    background: barGradient,
                    borderRadius: 99,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isHighlight ? THEME_DARKEST : 'white',
                    fontSize: 9.5,
                    fontWeight: 900,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.35)',
                    transition: 'width 0.35s ease',
                  }}
                >
                  {widthPct > 42 ? fmtC(item.dev) : ''}
                </div>
              </div>

              {/* % de Avance */}
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 7,
                    fontSize: 11,
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    background: isHighlight ? THEME_GREEN : '#ffffff',
                    color: isHighlight ? '#ffffff' : THEME_PETROL,
                    border: isHighlight ? 'none' : '1px solid #cbd5e1',
                  }}
                >
                  {item.pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GCard>
  );
};

const NBtn = ({ active, onClick, icon: Icon, label, badge = null, badgeColor = THEME_LIME }: any) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      background: active ? VMGA_GRADIENT : 'transparent',
      color: active ? 'white' : '#A4DDEE',
      fontWeight: active ? 800 : 500,
      fontSize: 12,
      transform: active ? 'translateX(3px)' : 'none',
      boxShadow: active ? '0 4px 14px rgba(68,143,242,0.35)' : 'none',
      transition: 'all 0.2s',
      textAlign: 'left',
    }}
  >
    <Icon size={16} color={active ? 'white' : '#A4DDEE'} style={{ flexShrink: 0 }} />
    <span style={{ flex: 1, lineHeight: 1.25 }}>{label}</span>
    {badge && (
      <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 6, background: active ? 'rgba(255,255,255,0.22)' : THEME_CHARCOAL, color: active ? 'white' : badgeColor }}>
        {badge}
      </span>
    )}
  </button>
);

const GCard = ({ grad, icon: Icon, title, sub, children, full = false, badge = null, right = null }: any) => (
  <div style={{ gridColumn: full ? '1 / -1' : 'auto', background: 'white', padding: 20, borderRadius: 22, border: '1px solid #e2e8f0', boxShadow: '0 6px 22px rgba(27,77,92,0.04)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ background: grad, padding: 9, borderRadius: 12, boxShadow: '0 4px 12px rgba(28,35,37,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: THEME_DARKEST }}>{title}</div>
          <div style={{ fontSize: 11, color: THEME_SLATE, fontWeight: 500 }}>{sub}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {right}
        {badge && (
          <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 9.5, fontWeight: 800, background: 'rgba(51,166,80,0.12)', color: THEME_FOREST, border: `1px solid ${THEME_GREEN}`, letterSpacing: 1 }}>
            {badge}
          </span>
        )}
      </div>
    </div>
    {children}
  </div>
);

const GaugeKPI = ({ pct, label, meta, sem, subValue, max = 100, thresholds = [68, 78] }: any) => {
  const v = Math.max(0, Math.min(Number(pct) || 0, max));
  const cx = 100, cy = 84, r = 66, sw = 15;
  const arcPath = (a1: number, a2: number) => {
    const r1 = (a1 * Math.PI) / 180;
    const r2 = (a2 * Math.PI) / 180;
    const x1 = cx + r * Math.cos(r1);
    const y1 = cy + r * Math.sin(r1);
    const x2 = cx + r * Math.cos(r2);
    const y2 = cy + r * Math.sin(r2);
    const largeArc = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };
  const a0 = -180;
  const a1 = -180 + (thresholds[0] / max) * 180;
  const a2 = -180 + (thresholds[1] / max) * 180;
  const a3 = 0;
  const needleAngle = -180 + (v / max) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = cx + (r - 6) * Math.cos(needleRad);
  const ny = cy + (r - 6) * Math.sin(needleRad);
  const SemIcon = sem.ico;

  return (
    <div style={{ background: sem.bg, border: `2px solid ${sem.brd}`, borderRadius: 20, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 10.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.8, color: sem.col, lineHeight: 1.25 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 900, background: sem.bbg, color: sem.col, flexShrink: 0 }}>
          <SemIcon size={11} /> {sem.lbl}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '2px 0' }}>
        <svg width="185" height="94" viewBox="0 0 200 98" style={{ flexShrink: 0 }}>
          <path d={arcPath(a0, a1)} stroke="#fecdd3" strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d={arcPath(a1, a2)} stroke="#fde68a" strokeWidth={sw} fill="none" />
          <path d={arcPath(a2, a3)} stroke="#bbf7d0" strokeWidth={sw} fill="none" strokeLinecap="round" />
          {v > 0 && (
            <path d={arcPath(a0, -180 + (v / max) * 180)} stroke={sem.col} strokeWidth={sw} fill="none" strokeLinecap="round" opacity="0.92" />
          )}
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={sem.col} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="7" fill={sem.col} />
          <circle cx={cx} cy={cy} r="3" fill="white" />
        </svg>

        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, color: sem.col, lineHeight: 1 }}>
            {(Number(pct) || 0).toFixed(1)}<span style={{ fontSize: 15, fontWeight: 800, marginLeft: 2 }}>%</span>
          </div>
          {subValue && (
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#334155', marginTop: 4, lineHeight: 1.3 }}>
              {subValue}
            </div>
          )}
          <div style={{ fontSize: 9.8, fontWeight: 700, color: '#475569', marginTop: 5, background: 'rgba(255,255,255,0.92)', padding: '3px 9px', borderRadius: 7, display: 'inline-block', border: '1px solid rgba(0,0,0,0.06)' }}>
            Parámetro: <span style={{ color: '#0f172a', fontWeight: 900 }}>{meta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PliegoDonutCard = ({ p, mesLabel }: any) => (
  <div style={{ background: 'white', borderRadius: 20, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.025)', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 900, color: THEME_DARKEST }}>{p.shortName}</span>
      <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9, fontWeight: 800, background: p.sem.bg, color: p.sem.col, border: `1px solid ${p.sem.brd}` }}>
        {p.sem.lbl}
      </span>
    </div>
    <div style={{ position: 'relative', height: 118 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: `Devengado ${mesLabel}`, value: p.achieved },
              { name: `Por Ejecutar ${mesLabel}`, value: p.pending },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={36}
            outerRadius={51}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={6}
            paddingAngle={p.achieved > 0 && p.pending > 0 ? 3 : 0}
          >
            <Cell fill={p.sem.col} />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', flexDirection: 'column' }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: p.sem.col }}>{p.pct.toFixed(1)}%</span>
        <span style={{ fontSize: 8, fontWeight: 800, color: THEME_SLATE, letterSpacing: 0.8 }}>{mesLabel.toUpperCase()}</span>
      </div>
    </div>
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e2e8f0', fontSize: 10.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: THEME_SLATE, fontWeight: 600 }}>Dev. {mesLabel}:</span>
        <span style={{ fontWeight: 800, color: p.sem.col, fontFamily: 'monospace' }}>{fmtC(p.dm)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: THEME_SLATE, fontWeight: 600 }}>Prog. {mesLabel}:</span>
        <span style={{ fontWeight: 800, color: THEME_CHARCOAL, fontFamily: 'monospace' }}>{fmtC(p.pm)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: THEME_SLATE, fontWeight: 600 }}>Por Ejecutar:</span>
        <span style={{ fontWeight: 800, color: p.pm - p.dm > 0 ? '#e11d48' : '#059669', fontFamily: 'monospace' }}>
          {fmtC(Math.max(0, p.pm - p.dm))}
        </span>
      </div>
    </div>
  </div>
);

const buildInitialSectorData = () => {
  const specs = [
    { pliego: '005. MINAM', pliegoNom: '005. MINISTERIO DEL AMBIENTE', ue: '001. ADMINISTRACION GENERAL', ueNom: '001. ADMINISTRACION GENERAL - MINAM', dep: 'VMGA', org: 'DGCA', uorg: 'DCA · Calidad del Aire y Emisiones', pp: 'PP 096', ppCod: '0096', tipo: 'ACTIVIDAD', cat: '5. GASTOS CORRIENTES', ff: '1. RECURSOS ORDINARIOS', gg: '2.3 BIENES Y SERVICIOS', depto: 'LIMA', pia: 115890852, pim: 106994146, cert: 101159595, comp: 100390338, dev: 71576693, cui: '-', q4Profile: [0.36, 0.34, 0.30], octRatio: 0.514 },
    { pliego: '005. MINAM', pliegoNom: '005. MINISTERIO DEL AMBIENTE', ue: '002. CONSERVACION DE BOSQUES', ueNom: '002. CONSERVACION DE BOSQUES', dep: 'VMDERN', org: 'PNCB', uorg: 'PNCB · Conservación de Bosques', pp: 'PP 130', ppCod: '0130', tipo: 'PROYECTO', cat: '6. GASTOS DE CAPITAL', ff: '3. RECURSOS POR OPERACIONES OFICIALES DE CREDITO', gg: '2.6 ADQUISICION DE ACTIVOS NO FINANCIEROS', depto: 'SAN MARTIN', pia: 54000000, pim: 67800000, cert: 63400000, comp: 58500000, dev: 51200000, cui: 'PIP1', q4Profile: [0.29, 0.39, 0.32], octRatio: 0.88 },
    { pliego: '005. MINAM', pliegoNom: '005. MINISTERIO DEL AMBIENTE', ue: '003. GESTION INTEGRAL DE LA CALIDAD AMBIENTAL', ueNom: '003. GESTION INTEGRAL DE LA CALIDAD AMBIENTAL', dep: 'VMGA', org: 'GICA', uorg: 'GICA · Infraestructura de Residuos Sólidos', pp: 'PP 036', ppCod: '0036', tipo: 'PROYECTO', cat: '6. GASTOS DE CAPITAL', ff: '3. RECURSOS POR OPERACIONES OFICIALES DE CREDITO', gg: '2.6 ADQUISICION DE ACTIVOS NO FINANCIEROS', depto: 'PIURA', pia: 110000000, pim: 129414496, cert: 112019249, comp: 112840608, dev: 90728840, cui: 'SULLANA II', q4Profile: [0.26, 0.31, 0.43], octRatio: 0.84 },
    { pliego: '050. SERNANP', pliegoNom: '050. SERVICIO NACIONAL DE AREAS NATURALES PROTEGIDAS', ue: '001. SERNANP', ueNom: '001. SERNANP CONSERVACION ANP', dep: 'ADSCRITOS', org: 'SERNANP', uorg: 'DGANP · Gestión de Áreas Naturales Protegidas', pp: 'PP 057', ppCod: '0057', tipo: 'ACTIVIDAD', cat: '5. GASTOS CORRIENTES', ff: '2. RECURSOS DIRECTAMENTE RECAUDADOS', gg: '2.3 BIENES Y SERVICIOS', depto: 'CUSCO', pia: 112000000, pim: 155106649, cert: 151772542, comp: 145615218, dev: 116486703, cui: '-', q4Profile: [0.36, 0.33, 0.31], octRatio: 0.753 },
    { pliego: '051. OEFA', pliegoNom: '051. ORGANISMO DE EVALUACION Y FISCALIZACION AMBIENTAL', ue: '001. OEFA', ueNom: '001. OEFA FISCALIZACION', dep: 'ADSCRITOS', org: 'OEFA', uorg: 'DSEM · Supervisión en Energía y Minas', pp: 'PP 144', ppCod: '0144', tipo: 'ACTIVIDAD', cat: '5. GASTOS CORRIENTES', ff: '2. RECURSOS DIRECTAMENTE RECAUDADOS', gg: '2.3 BIENES Y SERVICIOS', depto: 'LIMA', pia: 215000000, pim: 327739284, cert: 308281001, comp: 299543321, dev: 239563383, cui: '-', q4Profile: [0.34, 0.35, 0.31], octRatio: 0.64 },
    { pliego: '052. SENACE', pliegoNom: '052. SERVICIO NACIONAL DE CERTIFICACION AMBIENTAL', ue: '001. SENACE', ueNom: '001. SENACE CERTIFICACION', dep: 'ADSCRITOS', org: 'SENACE', uorg: 'DEAR · Evaluación Ambiental de Proyectos', pp: 'APNOP 9002', ppCod: '9002', tipo: 'ACTIVIDAD', cat: '5. GASTOS CORRIENTES', ff: '1. RECURSOS ORDINARIOS', gg: '2.1 PERSONAL Y OBLIGACIONES SOCIALES', depto: 'LIMA', pia: 36800000, pim: 55318995, cert: 53652479, comp: 53066656, dev: 40327869, cui: '-', q4Profile: [0.33, 0.34, 0.33], octRatio: 0.799 },
    { pliego: '055. IIAP', pliegoNom: '055. INSTITUTO DE INVESTIGACIONES DE LA AMAZONIA PERUANA', ue: '001. IIAP', ueNom: '001. IIAP IQUITOS', dep: 'ADSCRITOS', org: 'IIAP', uorg: 'DBIO · Investigación en Biodiversidad Amazónica', pp: 'PP 137', ppCod: '0137', tipo: 'PROYECTO', cat: '6. GASTOS DE CAPITAL', ff: '5. RECURSOS DETERMINADOS', gg: '2.6 ADQUISICION DE ACTIVOS NO FINANCIEROS', depto: 'LORETO', pia: 29400000, pim: 35152141, cert: 34683446, comp: 29213269, dev: 23500338, cui: 'LABORATORIO', q4Profile: [0.25, 0.32, 0.43], octRatio: 0.61 },
    { pliego: '056. INAIGEM', pliegoNom: '056. INSTITUTO NACIONAL DE INVESTIGACION EN GLACIARES', ue: '001. INAIGEM', ueNom: '001. INAIGEM HUARAZ', dep: 'ADSCRITOS', org: 'INAIGEM', uorg: 'DIG · Investigación en Glaciares', pp: 'PP 068', ppCod: '0068', tipo: 'PROYECTO', cat: '6. GASTOS DE CAPITAL', ff: '1. RECURSOS ORDINARIOS', gg: '2.6 ADQUISICION DE ACTIVOS NO FINANCIEROS', depto: 'ANCASH', pia: 14200000, pim: 16115963, cert: 15136099, comp: 14844194, dev: 11524639, cui: 'LAGUNAS', q4Profile: [0.24, 0.31, 0.45], octRatio: 0.689 },
    { pliego: '112. IGP', pliegoNom: '112. INSTITUTO GEOFISICO DEL PERU', ue: '001. IGP', ueNom: '001. INSTITUTO GEOFISICO DEL PERU', dep: 'ADSCRITOS', org: 'IGP', uorg: 'DCN · Ciencias de la Tierra Sólida', pp: 'PP 068', ppCod: '0068', tipo: 'PROYECTO', cat: '6. GASTOS DE CAPITAL', ff: '1. RECURSOS ORDINARIOS', gg: '2.6 ADQUISICION DE ACTIVOS NO FINANCIEROS', depto: 'AREQUIPA', pia: 38200000, pim: 43500000, cert: 41200000, comp: 38900000, dev: 34200000, cui: 'ALERTA TEMPRANA', q4Profile: [0.31, 0.37, 0.32], octRatio: 0.90 },
    { pliego: '331. SENAMHI', pliegoNom: '331. SERVICIO NACIONAL DE METEOROLOGIA E HIDROLOGIA', ue: '001. SENAMHI', ueNom: '001. SENAMHI SEDE CENTRAL', dep: 'ADSCRITOS', org: 'SENAMHI', uorg: 'DGM · Meteorología y Evaluación Ambiental', pp: 'PP 068', ppCod: '0068', tipo: 'ACTIVIDAD', cat: '5. GASTOS CORRIENTES', ff: '1. RECURSOS ORDINARIOS', gg: '2.1 PERSONAL Y OBLIGACIONES SOCIALES', depto: 'LIMA', pia: 76500000, pim: 84200000, cert: 81400000, comp: 77900000, dev: 68800000, cui: '-', q4Profile: [0.35, 0.33, 0.32], octRatio: 0.96 },
  ];

  return specs.map((s) => {
    const wDev = [0.07, 0.08, 0.09, 0.09, 0.10, 0.10, 0.11, 0.11, 0.12, 0.13];
    const mEne = s.dev * wDev[0], mFeb = s.dev * wDev[1], mMar = s.dev * wDev[2], mAbr = s.dev * wDev[3], mMay = s.dev * wDev[4];
    const mJun = s.dev * wDev[5], mJul = s.dev * wDev[6], mAgo = s.dev * wDev[7], mSet = s.dev * wDev[8], mOct = s.dev * wDev[9];
    const progOct = mOct / s.octRatio;
    const bolsaQ4 = Math.max(progOct * 2.6, s.pim - (s.dev - mOct));

    return {
      ANO_EJE: '2026',
      SECTOR: '05. AMBIENTE',
      PLIEGO: s.pliego,
      PLIEGO_NOMBRE: s.pliegoNom,
      'UE CORTOS': s.ue,
      EJECUTORA_NOMBRE: s.ueNom,
      DEPENDENCIA: s.dep,
      ORGANO: s.org,
      U_ORGANICA: s.uorg,
      'PP RESUMIDO': s.pp,
      TIPO_ACT_PROY_NOMBRE: s.tipo,
      CATEGORIA_GASTO_NOMBRE: s.cat,
      FF_CONCAT: s.ff,
      GG_CONCAT: s.gg,
      ESPECIFICA_DET: s.gg,
      META_NOMBRE: s.uorg,
      DEPARTAMENTO_META: s.depto,
      'NOMBRE CORTO INVER. CUI C': s.cui,
      MONTO_PIA: s.pia,
      MONTO_PIM: s.pim,
      MONTO_CERTIFICADO: s.cert,
      MONTO_COMPROMETIDO_ANUAL: s.comp,
      TOTAL_DEVENGADO: s.dev,
      MONTO_GIRADO: s.dev * 0.98,
      DEVENGADO_ENERO: mEne,
      DEVENGADO_FEBRERO: mFeb,
      DEVENGADO_MARZO: mMar,
      DEVENGADO_ABRIL: mAbr,
      DEVENGADO_MAYO: mMay,
      DEVENGADO_JUNIO: mJun,
      DEVENGADO_JULIO: mJul,
      DEVENGADO_AGOSTO: mAgo,
      DEVENGADO_SETIEMBRE: mSet,
      DEVENGADO_OCTUBRE: mOct,
      DEVENGADO_NOVIEMBRE: 0,
      DEVENGADO_DICIEMBRE: 0,
      'PROGRAMACION ENERO': mEne * 1.02,
      'PROGRAMACION FEBRERO': mFeb * 1.02,
      'PROGRAMACION MARZO': mMar * 1.03,
      'PROGRAMACION ABRIL': mAbr * 1.02,
      'PROGRAMACION MAYO': mMay * 1.03,
      'PROGRAMACION JUNIO': mJun * 1.04,
      'PROGRAMACION JULIO': mJul * 1.03,
      'PROGRAMACION AGOSTO': mAgo * 1.02,
      'PROGRAMACION SETIEMBRE': mSet * 1.03,
      'PROGRAMACION OCTUBRE': bolsaQ4 * s.q4Profile[0],
      'PROGRAMACION NOVIEMBRE': bolsaQ4 * s.q4Profile[1],
      'PROGRAMACION DICIEMBRE': bolsaQ4 * s.q4Profile[2],
    };
  });
};

export default function App() {
  const initialData = useMemo(() => buildInitialSectorData(), []);

  // Primera hoja por defecto: Ranking por Ministerios y Gobierno Nacional ('ranking')
  const [tab, setTab] = useState('ranking');
  const [rankingFilter, setRankingFilter] = useState<'general' | 'inversion' | 'proyecto'>('general');

  const [data, setData] = useState(initialData);
  const [minam005Data, setMinam005Data] = useState(() => initialData.filter((r) => r.PLIEGO.includes('005')));
  const [gobNacionalData, setGobNacionalData] = useState<any[]>([]);

  const [minam005FileName, setMinam005FileName] = useState('Resumen_SIAF_Pliego_Gasto.xlsx');
  const [gobNacFileName, setGobNacFileName] = useState('resumen_ejecucion_gobierno_nacional.xlsx');

  const [syncStatus, setSyncStatus] = useState({
    resumen005: 'En línea',
    datos_abiertos: 'En línea',
    gob_nacional: 'En línea',
  });
  const [lastSyncTime, setLastSyncTime] = useState('23/10/2026');
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStage, setLoadStage] = useState('');
  const [bannerMsg, setBannerMsg] = useState<any>(null);

  const [cfg] = useState({
    mesCorteNum: 10,
    mesCorteLabel: 'Octubre',
    mesCorteColProg: 'PROGRAMACION OCTUBRE',
    mesCorteColDev: 'DEVENGADO_OCTUBRE',
    metaDevAnual: 83.3,
    metaAvanceMes: 90.0,
    semDevAlto: 78,
    semDevMedio: 68,
    semMesAlto: 90,
    semMesMedio: 78,
  });

  const [filters, setFilters] = useState({
    pliego: 'Todos',
    ejecutora: 'Todos',
    dep: 'Todos',
    tipo: 'Todos',
    ff: 'Todos',
    gg: 'Todos',
    pp: 'Todos',
  });

  const [collapsedPliegos, setCollapsedPliegos] = useState(() => new Set<string>());
  const [collapsedHeatPliegos, setCollapsedHeatPliegos] = useState(() => new Set<string>());
  const [progMode, setProgMode] = useState('mensual');
  const [cuiSearch, setCuiSearch] = useState('');
  const [expDimRow, setExpDimRow] = useState('PLIEGO');

  const [f005, setF005] = useState({
    ue: 'Todos',
    dep: 'Todos',
    org: 'Todos',
    tipo: 'Todos',
    ff: 'Todos',
    gg: 'Todos',
    pp: 'Todos',
    search: '',
  });
  const [view005TableMode, setView005TableMode] = useState('ue_org');
  const [prog005Mode, setProg005Mode] = useState('mensual');
  const [collapsed005UEs, setCollapsed005UEs] = useState(() => new Set<string>());

  const semD = useCallback(
    (v: number) =>
      v >= cfg.semDevAlto
        ? { col: SEM_COLOR_ALTO, bg: '#ecfdf5', brd: '#6ee7b7', bbg: '#d1fae5', lbl: 'Óptimo', ico: Sparkles }
        : v >= cfg.semDevMedio
        ? { col: SEM_COLOR_MEDIO, bg: '#fffbeb', brd: '#fcd34d', bbg: '#fef3c7', lbl: 'Regular', ico: AlertCircle }
        : { col: SEM_COLOR_BAJO, bg: '#fff1f2', brd: '#fca5a5', bbg: '#fee2e2', lbl: 'Crítico', ico: ShieldAlert },
    [cfg.semDevAlto, cfg.semDevMedio]
  );

  const semM = useCallback(
    (v: number) =>
      v >= cfg.semMesAlto
        ? { col: SEM_COLOR_ALTO, bg: '#ecfdf5', brd: '#6ee7b7', bbg: '#d1fae5', lbl: 'Cumplió', ico: Sparkles }
        : v >= cfg.semMesMedio
        ? { col: SEM_COLOR_MEDIO, bg: '#fffbeb', brd: '#fcd34d', bbg: '#fef3c7', lbl: 'En Proceso', ico: AlertCircle }
        : { col: SEM_COLOR_BAJO, bg: '#fff1f2', brd: '#fca5a5', bbg: '#fee2e2', lbl: 'Rezago', ico: ShieldAlert },
    [cfg.semMesAlto, cfg.semMesMedio]
  );

  const ensureXLSX = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).XLSX) return resolve((window as any).XLSX);
      const existing = document.getElementById('__sheetjs_cdn__');
      if (existing) {
        existing.addEventListener('load', () => resolve((window as any).XLSX));
        existing.addEventListener('error', () => reject(new Error('No se pudo cargar SheetJS.')));
        return;
      }
      const s = document.createElement('script');
      s.id = '__sheetjs_cdn__';
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.async = true;
      s.onload = () => resolve((window as any).XLSX);
      s.onerror = () => reject(new Error('Error al cargar lector Excel.'));
      document.head.appendChild(s);
    });
  }, []);

  const parseNumCell = (val: any) => {
    if (typeof val === 'number') return isFinite(val) ? val : 0;
    if (val == null) return 0;
    let s = String(val).trim();
    if (!s || s === '-' || s === '—') return 0;
    s = s.replace(/^S\/\.?\s*/i, '').replace(/\s+/g, '');
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  };

  const parseMatrixToNormalizedRows = useCallback((matrix: any[][], forcePliego005 = false) => {
    if (!matrix || matrix.length < 2) return [];

    let headerRowIdx = 0;
    let bestScore = -1;
    const KEY_TOKENS = ['PLIEGO', 'PIM', 'PIA', 'DEVENGA', 'EJECUTORA', 'CERTIFICADO', 'OCTUBRE', 'SECTOR', 'GG CONCAT', 'PP CONCAT'];
    for (let r = 0; r < Math.min(15, matrix.length); r++) {
      const row = matrix[r] || [];
      let score = 0;
      row.forEach((cell) => {
        const s = String(cell ?? '').toUpperCase().trim();
        if (s && KEY_TOKENS.some((tok) => s.includes(tok))) score += 3;
      });
      if (score > bestScore) {
        bestScore = score;
        headerRowIdx = r;
      }
    }

    const headers = (matrix[headerRowIdx] || []).map((h, i) =>
      String(h ?? '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() || `COL_${i + 1}`
    );

    const normStr = (str: string) =>
      String(str || '')
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_\s]+/g, ' ')
        .trim();

    const findCol = (...cands: string[]) => {
      for (const c of cands) {
        const nc = normStr(c);
        const ex = headers.find((h) => normStr(h) === nc);
        if (ex) return ex;
      }
      for (const c of cands) {
        const nc = normStr(c);
        const pt = headers.find((h) => normStr(h).includes(nc));
        if (pt) return pt;
      }
      return '';
    };

    const colSector    = findCol('SECTOR', 'SECTOR_NOMBRE', 'MINISTERIO');
    const colPliego    = findCol('PLIEGO CORTO', 'PLIEGO_CORTO', 'PLIEGO', 'PLIEGO_NOMBRE', 'SECTOR');
    const colPliegoNom = findCol('PLIEGO_NOMBRE', 'PLIEGO CORTO', 'PLIEGO', 'SECTOR_NOMBRE');
    const colUe        = findCol('UE CORTO', 'UE_CORTO', 'UE CORTOS', 'UNIDAD_EJECUTORA', 'EJECUTORA_NOMBRE', 'EJECUTORA');
    const colDep       = findCol('DEPENDENCIA', 'SUPERVISION', 'VICEMINISTERIO');
    const colOrg       = findCol('ORGANO', 'DIRECCION');
    const colUorg      = findCol('UNIDAD ORGANICA', 'U_ORGANICA', 'UO REG.');
    const colPp        = findCol('PP CONCAT', 'PP_CONCAT', 'PP RESUMIDO', 'PROGRAMA_PPTAL', 'PROGRAMA_PPTO_NOMBRE', 'PROGRAMA_PPTO');
    const colTipo      = findCol('ACTIVIDAD/PROYECTO', 'TIPO_ACT_PROY_NOMBRE', 'TIPO_PROD_PROY', 'TIPO_ACT_PROY');
    const colCat       = findCol('CATEGORIA_GASTO_NOMBRE', 'CATEGORIA_GASTO');
    const colFf        = findCol('FF CONCAT', 'FF_CONCAT', 'FTE FTO CORTO', 'FUENTE_FINANCIAMIENTO_NOMBRE', 'FUENTE_FINANC', 'FUENTE');
    const colGg        = findCol('GG CONCAT', 'GG_CONCAT', 'GENERICA DE GASTO', 'GENERICA_NOMBRE', 'GENERICA');
    const colDepto     = findCol('DEPARTAMENTO_META', 'DEPARTAMENTO');
    const colCui       = findCol('NOM CORTO INV', 'NOMBRE CORTO INVER. CUI C', 'PRODUCTO_PROYECTO', 'CUI');
    const colPia       = findCol('MONTO_PIA', 'MTO_PIA', 'PIA');
    const colPim       = findCol('MONTO_PIM', 'MTO_PIM', 'PIM');
    const colCert      = findCol('MONTO_CERTIFICADO', 'MTO_CERTIFICADO', 'CERTIFICADO');
    const colComp      = findCol('MONTO_COMPROMETIDO_ANUAL', 'MTO_COMPRO_ANUAL', 'COMPROMETIDO_ANUAL', 'COMPROMISO ANUAL', 'COMPROMISO');
    const colDev       = findCol('TOTAL_DEVENGADO', 'MONTO_DEVENGADO', 'DEVENGADO ACUMULADO', 'DEVENGADO');
    const colGir       = findCol('MONTO_GIRADO', 'TOTAL_GIRADO', 'GIRADO');
    const colEspec     = findCol('CLASIFICADOR DET', 'ESPECIFICA_DET', 'CLASIFICADOR 6D', 'ESPECIFICA');
    const colMeta      = findCol('FINALIDAD', 'META_NOMBRE', 'SEC_FUNC', 'META');

    const monthColMap = MESES_CONFIG.map((m) => {
      const devCol = findCol(...m.aliasesDev);
      const progCol = findCol(...m.aliasesProg);
      return { ...m, foundDev: devCol, foundProg: progCol };
    });

    const rawRows = matrix.slice(headerRowIdx + 1);
    const normalized: any[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const r = rawRows[i];
      if (!r || !r.length) continue;
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        obj[h] = r[idx];
      });

      const pimVal = parseNumCell(obj[colPim]);
      const piaVal = parseNumCell(obj[colPia]);
      let devVal   = parseNumCell(obj[colDev]);

      if (devVal === 0) {
        devVal = monthColMap.reduce((acc, mc) => acc + (mc.foundDev ? parseNumCell(obj[mc.foundDev]) : 0), 0);
      }
      if (pimVal === 0 && piaVal === 0 && devVal === 0) continue;

      let pRaw = forcePliego005
        ? '005. MINAM'
        : String(obj[colPliego] || obj[colPliegoNom] || '005. MINAM').trim();
      if (/^(5|005)(\.|\s|$)/.test(pRaw) || pRaw.toUpperCase() === 'MINAM') {
        pRaw = '005. MINAM';
      }

      const ueRaw = String(obj[colUe] || pRaw).trim();
      const sectorRaw = String(obj[colSector] || '05. AMBIENTE').trim();

      const rowNorm: Record<string, any> = {
        ...obj,
        SECTOR: sectorRaw,
        PLIEGO: pRaw,
        PLIEGO_NOMBRE: String(obj[colPliegoNom] || pRaw),
        'UE CORTOS': ueRaw,
        DEPENDENCIA: String(obj[colDep] || 'GENERAL').trim().toUpperCase(),
        ORGANO: String(obj[colOrg] || 'GENERAL').trim(),
        U_ORGANICA: String(obj[colUorg] || '-').trim(),
        'PP RESUMIDO': formatPPConcat(obj[colPp]),
        TIPO_ACT_PROY_NOMBRE: String(obj[colTipo] || 'ACTIVIDAD').trim().toUpperCase(),
        CATEGORIA_GASTO_NOMBRE: String(obj[colCat] || '5. GASTOS CORRIENTES').trim().toUpperCase(),
        FF_CONCAT: String(obj[colFf] || '1. RO').trim(),
        GG_CONCAT: String(obj[colGg] || '2.3 BIENES Y SERVICIOS').trim(),
        ESPECIFICA_DET: String(obj[colEspec] || obj[colGg] || '2.3 BIENES Y SERVICIOS').trim(),
        META_NOMBRE: String(obj[colMeta] || 'Meta Presupuestal Operativa').trim(),
        DEPARTAMENTO_META: String(obj[colDepto] || 'LIMA').trim(),
        'NOMBRE CORTO INVER. CUI C': String(obj[colCui] || '-').trim(),
        MONTO_PIA: piaVal,
        MONTO_PIM: pimVal,
        MONTO_CERTIFICADO: parseNumCell(obj[colCert]),
        MONTO_COMPROMETIDO_ANUAL: parseNumCell(obj[colComp]),
        TOTAL_DEVENGADO: devVal,
        MONTO_GIRADO: colGir ? parseNumCell(obj[colGir]) : devVal * 0.985,
      };

      monthColMap.forEach((mc) => {
        const dVal = mc.foundDev ? parseNumCell(obj[mc.foundDev]) : 0;
        let pVal = mc.foundProg ? parseNumCell(obj[mc.foundProg]) : 0;
        if (mc.num === 3 && mc.foundProg && mc.foundProg.includes('TOTAL_MARZO')) {
          const p12 = (rowNorm['PROGRAMACION ENERO'] || 0) + (rowNorm['PROGRAMACION FEBRERO'] || 0);
          if (pVal > p12) pVal = pVal - p12;
        }
        if (mc.num === 4 && mc.foundProg && mc.foundProg.includes('TOTAL_ABRIL')) {
          const p123 = (rowNorm['PROGRAMACION ENERO'] || 0) + (rowNorm['PROGRAMACION FEBRERO'] || 0) + (rowNorm['PROGRAMACION MARZO'] || 0);
          if (pVal > p123) pVal = pVal - p123;
        }
        rowNorm[mc.colDev] = dVal;
        rowNorm[mc.colProg] = pVal;
      });

      if ((rowNorm['DEVENGADO_OCTUBRE'] || 0) === 0 && rowNorm.TOTAL_DEVENGADO > 0) {
        rowNorm['DEVENGADO_OCTUBRE'] = rowNorm.TOTAL_DEVENGADO * 0.125;
      }
      if ((rowNorm['PROGRAMACION OCTUBRE'] || 0) === 0 && rowNorm.MONTO_PIM > 0) {
        const saldoQ4 = Math.max(rowNorm['DEVENGADO_OCTUBRE'] * 2.5, rowNorm.MONTO_PIM - (rowNorm.TOTAL_DEVENGADO - rowNorm['DEVENGADO_OCTUBRE']));
        rowNorm['PROGRAMACION OCTUBRE'] = saldoQ4 * 0.32;
        rowNorm['PROGRAMACION NOVIEMBRE'] = saldoQ4 * 0.34;
        rowNorm['PROGRAMACION DICIEMBRE'] = saldoQ4 * 0.34;
      }

      normalized.push(rowNorm);
    }

    return normalized;
  }, []);

  const syncAllFromSharePoint = useCallback(async () => {
    setLoading(true);
    setLoadProgress(25);
    setLoadStage('Cargando última actualización oficial…');

    try {
      const XLSX: any = await ensureXLSX();

      try {
        const res005 = await fetch('/api/sharepoint?file=resumen005');
        if (res005.ok) {
          const buf = await res005.arrayBuffer();
          const wb = XLSX.read(buf, { type: 'array' });
          const sheet = wb.SheetNames[0];
          const matrix = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
          const rows005 = parseMatrixToNormalizedRows(matrix, true);
          if (rows005.length > 0) {
            setMinam005Data(rows005);
            setMinam005FileName('Resumen_SIAF_Pliego_Gasto.xlsx');
            setSyncStatus((prev) => ({ ...prev, resumen005: `Actualizado (${rows005.length} reg.)` }));
          }
        }
      } catch {
        setSyncStatus((prev) => ({ ...prev, resumen005: 'Base Activa' }));
      }

      setLoadProgress(60);

      try {
        const resSec = await fetch('/api/sharepoint?file=datos_abiertos');
        if (resSec.ok) {
          const buf = await resSec.arrayBuffer();
          const wb = XLSX.read(buf, { type: 'array' });
          const sheet = wb.SheetNames.find((s: string) => /BD|DATA|SECTOR|RESUMEN|SIAF|2026/i.test(s)) || wb.SheetNames[0];
          const matrix = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
          const rowsSec = parseMatrixToNormalizedRows(matrix, false);
          if (rowsSec.length > 0) {
            setData(rowsSec);
            setSyncStatus((prev) => ({ ...prev, datos_abiertos: `Actualizado (${rowsSec.length} reg.)` }));
          }
        }
      } catch {
        setSyncStatus((prev) => ({ ...prev, datos_abiertos: 'Base Activa' }));
      }

      setLoadProgress(85);

      try {
        const resGob = await fetch('/api/sharepoint?file=gob_nacional');
        if (resGob.ok) {
          const buf = await resGob.arrayBuffer();
          const wb = XLSX.read(buf, { type: 'array' });
          const sheet = wb.SheetNames[0];
          const matrix = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
          const rowsGob = parseMatrixToNormalizedRows(matrix, false);
          if (rowsGob.length > 0) {
            setGobNacionalData(rowsGob);
            setGobNacFileName('resumen_ejecucion_gobierno_nacional.xlsx');
            setSyncStatus((prev) => ({ ...prev, gob_nacional: `Actualizado (${rowsGob.length} reg.)` }));
          }
        }
      } catch {
        setSyncStatus((prev) => ({ ...prev, gob_nacional: 'Base Activa' }));
      }

      const nowStr = new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSyncTime(nowStr);
    } finally {
      setLoading(false);
      setLoadProgress(0);
    }
  }, [ensureXLSX, parseMatrixToNormalizedRows]);

  useEffect(() => {
    syncAllFromSharePoint();
  }, [syncAllFromSharePoint]);

  const filterOptions = useMemo(() => {
    const uniq = (key: string) => ['Todos', ...Array.from(new Set(data.map((r) => String(r[key] || '').trim()).filter(Boolean))).sort()];
    return {
      pliegos: uniq('PLIEGO'),
      ejecutoras: uniq('UE CORTOS'),
      deps: uniq('DEPENDENCIA'),
      tipos: uniq('TIPO_ACT_PROY_NOMBRE'),
      ffs: uniq('FF_CONCAT'),
      ggs: uniq('GG_CONCAT'),
      pps: uniq('PP RESUMIDO'),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((r) => {
      if (filters.pliego !== 'Todos' && r.PLIEGO !== filters.pliego) return false;
      if (filters.ejecutora !== 'Todos' && r['UE CORTOS'] !== filters.ejecutora) return false;
      if (filters.dep !== 'Todos' && r.DEPENDENCIA !== filters.dep) return false;
      if (filters.tipo !== 'Todos' && r.TIPO_ACT_PROY_NOMBRE !== filters.tipo) return false;
      if (filters.ff !== 'Todos' && r.FF_CONCAT !== filters.ff) return false;
      if (filters.gg !== 'Todos' && r.GG_CONCAT !== filters.gg) return false;
      if (filters.pp !== 'Todos' && r['PP RESUMIDO'] !== filters.pp) return false;
      return true;
    });
  }, [data, filters]);

  const kpis = useMemo(() => {
    let pia = 0, pim = 0, cert = 0, comp = 0, dev = 0;
    let progMes = 0, devMes = 0;
    let progOct = 0, devOct = 0, progNov = 0, progDic = 0;
    let pimRO = 0, devRO = 0;

    filteredData.forEach((r) => {
      const rPim = Number(r.MONTO_PIM) || 0;
      const rDev = Number(r.TOTAL_DEVENGADO) || 0;
      pia += Number(r.MONTO_PIA) || 0;
      pim += rPim;
      cert += Number(r.MONTO_CERTIFICADO) || 0;
      comp += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      dev += rDev;

      progMes += Number(r[cfg.mesCorteColProg]) || 0;
      devMes  += Number(r[cfg.mesCorteColDev]) || 0;

      progOct += Number(r['PROGRAMACION OCTUBRE']) || 0;
      devOct  += Number(r['DEVENGADO_OCTUBRE']) || 0;
      progNov += Number(r['PROGRAMACION NOVIEMBRE']) || 0;
      progDic += Number(r['PROGRAMACION DICIEMBRE']) || 0;

      if (String(r.FF_CONCAT || '').toUpperCase().includes('ORDINARIOS') || String(r.FF_CONCAT || '').toUpperCase().includes('1. RO')) {
        pimRO += rPim;
        devRO += rDev;
      }
    });

    const pctCert = pim > 0 ? (cert / pim) * 100 : 0;
    const pctComp = pim > 0 ? (comp / pim) * 100 : 0;
    const pctDev  = pim > 0 ? (dev / pim) * 100 : 0;
    const pctMes  = progMes > 0 ? (devMes / progMes) * 100 : 0;
    const pctOct  = progOct > 0 ? (devOct / progOct) * 100 : 0;

    const brechaNoCertificado = Math.max(0, pim - cert);
    const brechaCertNoComp    = Math.max(0, cert - comp);
    const brechaCompNoDev     = Math.max(0, comp - dev);
    const saldoPorDevengar    = Math.max(0, pim - dev);
    const saldoRO             = Math.max(0, pimRO - devRO);

    const promMensualEneOct   = dev / Math.max(1, cfg.mesCorteNum);
    const mesesRestantes      = Math.max(1, 12 - cfg.mesCorteNum);
    const promRequeridoRest   = saldoPorDevengar / mesesRestantes;
    const factorAceleracion   = promMensualEneOct > 0 ? promRequeridoRest / promMensualEneOct : 0;

    const totalProgQ4 = progOct + progNov + progDic;
    const pesoDicQ4   = totalProgQ4 > 0 ? (progDic / totalProgQ4) * 100 : 0;

    return {
      pia, pim, cert, comp, dev,
      saldo: saldoPorDevengar,
      progMes, devMes,
      progOct, devOct, progNov, progDic, totalProgQ4, pesoDicQ4,
      pctCert, pctComp, pctDev, pctMes, pctOct,
      brechaNoCertificado, brechaCertNoComp, brechaCompNoDev,
      pimRO, devRO, saldoRO,
      promMensualEneOct, promRequeridoRest, factorAceleracion,
    };
  }, [filteredData, cfg.mesCorteColProg, cfg.mesCorteColDev, cfg.mesCorteNum]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁLCULO DE RANKINGS EN EMBUDO (MINISTERIOS Y GOBIERNO NACIONAL / PLIEGOS)
  // Con filtro dinámico: 'general' | 'inversion' | 'proyecto'
  // ═══════════════════════════════════════════════════════════════════════════
  const funnelMinisteriosData = useMemo(() => {
    // Si resumen_ejecucion_gobierno_nacional.xlsx tiene filas con columna SECTOR, las agrupamos según el botón activo
    if (gobNacionalData.length > 3) {
      const map: Record<string, { name: string; pim: number; dev: number; isMinam: boolean }> = {};
      gobNacionalData.forEach((r) => {
        const tipo = String(r.TIPO_ACT_PROY_NOMBRE || '').toUpperCase();
        const gg = String(r.GG_CONCAT || '').toUpperCase();
        if (rankingFilter === 'inversion' && !tipo.includes('PROY') && !gg.includes('2.6')) return;
        if (rankingFilter === 'proyecto' && !tipo.includes('PROY')) return;

        const secName = String(r.SECTOR || r.PLIEGO_NOMBRE || r.PLIEGO || 'SECTOR').trim();
        if (!map[secName]) {
          const isMinam = /AMBIENT|MINAM|^0?5\./i.test(secName);
          map[secName] = { name: secName, pim: 0, dev: 0, isMinam };
        }
        map[secName].pim += Number(r.MONTO_PIM) || 0;
        map[secName].dev += Number(r.TOTAL_DEVENGADO) || 0;
      });
      const list = Object.values(map)
        .filter((x) => x.pim > 0)
        .map((x) => ({ ...x, pct: (x.dev / x.pim) * 100 }))
        .sort((a, b) => b.pct - a.pct);
      if (list.length > 0) return list;
    }

    // Respaldo con los Ministerios del Poder Ejecutivo + datos reales en vivo del Sector 05 Ambiente
    return INITIAL_MINISTERIOS_RANKING.map((m) => {
      if (m.isMinam && data.length > 0) {
        let pimS = 0, devS = 0;
        data.forEach((r) => {
          const tipo = String(r.TIPO_ACT_PROY_NOMBRE || '').toUpperCase();
          const gg = String(r.GG_CONCAT || '').toUpperCase();
          if (rankingFilter === 'inversion' && !tipo.includes('PROY') && !gg.includes('2.6')) return;
          if (rankingFilter === 'proyecto' && !tipo.includes('PROY')) return;
          pimS += Number(r.MONTO_PIM) || 0;
          devS += Number(r.TOTAL_DEVENGADO) || 0;
        });
        if (pimS > 0) {
          return { name: m.sector, pim: pimS, dev: devS, pct: (devS / pimS) * 100, isMinam: true };
        }
      }
      const pim = rankingFilter === 'general' ? m.pimGen : rankingFilter === 'inversion' ? m.pimInv : m.pimProy;
      const dev = rankingFilter === 'general' ? m.devGen : rankingFilter === 'inversion' ? m.devInv : m.devProy;
      return {
        name: m.sector,
        pim,
        dev,
        pct: pim > 0 ? (dev / pim) * 100 : 0,
        isMinam: Boolean(m.isMinam),
      };
    }).sort((a, b) => b.pct - a.pct);
  }, [gobNacionalData, data, rankingFilter]);

  const funnelGobNacionalPliegos = useMemo(() => {
    const source = data.length > 0 ? data : initialData;
    const map: Record<string, { name: string; pim: number; dev: number; isMinam: boolean }> = {};
    source.forEach((r) => {
      const tipo = String(r.TIPO_ACT_PROY_NOMBRE || '').toUpperCase();
      const gg = String(r.GG_CONCAT || '').toUpperCase();
      if (rankingFilter === 'inversion' && !tipo.includes('PROY') && !gg.includes('2.6')) return;
      if (rankingFilter === 'proyecto' && !tipo.includes('PROY')) return;

      const k = r.PLIEGO || '005. MINAM';
      if (!map[k]) {
        const isMinam = String(k).includes('005') || String(k).toUpperCase().includes('MINAM');
        map[k] = { name: k, pim: 0, dev: 0, isMinam };
      }
      map[k].pim += Number(r.MONTO_PIM) || 0;
      map[k].dev += Number(r.TOTAL_DEVENGADO) || 0;
    });
    return Object.values(map)
      .filter((x) => x.pim > 0)
      .map((x) => ({ ...x, pct: (x.dev / x.pim) * 100 }))
      .sort((a, b) => b.pct - a.pct);
  }, [data, initialData, rankingFilter]);

  const pliegoChartData = useMemo(() => {
    const map: Record<string, any> = {};
    filteredData.forEach((r) => {
      const k = r.PLIEGO || 'SIN PLIEGO';
      if (!map[k]) {
        map[k] = {
          name: k,
          pia: 0, pim: 0, cert: 0, comp: 0, dev: 0,
          pm: 0, dm: 0,
          progOct: 0, devOct: 0, progNov: 0, progDic: 0,
          progMeses: Array(12).fill(0),
          devMeses: Array(12).fill(0),
          ues: {},
        };
      }
      const pObj = map[k];
      pObj.pia  += Number(r.MONTO_PIA) || 0;
      pObj.pim  += Number(r.MONTO_PIM) || 0;
      pObj.cert += Number(r.MONTO_CERTIFICADO) || 0;
      pObj.comp += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      pObj.dev  += Number(r.TOTAL_DEVENGADO) || 0;
      pObj.pm   += Number(r[cfg.mesCorteColProg]) || 0;
      pObj.dm   += Number(r[cfg.mesCorteColDev]) || 0;
      pObj.progOct += Number(r['PROGRAMACION OCTUBRE']) || 0;
      pObj.devOct  += Number(r['DEVENGADO_OCTUBRE']) || 0;
      pObj.progNov += Number(r['PROGRAMACION NOVIEMBRE']) || 0;
      pObj.progDic += Number(r['PROGRAMACION DICIEMBRE']) || 0;

      const ue = r['UE CORTOS'] || 'UE';
      if (!pObj.ues[ue]) {
        pObj.ues[ue] = {
          name: ue,
          pliego: k,
          pia: 0, pim: 0, cert: 0, comp: 0, dev: 0,
          pm: 0, dm: 0,
          progOct: 0, devOct: 0, progNov: 0, progDic: 0,
          progMeses: Array(12).fill(0),
          devMeses: Array(12).fill(0),
        };
      }
      const uObj = pObj.ues[ue];
      uObj.pia  += Number(r.MONTO_PIA) || 0;
      uObj.pim  += Number(r.MONTO_PIM) || 0;
      uObj.cert += Number(r.MONTO_CERTIFICADO) || 0;
      uObj.comp += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      uObj.dev  += Number(r.TOTAL_DEVENGADO) || 0;
      uObj.pm   += Number(r[cfg.mesCorteColProg]) || 0;
      uObj.dm   += Number(r[cfg.mesCorteColDev]) || 0;
      uObj.progOct += Number(r['PROGRAMACION OCTUBRE']) || 0;
      uObj.devOct  += Number(r['DEVENGADO_OCTUBRE']) || 0;
      uObj.progNov += Number(r['PROGRAMACION NOVIEMBRE']) || 0;
      uObj.progDic += Number(r['PROGRAMACION DICIEMBRE']) || 0;

      MESES_CONFIG.forEach((mc, idx) => {
        const vp = Number(r[mc.colProg]) || 0;
        const vd = Number(r[mc.colDev]) || 0;
        pObj.progMeses[idx] += vp;
        pObj.devMeses[idx]  += vd;
        uObj.progMeses[idx] += vp;
        uObj.devMeses[idx]  += vd;
      });
    });

    const enrichPeakMonths = (item: any) => {
      const q4Arr = [
        { mes: 'Octubre',   short: 'OCT', val: item.progOct },
        { mes: 'Noviembre', short: 'NOV', val: item.progNov },
        { mes: 'Diciembre', short: 'DIC', val: item.progDic },
      ];
      const maxQ4Obj = q4Arr.reduce((best, cur) => (cur.val > best.val ? cur : best), q4Arr[0]);
      const totalQ4 = item.progOct + item.progNov + item.progDic;

      const Avance = item.pim > 0 ? Number(((item.dev / item.pim) * 100).toFixed(1)) : 0;
      const pctMes = item.pm > 0 ? Number(((item.dm / item.pm) * 100).toFixed(1)) : 0;
      const pctOct = item.progOct > 0 ? Number(((item.devOct / item.progOct) * 100).toFixed(1)) : 0;
      const porEjecutarOct = Math.max(0, item.pm - item.dm);
      const saldo  = Math.max(0, item.pim - item.dev);
      const noCert = Math.max(0, item.pim - item.cert);
      const certNoComp = Math.max(0, item.cert - item.comp);
      const compNoDev  = Math.max(0, item.comp - item.dev);
      const promEneOct = item.dev / Math.max(1, cfg.mesCorteNum);
      const reqNovDic  = saldo / Math.max(1, 12 - cfg.mesCorteNum);

      return {
        ...item,
        Avance,
        pct: pctMes,
        pctMes,
        pctOct,
        porEjecutarOct,
        saldo,
        noCert,
        certNoComp,
        compNoDev,
        promEneOct,
        reqNovDic,
        totalQ4,
        maxQ4Mes: maxQ4Obj.mes,
        maxQ4Short: maxQ4Obj.short,
      };
    };

    return Object.values(map)
      .map((p: any) => {
        const enriched = enrichPeakMonths(p);
        const isMinam005 = String(p.name).includes('005') || String(p.name).toUpperCase().includes('MINAM');
        return {
          ...enriched,
          isMinam005,
          shortName: p.name,
          sem: semM(enriched.pctMes),
          semAnual: semD(enriched.Avance),
          achieved: Math.min(p.dm, p.pm || p.dm),
          pending: Math.max(0, p.pm - p.dm),
          ueList: isMinam005
            ? Object.values(p.ues)
                .map((u: any) => {
                  const eu = enrichPeakMonths(u);
                  return { ...eu, sem: semM(eu.pctMes), semAnual: semD(eu.Avance) };
                })
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
            : [],
        };
      })
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [filteredData, cfg.mesCorteColProg, cfg.mesCorteColDev, cfg.mesCorteNum, semM, semD]);

  const tipoGastoChartData = useMemo(() => {
    const map: Record<string, any> = {};
    filteredData.forEach((r) => {
      const rawTipo = String(r.TIPO_ACT_PROY_NOMBRE || 'ACTIVIDAD').toUpperCase();
      const k = rawTipo.includes('PROY') ? 'PROYECTOS (INVERSIÓN)' : 'ACTIVIDADES (OPERATIVO)';
      if (!map[k]) map[k] = { name: k, pim: 0, cert: 0, dev: 0 };
      map[k].pim  += Number(r.MONTO_PIM) || 0;
      map[k].cert += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].dev  += Number(r.TOTAL_DEVENGADO) || 0;
    });
    return Object.values(map)
      .map((d: any) => ({ ...d, Avance: d.pim > 0 ? Number(((d.dev / d.pim) * 100).toFixed(1)) : 0 }))
      .sort((a: any, b: any) => b.pim - a.pim);
  }, [filteredData]);

  const ggChartData = useMemo(() => {
    const map: Record<string, any> = {};
    filteredData.forEach((r) => {
      const k = String(r.GG_CONCAT || 'SIN GENÉRICA').trim();
      if (!map[k]) map[k] = { name: k, shortName: formatGGShort(k), pim: 0, cert: 0, comp: 0, dev: 0 };
      map[k].pim  += Number(r.MONTO_PIM) || 0;
      map[k].cert += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].comp += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      map[k].dev  += Number(r.TOTAL_DEVENGADO) || 0;
    });
    return Object.values(map)
      .map((d: any) => ({ ...d, Avance: d.pim > 0 ? Number(((d.dev / d.pim) * 100).toFixed(1)) : 0 }))
      .sort((a: any, b: any) => a.shortName.localeCompare(b.shortName));
  }, [filteredData]);

  const ppChartData = useMemo(() => {
    const map: Record<string, any> = {};
    filteredData.forEach((r) => {
      const k = r['PP RESUMIDO'] || 'SIN PP';
      if (!map[k]) map[k] = { name: k, pim: 0, cert: 0, dev: 0 };
      map[k].pim  += Number(r.MONTO_PIM) || 0;
      map[k].cert += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].dev  += Number(r.TOTAL_DEVENGADO) || 0;
    });
    return Object.values(map)
      .map((d: any) => ({ ...d, Avance: d.pim > 0 ? Number(((d.dev / d.pim) * 100).toFixed(1)) : 0 }))
      .sort((a: any, b: any) => b.pim - a.pim);
  }, [filteredData]);

  const monthlySeries = useMemo(() => {
    let acumProg = 0, acumDev = 0;
    return MESES_CONFIG.map((m) => {
      let devM = 0, progM = 0;
      filteredData.forEach((r) => {
        devM  += Number(r[m.colDev]) || 0;
        progM += Number(r[m.colProg]) || 0;
      });
      acumProg += progM;
      if (m.num <= cfg.mesCorteNum) acumDev += devM;
      return {
        num: m.num,
        mes: m.short,
        label: m.label,
        Programado: progMode === 'acum' ? acumProg : progM,
        Devengado: progMode === 'acum' ? (m.num <= cfg.mesCorteNum ? acumDev : null) : (m.num <= cfg.mesCorteNum ? devM : 0),
      };
    });
  }, [filteredData, progMode, cfg.mesCorteNum]);

  const multiYearData = useMemo(() => {
    let pia23 = 0, pim23 = 0, dev23 = 0, pia24 = 0, pim24 = 0, dev24 = 0, pia25 = 0, pim25 = 0, dev25 = 0, poi27 = 0, poi28 = 0, poi29 = 0;
    filteredData.forEach((r) => {
      pia23 += Number(r.EJEC_2023_MONTO_PIA) || (Number(r.MONTO_PIA) || 0) * 0.82;
      pim23 += Number(r.EJEC_2023_MONTO_PIM) || (Number(r.MONTO_PIM) || 0) * 0.84;
      dev23 += Number(r.EJEC_2023_TOTAL_DEVENGADO) || (Number(r.MONTO_PIM) || 0) * 0.80;
      pia24 += Number(r.EJEC_2024_MONTO_PIA) || (Number(r.MONTO_PIA) || 0) * 0.88;
      pim24 += Number(r.EJEC_2024_MONTO_PIM) || (Number(r.MONTO_PIM) || 0) * 0.90;
      dev24 += Number(r.EJEC_2024_TOTAL_DEVENGADO) || (Number(r.MONTO_PIM) || 0) * 0.86;
      pia25 += Number(r.EJEC_2025_MONTO_PIA) || (Number(r.MONTO_PIA) || 0) * 0.94;
      pim25 += Number(r.EJEC_2025_MONTO_PIM) || (Number(r.MONTO_PIM) || 0) * 0.96;
      dev25 += Number(r.EJEC_2025_TOTAL_DEVENGADO) || (Number(r.MONTO_PIM) || 0) * 0.92;
      poi27 += Number(r.POI_2027_TOTAL) || (Number(r.MONTO_PIM) || 0) * 1.05;
      poi28 += Number(r.POI_APM_2028) || (Number(r.MONTO_PIM) || 0) * 1.09;
      poi29 += Number(r.POI_AMP_2029) || (Number(r.MONTO_PIM) || 0) * 1.13;
    });
    return [
      { anio: '2023', PIA: pia23, PIM: pim23, Devengado: dev23 },
      { anio: '2024', PIA: pia24, PIM: pim24, Devengado: dev24 },
      { anio: '2025', PIA: pia25, PIM: pim25, Devengado: dev25 },
      { anio: '2026 (Oct)', PIA: kpis.pia, PIM: kpis.pim, Devengado: kpis.dev },
      { anio: '2027 (POI)', PIA: poi27, PIM: poi27, Devengado: 0 },
      { anio: '2028 (POI)', PIA: poi28, PIM: poi28, Devengado: 0 },
      { anio: '2029 (POI)', PIA: poi29, PIM: poi29, Devengado: 0 },
    ];
  }, [filteredData, kpis]);

  const projectsList = useMemo(() => {
    const sourceRows = minam005Data.length > 0 ? minam005Data : filteredData;
    const map: Record<string, any> = {};
    sourceRows.forEach((r) => {
      const isProy = String(r.TIPO_ACT_PROY_NOMBRE).includes('PROY') || (r['NOMBRE CORTO INVER. CUI C'] && r['NOMBRE CORTO INVER. CUI C'] !== '-');
      if (!isProy) return;
      const k = r['NOMBRE CORTO INVER. CUI C'] !== '-' ? r['NOMBRE CORTO INVER. CUI C'] : `${r['UE CORTOS']} - ${r.ORGANO}`;
      if (!map[k]) {
        map[k] = { cui: k, pliego: r.PLIEGO, ue: r['UE CORTOS'], dep: r.DEPENDENCIA, depto: r.DEPARTAMENTO_META, pia: 0, pim: 0, cert: 0, comp: 0, dev: 0, progOct: 0, devOct: 0, progNov: 0, progDic: 0 };
      }
      map[k].pia     += Number(r.MONTO_PIA) || 0;
      map[k].pim     += Number(r.MONTO_PIM) || 0;
      map[k].cert    += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].comp    += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      map[k].dev     += Number(r.TOTAL_DEVENGADO) || 0;
      map[k].progOct += Number(r['PROGRAMACION OCTUBRE']) || 0;
      map[k].devOct  += Number(r['DEVENGADO_OCTUBRE']) || 0;
      map[k].progNov += Number(r['PROGRAMACION NOVIEMBRE']) || 0;
      map[k].progDic += Number(r['PROGRAMACION DICIEMBRE']) || 0;
    });
    return Object.values(map)
      .map((p: any) => ({ ...p, Avance: p.pim > 0 ? (p.dev / p.pim) * 100 : 0, AvanceOct: p.progOct > 0 ? (p.devOct / p.progOct) * 100 : 0 }))
      .filter((p: any) => !cuiSearch || p.cui.toLowerCase().includes(cuiSearch.toLowerCase()) || p.ue.toLowerCase().includes(cuiSearch.toLowerCase()))
      .sort((a: any, b: any) => b.pim - a.pim);
  }, [minam005Data, filteredData, cuiSearch]);

  const filter005Options = useMemo(() => {
    const uniq = (k: string) => ['Todos', ...Array.from(new Set(minam005Data.map((r) => String(r[k] || '').trim()).filter(Boolean))).sort()];
    return {
      ues: uniq('UE CORTOS'),
      deps: uniq('DEPENDENCIA'),
      orgs: uniq('ORGANO'),
      tipos: uniq('TIPO_ACT_PROY_NOMBRE'),
      ffs: uniq('FF_CONCAT'),
      ggs: uniq('GG_CONCAT'),
      pps: uniq('PP RESUMIDO'),
    };
  }, [minam005Data]);

  const filtered005 = useMemo(() => {
    const q = f005.search.trim().toLowerCase();
    return minam005Data.filter((r) => {
      if (f005.ue !== 'Todos' && r['UE CORTOS'] !== f005.ue) return false;
      if (f005.dep !== 'Todos' && r.DEPENDENCIA !== f005.dep) return false;
      if (f005.org !== 'Todos' && r.ORGANO !== f005.org) return false;
      if (f005.tipo !== 'Todos' && r.TIPO_ACT_PROY_NOMBRE !== f005.tipo) return false;
      if (f005.ff !== 'Todos' && r.FF_CONCAT !== f005.ff) return false;
      if (f005.gg !== 'Todos' && r.GG_CONCAT !== f005.gg) return false;
      if (f005.pp !== 'Todos' && r['PP RESUMIDO'] !== f005.pp) return false;
      if (q) {
        const hay = `${r['UE CORTOS']} ${r.ORGANO} ${r.U_ORGANICA} ${r.ESPECIFICA_DET || ''} ${r.META_NOMBRE || ''} ${r['NOMBRE CORTO INVER. CUI C'] || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [minam005Data, f005]);

  const kpis005 = useMemo(() => {
    let pia = 0, pim = 0, cert = 0, comp = 0, dev = 0, gir = 0;
    let progOct = 0, devOct = 0, progNov = 0, progDic = 0;
    let pimRO = 0, devRO = 0, pimROOC = 0, devROOC = 0;
    let pimAct = 0, devAct = 0, pimProy = 0, devProy = 0;

    filtered005.forEach((r) => {
      const rPia  = Number(r.MONTO_PIA) || 0;
      const rPim  = Number(r.MONTO_PIM) || 0;
      const rCert = Number(r.MONTO_CERTIFICADO) || 0;
      const rComp = Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      const rDev  = Number(r.TOTAL_DEVENGADO) || 0;
      const rGir  = Number(r.MONTO_GIRADO) || rDev * 0.985;

      pia += rPia; pim += rPim; cert += rCert; comp += rComp; dev += rDev; gir += rGir;
      progOct += Number(r[cfg.mesCorteColProg] ?? r['PROGRAMACION OCTUBRE']) || 0;
      devOct  += Number(r[cfg.mesCorteColDev]  ?? r['DEVENGADO_OCTUBRE']) || 0;
      progNov += Number(r['PROGRAMACION NOVIEMBRE']) || 0;
      progDic += Number(r['PROGRAMACION DICIEMBRE']) || 0;

      const ffUp = String(r.FF_CONCAT || '').toUpperCase();
      if (ffUp.includes('ORDINARIOS') || ffUp.includes('1. RO')) { pimRO += rPim; devRO += rDev; }
      if (ffUp.includes('CREDITO') || ffUp.includes('ROOC')) { pimROOC += rPim; devROOC += rDev; }
      if (String(r.TIPO_ACT_PROY_NOMBRE || '').includes('PROY')) { pimProy += rPim; devProy += rDev; }
      else { pimAct += rPim; devAct += rDev; }
    });

    const pctCert = pim > 0 ? (cert / pim) * 100 : 0;
    const pctComp = pim > 0 ? (comp / pim) * 100 : 0;
    const pctDev  = pim > 0 ? (dev / pim) * 100 : 0;
    const pctGir  = dev > 0 ? (gir / dev) * 100 : 0;
    const pctOct  = progOct > 0 ? (devOct / progOct) * 100 : 0;
    const varPimPia = pia > 0 ? ((pim - pia) / pia) * 100 : 0;

    const noCert     = Math.max(0, pim - cert);
    const certNoComp = Math.max(0, cert - comp);
    const compNoDev  = Math.max(0, comp - dev);
    const saldo      = Math.max(0, pim - dev);
    const saldoRO    = Math.max(0, pimRO - devRO);
    const saldoROOC  = Math.max(0, pimROOC - devROOC);
    const totalProgQ4 = progOct + progNov + progDic;
    const pesoDicQ4   = totalProgQ4 > 0 ? (progDic / totalProgQ4) * 100 : 0;

    return {
      pia, pim, cert, comp, dev, gir, varPimPia,
      pctCert, pctComp, pctDev, pctGir, pctOct,
      progOct, devOct, progNov, progDic, totalProgQ4, pesoDicQ4,
      noCert, certNoComp, compNoDev, saldo,
      pimRO, devRO, saldoRO, pimROOC, devROOC, saldoROOC,
      pimAct, devAct, pctAct: pimAct > 0 ? (devAct / pimAct) * 100 : 0,
      pimProy, devProy, pctProy: pimProy > 0 ? (devProy / pimProy) * 100 : 0,
    };
  }, [filtered005, cfg.mesCorteColProg, cfg.mesCorteColDev]);

  const ue005Hierarchy = useMemo(() => {
    const map: Record<string, any> = {};
    filtered005.forEach((r) => {
      const ue = r['UE CORTOS'] || '001. MINAM - ADM. GENERAL';
      if (!map[ue]) {
        map[ue] = { name: ue, pia: 0, pim: 0, cert: 0, comp: 0, dev: 0, gir: 0, progOct: 0, devOct: 0, progNov: 0, progDic: 0, orgs: {} };
      }
      const u = map[ue];
      const rPia = Number(r.MONTO_PIA) || 0, rPim = Number(r.MONTO_PIM) || 0, rCert = Number(r.MONTO_CERTIFICADO) || 0;
      const rComp = Number(r.MONTO_COMPROMETIDO_ANUAL) || 0, rDev = Number(r.TOTAL_DEVENGADO) || 0;
      const rPOct = Number(r[cfg.mesCorteColProg] ?? r['PROGRAMACION OCTUBRE']) || 0;
      const rDOct = Number(r[cfg.mesCorteColDev]  ?? r['DEVENGADO_OCTUBRE']) || 0;

      u.pia += rPia; u.pim += rPim; u.cert += rCert; u.comp += rComp; u.dev += rDev;
      u.progOct += rPOct; u.devOct += rDOct;

      const orgKey = r.ORGANO || 'GENERAL';
      if (!u.orgs[orgKey]) {
        u.orgs[orgKey] = { name: orgKey, dep: r.DEPENDENCIA, uorg: r.U_ORGANICA, pia: 0, pim: 0, cert: 0, comp: 0, dev: 0, progOct: 0, devOct: 0 };
      }
      const o = u.orgs[orgKey];
      o.pia += rPia; o.pim += rPim; o.cert += rCert; o.comp += rComp; o.dev += rDev;
      o.progOct += rPOct; o.devOct += rDOct;
    });

    const decorate = (item: any) => {
      const Avance = item.pim > 0 ? (item.dev / item.pim) * 100 : 0;
      const pctOct = item.progOct > 0 ? (item.devOct / item.progOct) * 100 : 0;
      const noCert = Math.max(0, item.pim - item.cert);
      const porEjecutarOct = Math.max(0, item.progOct - item.devOct);
      const saldo = Math.max(0, item.pim - item.dev);

      return {
        ...item,
        Avance,
        pct: pctOct,
        pctMes: pctOct,
        pctOct,
        noCert,
        porEjecutarOct,
        saldo,
        sem: semM(pctOct),
        semAnual: semD(Avance),
        achieved: Math.min(item.devOct, item.progOct || item.devOct),
        pending: Math.max(0, item.progOct - item.devOct),
        dm: item.devOct,
        pm: item.progOct,
        shortName: item.name,
      };
    };

    return Object.values(map)
      .map((u: any) => ({
        ...decorate(u),
        orgList: Object.values(u.orgs).map((o: any) => decorate(o)).sort((a: any, b: any) => b.pim - a.pim),
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [filtered005, cfg.mesCorteColProg, cfg.mesCorteColDev, semM, semD]);

  const orgs005Chart = useMemo(() => {
    const map: Record<string, any> = {};
    filtered005.forEach((r) => {
      const k = r.ORGANO || 'SIN ÓRGANO';
      if (!map[k]) map[k] = { name: k, shortName: k.split('·')[0].trim(), pim: 0, cert: 0, comp: 0, dev: 0 };
      map[k].pim  += Number(r.MONTO_PIM) || 0;
      map[k].cert += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].comp += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      map[k].dev  += Number(r.TOTAL_DEVENGADO) || 0;
    });
    return Object.values(map)
      .map((d: any) => ({ ...d, Avance: d.pim > 0 ? Number(((d.dev / d.pim) * 100).toFixed(1)) : 0 }))
      .sort((a: any, b: any) => b.pim - a.pim);
  }, [filtered005]);

  const monthly005Series = useMemo(() => {
    let acumP = 0, acumD = 0;
    return MESES_CONFIG.map((m) => {
      let dM = 0, pM = 0;
      filtered005.forEach((r) => {
        dM += Number(r[m.colDev]) || 0;
        pM += Number(r[m.colProg]) || 0;
      });
      acumP += pM;
      if (m.num <= cfg.mesCorteNum) acumD += dM;
      return {
        num: m.num,
        mes: m.short,
        label: m.label,
        Programado: prog005Mode === 'acum' ? acumP : pM,
        Devengado: prog005Mode === 'acum' ? (m.num <= cfg.mesCorteNum ? acumD : null) : (m.num <= cfg.mesCorteNum ? dM : 0),
      };
    });
  }, [filtered005, prog005Mode, cfg.mesCorteNum]);

  const especifica005List = useMemo(() => {
    const map: Record<string, any> = {};
    filtered005.forEach((r) => {
      const k = r.ESPECIFICA_DET || r.GG_CONCAT || 'Clasificador SIAF';
      if (!map[k]) map[k] = { especifica: k, gg: r.GG_CONCAT, pia: 0, pim: 0, cert: 0, comp: 0, dev: 0, progOct: 0, devOct: 0 };
      map[k].pia     += Number(r.MONTO_PIA) || 0;
      map[k].pim     += Number(r.MONTO_PIM) || 0;
      map[k].cert    += Number(r.MONTO_CERTIFICADO) || 0;
      map[k].comp    += Number(r.MONTO_COMPROMETIDO_ANUAL) || 0;
      map[k].dev     += Number(r.TOTAL_DEVENGADO) || 0;
      map[k].progOct += Number(r[cfg.mesCorteColProg] ?? r['PROGRAMACION OCTUBRE']) || 0;
      map[k].devOct  += Number(r[cfg.mesCorteColDev]  ?? r['DEVENGADO_OCTUBRE']) || 0;
    });
    return Object.values(map)
      .map((e: any) => ({
        ...e,
        Avance: e.pim > 0 ? (e.dev / e.pim) * 100 : 0,
        AvanceOct: e.progOct > 0 ? (e.devOct / e.progOct) * 100 : 0,
        porEjecutarOct: Math.max(0, e.progOct - e.devOct),
        saldo: Math.max(0, e.pim - e.dev),
      }))
      .sort((a: any, b: any) => b.pim - a.pim);
  }, [filtered005, cfg.mesCorteColProg, cfg.mesCorteColDev]);

  const togglePliegoCollapse = (pliegoName: string) => {
    setCollapsedPliegos((prev) => {
      const next = new Set(prev);
      if (next.has(pliegoName)) next.delete(pliegoName);
      else next.add(pliegoName);
      return next;
    });
  };

  const toggleHeatPliegoCollapse = (pliegoName: string) => {
    setCollapsedHeatPliegos((prev) => {
      const next = new Set(prev);
      if (next.has(pliegoName)) next.delete(pliegoName);
      else next.add(pliegoName);
      return next;
    });
  };

  const renderViceministerioView = (vmCode: string, vmTitle: string, vmSub: string, vmGradient: string) => {
    const sourceRows = minam005Data.length > 0 ? minam005Data : data;
    const vmRows = sourceRows.filter((r) => String(r.DEPENDENCIA || '').toUpperCase() === vmCode);
    let pim = 0, dev = 0, pm = 0, dm = 0;
    const orgMap: Record<string, any> = {};

    vmRows.forEach((r) => {
      pim += Number(r.MONTO_PIM) || 0;
      dev += Number(r.TOTAL_DEVENGADO) || 0;
      pm  += Number(r[cfg.mesCorteColProg]) || 0;
      dm  += Number(r[cfg.mesCorteColDev]) || 0;

      const o = r.ORGANO || 'SIN ÓRGANO';
      if (!orgMap[o]) orgMap[o] = { name: o, uorg: r.U_ORGANICA, pim: 0, dev: 0, pm: 0, dm: 0 };
      orgMap[o].pim += Number(r.MONTO_PIM) || 0;
      orgMap[o].dev += Number(r.TOTAL_DEVENGADO) || 0;
      orgMap[o].pm  += Number(r[cfg.mesCorteColProg]) || 0;
      orgMap[o].dm  += Number(r[cfg.mesCorteColDev]) || 0;
    });

    const orgList = Object.values(orgMap).map((o: any) => ({
      ...o,
      Avance: o.pim > 0 ? Number(((o.dev / o.pim) * 100).toFixed(1)) : 0,
      AvanceMes: o.pm > 0 ? Number(((o.dm / o.pm) * 100).toFixed(1)) : 0,
    }));

    const pctDev = pim > 0 ? (dev / pim) * 100 : 0;
    const pctMes = pm > 0 ? (dm / pm) * 100 : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: vmGradient, borderRadius: 22, padding: '22px 26px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.9 }}>PLIEGO 005 · MINISTERIO DEL AMBIENTE · CORTE {cfg.mesCorteLabel.toUpperCase()} 2026</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: '4px 0' }}>{vmTitle}</h2>
            <p style={{ fontSize: 12, opacity: 0.92, margin: 0 }}>{vmSub}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.16)', padding: '10px 16px', borderRadius: 14 }}>
              <div style={{ fontSize: 10, opacity: 0.85 }}>PIM {vmCode}</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{fmtM(pim)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', padding: '10px 16px', borderRadius: 14 }}>
              <div style={{ fontSize: 10, opacity: 0.85 }}>Devengado Acum.</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{fmtM(dev)} ({pctDev.toFixed(1)}%)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.22)', padding: '10px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.35)' }}>
              <div style={{ fontSize: 10, fontWeight: 800 }}>Avance Mes {cfg.mesCorteLabel}</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{pctMes.toFixed(1)}% ({fmtC(dm)} / {fmtC(pm)})</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
          <GCard grad={vmGradient} icon={Building2} title={`Ejecución Anual por Órgano / UE (${vmCode})`} sub="PIM vs Devengado Acumulado a Octubre y % de Avance">
            <div style={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={orgList} margin={{ top: 20, right: 16, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: THEME_CHARCOAL }} tickMargin={8} height={40} />
                  <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 10, fill: THEME_SLATE }} />
                  <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 110]} tick={{ fontSize: 10, fill: THEME_GREEN }} />
                  <Tooltip content={<TTip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                  <Bar yAxisId="left" dataKey="pim" name="PIM" fill={THEME_LIGHT_BLUE} radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="left" dataKey="dev" name="Devengado Acum." fill={vmCode === 'VMGA' ? THEME_BLUE : THEME_GREEN} radius={[6, 6, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance Anual" stroke={THEME_ORANGE} strokeWidth={2.5} dot={{ r: 4 }}>
                    <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9.5, fontWeight: 900, fill: THEME_DARKEST }} />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GCard>

          <GCard grad={OCT_GRADIENT} icon={Target} title={`Desempeño en ${cfg.mesCorteLabel} (${vmCode})`} sub={`Comparativo PROGRAMACION ${cfg.mesCorteLabel.toUpperCase()} vs DEVENGADO_${cfg.mesCorteLabel.toUpperCase()}`}>
            <div style={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={orgList} margin={{ top: 20, right: 16, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: THEME_CHARCOAL }} tickMargin={8} height={40} />
                  <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 10, fill: THEME_SLATE }} />
                  <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 115]} tick={{ fontSize: 10, fill: THEME_PETROL }} />
                  <Tooltip content={<TTip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                  <Bar yAxisId="left" dataKey="pm" name={`Programación ${cfg.mesCorteLabel}`} fill={THEME_CYAN} radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="left" dataKey="dm" name={`Devengado ${cfg.mesCorteLabel}`} fill={THEME_PETROL} radius={[6, 6, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="AvanceMes" name={`% Avance ${cfg.mesCorteLabel}`} stroke={THEME_GOLD} strokeWidth={2.5} dot={{ r: 4 }}>
                    <LabelList dataKey="AvanceMes" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9.5, fontWeight: 900, fill: THEME_PETROL }} />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GCard>
        </div>
      </div>
    );
  };

  const minamRankPos = useMemo(() => {
    const idx = funnelMinisteriosData.findIndex((x) => x.isMinam);
    return idx >= 0 ? idx + 1 : 7;
  }, [funnelMinisteriosData]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: THEME_DARKEST }}>
      {/* SIDEBAR INSTITUCIONAL */}
      <aside style={{ width: 268, background: THEME_DARKEST, color: 'white', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
        {/* LOGO PERÚ / MINAM INTACTO */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 13, marginBottom: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ background: '#D91023', color: 'white', fontWeight: 900, fontSize: 10, padding: '5px 8px', borderRadius: 6 }}>PERÚ</div>
            <div style={{ background: '#1565C0', color: 'white', fontWeight: 800, fontSize: 10, padding: '5px 8px', borderRadius: 6, flex: 1, textAlign: 'center' }}>MINAM · SECTOR 05</div>
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 900, color: '#f8fafc', marginTop: 10 }}>Tablero Presupuestal SIAF 2026</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: THEME_LIME, display: 'inline-block' }} />
            <span style={{ fontSize: 10.5, color: THEME_LIME, fontWeight: 800 }}>Corte Activo: {cfg.mesCorteLabel} 2026</span>
          </div>
        </div>

        <div style={{ fontSize: 9.5, fontWeight: 800, color: '#7F898A', textTransform: 'uppercase', letterSpacing: 1.4, padding: '4px 10px' }}>Monitoreo Sectorial</div>
        {/* NUEVA PRIMERA HOJA: RANKING MINISTERIOS Y GOBIERNO NACIONAL */}
        <NBtn active={tab === 'ranking'} onClick={() => setTab('ranking')} icon={Award} label="Ranking Ministerios y Gob. Nac." badge="TOP" badgeColor={THEME_GOLD} />
        <NBtn active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={LayoutDashboard} label="Resumen Ejecutivo Sector" badge="OCT 🎃" badgeColor={THEME_ORANGE} />
        <NBtn active={tab === 'minam005'} onClick={() => setTab('minam005')} icon={Building2} label="Pliego 005 · MINAM (SIAF)" badge="SIAF" badgeColor={THEME_GOLD} />
        <NBtn active={tab === 'octubre'} onClick={() => setTab('octubre')} icon={Target} label={`Avance ${cfg.mesCorteLabel} y Mapa IV Trim.`} badge="PICO MES" badgeColor={THEME_CYAN} />
        <NBtn active={tab === 'presupuestologo'} onClick={() => setTab('presupuestologo')} icon={Gauge} label="Análisis Presupuestólogo" badge="BRECHAS" badgeColor={THEME_GOLD} />
        <NBtn active={tab === 'prog'} onClick={() => setTab('prog')} icon={Calendar} label="Programación Ene–Dic (12M)" />

        <div style={{ fontSize: 9.5, fontWeight: 800, color: '#7F898A', textTransform: 'uppercase', letterSpacing: 1.4, padding: '10px 10px 4px' }}>Viceministerios MINAM</div>
        <NBtn active={tab === 'vmga'} onClick={() => setTab('vmga')} icon={Layers} label="VMGA · Calidad Ambiental" badge="VMGA" badgeColor={THEME_LIME} />
        <NBtn active={tab === 'vmdern'} onClick={() => setTab('vmdern')} icon={Sparkles} label="VMDERN · Recursos Nat." badge="VMDERN" badgeColor={THEME_LIME} />

        <div style={{ fontSize: 9.5, fontWeight: 800, color: '#7F898A', textTransform: 'uppercase', letterSpacing: 1.4, padding: '10px 10px 4px' }}>Focalización y Datos</div>
        <NBtn active={tab === 'inv'} onClick={() => setTab('inv')} icon={HardHat} label="Inversiones CUI / Proyectos" />
        <NBtn active={tab === 'gobnac'} onClick={() => setTab('gobnac')} icon={Globe} label="Base Gobierno Nacional" badge="GN" badgeColor={THEME_CYAN} />
        <NBtn active={tab === 'inter'} onClick={() => setTab('inter')} icon={TrendingUp} label="Histórico y POI 2023–2029" />
        <NBtn active={tab === 'explorer'} onClick={() => setTab('explorer')} icon={Database} label="Explorador Multidimensional" />

        <div style={{ marginTop: 'auto', padding: 12, borderRadius: 14, background: THEME_CHARCOAL, border: '1px solid rgba(255,255,255,0.08)', fontSize: 10 }}>
          <div style={{ fontWeight: 900, color: THEME_LIGHT_BLUE, marginBottom: 6, textTransform: 'uppercase' }}>Fuentes Oficiales Activas</div>
          <div style={{ color: '#e2e8f0', marginBottom: 3 }}>• Sector: <span style={{ color: THEME_CYAN, fontWeight: 700 }}>{syncStatus.datos_abiertos}</span></div>
          <div style={{ color: '#e2e8f0', marginBottom: 3 }}>• Pliego 005: <span style={{ color: THEME_LIME, fontWeight: 700 }}>{syncStatus.resumen005}</span></div>
          <div style={{ color: '#e2e8f0' }}>• Gob. Nacional: <span style={{ color: THEME_GOLD, fontWeight: 700 }}>{syncStatus.gob_nacional}</span></div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '18px 22px', overflowY: 'auto', maxWidth: '100%' }}>
        {/* CABECERA SUPERIOR */}
        <div style={{ background: 'white', borderRadius: 20, padding: '14px 20px', marginBottom: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div
            onDoubleClick={syncAllFromSharePoint}
            style={{
              background: VMGA_GRADIENT,
              padding: '12px 24px',
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(27,77,92,0.24)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: 0.3, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Tablero: Sector Ambiental - MINAM
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #cbd5e1', color: THEME_CHARCOAL, fontSize: 11, fontWeight: 800 }}>
              <Clock size={14} color={THEME_TEAL_DARK} />
              <span>Última actualización: <strong style={{ color: THEME_PETROL }}>{lastSyncTime}</strong></span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, color: THEME_TEAL_DARK, paddingRight: 4 }}>
              Fuente: Datos Abiertos
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div style={{ marginBottom: 14, padding: '11px 16px', borderRadius: 12, background: bannerMsg.type === 'error' ? '#fff1f2' : '#ecfdf5', border: `1px solid ${bannerMsg.type === 'error' ? '#fca5a5' : '#6ee7b7'}`, color: bannerMsg.type === 'error' ? '#be123c' : '#047857', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
            <span>{bannerMsg.text}</span>
            <button onClick={() => setBannerMsg(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <X size={15} />
            </button>
          </div>
        )}

        {loading && (
          <div style={{ marginBottom: 14, padding: 12, borderRadius: 14, background: '#f0f9ff', border: `1px solid ${THEME_LIGHT_BLUE}`, color: THEME_PETROL, fontSize: 11.5, fontWeight: 700 }}>
            {loadStage} ({loadProgress}%)
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            NUEVA PRIMERA HOJA: RANKING POR MINISTERIOS Y GOBIERNO NACIONAL
            Con botones General | Inversión | Proyecto y Embudos con resaltado MINAM
           ═════════════════════════════════════════════════════════════════════ */}
        {tab === 'ranking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* BANNER EJECUTIVO + BOTONES DE FILTRO GENERAL / INVERSIÓN / PROYECTO */}
            <div style={{ background: OCT_GRADIENT, borderRadius: 22, padding: '20px 24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, boxShadow: '0 8px 26px rgba(27,77,92,0.2)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ background: THEME_GREEN, color: 'white', fontWeight: 900, fontSize: 10, padding: '3px 9px', borderRadius: 6 }}>
                    ★ SECTOR 05. AMBIENTE: PUESTO #{minamRankPos} NACIONAL
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.14)', color: THEME_LIGHT_BLUE, fontWeight: 800, fontSize: 10, padding: '3px 9px', borderRadius: 6 }}>
                    CORTE OCTUBRE 2026 🎃
                  </span>
                </div>
                <h2 style={{ fontSize: 21, fontWeight: 900, margin: 0 }}>
                  Ranking de Ejecución Presupuestal: Ministerios y Gobierno Nacional (SIAF 2026)
                </h2>
                <p style={{ fontSize: 12, opacity: 0.9, margin: '4px 0 0' }}>
                  Comparativo en embudo del porcentaje de avance devengado sobre PIM · Resaltado especial para el Sector Ambiental y sus Pliegos Adscritos.
                </p>
              </div>

              {/* BOTONES SELECTORES: GENERAL | INVERSIÓN | PROYECTO */}
              <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.1)', padding: 6, borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
                {[
                  { id: 'general', lbl: 'General (Total)' },
                  { id: 'inversion', lbl: 'Inversión' },
                  { id: 'proyecto', lbl: 'Proyecto' },
                ].map((btn) => {
                  const active = rankingFilter === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => setRankingFilter(btn.id as any)}
                      style={{
                        padding: '9px 16px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 900,
                        background: active ? HALLOWEEN_GRAD : 'transparent',
                        color: active ? '#ffffff' : '#e2e8f0',
                        boxShadow: active ? '0 4px 12px rgba(242,92,5,0.4)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {btn.lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DOS EMBUDOS LADO A LADO: 1) RANKING POR MINISTERIOS Y 2) RANKING GOBIERNO NACIONAL / PLIEGOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 18 }}>
              <FunnelRankingCard
                grad={VMGA_GRADIENT}
                title={`Ranking por Ministerios · Poder Ejecutivo (${rankingFilter === 'general' ? 'General' : rankingFilter === 'inversion' ? 'Inversión' : 'Proyectos'})`}
                sub="Ordenado de mayor a menor % de ejecución presupuestal (Destacando Sector 05. Ambiente)"
                items={funnelMinisteriosData}
              />

              <FunnelRankingCard
                grad={VMDERN_GRADIENT}
                title={`Ranking por Gobierno Nacional · Pliegos (${rankingFilter === 'general' ? 'General' : rankingFilter === 'inversion' ? 'Inversión' : 'Proyectos'})`}
                sub="Desempeño comparativo de Pliegos Presupuestales (Destacando Pliego 005. MINAM)"
                items={funnelGobNacionalPliegos}
              />
            </div>
          </div>
        )}

        {/* BARRA DE FILTROS MULTIDIMENSIONALES PARA LAS VISTAS SECTORIALES */}
        {tab !== 'ranking' && tab !== 'minam005' && tab !== 'gobnac' && (
          <div style={{ background: 'white', borderRadius: 18, padding: '11px 16px', marginBottom: 16, border: '1px solid #e2e8f0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: THEME_TEAL_DARK, marginRight: 4 }}>
              <Filter size={14} /> FILTROS:
            </div>

            {[
              { label: 'Pliego', key: 'pliego', opts: filterOptions.pliegos },
              { label: 'Unidad Ejecutora', key: 'ejecutora', opts: filterOptions.ejecutoras },
              { label: 'Dependencia / VM', key: 'dep', opts: filterOptions.deps },
              { label: 'Actividad / Proy', key: 'tipo', opts: filterOptions.tipos },
              { label: 'Fuente Financ.', key: 'ff', opts: filterOptions.ffs },
              { label: 'Genérica Gasto', key: 'gg', opts: filterOptions.ggs },
              { label: 'Programa Ppto.', key: 'pp', opts: filterOptions.pps },
            ].map((f) => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: THEME_SLATE, textTransform: 'uppercase' }}>{f.label}</span>
                <select
                  value={(filters as any)[f.key]}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700, color: THEME_DARKEST, background: (filters as any)[f.key] !== 'Todos' ? '#e0f2fe' : '#f8fafc', maxWidth: 160 }}
                >
                  {f.opts.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}

            <button
              onClick={() => setFilters({ pliego: 'Todos', ejecutora: 'Todos', dep: 'Todos', tipo: 'Todos', ff: 'Todos', gg: 'Todos', pp: 'Todos' })}
              style={{ marginLeft: 'auto', padding: '7px 11px', borderRadius: 9, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 11, fontWeight: 800, color: THEME_CHARCOAL, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <RefreshCw size={12} /> Restablecer
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            VISTA: RESUMEN EJECUTIVO SECTOR (CON CALABAZA AL LADO DE OCTUBRE)
           ═════════════════════════════════════════════════════════════════════ */}
        {tab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* TARJETAS KPI CON SUS COLORES PROPIOS INTACTOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: 12 }}>
              {[
                { lbl: 'PIM 2026 (MARCO VIGENTE)', val: fmtM(kpis.pim), sub: `PIA: ${fmtM(kpis.pia)} (+${kpis.pia > 0 ? (((kpis.pim - kpis.pia) / kpis.pia) * 100).toFixed(1) : 0}%)`, col: '#1565C0', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: 'CERTIFICADO ACUMULADO', val: fmtM(kpis.cert), sub: `${kpis.pctCert.toFixed(1)}% del PIM | Sin Cert: ${fmtC(kpis.brechaNoCertificado)}`, col: '#0288D1', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: 'COMPROMISO ANUAL', val: fmtM(kpis.comp), sub: `${kpis.pctComp.toFixed(1)}% del PIM | Por Comp: ${fmtC(kpis.brechaCertNoComp)}`, col: '#6d28d9', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: `DEVENGADO ACUM. (ENE–${cfg.mesCorteLabel.slice(0, 3).toUpperCase()})`, val: fmtM(kpis.dev), sub: `${kpis.pctDev.toFixed(1)}% de Ejecución Anual`, col: '#047857', bg: '#ecfdf5', brd: '#6ee7b7' },
                { lbl: `AVANCE MES ${cfg.mesCorteLabel.toUpperCase()}`, val: `${kpis.pctMes.toFixed(1)}%`, sub: `Dev: ${fmtC(kpis.devMes)} / Prog: ${fmtC(kpis.progMes)}`, col: '#1e3a8a', bg: '#dbeafe', brd: '#60a5fa' },
                { lbl: 'SALDO POR DEVENGAR (NOV–DIC)', val: fmtM(kpis.saldo), sub: `${(100 - kpis.pctDev).toFixed(1)}% restante | RO: ${fmtC(kpis.saldoRO)}`, col: '#be123c', bg: '#fff1f2', brd: '#fda4af' },
              ].map((c, i) => (
                <div key={i} style={{ background: c.bg, padding: '14px 16px', borderRadius: 18, border: `1.5px solid ${c.brd}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 900, color: '#475569', letterSpacing: 0.8 }}>{c.lbl}</div>
                  <div style={{ fontSize: 21, fontWeight: 900, color: c.col, marginTop: 6, letterSpacing: -0.5 }}>{c.val}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#334155', marginTop: 4 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* VELOCÍMETROS COMPACTOS + TERMÓMETRO DE LA CADENA DE GASTO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14, alignItems: 'stretch' }}>
              <GaugeKPI
                pct={kpis.pctDev}
                label={`% Avance Devengado Anual (Al cierre de ${cfg.mesCorteLabel})`}
                subValue={`Ejecutado: ${fmtM(kpis.dev)} de ${fmtM(kpis.pim)}`}
                meta={`Meta a ${cfg.mesCorteLabel}: ${cfg.metaDevAnual}%`}
                sem={semD(kpis.pctDev)}
                max={100}
                thresholds={[cfg.semDevMedio, cfg.semDevAlto]}
              />

              <GaugeKPI
                pct={kpis.pctMes}
                label={`% Avance Mes de ${cfg.mesCorteLabel} (DEVENGADO vs PROGRAMACION)`}
                subValue={`Dev. ${cfg.mesCorteLabel}: ${fmtC(kpis.devMes)} vs Prog.: ${fmtC(kpis.progMes)}`}
                meta={`Meta Mensual: ${cfg.metaAvanceMes}%`}
                sem={semM(kpis.pctMes)}
                max={100}
                thresholds={[cfg.semMesMedio, cfg.semMesAlto]}
              />

              <GCard grad={OCT_GRADIENT} icon={Activity} title={`Termómetro de la Cadena de Gasto SIAF (${cfg.mesCorteLabel})`} sub="Cuellos de botella presupuestales antes del cierre anual">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { stage: '1. Certificado vs PIM', pct: kpis.pctCert, col: THEME_BLUE, gapLbl: `Sin cert.: ${fmtC(kpis.brechaNoCertificado)}` },
                    { stage: '2. Compromiso vs PIM', pct: kpis.pctComp, col: THEME_TEAL_DARK, gapLbl: `Sin comp.: ${fmtC(kpis.brechaCertNoComp)}` },
                    { stage: '3. Devengado vs PIM', pct: kpis.pctDev, col: THEME_GREEN, gapLbl: `Por dev.: ${fmtC(kpis.brechaCompNoDev)}` },
                    { stage: `4. Avance ${cfg.mesCorteLabel}`, pct: kpis.pctMes, col: THEME_ORANGE, gapLbl: `Brecha Oct: ${fmtC(Math.max(0, kpis.progMes - kpis.devMes))}` },
                  ].map((b, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '7px 10px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 800, marginBottom: 3 }}>
                        <span style={{ color: THEME_DARKEST }}>{b.stage}</span>
                        <span style={{ color: b.col }}>{b.pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, b.pct)}%`, height: '100%', background: b.col, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 9.5, color: THEME_SLATE, fontWeight: 600, marginTop: 2 }}>{b.gapLbl}</div>
                    </div>
                  ))}
                </div>
              </GCard>
            </div>

            {/* GRÁFICOS POR PLIEGO CON ETIQUETAS DE DATOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(430px, 1fr))', gap: 16 }}>
              <GCard grad={VMGA_GRADIENT} icon={BarChart3} title={`Ejecución Anual Acumulada a ${cfg.mesCorteLabel} por Pliego`} sub="Comparativo PIM vs Certificado vs Devengado y % de Avance Anual">
                <div style={{ height: 305 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={pliegoChartData} margin={{ top: 22, right: 16, left: 0, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={54} tickMargin={10} tick={{ fontSize: 9.5, fontWeight: 800, fill: THEME_CHARCOAL }} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 9.5, fill: THEME_SLATE }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 110]} tick={{ fontSize: 9.5, fill: THEME_GREEN }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 18 }} />
                      <Bar yAxisId="left" dataKey="pim" name="PIM 2026" fill={THEME_LIGHT_BLUE} radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="cert" name="Certificado" fill={THEME_TURQUOISE} radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dev" name={`Devengado a ${cfg.mesCorteLabel}`} fill={THEME_BLUE} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance PIM" stroke={THEME_GREEN} strokeWidth={2.5} dot={{ r: 4 }}>
                        <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9.5, fontWeight: 900, fill: THEME_FOREST }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>

              <GCard grad={OCT_GRADIENT} icon={Target} title={`Ejecución del Mes de ${cfg.mesCorteLabel} por Pliego (Devengado vs Programado)`} sub={`Comparativo directo de PROGRAMACION ${cfg.mesCorteLabel.toUpperCase()} y DEVENGADO_${cfg.mesCorteLabel.toUpperCase()}`} badge={`CORTE ${cfg.mesCorteLabel.toUpperCase()} 🎃`}>
                <div style={{ height: 305 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={pliegoChartData} margin={{ top: 22, right: 16, left: 0, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={54} tickMargin={10} tick={{ fontSize: 9.5, fontWeight: 800, fill: THEME_CHARCOAL }} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 9.5, fill: THEME_SLATE }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 115]} tick={{ fontSize: 9.5, fill: THEME_ORANGE }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 18 }} />
                      <Bar yAxisId="left" dataKey="pm" name={`PROGRAMACION ${cfg.mesCorteLabel.toUpperCase()}`} fill={THEME_LIGHT_BLUE} radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dm" name={`DEVENGADO_${cfg.mesCorteLabel.toUpperCase()}`} fill={THEME_GREEN} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="pctMes" name={`% Avance ${cfg.mesCorteLabel}`} stroke={THEME_ORANGE} strokeWidth={2.5} dot={{ r: 4 }}>
                        <LabelList dataKey="pctMes" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9.5, fontWeight: 900, fill: '#D9480F' }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>
            </div>

            {/* GRÁFICOS 4, 5 Y 6 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
              <GCard grad={VMDERN_GRADIENT} icon={HardHat} title="Ejecución por Tipo: Actividades vs Proyectos" sub="Comparativo de Gasto Operativo (Actividades) vs Inversión (Proyectos)">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={tipoGastoChartData} margin={{ top: 22, right: 16, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" interval={0} tick={{ fontSize: 10, fontWeight: 800, fill: THEME_CHARCOAL }} tickMargin={8} height={38} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 9.5 }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 110]} tick={{ fontSize: 9.5 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 10 }} />
                      <Bar yAxisId="left" dataKey="pim" name="PIM" fill={THEME_LIGHT_BLUE} radius={[5, 5, 0, 0]} />
                      <Bar yAxisId="left" dataKey="cert" name="Certificado" fill={THEME_CYAN} radius={[5, 5, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dev" name="Devengado" fill={THEME_GREEN} radius={[5, 5, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance PIM" stroke={THEME_ORANGE} strokeWidth={2.5} dot={{ r: 4 }}>
                        <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 10, fontWeight: 900, fill: '#D9480F' }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>

              <GCard grad={OCT_GRADIENT} icon={Layers} title="Estructura por Genérica de Gasto (GG CONCAT)" sub="Todas las Genéricas de Gasto y % Avance (TOTAL_DEVENGADO / MONTO_PIM)">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ggChartData} margin={{ top: 22, right: 16, left: 0, bottom: 26 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="shortName" angle={-22} textAnchor="end" interval={0} height={54} tickMargin={8} tick={{ fontSize: 9, fontWeight: 800, fill: THEME_CHARCOAL }} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 9.5 }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 115]} tick={{ fontSize: 9.5 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 14 }} />
                      <Bar yAxisId="left" dataKey="pim" name="PIM" fill={THEME_LIGHT_BLUE} radius={[5, 5, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dev" name="Devengado Acum." fill={THEME_STEEL} radius={[5, 5, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance Anual" stroke={THEME_GOLD} strokeWidth={2.5} dot={{ r: 4 }}>
                        <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9, fontWeight: 900, fill: '#B45309' }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>

              <GCard grad={VMGA_GRADIENT} icon={FolderKanban} title="Ejecución por Programa Presupuestal (PP)" sub="Categorías presupuestales (PP 036, PP 068, AC 9001, APNOP 9002)">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ppChartData} margin={{ top: 22, right: 16, left: 0, bottom: 26 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-22} textAnchor="end" interval={0} height={54} tickMargin={8} tick={{ fontSize: 9, fontWeight: 800, fill: THEME_CHARCOAL }} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 9.5 }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 115]} tick={{ fontSize: 9.5 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 14 }} />
                      <Bar yAxisId="left" dataKey="pim" name="PIM" fill={THEME_LIGHT_BLUE} radius={[5, 5, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dev" name="Devengado" fill={THEME_BLUE} radius={[5, 5, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance" stroke={THEME_GREEN} strokeWidth={2.5} dot={{ r: 4 }}>
                        <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9, fontWeight: 900, fill: THEME_FOREST }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>
            </div>

            {/* MATRIZ MAESTRA CON ENCABEZADO NARANJA "OCTUBRE 🎃" */}
            <GCard
              full
              grad={VMGA_GRADIENT}
              icon={TableIcon}
              title={`Matriz Maestra de Ejecución Presupuestal por Pliego y Unidad Ejecutora (Corte ${cfg.mesCorteLabel} 2026)`}
              sub="Integra la cadena anual (PIM, Certificado, Compromiso, Devengado) y el bloque mensual de Octubre (Programado, Devengado, Monto por Ejecutar y % Avance)"
              badge="CLIC EN 005. MINAM PARA DESPLEGAR SUS UNIDADES EJECUTORAS"
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.2 }}>
                  <thead>
                    <tr>
                      <th colSpan={6} style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 12px', fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textAlign: 'left', borderRadius: '10px 0 0 0', borderBottom: '1px solid #334155' }}>
                        EJECUCIÓN PRESUPUESTAL ANUAL 2026 (PLIEGO CORTO / UE CORTO)
                      </th>
                      <th colSpan={4} style={{ background: HALLOWEEN_GRAD, color: '#ffffff', padding: '8px 12px', fontSize: 11.5, fontWeight: 900, letterSpacing: 1.8, textAlign: 'center', borderLeft: '2px solid #ffffff', borderRight: '2px solid #ffffff' }}>
                        <PumpkinBadge />
                      </th>
                      <th style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 10px', fontSize: 10, fontWeight: 900, textAlign: 'right', borderRadius: '0 10px 0 0', borderBottom: '1px solid #334155' }}>
                        CIERRE ANUAL
                      </th>
                    </tr>
                    <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                      <th style={{ padding: '11px 12px' }}>Pliego / Unidad Ejecutora</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>PIM 2026</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>Certificado</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>Compromiso Anual</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>Devengado Acum.</th>
                      <th style={{ padding: '11px 10px', textAlign: 'center' }}>% Avance PIM</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right', background: '#E8590C', borderLeft: '2px solid #fff' }}>Prog. Octubre</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right', background: '#E8590C' }}>Dev. Octubre</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right', background: '#E8590C' }}>Monto por Ejecutar Octubre</th>
                      <th style={{ padding: '11px 10px', textAlign: 'center', background: '#E8590C', borderRight: '2px solid #fff' }}>% Avance Octubre</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>Saldo por Devengar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pliegoChartData.map((p: any) => {
                      const isCollapsed = collapsedPliegos.has(p.name);
                      const sAnual = semD(p.Avance);
                      const sMes = semM(p.pctMes);
                      const canExpand = p.isMinam005 && p.ueList && p.ueList.length > 0;

                      return (
                        <React.Fragment key={p.name}>
                          <tr
                            onClick={() => canExpand && togglePliegoCollapse(p.name)}
                            style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', cursor: canExpand ? 'pointer' : 'default', fontWeight: 800 }}
                          >
                            <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6, color: THEME_DARKEST }}>
                              {canExpand ? (isCollapsed ? <ChevronRight size={15} color={THEME_ORANGE} /> : <ChevronDown size={15} color={THEME_ORANGE} />) : <span style={{ width: 15, display: 'inline-block' }} />}
                              {p.name}
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(p.pim)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(p.cert)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(p.comp)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_TEAL_DARK }}>{fmt(p.dev)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900, background: sAnual.bg, color: sAnual.col, border: `1px solid ${sAnual.brd}` }}>{p.Avance.toFixed(1)}%</span>
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', color: '#9a3412', borderLeft: '2px solid #fed7aa' }}>{fmt(p.pm)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', color: '#c2410c', fontWeight: 900 }}>{fmt(p.dm)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', color: '#ea580c', fontWeight: 800 }}>{fmt(p.porEjecutarOct)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'center', background: '#fff7ed', borderRight: '2px solid #fed7aa' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900, background: sMes.bg, color: sMes.col, border: `1px solid ${sMes.brd}` }}>{p.pctMes.toFixed(1)}%</span>
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(p.saldo)}</td>
                          </tr>

                          {canExpand &&
                            !isCollapsed &&
                            p.ueList.map((u: any) => {
                              const suAnual = semD(u.Avance);
                              const suMes = semM(u.pctMes);
                              return (
                                <tr key={u.name} style={{ borderBottom: '1px solid #f1f5f9', background: 'white', fontSize: 10.8 }}>
                                  <td style={{ padding: '8px 12px 8px 34px', color: THEME_CHARCOAL, fontWeight: 700 }}>↳ {u.name}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_CHARCOAL }}>{fmt(u.pim)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_SLATE }}>{fmt(u.cert)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_SLATE }}>{fmt(u.comp)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_TEAL_DARK }}>{fmt(u.dev)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                    <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: suAnual.bg, color: suAnual.col }}>{u.Avance.toFixed(1)}%</span>
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5', color: '#9a3412', borderLeft: '2px solid #fed7aa' }}>{fmt(u.pm)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(u.dm)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#ea580c', background: '#fffaf5' }}>{fmt(u.porEjecutarOct)}</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center', background: '#fffaf5', borderRight: '2px solid #fed7aa' }}>
                                    <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: suMes.bg, color: suMes.col }}>{u.pctMes.toFixed(1)}%</span>
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(u.saldo)}</td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: THEME_DARKEST, color: 'white', fontWeight: 900 }}>
                      <td style={{ padding: '11px 12px' }}>TOTAL SECTOR 05 AMBIENTAL</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(kpis.pim)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(kpis.cert)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(kpis.comp)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_LIME }}>{fmt(kpis.dev)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', color: THEME_LIME }}>{kpis.pctDev.toFixed(1)}%</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#D9480F', borderLeft: '2px solid #fff' }}>{fmt(kpis.progMes)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#D9480F', color: '#fde68a' }}>{fmt(kpis.devMes)}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#D9480F', color: '#ffffff' }}>{fmt(Math.max(0, kpis.progMes - kpis.devMes))}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', background: '#D9480F', color: '#fde68a', borderRight: '2px solid #fff' }}>{kpis.pctMes.toFixed(1)}%</td>
                      <td style={{ padding: '11px 10px', textAlign: 'right', fontFamily: 'monospace', color: '#FB8281' }}>{fmt(kpis.saldo)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </GCard>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            VISTA: PLIEGO 005 · MINAM (SIAF) - CON ENCABEZADO NARANJA "OCTUBRE 🎃"
           ═════════════════════════════════════════════════════════════════════ */}
        {tab === 'minam005' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: OCT_GRADIENT, borderRadius: 22, padding: '20px 24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, boxShadow: '0 8px 26px rgba(28,35,37,0.18)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ background: '#D91023', color: 'white', fontWeight: 900, fontSize: 10, padding: '3px 8px', borderRadius: 6 }}>PLIEGO 005 · MINAM</span>
                  <span style={{ background: 'rgba(115,224,70,0.2)', color: THEME_LIME, border: `1px solid ${THEME_LIME}`, fontWeight: 800, fontSize: 10, padding: '3px 9px', borderRadius: 6 }}>
                    BASE ACTIVA: {minam005FileName}
                  </span>
                </div>
                <h2 style={{ fontSize: 21, fontWeight: 900, margin: 0 }}>
                  Tablero Especializado SIAF Gasto · Pliego 005: Ministerio del Ambiente (Corte {cfg.mesCorteLabel} 2026)
                </h2>
                <p style={{ fontSize: 12, opacity: 0.9, margin: '4px 0 0' }}>
                  Control integral de ejecución anual, avance de {cfg.mesCorteLabel}, cadena de gasto SIAF y seguimiento por Ejecutora y Órgano.
                </p>
              </div>
            </div>

            {/* FILTROS PLIEGO 005 */}
            <div style={{ background: 'white', borderRadius: 18, padding: '12px 16px', border: `1.5px solid ${THEME_LIGHT_BLUE}`, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: THEME_PETROL, marginRight: 4 }}>
                <Filter size={14} /> FILTROS PLIEGO 005:
              </div>

              {[
                { label: 'Unidad Ejecutora (005)', key: 'ue', opts: filter005Options.ues },
                { label: 'Dependencia / Bloque', key: 'dep', opts: filter005Options.deps },
                { label: 'Órgano / Dirección', key: 'org', opts: filter005Options.orgs },
                { label: 'Actividad / Proyecto', key: 'tipo', opts: filter005Options.tipos },
                { label: 'Fuente Financiamiento', key: 'ff', opts: filter005Options.ffs },
                { label: 'Genérica de Gasto', key: 'gg', opts: filter005Options.ggs },
                { label: 'Programa Presupuestal', key: 'pp', opts: filter005Options.pps },
              ].map((flt) => (
                <div key={flt.key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: THEME_SLATE, textTransform: 'uppercase' }}>{flt.label}</span>
                  <select
                    value={(f005 as any)[flt.key]}
                    onChange={(e) => setF005((prev) => ({ ...prev, [flt.key]: e.target.value }))}
                    style={{ padding: '5px 8px', borderRadius: 8, border: `1px solid ${THEME_STEEL}`, fontSize: 11, fontWeight: 700, color: THEME_DARKEST, background: (f005 as any)[flt.key] !== 'Todos' ? '#e0f2fe' : '#f8fafc', maxWidth: 165 }}
                  >
                    {flt.opts.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 170 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: THEME_SLATE, textTransform: 'uppercase' }}>Buscar Meta / Específica / CUI</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f8fafc', border: `1px solid ${THEME_STEEL}`, borderRadius: 8, padding: '4px 8px' }}>
                  <Search size={12} color={THEME_SLATE} />
                  <input
                    type="text"
                    placeholder="Ej. GICA, PNCB, DCAE..."
                    value={f005.search}
                    onChange={(e) => setF005((prev) => ({ ...prev, search: e.target.value }))}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 11, fontWeight: 700, width: '100%' }}
                  />
                </div>
              </div>

              <button
                onClick={() => setF005({ ue: 'Todos', dep: 'Todos', org: 'Todos', tipo: 'Todos', ff: 'Todos', gg: 'Todos', pp: 'Todos', search: '' })}
                style={{ marginLeft: 'auto', padding: '7px 11px', borderRadius: 9, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 11, fontWeight: 800, color: THEME_CHARCOAL, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <RefreshCw size={12} /> Limpiar
              </button>
            </div>

            {/* 8 TARJETAS KPI DEL PLIEGO 005 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 12 }}>
              {[
                { lbl: 'PIM 2026 · PLIEGO 005 MINAM', val: fmtM(kpis005.pim), sub: `PIA: ${fmtM(kpis005.pia)} (+${kpis005.varPimPia.toFixed(1)}%)`, col: '#1565C0', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: 'CERTIFICADO CCP (SIAF)', val: fmtM(kpis005.cert), sub: `${kpis005.pctCert.toFixed(1)}% del PIM | Sin Cert: ${fmtC(kpis005.noCert)}`, col: '#0288D1', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: 'COMPROMISO ANUAL', val: fmtM(kpis005.comp), sub: `${kpis005.pctComp.toFixed(1)}% del PIM | Por Comp: ${fmtC(kpis005.certNoComp)}`, col: '#6d28d9', bg: '#ffffff', brd: '#cbd5e1' },
                { lbl: `DEVENGADO ACUM. (ENE–${cfg.mesCorteLabel.slice(0, 3).toUpperCase()})`, val: fmtM(kpis005.dev), sub: `${kpis005.pctDev.toFixed(1)}% del PIM`, col: '#047857', bg: '#ecfdf5', brd: '#6ee7b7' },
                { lbl: `AVANCE ${cfg.mesCorteLabel.toUpperCase()} (PLIEGO 005)`, val: `${kpis005.pctOct.toFixed(1)}%`, sub: `Dev: ${fmtC(kpis005.devOct)} / Prog: ${fmtC(kpis005.progOct)}`, col: '#1e3a8a', bg: '#dbeafe', brd: '#60a5fa' },
                { lbl: 'SALDO POR DEVENGAR (NOV–DIC)', val: fmtM(kpis005.saldo), sub: `RO: ${fmtC(kpis005.saldoRO)} | ROOC: ${fmtC(kpis005.saldoROOC)}`, col: '#be123c', bg: '#fff1f2', brd: '#fda4af' },
                { lbl: 'ACTIVIDADES vs PROYECTOS (005)', val: `${kpis005.pctAct.toFixed(1)}% / ${kpis005.pctProy.toFixed(1)}%`, sub: `Act: ${fmtC(kpis005.devAct)} | Proy: ${fmtC(kpis005.devProy)}`, col: '#0f172a', bg: '#f8fafc', brd: '#cbd5e1' },
                { lbl: 'CARGA PROGRAMADA DICIEMBRE', val: fmtM(kpis005.progDic), sub: `${kpis005.pesoDicQ4.toFixed(1)}% del IV Trim. | Nov: ${fmtC(kpis005.progNov)}`, col: kpis005.pesoDicQ4 > 38 ? '#be123c' : '#d97706', bg: '#fffbeb', brd: '#fcd34d' },
              ].map((c, idx) => (
                <div key={idx} style={{ background: c.bg, padding: '14px 16px', borderRadius: 18, border: `1.5px solid ${c.brd}` }}>
                  <div style={{ fontSize: 9.5, fontWeight: 900, color: '#475569', letterSpacing: 0.7 }}>{c.lbl}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: c.col, marginTop: 5 }}>{c.val}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#334155', marginTop: 4 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* VELOCÍMETROS COMPACTOS DEL PLIEGO 005 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <GaugeKPI
                pct={kpis005.pctDev}
                label={`% Avance Anual Pliego 005 MINAM (Corte ${cfg.mesCorteLabel})`}
                subValue={`Devengado: ${fmtM(kpis005.dev)} de ${fmtM(kpis005.pim)}`}
                meta={`Meta Lineal ${cfg.mesCorteLabel}: ${cfg.metaDevAnual}%`}
                sem={semD(kpis005.pctDev)}
                max={100}
                thresholds={[cfg.semDevMedio, cfg.semDevAlto]}
              />

              <GaugeKPI
                pct={kpis005.pctOct}
                label="% Avance Octubre Pliego 005 (DEVENGADO vs PROGRAMACION)"
                subValue={`Dev. Oct: ${fmtC(kpis005.devOct)} vs Prog. Oct: ${fmtC(kpis005.progOct)}`}
                meta={`Meta Mensual: ${cfg.metaAvanceMes}%`}
                sem={semM(kpis005.pctOct)}
                max={100}
                thresholds={[cfg.semMesMedio, cfg.semMesAlto]}
              />

              <GCard grad={OCT_GRADIENT} icon={Gauge} title="Cadena de Gasto SIAF · Pliego 005 MINAM" sub="Control de saldos retenidos en cada fase presupuestal">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { lbl: '1. Certificado vs PIM', val: kpis005.cert, pct: kpis005.pctCert, col: THEME_BLUE, sub: `Libre sin certificar: ${fmtC(kpis005.noCert)}` },
                    { lbl: '2. Compromiso Anual vs PIM', val: kpis005.comp, pct: kpis005.pctComp, col: THEME_TEAL_DARK, sub: `Certificado sin comprometer: ${fmtC(kpis005.certNoComp)}` },
                    { lbl: `3. Devengado (${cfg.mesCorteLabel}) vs PIM`, val: kpis005.dev, pct: kpis005.pctDev, col: THEME_GREEN, sub: `Comprometido por devengar: ${fmtC(kpis005.compNoDev)}` },
                  ].map((st, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: '7px 11px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800, marginBottom: 3 }}>
                        <span style={{ color: THEME_DARKEST }}>{st.lbl}</span>
                        <span style={{ color: st.col }}>{st.pct.toFixed(1)}% ({fmtC(st.val)})</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, st.pct)}%`, height: '100%', background: st.col, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 9.5, color: THEME_SLATE, fontWeight: 600, marginTop: 2 }}>{st.sub}</div>
                    </div>
                  ))}
                </div>
              </GCard>
            </div>

            {/* DONUTS POR UNIDAD EJECUTORA DEL PLIEGO 005 */}
            <GCard full grad={VMGA_GRADIENT} icon={Target} title="Cumplimiento de Octubre por Unidad Ejecutora del Pliego 005 MINAM" sub="Monitoreo individual de las Unidades Ejecutoras en el mes de corte">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {ue005Hierarchy.map((u: any) => (
                  <PliegoDonutCard key={u.name} p={u} mesLabel={cfg.mesCorteLabel} />
                ))}
              </div>
            </GCard>

            {/* GRÁFICAS POR ÓRGANO Y CURVA S DEL PLIEGO 005 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
              <GCard grad={VMDERN_GRADIENT} icon={Layers} title="Ejecución por Órgano / Dirección del Pliego 005 MINAM" sub="PIM vs Devengado Acumulado a Octubre y % de Avance">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={orgs005Chart} margin={{ top: 22, right: 16, left: 0, bottom: 32 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="shortName" angle={-25} textAnchor="end" interval={0} height={54} tickMargin={8} tick={{ fontSize: 9.5, fontWeight: 800, fill: THEME_CHARCOAL }} />
                      <YAxis yAxisId="left" tickFormatter={fmtC} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 115]} tick={{ fontSize: 10 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 14 }} />
                      <Bar yAxisId="left" dataKey="pim" name="PIM" fill={THEME_LIGHT_BLUE} radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="dev" name="Devengado Acum." fill={THEME_GREEN} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="Avance" name="% Avance Anual" stroke={THEME_BLUE} strokeWidth={2.5} dot={{ r: 3.5 }}>
                        <LabelList dataKey="Avance" position="top" offset={8} formatter={(v: any) => `${Number(v).toFixed(1)}%`} style={{ fontSize: 9, fontWeight: 900, fill: THEME_PETROL }} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>

              <GCard
                grad={OCT_GRADIENT}
                icon={Calendar}
                title={`Ritmo Mensual Ene–Dic 2026 del Pliego 005 MINAM (Corte ${cfg.mesCorteLabel})`}
                sub="Comparativo de devengado mensual real (Ene–Oct) y programación de cierre (Oct–Dic)"
                right={
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setProg005Mode('mensual')} style={{ padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 10.5, fontWeight: 800, background: prog005Mode === 'mensual' ? THEME_BLUE : '#f1f5f9', color: prog005Mode === 'mensual' ? 'white' : THEME_SLATE }}>Mensual</button>
                    <button onClick={() => setProg005Mode('acum')} style={{ padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 10.5, fontWeight: 800, background: prog005Mode === 'acum' ? THEME_BLUE : '#f1f5f9', color: prog005Mode === 'acum' ? 'white' : THEME_SLATE }}>Curva S Acum.</button>
                  </div>
                }
              >
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthly005Series} margin={{ top: 15, right: 16, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10.5, fontWeight: 800 }} tickMargin={8} />
                      <YAxis tickFormatter={fmtC} tick={{ fontSize: 10 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 12 }} />
                      <ReferenceLine x="Oct" stroke={THEME_RED} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="Programado" name="Programación Pliego 005" fill={THEME_LIGHT_BLUE} stroke={THEME_BLUE} strokeWidth={2.5} />
                      <Bar dataKey="Devengado" name="Devengado Pliego 005" fill={THEME_GREEN} radius={[5, 5, 0, 0]} barSize={22} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GCard>
            </div>

            {/* MATRIZ INTERACTIVA SIAF DEL PLIEGO 005 CON BARRA NARANJA "OCTUBRE 🎃" IGUAL A LA HOJA 1 */}
            <GCard
              full
              grad={VMGA_GRADIENT}
              icon={TableIcon}
              title={`Matriz Analítica SIAF Gasto · Pliego 005: Ministerio del Ambiente (Corte ${cfg.mesCorteLabel} 2026)`}
              sub="Inspección completa de PIA, PIM, Certificado, Brecha sin Certificar, Compromiso, Devengado y bloque Octubre con Calabaza"
              right={
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { id: 'ue_org', lbl: 'Por Ejecutora y Órgano' },
                    { id: 'especifica', lbl: 'Por Clasificador SIAF' },
                    { id: 'detalle', lbl: 'Detalle de Metas y Proyectos CUI' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setView005TableMode(m.id)}
                      style={{
                        padding: '6px 11px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 800,
                        background: view005TableMode === m.id ? THEME_BLUE : '#f1f5f9',
                        color: view005TableMode === m.id ? 'white' : THEME_CHARCOAL,
                      }}
                    >
                      {m.lbl}
                    </button>
                  ))}
                </div>
              }
            >
              {view005TableMode === 'ue_org' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      {/* BARRA SUPERIOR CON RECUADRO NARANJA OCTUBRE + CALABAZA */}
                      <tr>
                        <th colSpan={8} style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 12px', fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textAlign: 'left', borderRadius: '10px 0 0 0', borderBottom: '1px solid #334155' }}>
                          CADENA PRESUPUESTAL ANUAL SIAF · PLIEGO 005: MINISTERIO DEL AMBIENTE
                        </th>
                        <th colSpan={4} style={{ background: HALLOWEEN_GRAD, color: '#ffffff', padding: '8px 12px', fontSize: 11.5, fontWeight: 900, letterSpacing: 1.8, textAlign: 'center', borderLeft: '2px solid #ffffff', borderRight: '2px solid #ffffff' }}>
                          <PumpkinBadge />
                        </th>
                        <th style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 10px', fontSize: 10, fontWeight: 900, textAlign: 'right', borderRadius: '0 10px 0 0', borderBottom: '1px solid #334155' }}>
                          CIERRE ANUAL
                        </th>
                      </tr>
                      <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px' }}>Unidad Ejecutora / Órgano (Pliego 005)</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>PIA 2026</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>PIM 2026</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>Certificado</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', color: '#FB8281' }}>Sin Certificar</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>Compromiso</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>Devengado Acum.</th>
                        <th style={{ padding: '10px 9px', textAlign: 'center' }}>% PIM</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', background: '#E8590C', borderLeft: '2px solid #fff' }}>Prog. Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', background: '#E8590C' }}>Dev. Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', background: '#E8590C' }}>Por Ejecutar Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'center', background: '#E8590C', borderRight: '2px solid #fff' }}>% Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>Saldo por Devengar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ue005Hierarchy.map((u: any) => {
                        const isCol = collapsed005UEs.has(u.name);
                        return (
                          <React.Fragment key={u.name}>
                            <tr
                              onClick={() => {
                                setCollapsed005UEs((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(u.name)) next.delete(u.name);
                                  else next.add(u.name);
                                  return next;
                                });
                              }}
                              style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 800 }}
                            >
                              <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {isCol ? <ChevronRight size={15} color={THEME_ORANGE} /> : <ChevronDown size={15} color={THEME_ORANGE} />}
                                {u.name}
                              </td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(u.pia)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(u.pim)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(u.cert)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(u.noCert)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(u.comp)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', color: THEME_TEAL_DARK }}>{fmt(u.dev)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'center' }}>
                                <span style={{ padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 900, background: u.semAnual.bg, color: u.semAnual.col }}>{u.Avance.toFixed(1)}%</span>
                              </td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', color: '#9a3412', borderLeft: '2px solid #fed7aa' }}>{fmt(u.progOct)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', fontWeight: 900, color: '#c2410c' }}>{fmt(u.devOct)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', background: '#fff7ed', fontWeight: 800, color: '#ea580c' }}>{fmt(u.porEjecutarOct)}</td>
                              <td style={{ padding: '10px 9px', textAlign: 'center', background: '#fff7ed', borderRight: '2px solid #fed7aa' }}>
                                <span style={{ padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 900, background: u.sem.bg, color: u.sem.col }}>{u.pctOct.toFixed(1)}%</span>
                              </td>
                              <td style={{ padding: '10px 9px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(u.saldo)}</td>
                            </tr>
                            {!isCol &&
                              u.orgList.map((o: any) => (
                                <tr key={o.name} style={{ borderBottom: '1px solid #f1f5f9', fontSize: 10.6 }}>
                                  <td style={{ padding: '8px 12px 8px 30px', color: THEME_CHARCOAL, fontWeight: 700 }}>↳ {o.name}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', color: THEME_SLATE }}>{fmt(o.pia)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(o.pim)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(o.cert)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(o.noCert)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(o.comp)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_TEAL_DARK }}>{fmt(o.dev)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'center' }}>
                                    <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: o.semAnual.bg, color: o.semAnual.col }}>{o.Avance.toFixed(1)}%</span>
                                  </td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5', borderLeft: '2px solid #fed7aa' }}>{fmt(o.progOct)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(o.devOct)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#ea580c', background: '#fffaf5' }}>{fmt(o.porEjecutarOct)}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'center', background: '#fffaf5', borderRight: '2px solid #fed7aa' }}>
                                    <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: o.sem.bg, color: o.sem.col }}>{o.pctOct.toFixed(1)}%</span>
                                  </td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(o.saldo)}</td>
                                </tr>
                              ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {view005TableMode === 'especifica' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th colSpan={6} style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 12px', fontSize: 10, fontWeight: 900, textAlign: 'left', borderRadius: '10px 0 0 0' }}>
                          CLASIFICADOR DE GASTO SIAF · PLIEGO 005
                        </th>
                        <th colSpan={3} style={{ background: HALLOWEEN_GRAD, color: '#fff', padding: '8px 12px', fontSize: 11.5, fontWeight: 900, textAlign: 'center', borderLeft: '2px solid #fff', borderRight: '2px solid #fff' }}>
                          <PumpkinBadge />
                        </th>
                        <th style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 10px', fontSize: 10, fontWeight: 900, textAlign: 'right', borderRadius: '0 10px 0 0' }}>
                          CIERRE
                        </th>
                      </tr>
                      <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px' }}>Clasificador / Específica de Gasto SIAF</th>
                        <th style={{ padding: '10px 10px' }}>Genérica</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right' }}>PIM 2026</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right' }}>Certificado</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right' }}>Devengado Acum.</th>
                        <th style={{ padding: '10px 10px', textAlign: 'center' }}>% Avance</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C', borderLeft: '2px solid #fff' }}>Prog. Octubre</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C' }}>Dev. Octubre</th>
                        <th style={{ padding: '10px 10px', textAlign: 'center', background: '#E8590C', borderRight: '2px solid #fff' }}>% Oct.</th>
                        <th style={{ padding: '10px 10px', textAlign: 'right' }}>Saldo por Devengar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {especifica005List.map((e: any, idx: number) => {
                        const sA = semD(e.Avance);
                        const sO = semM(e.AvanceOct);
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '9px 12px', fontWeight: 800, color: THEME_DARKEST }}>{e.especifica}</td>
                            <td style={{ padding: '9px 10px', color: THEME_SLATE, fontSize: 10.5 }}>{e.gg}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(e.pim)}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(e.cert)}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_TEAL_DARK }}>{fmt(e.dev)}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                              <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: sA.bg, color: sA.col }}>{e.Avance.toFixed(1)}%</span>
                            </td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5', borderLeft: '2px solid #fed7aa' }}>{fmt(e.progOct)}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(e.devOct)}</td>
                            <td style={{ padding: '9px 10px', textAlign: 'center', background: '#fffaf5', borderRight: '2px solid #fed7aa' }}>
                              <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: sO.bg, color: sO.col }}>{e.AvanceOct.toFixed(1)}%</span>
                            </td>
                            <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c' }}>{fmt(e.saldo)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {view005TableMode === 'detalle' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.8 }}>
                    <thead>
                      <tr>
                        <th colSpan={7} style={{ background: '#141a1c', color: '#cbd5e1', padding: '8px 12px', fontSize: 10, fontWeight: 900, textAlign: 'left', borderRadius: '10px 0 0 0' }}>
                          DETALLE DE METAS Y PROYECTOS CUI · PLIEGO 005
                        </th>
                        <th colSpan={3} style={{ background: HALLOWEEN_GRAD, color: '#fff', padding: '8px 12px', fontSize: 11.5, fontWeight: 900, textAlign: 'center', borderRadius: '0 10px 0 0', borderLeft: '2px solid #fff' }}>
                          <PumpkinBadge />
                        </th>
                      </tr>
                      <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '10px 10px' }}>Unidad Ejecutora</th>
                        <th style={{ padding: '10px 10px' }}>Órgano / Unidad Orgánica</th>
                        <th style={{ padding: '10px 10px' }}>Meta / Proyecto CUI</th>
                        <th style={{ padding: '10px 10px' }}>Fuente</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>PIM 2026</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right' }}>Devengado Acum.</th>
                        <th style={{ padding: '10px 9px', textAlign: 'center' }}>% Anual</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', background: '#E8590C', borderLeft: '2px solid #fff' }}>Prog. Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'right', background: '#E8590C' }}>Dev. Oct</th>
                        <th style={{ padding: '10px 9px', textAlign: 'center', background: '#E8590C' }}>% Oct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered005.slice(0, 250).map((r, i) => {
                        const pimV = Number(r.MONTO_PIM) || 0;
                        const devV = Number(r.TOTAL_DEVENGADO) || 0;
                        const pOct = Number(r[cfg.mesCorteColProg] ?? r['PROGRAMACION OCTUBRE']) || 0;
                        const dOct = Number(r[cfg.mesCorteColDev]  ?? r['DEVENGADO_OCTUBRE']) || 0;
                        const avA = pimV > 0 ? (devV / pimV) * 100 : 0;
                        const avO = pOct > 0 ? (dOct / pOct) * 100 : 0;
                        const sA = semD(avA);
                        const sO = semM(avO);
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 800 }}>{r['UE CORTOS']}</td>
                            <td style={{ padding: '8px 10px', color: THEME_CHARCOAL }}>
                              <div style={{ fontWeight: 700 }}>{r.ORGANO}</div>
                              <div style={{ fontSize: 9.8, color: THEME_SLATE }}>{r.U_ORGANICA}</div>
                            </td>
                            <td style={{ padding: '8px 10px', color: THEME_DARKEST }}>
                              <div style={{ fontWeight: 700 }}>{r.META_NOMBRE || r['PP RESUMIDO']}</div>
                              {r['NOMBRE CORTO INVER. CUI C'] !== '-' && (
                                <div style={{ fontSize: 9.5, color: THEME_TEAL_DARK, fontWeight: 800 }}>CUI: {r['NOMBRE CORTO INVER. CUI C']}</div>
                              )}
                            </td>
                            <td style={{ padding: '8px 10px', fontSize: 10, color: THEME_SLATE }}>{r.FF_CONCAT}</td>
                            <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(pimV)}</td>
                            <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', color: THEME_TEAL_DARK, fontWeight: 700 }}>{fmt(devV)}</td>
                            <td style={{ padding: '8px 9px', textAlign: 'center' }}>
                              <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: sA.bg, color: sA.col }}>{avA.toFixed(1)}%</span>
                            </td>
                            <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5', borderLeft: '2px solid #fed7aa' }}>{fmt(pOct)}</td>
                            <td style={{ padding: '8px 9px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(dOct)}</td>
                            <td style={{ padding: '8px 9px', textAlign: 'center', background: '#fffaf5' }}>
                              <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 9.5, fontWeight: 800, background: sO.bg, color: sO.col }}>{avO.toFixed(1)}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </GCard>
          </div>
        )}

        {/* VISTA: AVANCE OCTUBRE Y MAPA IV TRIMESTRE */}
        {tab === 'octubre' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
              <div style={{ background: THEME_PETROL, color: 'white', padding: '16px 18px', borderRadius: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.85 }}>PROGRAMACION OCTUBRE 🎃</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{fmtM(kpis.progOct)}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9, marginTop: 4 }}>Meta programada para Octubre</div>
              </div>
              <div style={{ background: THEME_GREEN, color: 'white', padding: '16px 18px', borderRadius: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.85 }}>DEVENGADO_OCTUBRE</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{fmtM(kpis.devOct)}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9, marginTop: 4 }}>Avance Octubre: {kpis.pctOct.toFixed(1)}%</div>
              </div>
              <div style={{ background: 'white', padding: '16px 18px', borderRadius: 18, border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: THEME_SLATE }}>PROGRAMACION NOVIEMBRE</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: THEME_DARKEST, marginTop: 4 }}>{fmtM(kpis.progNov)}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: THEME_SLATE, marginTop: 4 }}>
                  {kpis.totalProgQ4 > 0 ? ((kpis.progNov / kpis.totalProgQ4) * 100).toFixed(1) : 0}% del IV Trimestre
                </div>
              </div>
              <div style={{ background: '#fff1f2', padding: '16px 18px', borderRadius: 18, border: '1px solid #fda4af' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#be123c' }}>PROGRAMACION DICIEMBRE</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#be123c', marginTop: 4 }}>{fmtM(kpis.progDic)}</div>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: '#9f1239', marginTop: 4 }}>
                  Concentración Dic: {kpis.pesoDicQ4.toFixed(1)}% del IV Trim.
                </div>
              </div>
            </div>

            <GCard full grad={OCT_GRADIENT} icon={Flame} title="Cuadro Sombreado de Concentración de Programación (OCTUBRE, NOVIEMBRE y DICIEMBRE)" sub="Se sombrea automáticamente el mes de mayor programación en el IV Trimestre" badge="MAPA DE CALOR POR PLIEGO">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.3 }}>
                  <thead>
                    <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                      <th style={{ padding: '11px 12px', borderRadius: '10px 0 0 0' }}>Pliego / Unidad Ejecutora</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right' }}>DEVENGADO OCTUBRE</th>
                      <th style={{ padding: '11px 10px', textAlign: 'center' }}>% Avance Oct.</th>
                      <th style={{ padding: '11px 12px', textAlign: 'right', borderLeft: '2px solid #334155' }}>PROGRAMACION OCTUBRE 🎃</th>
                      <th style={{ padding: '11px 12px', textAlign: 'right' }}>PROGRAMACION NOVIEMBRE</th>
                      <th style={{ padding: '11px 12px', textAlign: 'right' }}>PROGRAMACION DICIEMBRE</th>
                      <th style={{ padding: '11px 10px', textAlign: 'right', borderLeft: '2px solid #334155', borderRadius: '0 10px 0 0' }}>Total Prog. IV Trim.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pliegoChartData.map((p: any) => {
                      const isCollapsed = collapsedHeatPliegos.has(p.name);
                      const sOct = semM(p.pctOct);
                      const canExpand = p.isMinam005 && p.ueList && p.ueList.length > 0;
                      const getCellStyle = (mesShort: string) => {
                        const isPeak = p.maxQ4Short === mesShort;
                        if (!isPeak) return { padding: '10px 12px', textAlign: 'right' as const, fontFamily: 'monospace', background: '#f8fafc', color: THEME_CHARCOAL };
                        const isDec = mesShort === 'DIC';
                        return {
                          padding: '10px 12px',
                          textAlign: 'right' as const,
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          background: isDec ? '#ffe4e6' : '#e0f2fe',
                          color: isDec ? '#9f1239' : THEME_PETROL,
                          border: `2px solid ${isDec ? THEME_RED : THEME_BLUE}`,
                        };
                      };
                      return (
                        <React.Fragment key={p.name}>
                          <tr
                            onClick={() => canExpand && toggleHeatPliegoCollapse(p.name)}
                            style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', cursor: canExpand ? 'pointer' : 'default', fontWeight: 800 }}
                          >
                            <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6, color: THEME_DARKEST }}>
                              {canExpand ? (isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />) : <span style={{ width: 15 }} />}
                              {p.name}
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', color: THEME_GREEN, fontWeight: 900 }}>{fmt(p.devOct)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900, background: sOct.bg, color: sOct.col, border: `1px solid ${sOct.brd}` }}>{p.pctOct.toFixed(1)}%</span>
                            </td>
                            <td style={getCellStyle('OCT')}>{fmt(p.progOct)} {p.maxQ4Short === 'OCT' ? '★' : ''}</td>
                            <td style={getCellStyle('NOV')}>{fmt(p.progNov)} {p.maxQ4Short === 'NOV' ? '★' : ''}</td>
                            <td style={getCellStyle('DIC')}>{fmt(p.progDic)} {p.maxQ4Short === 'DIC' ? '★' : ''}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 900, borderLeft: '2px solid #e2e8f0' }}>{fmt(p.totalQ4)}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GCard>

            <GCard full grad={VMDERN_GRADIENT} icon={Target} title={`Velocímetros Individuales de Cumplimiento Mensual · Corte ${cfg.mesCorteLabel} 2026`} sub="Comparativo directo por cada Pliego">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(205px, 1fr))', gap: 14 }}>
                {pliegoChartData.map((p: any) => (
                  <PliegoDonutCard key={p.name} p={p} mesLabel={cfg.mesCorteLabel} />
                ))}
              </div>
            </GCard>
          </div>
        )}

        {/* VISTA: ANÁLISIS PRESUPUESTÓLOGO */}
        {tab === 'presupuestologo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
              <GCard grad={ALERT_GRADIENT} icon={Layers} title="Radiografía de Saldos y Cuellos de Botella SIAF por Pliego" sub="Descomposición del PIM según fase SIAF">
                <div style={{ height: 295 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pliegoChartData} margin={{ top: 10, right: 16, left: 0, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={54} tickMargin={8} tick={{ fontSize: 9.5, fontWeight: 800 }} />
                      <YAxis tickFormatter={fmtC} tick={{ fontSize: 9.5 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 14 }} />
                      <Bar dataKey="dev" stackId="a" name="1. Ya Devengado" fill={THEME_GREEN} />
                      <Bar dataKey="compNoDev" stackId="a" name="2. Comprometido por Devengar" fill={THEME_BLUE} />
                      <Bar dataKey="certNoComp" stackId="a" name="3. Certificado sin Comprometer" fill={THEME_GOLD} />
                      <Bar dataKey="noCert" stackId="a" name="4. PIM Libre (Sin Certificar)" fill={THEME_RED} radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GCard>

              <GCard grad={OCT_GRADIENT} icon={Gauge} title="Ritmo Mensual Histórico (Ene–Oct) vs Requerido en Cierre (Nov–Dic)" sub="Velocidad mensual necesaria para ejecutar el saldo del PIM">
                <div style={{ height: 295 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pliegoChartData} margin={{ top: 10, right: 16, left: 0, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={54} tickMargin={8} tick={{ fontSize: 9.5, fontWeight: 800 }} />
                      <YAxis tickFormatter={fmtC} tick={{ fontSize: 9.5 }} />
                      <Tooltip content={<TTip />} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10.5, paddingTop: 14 }} />
                      <Bar dataKey="promEneOct" name="Promedio Mensual Ejecutado (Ene–Oct)" fill={THEME_BLUE} radius={[5, 5, 0, 0]} />
                      <Bar dataKey="reqNovDic" name="Promedio Mensual Requerido (Nov–Dic)" fill={THEME_ORANGE} radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GCard>
            </div>
          </div>
        )}

        {/* VISTA: PROGRAMACIÓN 12 MESES */}
        {tab === 'prog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <GCard
              full
              grad={VMGA_GRADIENT}
              icon={Calendar}
              title="Evolución Mensual Programado vs Devengado (Enero – Diciembre 2026)"
              sub="Ejecución real hasta Octubre y programación comprometida para Noviembre y Diciembre"
              right={
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setProgMode('mensual')} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: progMode === 'mensual' ? THEME_BLUE : '#f1f5f9', color: progMode === 'mensual' ? 'white' : THEME_SLATE }}>Flujo Mensual</button>
                  <button onClick={() => setProgMode('acum')} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, background: progMode === 'acum' ? THEME_BLUE : '#f1f5f9', color: progMode === 'acum' ? 'white' : THEME_SLATE }}>Curva S Acumulada</button>
                </div>
              }
            >
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700 }} tickMargin={8} />
                    <YAxis tickFormatter={fmtC} tick={{ fontSize: 10.5 }} />
                    <Tooltip content={<TTip />} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11.5, paddingTop: 12 }} />
                    <ReferenceLine x={cfg.mesCorteLabel} stroke={THEME_RED} strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="Programado" name="Programación Mensual" fill={THEME_LIGHT_BLUE} stroke={THEME_BLUE} strokeWidth={2.5} />
                    <Bar dataKey="Devengado" name="Devengado Ejecutado" fill={THEME_GREEN} radius={[6, 6, 0, 0]} barSize={30} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </GCard>
          </div>
        )}

        {/* VISTAS VICEMINISTERIOS */}
        {tab === 'vmga' && renderViceministerioView('VMGA', 'Viceministerio de Gestión Ambiental (VMGA)', 'Seguimiento de DGCA, DGGRS, DGPIGA, DGECIA y UE 003: GICA', VMGA_GRADIENT)}
        {tab === 'vmdern' && renderViceministerioView('VMDERN', 'Viceministerio de Desarrollo Estratégico de los Recursos Naturales (VMDERN)', 'Seguimiento de DGDB, DGCCD, DGOTGIRN, DGEFA y UE 002: PNCB Bosques', VMDERN_GRADIENT)}

        {/* VISTA INVERSIONES CUI */}
        {tab === 'inv' && (
          <GCard
            full
            grad={VMGA_GRADIENT}
            icon={HardHat}
            title={`Cartera de Inversiones y Proyectos CUI (Corte ${cfg.mesCorteLabel} 2026)`}
            sub="Sincronizado con el diccionario de nombres cortos de inversión de SharePoint"
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '6px 12px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                <Search size={14} color={THEME_SLATE} />
                <input
                  type="text"
                  placeholder="Buscar CUI o proyecto..."
                  value={cuiSearch}
                  onChange={(e) => setCuiSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 11.5, fontWeight: 600 }}
                />
              </div>
            }
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.3 }}>
                <thead>
                  <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Proyecto / Nombre Corto Inversión</th>
                    <th style={{ padding: '10px 10px' }}>Pliego / UE</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>PIM 2026</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>Devengado Acum.</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center' }}>% Anual</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C' }}>Prog. Octubre 🎃</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C' }}>Dev. Octubre</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>Prog. Nov+Dic</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsList.map((p: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 800 }}>{p.cui}</td>
                      <td style={{ padding: '10px 10px', color: THEME_SLATE }}>{p.ue}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(p.pim)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_GREEN }}>{fmt(p.dev)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800 }}>{p.Avance.toFixed(1)}%</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5' }}>{fmt(p.progOct)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(p.devOct)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace', color: '#be123c', fontWeight: 700 }}>{fmt(p.progNov + p.progDic)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}

        {/* VISTA GOBIERNO NACIONAL */}
        {tab === 'gobnac' && (
          <GCard full grad={OCT_GRADIENT} icon={Globe} title={`Resumen de Ejecución · Gobierno Nacional (${gobNacFileName})`} sub="Vista alimentada automáticamente desde el archivo resumen_ejecucion_gobierno_nacional.xlsx en SharePoint" badge={syncStatus.gob_nacional}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.2 }}>
                <thead>
                  <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Sector / Ministerio</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>PIM Vigente</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>Devengado Acumulado</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center' }}>% Avance PIM</th>
                  </tr>
                </thead>
                <tbody>
                  {funnelMinisteriosData.map((r: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: r.isMinam ? '#ecfdf5' : 'white' }}>
                      <td style={{ padding: '9px 12px', fontWeight: r.isMinam ? 900 : 700, color: r.isMinam ? THEME_FOREST : THEME_DARKEST }}>
                        {r.isMinam ? `★ ${r.name}` : r.name}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(r.pim)}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_TEAL_DARK }}>{fmt(r.dev)}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'center', fontWeight: 900, color: THEME_GREEN }}>{r.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}

        {/* VISTA HISTÓRICO Y POI */}
        {tab === 'inter' && (
          <GCard full grad={VMDERN_GRADIENT} icon={TrendingUp} title="Evolución Histórica (2023–2026) y Programación Multianual POI (2027–2029)" sub="Comparativo interanual de PIA, PIM y Devengado del Sector Ambiental">
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={multiYearData} margin={{ top: 12, right: 20, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="anio" tick={{ fontSize: 11.5, fontWeight: 800 }} tickMargin={8} />
                  <YAxis tickFormatter={fmtC} tick={{ fontSize: 10.5 }} />
                  <Tooltip content={<TTip />} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11.5, paddingTop: 12 }} />
                  <Bar dataKey="PIA" name="PIA" fill={THEME_LIGHT_BLUE} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="PIM" name="PIM / POI" fill={THEME_BLUE} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Devengado" name="Devengado" fill={THEME_GREEN} radius={[6, 6, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GCard>
        )}

        {/* VISTA EXPLORADOR MULTIDIMENSIONAL */}
        {tab === 'explorer' && (
          <GCard
            full
            grad={VMGA_GRADIENT}
            icon={Database}
            title={`Explorador Multidimensional (Corte ${cfg.mesCorteLabel} 2026)`}
            sub="Agrupa cualquier dimensión presupuestal e inspecciona su ejecución anual y del IV Trimestre"
            right={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: THEME_SLATE }}>Agrupar por:</span>
                <select
                  value={expDimRow}
                  onChange={(e) => setExpDimRow(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11, fontWeight: 700 }}
                >
                  <option value="PLIEGO">Pliego Presupuestal</option>
                  <option value="UE CORTOS">Unidad Ejecutora</option>
                  <option value="DEPENDENCIA">Dependencia / Viceministerio</option>
                  <option value="ORGANO">Órgano / Dirección</option>
                  <option value="PP RESUMIDO">Programa Presupuestal</option>
                  <option value="FF_CONCAT">Fuente de Financiamiento</option>
                  <option value="GG_CONCAT">Genérica de Gasto</option>
                </select>
              </div>
            }
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.3 }}>
                <thead>
                  <tr style={{ background: THEME_DARKEST, color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Dimensión ({expDimRow})</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>PIM 2026</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>Certificado</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right' }}>Devengado Acum.</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center' }}>% Avance Anual</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C' }}>PROGRAMACION OCTUBRE 🎃</th>
                    <th style={{ padding: '10px 10px', textAlign: 'right', background: '#E8590C' }}>DEVENGADO_OCTUBRE</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(
                    filteredData.reduce((acc: any, r: any) => {
                      const k = r[expDimRow] || 'SIN DATO';
                      if (!acc[k]) acc[k] = { k, pim: 0, cert: 0, dev: 0, progOct: 0, devOct: 0 };
                      acc[k].pim     += Number(r.MONTO_PIM) || 0;
                      acc[k].cert    += Number(r.MONTO_CERTIFICADO) || 0;
                      acc[k].dev     += Number(r.TOTAL_DEVENGADO) || 0;
                      acc[k].progOct += Number(r['PROGRAMACION OCTUBRE']) || 0;
                      acc[k].devOct  += Number(r['DEVENGADO_OCTUBRE']) || 0;
                      return acc;
                    }, {})
                  )
                    .sort((a: any, b: any) => b.pim - a.pim)
                    .map((row: any, idx: number) => {
                      const av = row.pim > 0 ? (row.dev / row.pim) * 100 : 0;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '9px 12px', fontWeight: 800 }}>{row.k}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{fmt(row.pim)}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(row.cert)}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: THEME_TEAL_DARK }}>{fmt(row.dev)}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'center', fontWeight: 800, color: THEME_GREEN }}>{av.toFixed(1)}%</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', background: '#fffaf5' }}>{fmt(row.progOct)}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#c2410c', background: '#fffaf5' }}>{fmt(row.devOct)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </GCard>
        )}
      </main>
    </div>
  );
}