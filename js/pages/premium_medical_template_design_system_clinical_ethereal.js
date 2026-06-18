window.PAGES = window.PAGES || {};
window.PAGES['premium_medical_template_design_system_clinical_ethereal'] = () => `
# Premium Medical Template Design System: "Clinical Ethereal"

To transform the template preview from a standard vertical list of boxes into a \$10M enterprise-grade product, we must abandon flat gray borders and embrace **depth, light, and typographic hierarchy**. In clinical environments, cognitive load is high, so the design must feel hyper-organized, deeply calming, and surgically precise.

Here is the exact visual spec to achieve this.

## 1. The Global Atmosphere (Background)
Pure white or plain gray backgrounds feel sterile or cheap. We use a **Subtle Mesh Gradient** combined with glassmorphism to create a sense of spatial depth.

**CSS Application:**
\`\`\`css
body {
  background-color: #F8FAFC; /* Slate-tinted off-white */
  /* Ambient, ultra-subtle mesh gradients for warmth and depth */
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(37, 99, 235, 0.03), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(13, 148, 136, 0.03), transparent 25%);
  background-attachment: fixed;
}
\`\`\`

## 2. Typography Architecture
Medical data is dense. We use a two-font system to separate wayfinding (headers) from data (body).

- **Display/Headers:** **Plus Jakarta Sans**. It has incredible geometric precision, making headers feel modern and authoritative.
- **Body/Data:** **Inter**. Unbeatable legibility for numbers, vitals, and dense paragraphs.

**CSS Variables:**
\`\`\`css
:root {
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
}

.text-section-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem; /* 18px */
  letter-spacing: -0.02em;
  color: #0F172A; /* Deep Slate */
}

.text-clinical-data {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.9375rem; /* 15px - perfect for dense UI */
  line-height: 1.6;
  color: #334155; 
}

.text-label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.75rem; /* 12px */
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748B;
}
\`\`\`

## 3. The Elevation & Depth System
Standard gray borders look basic. We create physical-looking "cards" using an inner white highlight (mimicking a glass edge) and multi-layered, low-opacity drop shadows. 

**CSS Implementation:**
\`\`\`css
:root {
  /* The "Glass Edge" - critical for the premium feel */
  --border-glass: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.8), 
                  inset 0px -1px 0px 0px rgba(255, 255, 255, 0.3);
                  
  /* Multi-layered soft shadow for sections */
  --shadow-clinical-soft:
    0px 2px 4px rgba(15, 23, 42, 0.02),
    0px 8px 16px rgba(15, 23, 42, 0.03),
    0px 16px 32px rgba(15, 23, 42, 0.03);

  /* Hover/Active state for focused section */
  --shadow-clinical-hover:
    0px 4px 6px rgba(15, 23, 42, 0.02),
    0px 12px 24px rgba(15, 23, 42, 0.04),
    0px 24px 48px rgba(15, 23, 42, 0.04),
    0px 0px 0px 1.5px #2563EB; /* Sapphire Focus Ring */
}
\`\`\`

## 4. Component Layout: The "Section Card"
Instead of boxes touching each other, wrap Chief Complaint, HPI, ROS, Vitals, etc., in standalone floating cards with generous padding.

\`\`\`css
.medical-section-card {
  /* Glassmorphism base */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  
  /* Physical border is highly subtle */
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  
  /* Apply our custom edge and shadow */
  box-shadow: var(--border-glass), var(--shadow-clinical-soft);
  
  padding: 32px;
  margin-bottom: 24px;
  
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.medical-section-card:hover, 
.medical-section-card:focus-within {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--border-glass), var(--shadow-clinical-hover);
  transform: translateY(-2px);
}
\`\`\`

## 5. Premium Accents & Tags
For micro-elements (like an "Abnormal" vital sign or "Reviewed" status tag), use subtle gradient fills with high-contrast text rather than flat background colors.

\`\`\`css
.tag-premium-normal {
  /* Premium Teal */
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.02) 100%);
  border: 1px solid rgba(13, 148, 136, 0.2);
  color: #0F766E;
  border-radius: 9999px;
  padding: 4px 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.tag-premium-alert {
  /* Premium Rose */
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.1) 0%, rgba(225, 29, 72, 0.02) 100%);
  border: 1px solid rgba(225, 29, 72, 0.2);
  color: #BE123C;
  border-radius: 9999px;
  padding: 4px 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
\`\`\`

## 6. Structural UX Recommendation: "Focus Flow"
Instead of a single-column scrolling list:
1. **Asymmetric Grid:** Create a layout where the left 25% is a sticky "Template Navigator" (a mini table of contents showing HPI, ROS, Vitals). 
2. **Dynamic Dimming:** When the user hovers over the "Vitals" card on the right, gently dim the other cards (\`opacity: 0.6\`) via a parent hover state. This creates a hyper-focused, distraction-free environment that physicians will love.

This specification elevates a standard UI into a product that feels exceptionally expensive, deeply trustworthy, and surgically clean.
</SYSTEM_MESSAGE>
`;
