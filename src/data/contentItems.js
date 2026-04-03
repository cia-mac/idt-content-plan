const contentItems = [
  // ===== APRIL 2026 - LINKEDIN =====
  {
    id: "apr-li-1",
    title: "What 1,000 FPS Actually Looks Like in a Crash Facility",
    type: "LinkedIn",
    category: "Educational",
    month: "April",
    targetDate: "2026-04-07",
    description: "At 60 fps a frontal impact is over in 4 frames. At 1,000 fps you get 67 frames of deformation data. Pure education, no product pitch.",
    status: "Written"
  },
  {
    id: "apr-li-2",
    title: "CrashCam Mini: 200G Shock Rating in a 2-Inch Form Factor",
    type: "LinkedIn",
    category: "Product",
    month: "April",
    targetDate: "2026-04-09",
    description: "Product spotlight. 200G shock, 20G vibration, onboard memory. Form factor comparison to a GoPro (which fails at 40G).",
    status: "Written"
  },
  {
    id: "apr-li-3",
    title: "How Caltech Uses PIV to Map Turbulence in 3D",
    type: "LinkedIn",
    category: "Application",
    month: "April",
    targetDate: "2026-04-14",
    description: "Particle Image Velocimetry explained for procurement managers. Caltech XStream Mini deployment. Quote from Prof. Gharib.",
    status: "Written"
  },
  {
    id: "apr-li-4",
    title: "Frame Rate vs. Resolution: The Tradeoff Every Test Engineer Faces",
    type: "LinkedIn",
    category: "Educational",
    month: "April",
    targetDate: "2026-04-16",
    description: "How to choose the right FPS/resolution balance. Reference IDT range from 1,000 to 100,000+ fps. 4-slide decision matrix carousel.",
    status: "Written"
  },
  {
    id: "apr-li-5",
    title: "From Pasadena to the Paddock: IDT Cameras at Every UK Racecourse",
    type: "LinkedIn",
    category: "Application",
    month: "April",
    targetDate: "2026-04-21",
    description: "RaceTech case study teaser. 15 CrashCam POV systems across UK and Irish horse racing. Custom firmware. Links to blog post.",
    status: "Written",
    note: "Depends on RaceTech blog post going live. If not published by Apr 21, swap with Post 7."
  },
  {
    id: "apr-li-6",
    title: "Inside the Build: How IDT Tests Every Camera Before It Ships",
    type: "LinkedIn",
    category: "Culture",
    month: "April",
    targetDate: "2026-04-23",
    description: "Behind-the-scenes at Pasadena facility. Thermal cycling, vibration testing, quality control. Engineering rigor, no specs.",
    status: "Written"
  },
  {
    id: "apr-li-7",
    title: "SDI vs. Thunderbolt vs. Fiber: Choosing the Right Interface",
    type: "LinkedIn",
    category: "Educational",
    month: "April",
    targetDate: "2026-04-28",
    description: "When you need SDI (broadcast), Thunderbolt 3 (compact), or QSFP fiber (max bandwidth). Decision tree format.",
    status: "Written"
  },
  {
    id: "apr-li-8",
    title: "Phoenix Gold 5K: 2,000 FPS at 5120x2448",
    type: "LinkedIn",
    category: "Product",
    month: "April",
    targetDate: "2026-04-30",
    description: "Phoenix Gold 5K specs and target applications. Pair with RT IV Rack for maximum bandwidth.",
    status: "Written"
  },

  // ===== APRIL 2026 - BLOG =====
  {
    id: "apr-blog-1",
    title: "Blog #15: SDI High-Speed Cameras for Automated Broadcast Replay",
    type: "Blog",
    category: "Application",
    month: "April",
    targetDate: "2026-04-18",
    description: "RaceTech deployment deep dive. 15 CrashCam POV systems. Custom SDI firmware. Must publish before Apr 21 LinkedIn post.",
    status: "Draft"
  },
  {
    id: "apr-blog-2",
    title: "Blog #16: How Frame Rate and Resolution Are Connected",
    type: "Blog",
    category: "Educational",
    month: "April",
    targetDate: "2026-04-25",
    description: "Interactive explainer with embedded technical diagram. Sensor readout, pixel bandwidth, and the FPS/resolution tradeoff.",
    status: "Draft"
  },

  // ===== MAY 2026 - LINKEDIN =====
  {
    id: "may-li-1",
    title: "Why Lighting Kills More High-Speed Shots Than Camera Settings",
    type: "LinkedIn",
    category: "Educational",
    month: "May",
    targetDate: "2026-05-05",
    description: "Flicker, LED pulse width, color temp at high FPS. Sets up Veritas Light product post."
  },
  {
    id: "may-li-2",
    title: "Veritas Light: Synchronized, Flicker-Free Illumination",
    type: "LinkedIn",
    category: "Product",
    month: "May",
    targetDate: "2026-05-07",
    description: "Product spotlight. Veritas Light features. Synced to camera frame rate for flicker-free capture."
  },
  {
    id: "may-li-3",
    title: "How Mercedes-Benz Sindelfingen Captures Every Millisecond of Impact",
    type: "LinkedIn",
    category: "Application",
    month: "May",
    targetDate: "2026-05-12",
    description: "IDT cameras at Mercedes crash facility. Technical setup and title card approach."
  },
  {
    id: "may-li-4",
    title: "Onboard vs. Off-Board: Where to Mount Your High-Speed Camera",
    type: "LinkedIn",
    category: "Educational",
    month: "May",
    targetDate: "2026-05-14",
    description: "Mounting considerations. G-force ratings. Compact vs. full-size tradeoffs for crash testing."
  },
  {
    id: "may-li-5",
    title: "From Camera to Cockpit: Custom Cameras for the Artemis Spacecraft",
    type: "LinkedIn",
    category: "Application",
    month: "May",
    targetDate: "2026-05-19",
    description: "Artemis/Lockheed Martin story. Custom Os series cameras. Parachute deployment at 400-1,000 fps."
  },
  {
    id: "may-li-6",
    title: "3 Things to Check Before You Buy a High-Speed Camera",
    type: "LinkedIn",
    category: "Educational",
    month: "May",
    targetDate: "2026-05-21",
    description: "Buyer's guide. Sensor size, interface bandwidth, software ecosystem. Non-salesy educational format."
  },
  {
    id: "may-li-7",
    title: "Galileo Series: Built for the Field, Priced for the Lab",
    type: "LinkedIn",
    category: "Product",
    month: "May",
    targetDate: "2026-05-26",
    description: "Product spotlight. Galileo rugged construction. Target audience: defense and field researchers."
  },
  {
    id: "may-li-8",
    title: "The Engineers Behind the Lens: Meet the IDT Team",
    type: "LinkedIn",
    category: "Culture",
    month: "May",
    targetDate: "2026-05-28",
    description: "Team spotlight. Engineering culture. Pasadena roots. What it takes to build a high-speed camera."
  },

  // ===== MAY 2026 - BLOG =====
  {
    id: "may-blog-1",
    title: "Blog #17: Onboard vs Offboard: Camera Placement in a Crash Test",
    type: "Blog",
    category: "Application",
    month: "May",
    targetDate: "2026-05-09",
    description: "Interactive explainer with camera placement geometry diagram. Onboard vs offboard tradeoffs for crash testing."
  },
  {
    id: "may-blog-2",
    title: "Blog #18: How Autonomous High-Speed Replay Works",
    type: "Blog",
    category: "Educational",
    month: "May",
    targetDate: "2026-05-23",
    description: "Interactive explainer with autonomous camera lifecycle state machine diagram. SDI trigger logic and replay workflow."
  },

  // ===== JUNE 2026 - LINKEDIN =====
  {
    id: "jun-li-1",
    title: "What Is Digital Image Correlation and Why Does It Need 1,000+ FPS?",
    type: "LinkedIn",
    category: "Educational",
    month: "June",
    targetDate: "2026-06-02",
    description: "DIC primer. Strain mapping, structural testing. High frame rates for temporal resolution."
  },
  {
    id: "jun-li-2",
    title: "XStream Stick HD: High-Speed Imaging in a Stick Form Factor",
    type: "LinkedIn",
    category: "Product",
    month: "June",
    targetDate: "2026-06-04",
    description: "Product spotlight. XSS specs. Thunderbolt 3 compact workflow for lab and field."
  },
  {
    id: "jun-li-3",
    title: "How a Firmware Patch Turned a Camera Into a Broadcast Tool",
    type: "LinkedIn",
    category: "Application",
    month: "June",
    targetDate: "2026-06-09",
    description: "Deep dive: CrashCam Mini to POV variant. SDI 50Hz fix. RaceTech firmware customization story."
  },
  {
    id: "jun-li-4",
    title: "Memory Depth vs. Frame Rate: How Long Can You Actually Record?",
    type: "LinkedIn",
    category: "Educational",
    month: "June",
    targetDate: "2026-06-11",
    description: "Recording time calculation. Memory segmentation. Buffer strategies for different applications."
  },
  {
    id: "jun-li-5",
    title: "Leonardo Helicopters: High-Speed Imaging in Rotor Testing",
    type: "LinkedIn",
    category: "Application",
    month: "June",
    targetDate: "2026-06-16",
    description: "Leonardo deployment for vibration analysis on rotating components. Helicopter rotor testing."
  },
  {
    id: "jun-li-6",
    title: "Why IDT Builds Processors Separate From Cameras",
    type: "LinkedIn",
    category: "Educational",
    month: "June",
    targetDate: "2026-06-18",
    description: "Modular processor-camera architecture. RT IV Rack, RT III Compact, TB3, TC II. Why separation matters."
  },
  {
    id: "jun-li-7",
    title: "Phoenix CR-HD: 13,000+ FPS for When Speed Is Everything",
    type: "LinkedIn",
    category: "Product",
    month: "June",
    targetDate: "2026-06-23",
    description: "Product spotlight. Phoenix CR specs. RT IV Speed Booster for maximum frame rates."
  },
  {
    id: "jun-li-8",
    title: "Made in Pasadena: Why IDT Manufactures in California",
    type: "LinkedIn",
    category: "Culture",
    month: "June",
    targetDate: "2026-06-25",
    description: "Origin story. Supply chain control. US manufacturing advantage. Export compliance."
  },

  // ===== JUNE 2026 - BLOG =====
  {
    id: "jun-blog-1",
    title: "Blog #19: Sensor Readout Modes: Global vs Rolling Shutter, BSI vs FSI",
    type: "Blog",
    category: "Educational",
    month: "June",
    targetDate: "2026-06-06",
    description: "Interactive explainer module. Sensor readout comparison with animated diagrams."
  },
  {
    id: "jun-blog-2",
    title: "Blog #20: Multi-Camera Stereo and PIV Setup Guide",
    type: "Blog",
    category: "Educational",
    month: "June",
    targetDate: "2026-06-20",
    description: "Interactive explainer with multi-camera stereo/PIV setup diagram. Calibration and synchronization."
  },

  // ===== VIDEO =====
  {
    id: "video-1",
    title: "IDT Company Profile Video",
    type: "Video",
    category: "Culture",
    month: "Ongoing",
    targetDate: null,
    description: "Partners Cut v1.4 script locked. ~2:10 runtime. TTS versions generated. Needs final edit and pickup shots."
  },

  // ===== X POSTS =====
  {
    id: "x-placeholder",
    title: "X Content — Ideas TBD",
    type: "X",
    category: "TBD",
    month: "Ongoing",
    targetDate: null,
    description: "X post ideas to be added."
  },

  // ===== ONGOING PROJECTS =====
  {
    id: "ongoing-1",
    title: "IDT Product Configurator Launch",
    type: "Project",
    category: "Product",
    month: "Ongoing",
    targetDate: null,
    description: "37-model interactive configurator. Master Engine v1.0 built. Waiting on FPS spec sheet from Luiz."
  },
  {
    id: "ongoing-3",
    title: "Veritas Light Website",
    type: "Project",
    category: "Product",
    month: "Ongoing",
    targetDate: null,
    description: "Veritas Light sub-brand website. LED lighting product line for high-speed imaging applications."
  },
  {
    id: "ongoing-4",
    title: "Motion Monitor Software Redesign",
    type: "Project",
    category: "Product",
    month: "Ongoing",
    targetDate: null,
    description: "XS Motion Monitor UI redesign. 3 phases planned. iPad features, stereo export naming, camera list thumbnails."
  }
];

export default contentItems;
