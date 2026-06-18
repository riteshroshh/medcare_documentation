window.PAGES = window.PAGES || {};
window.PAGES['overview'] = () => `
<div class="page-chip">medcare_ai / objective</div>
# Architecture Objective

The MedCare AI platform is an enterprise-grade clinical documentation and medical coding engine. The objective is to construct a highly resilient, deterministic backend architecture that enforces CMS and payer documentation guidelines while reducing provider burden.

Our Node.js/Prisma backend architecture leverages a multi-agent AI pipeline utilizing Gemini 2.5 Pro and Gemini 2.5 Flash, wrapped in deterministic guardrails to prevent hallucination and guarantee strict adherence to E/M coding algorithms.
`;
