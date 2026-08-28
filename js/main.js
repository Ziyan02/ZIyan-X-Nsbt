/**
 * ZIYAN PATEL × MGM NSBT - OFFICIAL COLLABORATION PORTFOLIO
 * Main Interactive Engine & Industrial Calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRoleTyping();
  initNavbarScroll();
  initSheetMetalCalculator();
  initProjectFilterAndModals();
  initResumeModal();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('ziyan_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeToggleBtn, currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ziyan_theme', newTheme);
    updateThemeIcon(themeToggleBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
}

/* ==========================================================================
   2. Typing Animation for Hero Section
   ========================================================================== */
function initRoleTyping() {
  const typingTarget = document.getElementById('heroTypingTarget');
  if (!typingTarget) return;

  const roles = [
    'Mechanical Engineer (B.Tech 2023 - PES College)',
    '2 Years Sheet Metal Industry Specialist',
    'CAD & Creo 3D Modeling Expert',
    'Masters in Management Studies (MMS) @ MGM NSBT',
    'Product Costing & PPC Strategist',
    'Manufacturing Business Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeStep() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause when complete
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* ==========================================================================
   3. Navbar Scroll Behavior & Mobile Navigation
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(item => item.classList.remove('active'));
          navItem.classList.add('active');
        }
      }
    });
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.innerHTML = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
      });
    });
  }
}

/* ==========================================================================
   4. Interactive Sheet Metal & Industrial Cost Feasibility Estimator
   ========================================================================== */
const MATERIAL_DATA = {
  crca: { name: 'CRCA Mild Steel', density: 7.85, baseRate: 85, laserSpeedFactor: 1.0 },
  ss304: { name: 'Stainless Steel 304', density: 8.00, baseRate: 265, laserSpeedFactor: 0.75 },
  al5052: { name: 'Aluminium 5052', density: 2.70, baseRate: 295, laserSpeedFactor: 1.25 },
  gi: { name: 'Galvanized Iron (GI)', density: 7.85, baseRate: 98, laserSpeedFactor: 0.95 }
};

const PRESETS = {
  enclosure: {
    material: 'crca',
    thickness: 1.6,
    length: 420,
    width: 360,
    cuttingLength: 1850,
    pierces: 18,
    bends: 8,
    finishing: 'powder_coated',
    margin: 18
  },
  bracket: {
    material: 'al5052',
    thickness: 2.5,
    length: 220,
    width: 140,
    cuttingLength: 750,
    pierces: 8,
    bends: 4,
    finishing: 'anodized',
    margin: 20
  },
  ss_panel: {
    material: 'ss304',
    thickness: 1.2,
    length: 500,
    width: 320,
    cuttingLength: 2100,
    pierces: 24,
    bends: 6,
    finishing: 'hairline',
    margin: 22
  }
};

