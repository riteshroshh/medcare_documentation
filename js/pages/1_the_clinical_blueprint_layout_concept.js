window.PAGES = window.PAGES || {};
window.PAGES['1_the_clinical_blueprint_layout_concept'] = () => `
As an E9 Staff UI Architect, I've broken down the UX and structural composition of the Medical Template Preview from first principles.

A medical template isn't just a list of fields—it’s the cognitive blueprint of a clinical encounter (SOAP note format). When presented as a simple vertical stack, it overwhelms the user with a uniform lack of hierarchy. To elevate this to a premium enterprise product, we need spatial clustering, depth, and a layout that matches the clinician's mental model.

### 1. The "Clinical Blueprint" Layout Concept
We will transition from a "Document List" model to a **"Bento Box & Timeline"** model. 

1. **Left Sidebar (The Timeline & Metadata):** Holds the global context. Encounter type, patient vitals summary, and an interactive structural minimap/timeline of the template (Subjective → Objective → Assessment → Plan).
2. **Main Canvas (The Bento Workspace):** Groups related clinical nodes into distinct, rounded, subtle-shadowed "cells" within a CSS Grid layout.
3. **Right Sidebar (Auxiliary/Actions - Optional):** Quick macros, snippet injections, and clinical decision support warnings.

### 2. High-Level Component Tree
`;
