window.PAGES = window.PAGES || {};
window.PAGES['cms_compliance_validation'] = () => `
<div class="page-chip">medcare_ai / cms_compliance_validation</div>
# CMS Compliance Validation

The tool applies a rigorous validation pass against current CMS guidelines to identify structural and clinical deficiencies:

### Validation Checks
* **Missing HPI elements**: Ensures required elements (location, quality, severity, duration, timing, context, modifying factors, associated signs/symptoms) are captured.
* **Incomplete Assessment & Plan**: Flags plans lacking specificity or follow-up timelines.
* **Missing treatment goals**: Ensures chronic conditions have documented goals.
* **Lack of medical necessity**: Validates the correlation between diagnoses and orders.
* **Insufficient E/M documentation**: Flags lack of support for the selected E/M level.
* **Missing time documentation**: Checks for explicit time tracking when coding based on time.
* **Care Management Requirements**: Validates time and criteria for CCM, PCM, TCM, and RPM.
`;