function initSheetMetalCalculator() {
  const matSelect = document.getElementById('calcMaterial');
  const thickInput = document.getElementById('calcThickness');
  const lenInput = document.getElementById('calcLength');
  const widthInput = document.getElementById('calcWidth');
  const cutLenInput = document.getElementById('calcCutLength');
  const piercesInput = document.getElementById('calcPierces');
  const bendsInput = document.getElementById('calcBends');
  const finishSelect = document.getElementById('calcFinish');
  const marginInput = document.getElementById('calcMargin');
  const marginValBadge = document.getElementById('marginValBadge');

  if (!matSelect || !thickInput) return;

  function calculate() {
    const matKey = matSelect.value;
    const mat = MATERIAL_DATA[matKey] || MATERIAL_DATA.crca;
    const thickness = parseFloat(thickInput.value) || 1.6;
    const length = parseFloat(lenInput.value) || 300;
    const width = parseFloat(widthInput.value) || 200;
    const cutLength = parseFloat(cutLenInput.value) || 1200;
    const pierces = parseInt(piercesInput.value) || 10;
    const bends = parseInt(bendsInput.value) || 4;
    const finish = finishSelect.value;
    const margin = parseInt(marginInput.value) || 15;

    if (marginValBadge) marginValBadge.textContent = `${margin}%`;

    // 1. Raw Material Calculation
    // Volume in cm3 = (L mm / 10) * (W mm / 10) * (T mm / 10)
    const volumeCm3 = (length / 10) * (width / 10) * (thickness / 10);
    const blankWeightKg = (volumeCm3 * mat.density) / 1000;
    
    // Scrap recovery (assume 12% scrap credit at 35% scrap rate value)
    const rawMaterialCost = blankWeightKg * mat.baseRate;
    const scrapCredit = (blankWeightKg * 0.15) * (mat.baseRate * 0.35);
    const netMaterialCost = Math.max(rawMaterialCost - scrapCredit, 10);

    // 2. Laser Cutting Time & Cost
    // Average cutting speed mm/min based on thickness & material factor
    const baseCutSpeed = Math.max(12000 / (thickness * 1.5), 1200) * mat.laserSpeedFactor;
    const cuttingMinutes = cutLength / baseCutSpeed;
    const pierceMinutes = (pierces * 1.5) / 60; // 1.5s per pierce
    const totalLaserMinutes = cuttingMinutes + pierceMinutes + 0.35; // 0.35m loading/unloading
    const laserMachineHourRate = 1800; // INR per hour for CNC Fiber Laser
    const laserCuttingCost = (totalLaserMinutes / 60) * laserMachineHourRate;

    // 3. CNC Bending Cost
    // 35 INR per bend setup + hit time
    const bendingCost = bends * 22;

    // 4. Surface Finishing
    const surfaceAreaSqM = ((length * width * 2) / 1000000);
    let finishingCost = 0;
    if (finish === 'powder_coated') {
      finishingCost = Math.max(surfaceAreaSqM * 280, 45); // 280 INR / sq m
    } else if (finish === 'anodized') {
      finishingCost = Math.max(surfaceAreaSqM * 480, 75);
    } else if (finish === 'hairline') {
      finishingCost = Math.max(surfaceAreaSqM * 220, 35);
    }

    // 5. Overhead, Inspection & Packaging (12%)
    const primeManufacturingCost = netMaterialCost + laserCuttingCost + bendingCost + finishingCost;
    const overheadCost = primeManufacturingCost * 0.12;

    // 6. Total Unit Cost with Margin
    const subtotal = primeManufacturingCost + overheadCost;
    const profitAmount = subtotal * (margin / 100);
    const grandTotalUnitCost = Math.round(subtotal + profitAmount);

    // Update UI elements
    updateCalcUI({
      blankWeightKg: blankWeightKg.toFixed(2),
      netMaterialCost: Math.round(netMaterialCost),
      laserCuttingCost: Math.round(laserCuttingCost),
      bendingCost: Math.round(bendingCost),
      finishingCost: Math.round(finishingCost),
      overheadCost: Math.round(overheadCost),
      profitAmount: Math.round(profitAmount),
      grandTotalUnitCost: grandTotalUnitCost,
      cycleTimeSec: Math.round((totalLaserMinutes * 60) + (bends * 20))
    });
  }

  function updateCalcUI(data) {
    document.getElementById('resRawMaterial').textContent = `₹${data.netMaterialCost}`;
    document.getElementById('resLaserCost').textContent = `₹${data.laserCuttingCost}`;
    document.getElementById('resBendingCost').textContent = `₹${data.bendingCost}`;
    document.getElementById('resFinishingCost').textContent = `₹${data.finishingCost}`;
    document.getElementById('resOverheadCost').textContent = `₹${data.overheadCost}`;
    document.getElementById('resProfit').textContent = `₹${data.profitAmount}`;
    document.getElementById('resTotalCost').textContent = `₹${data.grandTotalUnitCost.toLocaleString('en-IN')}`;
    document.getElementById('resWeight').textContent = `${data.blankWeightKg} kg`;
    document.getElementById('resCycleTime').textContent = `${data.cycleTimeSec}s`;
  }

  // Attach event listeners to all inputs
  [matSelect, thickInput, lenInput, widthInput, cutLenInput, piercesInput, bendsInput, finishSelect, marginInput].forEach(el => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  // Preset Buttons
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.dataset.preset;
      const p = PRESETS[presetKey];
      if (!p) return;

      matSelect.value = p.material;
      thickInput.value = p.thickness;
      lenInput.value = p.length;
      widthInput.value = p.width;
      cutLenInput.value = p.cuttingLength;
      piercesInput.value = p.pierces;
      bendsInput.value = p.bends;
      finishSelect.value = p.finishing;
      marginInput.value = p.margin;

      calculate();
    });
  });

  calculate();
}

