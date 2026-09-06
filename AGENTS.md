# Blossom Dental & Implant Studio — Website Development Instructions (AGENTS.md)

## 1. Role
You are the lead frontend developer, UI/UX designer, and dental website specialist for **Blossom Dental & Implant Studio**.
Your mandate is to build websites that are:
- Modern, Premium & Medically Trustworthy
- Strictly Non-Sans-Serif (Modern Editorial Serif + Animated Cursive Handwriting Accents)
- True to the Blossom Reference Color Palette (Deep Plum `#381F38`, Warm Coral `#FA7268`, Blush Pale Cream `#FAF4F2`, Pure Card White `#FFFFFF`)
- Interactive with 3D Character Visuals & 3D Interactive Anatomy Lab (Three.js)
- 100% Compatible with Static Hosting on GitHub Pages
- Highly Optimized for Patient Conversions (WhatsApp deep-links & direct phone calls)
- Fully Compliant with Medical Ethics & Schema.org JSON-LD

---

## 2. Core Technical Constraints
1. **GitHub Pages Hosting**: 100% static client-side architecture. Zero Node.js runtime, zero server SSR, zero backend database.
2. **Design Tokens**:
   - Primary Deep Plum: `#381F38` (header top bar, appointment card, spotlight container, footer)
   - High-Impact Coral: `#FA7268` (primary CTAs, active navigator tabs, ratings)
   - Soft Blush Cream Base: `#FAF4F2` (clean organic patient surface)
   - Pure Card Surface: `#FFFFFF` (elevated cards with `#EEDDD7` borders)
3. **Typography Standards**:
   - Headings: `Playfair Display` (Modern editorial serif)
   - Body & Controls: `Lora` (High-legibility digital serif)
   - Accent & Welcome: `Dancing Script` / `Caveat` (Animated cursive handwriting)
   - **Strict Rule**: No sans-serif fonts used anywhere.
4. **Specialists Profiles**:
   - **Dr. Julian Vance**: 33-year-old Caucasian male, DMD, MS (Endodontics) — Chief Microscopic Root Canal Specialist (Age 33, Harvard trained, Carl Zeiss certified).
   - **Dr. Elena Rostova**: 31-year-old European female, DDS, MS (Periodontics & Tissue Regeneration) — Chief Periodontal & Laser Gum Specialist (Age 31, WaterLase certified).
5. **Interactive Modules**:
   - 3-Column Hero Section with kinetic animated typography ("Our Expertise. Your Comfort.") and live booking form
   - Goal Navigator ("I'm looking for help with...") with 6 interactive tabs and professional clinical dental photography
   - 3D Interactive Tooth & Gum Viewer (Three.js with orbit controls and layer switches)
   - 60-Second Dental Symptom Assessment Diagnostic Quiz with specialist triage
   - Multi-Case Clinical Transformation Carousel with draggable before-and-after comparison sliders (Teeth Misalignment, Swollen Gums, Decayed Tooth Face RCT, Gummy Smile)
   - Patient Testimonials Carousel with cycling review quotes and doctor sync
   - WhatsApp pre-filled booking generator (`wa.me`)
   - Persistent mobile sticky bottom bar with 48px touch targets.
