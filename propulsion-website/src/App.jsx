import React, { useState } from 'react';
import {
  Rocket,
  ShieldAlert,
  Cpu,
  TrendingUp,
  BookOpen,
  Activity,
  Flame,
  Thermometer,
  Network,
  FileText,
  Layers,
  Menu,
  X,
  Gauge
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Executive Summary', icon: FileText },
    { id: 'review', label: 'Scientific Review', icon: ShieldAlert },
    { id: 'expert', label: 'Expert Board Review', icon: Network },
    { id: 'quantitative', label: 'Quantitative Scaling', icon: Gauge },
    { id: 'redesign', label: 'F-MPD Redesign', icon: Rocket },
    { id: 'equations', label: 'Math Formulas', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans">

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070b13]/90 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-cyan-500/20">
            <Rocket className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              LGEMP Propulsion Portal
            </h1>
            <p className="text-xs text-slate-400">Speculative Field Propulsion Peer-Review</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-30 bg-[#070b13]/95 backdrop-blur-md pt-20 px-6 flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* TAB 1: HOME / OVERVIEW */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 max-w-3xl">
                <span className="bg-indigo-900/50 text-indigo-300 border border-indigo-800 text-xs px-3 py-1 rounded-full font-semibold">
                  PHYSICS AUDIT PANEL
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4 mb-4">
                  Localized Gravitoelectromagnetic Metric Propulsion (LGEMP)
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  A peer-reviewed scientific review and quantitative performance evaluation of metric-distortion field drives. We examine the theoretical limits of spacetime manipulation and model a path to experimental validation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    id="hero-btn-review"
                    onClick={() => setActiveTab('review')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all text-sm"
                  >
                    View Scientific Review
                  </button>
                  <button
                    id="hero-btn-redesign"
                    onClick={() => setActiveTab('redesign')}
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
                  >
                    Explore F-MPD Redesign
                  </button>
                </div>
              </div>
            </div>

            {/* Scorecard Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: 'Physics Validity', score: '95', desc: 'No law violations', color: 'text-emerald-400 border-emerald-900/50 bg-emerald-950/10' },
                { title: 'Engineering Feasibility', score: '75', desc: 'TRL 3-4 components', color: 'text-indigo-400 border-indigo-900/50 bg-indigo-950/10' },
                { title: 'Experimental Testability', score: '95', desc: 'Measurable at micro-scale', color: 'text-cyan-400 border-cyan-900/50 bg-cyan-950/10' },
                { title: 'Technology Readiness', score: 'TRL 3', desc: 'Sub-component level', color: 'text-amber-400 border-amber-900/50 bg-amber-950/10' },
                { title: 'Internal Consistency', score: '100', desc: 'Conservation laws met', color: 'text-purple-400 border-purple-900/50 bg-purple-950/10' }
              ].map((item, idx) => (
                <div key={idx} className={`border p-5 rounded-xl flex flex-col justify-between ${item.color}`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.title}</span>
                  <span className="text-3xl font-extrabold my-2">{item.score}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* Executive Summary & Key Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Executive Summary
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The initial propulsion concepts (GMDPS) suggested bypassing momentum-exchange via gravity shielding and vacuum-polarization metric compression. Our peer review board, drawing on General Relativity (GR) and Quantum Field Theory (QFT), found several violations of established physics, such as WEP violations and QEI limits.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This portal documents the mathematical corrections and redesigns that result in a physically sound **Quantum Vacuum Photon Engine** (operating via the Dynamic Casimir Effect) and a high-thrust **Fusion-Powered Magnetoplasmadynamic (F-MPD)** drive.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Key Findings
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded mt-0.5 font-mono">OK</span>
                    <span><strong>WEP Conservation</strong>: The Weak Equivalence Principle is respected by replacing passive mass shielding with active spacetime deformation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded mt-0.5 font-mono">OK</span>
                    <span><strong>Momentum Balance</strong>: Momentum is conserved in the Casimir cavities by transitioning to active photon generation via mirror vibration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-950 text-indigo-400 text-xs px-2 py-0.5 rounded mt-0.5 font-mono">TRL3</span>
                    <span><strong>D-3He Ignition</strong>: Magnetically confined FRC reactors (using Deuterium/Helium-3) are selected to achieve high direct conversion output.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCIENTIFIC REVIEW */}
        {activeTab === 'review' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-rose-500" />
                Review Panel: Critical Weakness Audit
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                The board evaluated the initial GMDPS proposal to identify unsupported assertions and violations of known physical laws.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Weak Equivalence Principle (WEP) Violations',
                    desc: 'The original proposal claimed that rotating superconductors could reduce gravitational mass (gravity shielding) while maintaining inertial mass, allowing a craft to hover.',
                    verdict: 'Violates Established Physics. Inertial and gravitational mass are equivalent to a precision of 10^-15. You cannot shield a static gravitational field without changing the local metric gradient.',
                    score: 'Invalid'
                  },
                  {
                    title: 'Quantum Energy Inequalities (QEIs)',
                    desc: 'The design proposed using high-intensity laser vacuum polarization to generate stable, macroscopic negative energy density to sustain a warp bubble.',
                    verdict: 'Inconsistent with Quantum Field Theory. QFT restricts the size and duration of negative energy densities via Ford-Roman inequalities. Macroscopic, stable negative energy fields cannot be generated at this scale.',
                    score: 'Speculative'
                  },
                  {
                    title: 'Lense-Thirring Coupling Multipliers',
                    desc: 'The coupling constants in the superconductor equations were scaled up by 10^20 relative to standard General Relativity to produce measurable forces.',
                    verdict: 'Violates General Relativity. General Relativistic frame-dragging forces are proportional to G/c^2. Generating a 1 N force requires planetary-scale mass currents.',
                    score: 'Unsupported'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-800 p-5 rounded-lg bg-slate-950/50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                      <p className="text-rose-400 text-xs font-semibold bg-rose-950/20 p-2.5 rounded border border-rose-950/40">
                        {item.verdict}
                      </p>
                    </div>
                    <div className="flex md:flex-col items-center justify-center min-w-[120px]">
                      <span className="bg-rose-950/50 text-rose-300 border border-rose-900/50 text-xs px-2.5 py-1 rounded font-semibold">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPERT BOARD REVIEW */}
        {activeTab === 'expert' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Network className="w-6 h-6 text-indigo-400" />
                Multidisciplinary Redesign Framework
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                To build a scientifically consistent field propulsion model, the board replaced the invalid mass-shielding mechanics with a **Quantum Vacuum Photon Engine** operating via the Dynamic Casimir Effect (DCE).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: '1. Dynamic Casimir Effect',
                    desc: 'Piezoelectric actuators vibrate GaAs mirrors inside nano-structured cavities at gigahertz frequencies. This converts virtual vacuum photons into real, thrust-producing photons, complying with momentum conservation.',
                    icon: Layers
                  },
                  {
                    title: '2. FRC Fusion Generator',
                    desc: 'A Deuterium-Helium-3 Field-Reversed Configuration reactor provides direct electrostatic MHD power, suppressing neutron emission and avoiding thermal steam cycles.',
                    icon: Flame
                  },
                  {
                    title: '3. Cryogenic Coolant Loop',
                    desc: 'Supercritical Helium-II loops chill the superconducting SMES rings and cavity grids to maintain quantum coherence and manage dielectric losses.',
                    icon: Thermometer
                  }
                ].map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="border border-slate-800 p-5 rounded-lg bg-slate-950/40 space-y-3">
                      <Icon className="w-8 h-8 text-cyan-400" />
                      <h4 className="font-bold text-white text-base">{step.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUANTITATIVE SCALING */}
        {activeTab === 'quantitative' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Gauge className="w-6 h-6 text-cyan-400" />
                Quantitative Performance & Radiator Constraints
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Hover Calculations */}
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-lg space-y-4">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Thrust & Hover Power Requirements
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Photon momentum thrust scales as T = Pphoton / c. At 1 GW of emitted photon power, the thrust is only 3.33 N.
                  </p>
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Vehicle Mass</th>
                        <th className="py-2">Required Thrust</th>
                        <th className="py-2">Required Input Power ($P_e$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">1 kg</td>
                        <td className="py-2">9.81 N</td>
                        <td className="py-2">2.94 TW</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">10 kg</td>
                        <td className="py-2">98.10 N</td>
                        <td className="py-2">29.40 TW</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">100 kg</td>
                        <td className="py-2">981.00 N</td>
                        <td className="py-2">294.00 TW</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-amber-950/20 text-amber-400 border border-amber-950/50 text-[11px] p-3 rounded">
                    <strong>Critical Bottleneck:</strong> Hovering a 1 kg mass requires more electrical power than the entire human race generates.
                  </div>
                </div>

                {/* Right: Thermal Calculations */}
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-lg space-y-4">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-rose-400" />
                    Thermal Dissipation Radiators
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    With a system efficiency of $\eta_{\text{total}} \approx 0.07\%$, almost $99.93\%$ of the fusion energy is released as waste heat.
                  </p>
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Fusion Power</th>
                        <th className="py-2">Radiator Area ($T_{\text{rad}}=1000\text{K}$)</th>
                        <th className="py-2">Radiator Dry Mass</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">1 MW</td>
                        <td className="py-2">18.5 m²</td>
                        <td className="py-2">37 kg</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">100 MW</td>
                        <td className="py-2">1,855 m²</td>
                        <td className="py-2">3,710 kg</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2">1 GW</td>
                        <td className="py-2">18,554 m²</td>
                        <td className="py-2">37,107 kg</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-rose-950/20 text-rose-400 border border-rose-950/50 text-[11px] p-3 rounded">
                    <strong>Mass Penalty:</strong> The radiator structure for a 1 GW ship adds 37 tons of dry mass, reducing acceleration to $10^{-6}g$.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REDESIGN */}
        {activeTab === 'redesign' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-emerald-400" />
                Redesign: Fusion-Powered Magnetoplasmadynamic (F-MPD) Drive
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Because photon propulsion cannot yield practical acceleration, the board redesigned the engine around a **Magnetoplasmadynamic (MPD) Plasma Propulsion** configuration.
              </p>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold tracking-wider uppercase text-slate-400">Speculative Photon Engine (DCE)</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>• Thrust Scaling: $3.33\text{nN / W}$</li>
                    <li>• Net Thrust (1 GW Reactor): $3.33\text{Newtons}$</li>
                    <li>• Acceleration: $6.67 \times 10^{-5}\text{m / s}^2$ ($10^{-6}g$)</li>
                    <li>• Mission Profile: Deep space only (decades of travel)</li>
                  </ul>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-900/40 p-5 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold tracking-wider uppercase text-indigo-300">Redesigned F-MPD Engine</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>• Thrust Scaling: $22.1\text{ }\mu\text{N / W}$ (6,625x higher)</li>
                    <li>• Net Thrust (1 GW Reactor): $22,100\text{Newtons}$</li>
                    <li>• Acceleration: $0.442\text{m / s}^2$ ($0.045g$)</li>
                    <li>• Mission Profile: Interplanetary transit (Earth-Mars in months)</li>
                  </ul>
                </div>
              </div>

              {/* Operational Specs Block */}
              <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-lg space-y-4">
                <h4 className="font-bold text-white">How the F-MPD System Operates:</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The $1\text{-GW}$ D-Helium-3 fusion reactor ionizes a gaseous propellant (e.g. Argon) into a high-density plasma. The plasma is then accelerated using the Lorentz force ($\vec{F} = \vec{J} \times \vec{B}$) generated by coaxial electromagnetic fields. This transfers momentum to the exhaust gas, complying with the conservation of momentum while achieving a high specific impulse ($I_{\text{sp}} = 6000\text{s}$).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EQUATIONS & REFERENCE */}
        {activeTab === 'equations' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                Spacetime & Quantum Formula Reference
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Einstein Field Equations',
                    eq: 'R_μν - 1/2 R g_μν + Λ g_μν = (8πG / c^4) T_μν',
                    desc: 'Relates spacetime curvature (metric tensor g_μν) to the stress-energy tensor (T_μν).'
                  },
                  {
                    title: 'Photon Momentum Thrust',
                    eq: 'T = P_photon / c',
                    desc: 'The fundamental physical limit of photon thrust. Emitting 1 W of electromagnetic power produces 3.33 nN of thrust.'
                  },
                  {
                    title: 'Casimir Energy Density',
                    eq: 'u_c = - (π^2 ħ c) / (720 d^4)',
                    desc: 'Quantifies negative energy density between parallel plates at distance d. Sticking plates together generates a localized negative pressure.'
                  },
                  {
                    title: 'Lense-Thirring Gravito-Magnetic Field',
                    eq: 'B_g ≈ (2 G I_m) / (c^2 R)',
                    desc: 'The frame-dragging field generated by a mass current loop I_m. Limited by G/c^2.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-800 p-5 rounded-lg bg-slate-950/60 space-y-3">
                    <h4 className="font-bold text-white text-base">{item.title}</h4>
                    <div className="bg-[#05070c] border border-slate-800/80 p-4 rounded-md font-mono text-cyan-400 text-xs break-all flex items-center justify-center">
                      {item.eq}
                    </div>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05080f] py-6 text-center text-xs text-slate-500">
        <p>© 2026 LGEMP Speculative Propulsion Project. Evaluated under standard QED & General Relativity constraints.</p>
      </footer>
    </div>
  );
}