/* ==========================================================================
   5. Projects Gallery, Category Filters & Case Study Modals
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 'proj-1',
    category: 'sheetmetal',
    title: 'High-Precision Sheet Metal Telecom Cabinet Enclosure',
    tagline: 'DFM & Tolerancing for IP55 Standard',
    categoryName: 'Sheet Metal & DFM',
    impact: '18% Waste Reduction',
    metrics: { material: 'CRCA 1.6mm', software: 'PTC Creo / AutoCAD', costImpact: '-14% Assembly Time' },
    tags: ['PTC Creo', 'Sheet Metal', 'DFM', 'Laser Nesting', 'IP55 Enclosure'],
    overview: 'Engineered a modular sheet metal outdoor telecommunication enclosure adhering to IP55 weather-resistance specifications. Resolved critical bend radius interferences and optimized sheet nesting layout.',
    problem: 'The legacy design experienced excessive weld distortion and high scrap rates (24%) during 8-stage press-brake bending operations.',
    solution: 'Re-engineered the corner reliefs, integrated self-locating tab-and-slot interlocks in Creo 3D, and standardized punch tooling to eliminate 3 manual weld seams.',
    results: [
      'Reduced scrap rate from 24% to 6.2% through smart blank nesting.',
      'Cut press-brake cycle time by 28% using unified tooling.',
      'Achieved 100% first-pass yield in dust and water ingress quality checks.'
    ]
  },
  {
    id: 'proj-2',
    category: 'costing',
    title: 'Dynamic Product Costing & Material Take-Off (BOM) Model',
    tagline: 'Precision Cost Estimation for 150+ Sheet Metal Assemblies',
    categoryName: 'Costing & Estimation',
    impact: 'Quote Accuracy +98%',
    metrics: { efficiency: '4x Faster Quotes', scope: '150+ SKUs', method: 'Activity-Based Costing' },
    tags: ['Product Costing', 'BOM Analysis', 'PPC Planning', 'MS Excel Advanced', 'Cost Optimization'],
    overview: 'Constructed an integrated multi-tier sheet metal costing algorithm factoring machine hourly rates (Fiber Laser, CNC Punch, Hydraulic Press Brake), scrap recovery index, and powder-coating batch runs.',
    problem: 'Manual quote estimations were taking 48 hours per RFQ and had frequent profit margin slippages due to unaccounted laser gas consumption and piercing overheads.',
    solution: 'Designed an automated costing engine calculating exact laser travel path times, gas consumption per sheet gauge, and tonnage load per bend, linked to live raw material commodity index.',
    results: [
      'Accelerated RFQ response time from 48 hours to under 4 hours.',
      'Eliminated quotation margin slippages, protecting targeted 18-22% gross profit margins.',
      'Standardized quotation matrix adopted by sales and engineering departments.'
    ]
  },
  {
    id: 'proj-3',
    category: 'cad',
    title: 'Automotive Sub-Assembly Mounting Bracket in Creo',
    tagline: 'Structural Stiffness Optimization & GD&T Compliance',
    categoryName: 'CAD & 3D Modeling',
    impact: 'Weight -15% / Strength +22%',
    metrics: { material: 'High-Strength Steel', tool: 'PTC Creo 9.0', std: 'ASME Y14.5 GD&T' },
    tags: ['Creo 3D', 'AutoCAD', 'GD&T', 'Structural Optimization', 'Automotive'],
    overview: 'Modeled and drafted complete manufacturing drawing packages with strict GD&T tolerances for heavy-duty automotive mounting brackets subjected to cyclic vibrational loads.',
    problem: 'Component failure during endurance vibration tests at bend corner stress concentration zones.',
    solution: 'Introduced targeted stiffening ribs/embosses in PTC Creo and optimized bend relief geometry without adding raw material thickness.',
    results: [
      'Passed 100,000-cycle vibrational endurance testing without plastic deformation.',
      'Reduced raw part mass by 15% through smart rib reinforcement.',
      'Created standardized ASME Y14.5 production drawings for shopfloor execution.'
    ]
  },
  {
    id: 'proj-4',
    category: 'management',
    title: 'Production Planning & Control (PPC) Shopfloor Optimization',
    tagline: 'Streamlining Work-in-Progress & Delivery Lead Times',
    categoryName: 'Operations & PPC',
    impact: 'On-Time Delivery 96%',
    metrics: { leadTime: '-30% Lead Time', wip: '-25% Floor Clutter', capacity: '+18% Throughput' },
    tags: ['PPC', 'Lean Operations', 'Customer Management', 'Kanban', 'Capacity Planning'],
    overview: 'Spearheaded shopfloor workflow restructuring for high-mix low-volume sheet metal manufacturing, syncing CNC laser shearing batches with downstream bending stations.',
    problem: 'Severe bottlenecks at the press brake stations causing delayed customer shipments and high WIP inventory clutter.',
    solution: 'Implemented dynamic kanban batching, color-coded stage routing cards, and prioritized high-tonnage jobs during shift turnovers.',
    results: [
      'Elevated on-time customer delivery compliance from 74% to 96%.',
      'Decreased work-in-progress floor inventory stagnation by 25%.',
      'Strengthened key client relationships resulting in repeat manufacturing orders.'
    ]
  },
  {
    id: 'proj-5',
    category: 'sheetmetal',
    title: 'Custom Industrial Server Rack Chassis & Perforated Airflow Panel',
    tagline: 'High-Density Perforation & Structural Rigidity',
    categoryName: 'Sheet Metal & DFM',
    impact: 'Thermal CFM +35%',
    metrics: { material: 'GI & CRCA', punch: 'Turret CNC', assembly: 'Clinch Fasteners' },
    tags: ['Sheet Metal', 'Turret Punching', 'Fasteners (PEM)', 'AutoCAD', 'Thermal DFM'],
    overview: 'Designed a 19-inch 4U server rack enclosure with customized hexagonal honeycomb ventilation panels maximizing CFM airflow while retaining EMI shielding and chassis rigidity.',
    problem: 'Standard punch clusters caused sheet warpage due to excessive localized punching stress across thin gauge GI sheets.',
    solution: 'Optimized the punching sequence and cluster pattern spacing, integrating progressive ribbing along the chassis perimeter for rigidity.',
    results: [
      'Eliminated sheet warpage, achieving zero distortion along 500mm span.',
      'Achieved 68% open airflow area without compromising drop-impact rating.'
    ]
  },
  {
    id: 'proj-6',
    category: 'management',
    title: 'Manufacturing Business Feasibility & Vendor Strategy Case',
    tagline: 'MGM NSBT Management Studies Research Project',
    categoryName: 'Business Strategy',
    impact: 'ROI Forecast 24%',
    metrics: { institution: 'MGM NSBT', focus: 'CapEx vs OpEx', framework: 'Strategic Feasibility' },
    tags: ['MGM NSBT', 'Business Strategy', 'Financial Modeling', 'Make-or-Buy', 'Supply Chain'],
    overview: 'Academic and industry research conducted at MGM NSBT evaluating the financial and operational feasibility of transitioning from sub-contract laser cutting to an in-house 6kW Fiber Laser installation.',
    problem: 'Evaluating capital expenditure break-even volumes against unpredictable job-shop vendor lead times and fluctuating power tariffs.',
    solution: 'Built an exhaustive DCF (Discounted Cash Flow) and sensitivity model factoring electrical load, nitrogen vs oxygen assist gas costs, operator efficiency curves, and payback horizons.',
    results: [
      'Identified exact break-even threshold at 145 operating hours/month.',
      'Awarded top honors for Academic & Practical Industrial Synthesis at MGM NSBT.'
    ]
  }
];

function initProjectFilterAndModals() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('projectModalOverlay');
  const modalCloseBtn = document.getElementById('projectModalClose');
  const modalBody = document.getElementById('projectModalBody');

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Open Handler
  document.querySelectorAll('.view-case-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.dataset.id;
      const project = PROJECTS_DATA.find(p => p.id === projId);
      if (!project || !modalOverlay || !modalBody) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="section-tag">${project.categoryName}</span>
          <h2 style="font-size: 1.85rem; margin-top: 0.5rem; margin-bottom: 0.35rem;">${project.title}</h2>
          <p style="color: var(--accent-amber-light); font-family: var(--font-mono); font-size: 0.95rem;">${project.tagline}</p>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem;">${project.overview}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.75rem;">
          <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 1rem; border-radius: 4px;">
            <strong style="color: #f87171; display: block; margin-bottom: 0.35rem; font-size: 0.9rem;">⚠️ Challenge / Problem</strong>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${project.problem}</p>
          </div>
          <div style="background: rgba(56, 189, 248, 0.08); border-left: 3px solid var(--accent-cyan); padding: 1rem; border-radius: 4px;">
            <strong style="color: var(--accent-cyan); display: block; margin-bottom: 0.35rem; font-size: 0.9rem;">💡 Engineering & Management Solution</strong>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${project.solution}</p>
          </div>
        </div>

        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem;">🚀 Quantifiable Impact & Deliverables</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.75rem;">
          ${project.results.map(r => `
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.92rem; color: var(--text-secondary);">
              <span style="color: var(--accent-emerald); font-weight: bold;">✔</span> ${r}
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

/* ==========================================================================
   6. Interactive Resume Modal & Printable View
   ========================================================================== */
function initResumeModal() {
  const openResumeBtn = document.getElementById('openResumeBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const resumeModal = document.getElementById('resumeModalOverlay');
  const closeResumeBtn = document.getElementById('resumeModalClose');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   7. Contact Form Handling & Quick Mailto Generator
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactInquiryForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ziyanpatel14@gmail.com').then(() => {
        const origText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied! ✓';
        copyEmailBtn.style.background = 'var(--accent-emerald)';
        copyEmailBtn.style.color = '#fff';
        setTimeout(() => {
          copyEmailBtn.textContent = origText;
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2000);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subjectType = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Build Mailto URI
      const emailSubject = encodeURIComponent(`[${subjectType}] Inquiry from ${name} via Portfolio`);
      const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${subjectType}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:ziyanpatel14@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Open mail client
      window.location.href = mailtoUrl;

      // Reset form and show confirmation
      contactForm.reset();
      alert('Thank you, ' + name + '! Your email client has been opened to send the message directly to ziyanpatel14@gmail.com.');
    });
  }
}

/* ==========================================================================
   8. Scroll-Triggered Progress Bar & Element Animations
   ========================================================================== */
function initScrollAnimations() {
  const progressFills = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const progress = target.dataset.progress || '85%';
        target.style.width = progress;
      }
    });
  }, { threshold: 0.2 });

  progressFills.forEach(fill => observer.observe(fill));
}
