const papers = [
  {
    id: "adult-heart-policy",
    short: "Adult heart policy",
    title: "Evolving Trends in Adult Heart Transplant With the 2018 Heart Allocation Policy Change",
    citation: "Kilic et al. JAMA Cardiology. 2021;6(2):159-167. doi:10.1001/jamacardio.2020.4909",
    journal: "JAMA Cardiology",
    year: "2021",
    source: "https://doi.org/10.1001/jamacardio.2020.4909",
    takeaway: "A national UNOS registry cohort treats the 2018 adult heart allocation revision as a policy-era exposure, showing improved waitlist outcomes but worse risk-adjusted posttransplant survival.",
    sections: {
      Motivation: "The 2018 adult heart allocation system expanded urgency tiers and shifted priority toward temporary mechanical circulatory support. The study asks whether the new rules changed patient selection, waitlist outcomes, donor selection, and posttransplant survival.",
      Design: "Retrospective national cohort of adult heart transplants in the UNOS registry. Patients split into pre-policy and post-policy eras; multiorgan transplants excluded; follow-up through March 31, 2020.",
      Methods: "Waitlist outcomes analyzed as competing events (Fine-Gray). Posttransplant survival estimated by Kaplan-Meier and multivariable Cox. Missing data handled with multiple imputation; variables >10% missing excluded.",
      Results: "Post-policy listing: lower waitlist mortality/deterioration (SHR 0.60), higher transplant likelihood (SHR 1.38), lower recovery removals (SHR 0.54). One-year posttransplant survival was lower in the new era (HR 1.29) even after risk adjustment."
    },
    methods: [
      {
        name: "Policy-Era Design",
        definition: "A before-after observational design that uses a known, exogenous policy change date to define exposure groups — approximating a natural experiment. Patients are assigned to pre-policy or post-policy cohorts based on the date of their index event (listing or transplant), not on any individual-level decision.",
        setup: [
          "Define the policy cutoff: October 18, 2018 (UNOS adult heart allocation revision)",
          "Assign exposure by date of listing (waitlist analysis) or transplant (posttransplant analysis)",
          "Exclude multiorgan transplants to keep the exposure interpretable",
          "For the posttransplant cohort, drop patients listed pre-policy but transplanted post-policy ('crossover' patients) — analyzed separately as a sensitivity check"
        ],
        hypothesisTesting: null,
        usageInPaper: "All UNOS adult heart transplant candidates divided into pre-policy (before Oct 18, 2018) and post-policy cohorts. Waitlisted patients still on the list at the policy change date are censored to prevent exposure contamination. A sensitivity analysis re-includes the crossover group and finds the same survival result, ruling out a transition-period artifact."
      },
      {
        name: "Fine-Gray Competing Risks",
        definition: "A subdistribution hazard regression for time-to-event data with competing events. Where standard Cox treats competing events as uninformative censoring (overestimating cumulative incidence), Fine-Gray directly models \\( h^*(t) \\), the hazard in an extended risk set that retains subjects who have experienced a competing event: \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] where \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = 1) \\) is the cause-specific cumulative incidence function. The model estimates subdistribution hazard ratios (SHR) rather than ordinary HRs.",
        setup: [
          "Classify all terminal events: focal event (waitlist death or deterioration) and competing events (transplant; recovery removal)",
          "Specify the extended risk set at time \\( t \\): subjects with \\( T_i \\geq t \\) plus subjects who have already experienced a competing event, entered with downweighted contributions",
          "Fit a proportional subdistribution hazard model with policy era as primary exposure",
          "Report SHRs with 95% CIs; plot cumulative incidence functions (CIF) — not \\( 1 - \\hat{S}_{\\text{KM}} \\)"
        ],
        hypothesisTesting: {
          null: "SHR = 1: policy era does not change the subdistribution hazard of the focal event",
          test: "Wald test on the policy-era coefficient; Gray's test for unadjusted CIF comparisons between eras",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Three mutually exclusive waitlist outcomes modeled with separate Fine-Gray models: (1) death or deterioration (focal), (2) transplant (competing), (3) recovery removal (competing). Post-policy SHR = 0.60 for death/deterioration, SHR = 1.38 for transplant, SHR = 0.54 for recovery. These cannot be summed as simple probabilities — each represents a separate subdistribution hazard."
      },
      {
        name: "Cox Proportional Hazards",
        definition: "A semi-parametric regression for time-to-event outcomes. The model specifies: \\[ h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\] where \\( h_0(t) \\) is the unspecified baseline hazard and \\( e^{\\beta_j} \\) is the hazard ratio for a unit increase in \\( X_j \\). Semi-parametric means \\( h_0(t) \\) is left free while covariate effects enter via \\( e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\). The proportional hazards (PH) assumption requires \\( h_i(t)/h_j(t) = e^{(\\mathbf{X}_i - \\mathbf{X}_j)^\\top \\boldsymbol{\\beta}} \\) to be constant over \\( t \\).",
        setup: [
          "Time-zero: transplant date; event: all-cause death post-transplant",
          "Candidate covariates selected by biological plausibility plus univariate \\( p < 0.05 \\)",
          "Variables with \\( > 10\\% \\) missingness excluded; remainder handled by multiple imputation",
          "PH assumption verified via scaled Schoenfeld residuals; time-varying covariates added if violated",
          "Kaplan-Meier curves plotted; log-rank test used for unadjusted group comparison"
        ],
        hypothesisTesting: {
          null: "HR = 1 for policy era: post-policy transplantation does not change the hazard of posttransplant death",
          test: "Wald test on policy-era HR; log-rank test on KM curves; scaled Schoenfeld residual test for PH assumption",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Post-policy era HR = 1.29 (95% CI: 1.07–1.55) — a 29% higher hazard of death after transplant despite waitlist improvements. This paradox motivates the interpretation that sicker patients are being bridged and transplanted under the new rules, not that transplant care worsened."
      },
      {
        name: "Multiple Imputation",
        definition: "A principled missing-data technique that replaces each missing value with \\( M \\) plausible draws from the posterior predictive distribution \\( p(\\mathbf{Y}_{\\text{mis}} \\mid \\mathbf{Y}_{\\text{obs}}) \\). Each of the \\( M \\) completed datasets is analyzed separately, and results are pooled via Rubin's rules: \\[ \\bar{\\theta} = \\frac{1}{M}\\sum_{m=1}^M \\hat{\\theta}_m, \\qquad \\widehat{\\operatorname{Var}}_{\\text{total}} = \\bar{V}_W + \\Bigl(1 + \\tfrac{1}{M}\\Bigr)B \\] where \\( \\bar{V}_W \\) is the mean within-imputation variance and \\( B = (M-1)^{-1}\\sum_m(\\hat{\\theta}_m - \\bar{\\theta})^2 \\) is the between-imputation variance. Valid under the missing-at-random (MAR) assumption.",
        setup: [
          "Exclude variables with \\( > 10\\% \\) missingness entirely (too sparse for stable imputation)",
          "Specify an imputation model for remaining covariates (predictive mean matching for continuous; logistic for binary)",
          "Generate \\( M \\geq 5 \\) imputed datasets",
          "Fit the Cox model on each; pool via Rubin's rules",
          "Compare pooled results to complete-case analysis as a sensitivity check"
        ],
        hypothesisTesting: null,
        usageInPaper: "Applied to the posttransplant Cox model. Missing covariate values (recipient BMI, creatinine, ischemic time) were imputed rather than listwise-deleted, retaining all eligible transplant recipients and avoiding the selection bias that complete-case analysis would introduce."
      }
    ],
    signals: [
      ["Waitlist death/deterioration SHR", 0.60],
      ["Transplant SHR (waitlist)", 1.38],
      ["Recovery removal SHR", 0.54],
      ["Posttransplant mortality HR", 1.29]
    ],
    pitfalls: [
      ["Era confounding", "Secular improvements in donor quality, surgical technique, and center behavior may coincide with the policy change and confound era comparisons."],
      ["Transition contamination", "Patients listed before but transplanted after a policy change blur the exposure boundary — addressed here by excluding and then re-including this group as a sensitivity analysis."],
      ["Mechanism ambiguity", "Increased use of temporary mechanical support is both a consequence of the policy and a marker of higher illness severity, making it a mediator, not just a covariate."]
    ],
    tags: ["UNOS", "policy era", "Fine-Gray", "Cox", "multiple imputation", "competing risks"]
  },

  {
    id: "pediatric-adult-heart",
    short: "Peds / adult heart",
    title: "Impact of Heart Transplant Allocation Changes on Waitlist Mortality in Pediatric and Adult Patients With Congenital Heart Disease and Cardiomyopathy",
    citation: "Wooster et al. Circulation. 2025;151:814-824. doi:10.1161/CIRCULATIONAHA.124.072335",
    journal: "Circulation",
    year: "2025",
    source: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.124.072335",
    takeaway: "The same allocation-policy logic applied across pediatric and adult subgroups reveals heterogeneous effects that broad adult-only averages mask: infants with CHD and adults with cardiomyopathy improved; adults with CHD and children with cardiomyopathy did not.",
    sections: {
      Motivation: "Prior evaluation of heart allocation changes focused on adult patients overall, leaving subgroups with congenital heart disease (CHD) and cardiomyopathy — especially across pediatric and adult allocation systems — poorly characterized.",
      Design: "Retrospective UNOS cohort of patients listed for heart transplantation with CHD or cardiomyopathy. Pediatric (<18) and adult (18–50) patients analyzed separately with their respective policy dates (2016 and 2018).",
      Methods: "Diagnoses adjudicated from dual-coded UNOS records using clinical hierarchy rules. Fine-Gray competing-risk survival models fit within each age/diagnosis stratum. Smaller strata use frequent-category imputation and stepwise covariate selection.",
      Results: "Allocation changes associated with lower death/removal for infants with CHD (HR 0.75), children with CHD (HR 0.61), and adults with cardiomyopathy (HR 0.60). Benefits were not significant for children with cardiomyopathy or adults with CHD."
    },
    methods: [
      {
        name: "Stratified Cohort Design",
        definition: "A design strategy that pre-specifies analytical strata based on clinically meaningful characteristics, then fits separate models within each stratum. This prevents effect heterogeneity from being 'averaged out' in pooled estimates (Simpson's paradox) and is essential when the mechanism or baseline risk differs meaningfully across groups.",
        setup: [
          "Pre-specify strata: age system (pediatric vs. adult) × diagnosis (CHD vs. cardiomyopathy) → 4 primary strata",
          "Further subdivide pediatric by age: infants (< 1 yr), children (1–17 yr)",
          "Use different policy cutoff dates: 2016 change for pediatric system, 2018 change for adult system",
          "Fit separate Fine-Gray models within each stratum; do not pool across strata",
          "Adolescents explored across three eras because both allocation systems may affect them"
        ],
        hypothesisTesting: {
          null: "Within each stratum: SHR = 1 (policy change has no effect on waitlist death/removal)",
          test: "Stratum-specific Wald tests on policy-era SHR; heterogeneity of effect inferred by comparing stratum-specific CIs (no formal cross-stratum test)",
          alpha: "\\( \\alpha = 0.05 \\) per stratum"
        },
        usageInPaper: "Six primary subgroup models reveal that the headline finding from adult-only pooled analyses does not hold uniformly: adult CHD patients showed no significant benefit (HR ≈ 1.0), a clinically critical distinction that a single pooled model would obscure."
      },
      {
        name: "Diagnosis Adjudication",
        definition: "A rule-based classifier applied to registry data to resolve ambiguous or dual diagnosis codes into a single clinically coherent category. Administrative registries often assign multiple diagnostic codes, creating misclassification bias if not resolved. The adjudication algorithm encodes clinical domain knowledge (e.g., a patient coded for both CHD and dilated cardiomyopathy is likely a CHD patient with secondary cardiac dysfunction).",
        setup: [
          "Identify patients with both CHD and cardiomyopathy codes in UNOS registry",
          "Apply a clinical hierarchy: CHD code takes precedence unless cardiomyopathy is the primary listing diagnosis",
          "Document the decision rule explicitly so it is reproducible",
          "Sensitivity analysis: exclude all dual-coded patients entirely and re-run primary models"
        ],
        hypothesisTesting: null,
        usageInPaper: "Patients with overlapping CHD and cardiomyopathy codes in UNOS are assigned using clinical hierarchy. The sensitivity analysis excluding dual-coded patients produces consistent SHRs, validating the adjudication algorithm."
      },
      {
        name: "Fine-Gray Competing Risks",
        definition: "Same subdistribution hazard framework as Paper 1 — \\( h^*(t) = -\\frac{d}{dt}\\log[1 - F_1(t)] \\) — applied within each age/diagnosis stratum separately. The focal event and event definition differ slightly: death on waitlist or within 60 days of removal for deterioration is the composite focal event; transplant remains the primary competing event.",
        setup: [
          "Focal event: waitlist death OR removal for clinical deterioration within 60 days",
          "Competing event: transplant; surviving withdrawals censored at 60 days post-removal",
          "Pre-policy patients still listed at the policy change date censored at that date",
          "Check PH assumption for \\( h^*(t) \\); add time-varying covariate for policy era if violated",
          "Infant models exclude functional status and eGFR (not measured at this age)"
        ],
        hypothesisTesting: {
          null: "SHR = 1 within stratum: policy era does not change subdistribution hazard of waitlist death/deterioration",
          test: "Wald test on policy-era SHR in each stratum-specific Fine-Gray model",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Separate Fine-Gray models for infants (CHD only), children (CHD; cardiomyopathy), and adults (CHD; cardiomyopathy). Policy-era SHRs range from 0.60 (adult cardiomyopathy, significant benefit) to ≈1.0 (adult CHD, no benefit). Adolescents require a three-era model since both allocation systems changed sequentially."
      },
      {
        name: "Frequent-Category Imputation",
        definition: "A simplified missing-data strategy for small analytic samples where standard multiple imputation is unstable. Missing categorical values are replaced with the mode (most frequent observed category) of that variable. Stepwise covariate selection then trims the model to maintain an adequate events-per-variable (EPV) ratio, preventing overfitting in small strata.",
        setup: [
          "Apply mode imputation to strata too small for stable MI (adult CHD; pediatric cardiomyopathy)",
          "Target EPV \\( \\geq 10 \\): if the ratio falls below threshold, remove lowest-priority covariates until it is met",
          "Priority order for removal: least biologically plausible, highest missingness",
          "Report the final covariate set per stratum to make selection transparent"
        ],
        hypothesisTesting: null,
        usageInPaper: "Adult CHD and pediatric cardiomyopathy strata are too small for full covariate adjustment. Frequent-category imputation preserves sample size; stepwise reduction keeps model degrees of freedom within bounds. This is explicitly less rigorous than the MI used in Paper 1 — a transparency note about the analytic trade-off in small-sample strata."
      }
    ],
    signals: [
      ["Infant CHD death/removal SHR", 0.75],
      ["Child CHD death/removal SHR", 0.61],
      ["Adult cardiomyopathy SHR", 0.60],
      ["Adult CHD SHR (no benefit)", 1.00]
    ],
    pitfalls: [
      ["Registry misclassification", "UNOS diagnosis codes blend congenital lesions with secondary valve or myopathic disease; adjudication helps but cannot recover missing clinical granularity."],
      ["Policy interference", "Adolescent candidates may fall under both pediatric and adult allocation systems simultaneously, making a clean before-after assignment impossible."],
      ["Unobserved severity", "Hemodynamic data, device timing, and center practice patterns are not captured in registry fields and confound era comparisons within strata."]
    ],
    tags: ["UNOS", "subgroups", "Fine-Gray", "CHD", "cardiomyopathy", "competing risks", "stratification"]
  },

  {
    id: "va-liver-distance",
    short: "VA liver distance",
    title: "Association of Distance From a Transplant Center With Access to Liver Transplant Waitlisting, Receipt of Transplant, and Survival Among US Veterans",
    citation: "Goldberg et al. JAMA. 2014;311(12):1234-1243. doi:10.1001/jama.2014.2520",
    journal: "JAMA",
    year: "2014",
    source: "https://jamanetwork.com/journals/jama/fullarticle/1849992",
    takeaway: "Linking VA electronic health records to OPTN waitlist data, this study models geographic distance as a continuous log-scaled exposure and finds that each doubling of distance from a VA transplant center is independently associated with lower odds of waitlisting and higher mortality.",
    sections: {
      Motivation: "Centralized specialty care may improve quality but imposes travel burdens that reduce access. The VA's national structure — with centralized liver transplant programs — provides an ideal setting to isolate the distance effect from insurance and income heterogeneity.",
      Design: "Retrospective study of VA patients meeting minimal liver-transplant eligibility criteria (ICD-9–validated decompensated cirrhosis or HCC) from 2003 to 2010, linked to OPTN waitlist data.",
      Methods: "Distance modeled continuously on log₂ scale. Waitlisting: GEE logistic regression clustered by VA hospital. Transplantation: competing-risk Cox. Survival: Cox from first decompensation. Schoenfeld residuals check PH assumption.",
      Results: "Greater distance associated with lower odds of VA-center waitlisting (OR 0.91 per doubling), lower any-center waitlisting (OR 0.94), lower transplant SHR (0.97), and higher mortality HR (1.03) among waitlisted veterans."
    },
    methods: [
      {
        name: "GEE Logistic Regression",
        definition: "Generalized Estimating Equations is a marginal (population-averaged) regression framework for correlated outcomes. GEE solves the system: \\[ \\sum_{i=1}^N \\mathbf{D}_i^\\top \\mathbf{V}_i^{-1}\\bigl(\\mathbf{Y}_i - \\boldsymbol{\\mu}_i\\bigr) = \\mathbf{0} \\] where \\( \\mathbf{D}_i = \\partial \\boldsymbol{\\mu}_i / \\partial \\boldsymbol{\\beta} \\) and \\( \\mathbf{V}_i = \\phi\\, A_i^{1/2} R(\\alpha) A_i^{1/2} \\) is the working covariance using working correlation matrix \\( R(\\alpha) \\). The sandwich (robust) variance estimator \\( \\hat{V}_{\\text{robust}} \\) is valid even if \\( R(\\alpha) \\) is mis-specified.",
        setup: [
          "Outcome: binary waitlisting (yes/no); link: logit",
          "Exposure: \\( \\log_2(d) \\) where \\( d \\) is distance in miles from patient's VA hospital to nearest VA transplant center",
          "Clustering unit: VA hospital (patients within the same hospital share referral pathways)",
          "Working correlation structure: exchangeable — all pairs within a cluster equally correlated",
          "Report odds ratios (OR) and 95% CIs from the robust sandwich variance estimator"
        ],
        hypothesisTesting: {
          null: "OR = 1: log₂-distance is not associated with the odds of waitlisting",
          test: "Wald chi-square test on the \\( \\log_2(d) \\) coefficient using the robust SE",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Primary model for waitlisting. OR = 0.91 per doubling of distance to a VA transplant center (p < 0.001). A secondary model tests whether proximity to non-VA transplant centers attenuates the association — it does not, suggesting VA-specific referral pathways drive the access gradient."
      },
      {
        name: "Log₂ Distance Exposure",
        definition: "A continuous geographic exposure measured on a base-2 logarithmic scale. The transformation \\( \\text{exposure} = \\log_2(d) \\) linearizes the right-skewed distance distribution. Because one unit increase in \\( \\log_2(d) \\) corresponds to a doubling of \\( d \\), the regression coefficient \\( \\hat{\\beta} \\) is directly interpretable as the log-OR (or log-HR) per doubling of raw distance — a clinically natural unit.",
        setup: [
          "Measure distance \\( d \\) from each patient's routine VA hospital to the nearest VA liver transplant center",
          "Transform: \\( \\text{exposure} = \\log_2(d) \\); one unit increase \\( \\Leftrightarrow \\) \\( d \\) doubles",
          "Fit all primary models with \\( \\log_2(d) \\) as a continuous covariate; report \\( e^{\\hat{\\beta}} \\) as OR or HR per doubling",
          "Post-hoc: bin into categorical distance bands for figures only — not used for primary inference"
        ],
        hypothesisTesting: {
          null: "Coefficient on \\( \\log_2(d) \\) equals zero: raw distance has no log-linear association with the outcome",
          test: "Test of linearity in \\( \\log_2(d) \\) via regression spline or likelihood ratio test for departure from the log-linear model",
          alpha: "\\( \\alpha = 0.05 \\)"
        },
        usageInPaper: "Primary exposure in all three outcome models (waitlisting, transplant, survival). The continuous OR/HR per doubling is reported as the primary estimate; categorical bands accompany figures but should not be used for causal inference because bands were chosen after inspecting the data."
      },
      {
        name: "Competing Risks Cox (Transplant)",
        definition: "A survival analysis that treats death as a competing event for the outcome of liver transplantation. Without this adjustment, the Kaplan-Meier estimator of transplant probability overestimates cumulative incidence by treating the competing event as uninformative censoring. The subdistribution hazard model again gives \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = \\text{transplant}) \\) directly, free from the bias introduced by simply computing \\( 1 - \\hat{S}_{\\text{KM}} \\).",
        setup: [
          "Time-zero: date of waitlisting; focal event: receipt of liver transplant; competing event: death before transplant",
          "Covariates: MELD score, albumin, HCC, insurance, area poverty level, \\( \\log_2(d) \\)",
          "Check PH assumption for \\( h^*(t) \\) via Schoenfeld residuals; add time × distance interaction if violated",
          "Report SHR per unit increase in \\( \\log_2(d) \\) (i.e., per doubling of distance)"
        ],
        hypothesisTesting: {
          null: "SHR = 1: distance is not associated with transplant probability after accounting for death as a competing event",
          test: "Wald test on \\( \\log_2(d) \\) coefficient; Gray's test for unadjusted CIF comparison across distance quartiles",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Among waitlisted veterans, SHR = 0.97 per doubling of distance (p < 0.01). The competing-risk model is important because sicker patients (higher MELD) may both be closer to VA centers and die faster, creating a confound that standard Kaplan-Meier would not correct."
      },
      {
        name: "ICD-9 Eligibility Algorithm",
        definition: "A validated rule-based algorithm that uses administrative diagnosis codes from electronic health records to identify patients meeting clinical study inclusion criteria. Translates clinical eligibility rules (decompensated liver disease or HCC without contraindications) into reproducible code-based logic. The algorithm's sensitivity and specificity against chart review determine how much misclassification bias affects downstream estimates.",
        setup: [
          "Inclusion codes: validated ICD-9-CM algorithms for decompensated cirrhosis (ascites, hepatic encephalopathy, variceal hemorrhage, spontaneous bacterial peritonitis) OR hepatocellular carcinoma",
          "Active VA care requirement: ≥ 2 outpatient visits in the 12 months after the eligibility-defining event",
          "Exclusion codes: prior organ transplant, age < 18 or > 70, contraindicated malignancies",
          "Algorithm validated against medical chart review in a subset; sensitivity and PPV reported"
        ],
        hypothesisTesting: null,
        usageInPaper: "Identifies 3,866 eligible VA patients from 2003 to 2010. Provides a nationally representative cohort of VA patients who should have been considered for transplant referral, enabling a study of whether referral (waitlisting) actually occurred as a function of distance. Without this algorithm, the denominator for access measurement would be undefined."
      }
    ],
    signals: [
      ["VA-center waitlisting OR per doubling", 0.91],
      ["Any-center waitlisting OR per doubling", 0.94],
      ["Transplant SHR per doubling", 0.97],
      ["Mortality HR per doubling", 1.03]
    ],
    pitfalls: [
      ["Ecological distance proxy", "Hospital-to-center distance systematically mismeasures individual patient travel burden — patients in rural areas may face greater practical barriers than distance alone captures."],
      ["Unmeasured contraindications", "Claims and ICD-9 algorithms cannot capture psychosocial transplant barriers, unstated clinical contraindications, or patient refusal."],
      ["Post-hoc categories", "Distance bands displayed in figures were chosen after inspecting the data and should be treated as exploratory, not as pre-specified strata."]
    ],
    tags: ["VA", "OPTN linkage", "GEE", "log₂ distance", "competing risks", "ICD-9 algorithm"]
  },

  {
    id: "ldkt-disparities",
    short: "LDKT disparities",
    title: "Association of Race and Ethnicity With Live Donor Kidney Transplantation in the United States From 1995 to 2014",
    citation: "Purnell et al. JAMA. 2018;319(1):49-61. doi:10.1001/jama.2017.19152",
    journal: "JAMA",
    year: "2018",
    source: "https://jamanetwork.com/journals/jama/fullarticle/2667722",
    takeaway: "A two-decade SRTR cohort shows that live-donor kidney transplant disparities by race and ethnicity did not narrow — they widened — with Black candidates' adjusted subhazard ratio falling from 0.45 to 0.27 relative to White candidates between 1995–1999 and 2010–2014.",
    sections: {
      Motivation: "National equity programs aimed at reducing racial disparities in live-donor kidney transplantation (LDKT). The study tests whether those efforts succeeded from 1995 to 2014 — two decades after passage of the National Organ Transplant Act amendments.",
      Design: "Secondary analysis of 453,162 adult first-time kidney transplant candidates on the deceased-donor waitlist in the SRTR. Candidates grouped into four 5-year listing periods; follow-up capped at 2 years from listing.",
      Methods: "Time to LDKT modeled with Cox (primary) and Fine-Gray (sensitivity). Interaction terms formally test whether racial/ethnic disparities changed across periods. Mediation-style covariate blocks decompose how much disparity is attributable to SES and transplant-center factors.",
      Results: "White candidates: rising 2-year LDKT incidence. Black candidates: falling from 9.0% (1995–99) to 6.5% (2010–14). Adjusted subhazard ratios for Black candidates: 0.45 → 0.27. Disparities for Hispanic and Asian candidates also worsened."
    },
    methods: [
      {
        name: "Time-Stratified Cox",
        definition: "Cox proportional hazards models \\( h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\) applied separately within pre-defined calendar-time strata (5-year listing periods). Rather than imposing a single \\( h_0(t) \\) and a single \\( \\boldsymbol{\\beta} \\), this estimates period-specific HRs directly, allowing both the baseline hazard and all covariate effects to vary freely across periods — a transparent way to characterize temporal trends without assuming a functional form for how effects change over time.",
        setup: [
          "Group candidates into four listing periods: 1995–1999, 2000–2004, 2005–2009, 2010–2014",
          "Cap follow-up at 2 years after listing date within each period",
          "Fit separate Cox models per period with race/ethnicity as primary exposure",
          "Covariates: age, sex, BMI, ABO, PRA/CPRA, dialysis status, SES indicators",
          "Report period-specific \\( e^{\\hat{\\beta}_{\\text{race}}} \\) (HR) with 95% CIs for each group vs. White"
        ],
        hypothesisTesting: {
          null: "HR = 1 within each period: race/ethnicity is not associated with time to LDKT",
          test: "Wald test on race coefficients per period; log-rank test on unadjusted KM curves",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Black HR decreases from ≈ 0.50 (1995–99) to ≈ 0.30 (2010–14); Hispanic HR from ≈ 0.85 to ≈ 0.55; Asian HR also declines. The progressive worsening across four independent cohorts confirms that widening disparity is not a statistical artifact of a single pooled model."
      },
      {
        name: "Fine-Gray Competing Risks",
        definition: "Used here as a sensitivity analysis to confirm that Cox-estimated disparities are not an artifact of informative censoring. Two competing events prevent LDKT: death and deceased-donor transplant. Standard Cox treats both as uninformative censoring — overestimating \\( P(\\text{LDKT}) \\) if racial groups differ in their competing-event rates. Fine-Gray models \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = \\text{LDKT}) \\) directly, avoiding this bias.",
        setup: [
          "Focal event: live-donor kidney transplant",
          "Competing events: (1) death before transplant; (2) receipt of deceased-donor kidney transplant",
          "Fit Fine-Gray models within each 5-year listing period",
          "Compare SHRs to Cox HRs: substantial divergence would indicate competing-event bias",
          "Report cumulative incidence functions (CIF) by race and period"
        ],
        hypothesisTesting: {
          null: "SHR = 1 within each period: race/ethnicity not associated with subdistribution hazard of LDKT",
          test: "Wald test on race coefficients; Gray's test on unadjusted CIFs",
          alpha: "\\( \\alpha = 0.05 \\)"
        },
        usageInPaper: "SHRs broadly consistent with Cox HRs (Black SHR ≈ 0.27–0.45 across periods). This confirms that the disparity findings are not an artifact of differential mortality or deceased-donor transplant rates between racial groups — the same widening pattern is observed in the competing-risk framework."
      },
      {
        name: "Interaction Terms (Trend Test)",
        definition: "A formal test of whether the association between race/ethnicity and LDKT changes across listing periods. A pooled Cox model includes both main effects and race × period product terms: \\[ \\log h(t) = \\log h_0(t) + \\boldsymbol{\\beta}_{\\text{race}}^\\top \\mathbf{R} + \\boldsymbol{\\gamma}_{\\text{period}}^\\top \\mathbf{P} + \\boldsymbol{\\delta}^\\top (\\mathbf{R} \\otimes \\mathbf{P}) \\] where \\( \\mathbf{R} \\otimes \\mathbf{P} \\) denotes race × period product terms. The joint test of \\( \\boldsymbol{\\delta} = \\mathbf{0} \\) is more rigorous than visually comparing stratum-specific HRs.",
        setup: [
          "Fit a single pooled Cox model with all four listing periods and all racial/ethnic groups",
          "Include race × period product terms (\\( \\mathbf{R} \\otimes \\mathbf{P} \\)) for each race–period combination",
          "Joint \\( \\chi^2 \\) or \\( F \\)-test for the block \\( H_0: \\boldsymbol{\\delta} = \\mathbf{0} \\)",
          "Report individual interaction terms for display; use joint test for primary inference"
        ],
        hypothesisTesting: {
          null: "\\( \\boldsymbol{\\delta} = \\mathbf{0} \\): the racial/ethnic disparity in LDKT is constant across all listing periods",
          test: "Joint \\( \\chi^2 \\) test (likelihood ratio or Wald) on the race × period block; degrees of freedom = (groups − 1) × (periods − 1)",
          alpha: "\\( \\alpha = 0.05 \\) for the joint test"
        },
        usageInPaper: "Joint p < 0.001 for the Black × period interaction block, confirming that the observed worsening of Black candidates' adjusted LDKT hazard is not due to chance variation across four independent cohorts. Similarly significant for Hispanic candidates. This is the primary inferential claim supporting the conclusion that national equity programs failed to narrow disparities."
      },
      {
        name: "Incremental Mediation Analysis",
        definition: "A sequential covariate-addition strategy that adds potential mediators or confounders in prespecified blocks to decompose how much of the racial/ethnic disparity in LDKT is 'explained' by each factor. Not a formal causal mediation analysis (which requires explicit counterfactual assumptions), but a practical decomposition. Attenuation of the race HR after adding a block suggests that block captures some of the mechanism linking race to LDKT access.",
        setup: [
          "Model 1 (base): race/ethnicity + clinical characteristics (age, sex, BMI, ABO, PRA)",
          "Model 2: add SES block (zip-code median income, insurance type)",
          "Model 3: add transplant-center block (volume, center LDKT rate, center fixed effects)",
          "Compute attenuation: \\( \\Delta\\mathrm{HR} = (\\hat{\\beta}_{\\text{base}} - \\hat{\\beta}_{\\text{full}}) / \\hat{\\beta}_{\\text{base}} \\)",
          "Missing SES: SRTR missing-category approach; multiple imputation as robustness check"
        ],
        hypothesisTesting: null,
        usageInPaper: "Adding SES indicators attenuates Black and Hispanic HRs modestly (~10–15%). Adding transplant-center factors attenuates further but large residual disparities remain. Interpretation: socioeconomic and center-level factors account for some — but not most — of the racial gap, pointing to unmeasured structural barriers."
      }
    ],
    signals: [
      ["Black SHR 1995–1999", 0.45],
      ["Black SHR 2010–2014", 0.27],
      ["Hispanic SHR 1995–1999", 0.83],
      ["Hispanic SHR 2010–2014", 0.52],
      ["Asian SHR 2010–2014", 0.42]
    ],
    pitfalls: [
      ["Race as a proxy", "Race/ethnicity fields in SRTR are center-recorded categories that proxy complex social, structural, and biological processes — they should not be interpreted as biological causes."],
      ["Mediator overcontrol", "Adding access and SES variables as 'confounders' may block causal pathways if the goal is to estimate the total disparity — blocking a mechanism is not the same as confounding."],
      ["Competing-event differential", "Death and deceased-donor transplant rates differ by race; treating them as uninformative censoring without a Fine-Gray sensitivity analysis would over- or understate LDKT disparities."]
    ],
    tags: ["SRTR", "equity", "Cox", "Fine-Gray", "interactions", "mediation", "temporal trends"]
  },

  {
    id: "living-donor-outcomes",
    short: "Donor outcomes",
    title: "Racial Variation in Medical Outcomes among Living Kidney Donors",
    citation: "Lentine et al. New England Journal of Medicine. 2010;363:724-732. doi:10.1056/NEJMoa1000950",
    journal: "NEJM",
    year: "2010",
    source: "https://www.nejm.org/doi/full/10.1056/NEJMoa1000950",
    takeaway: "Linking OPTN donor records to private insurer claims, this study uses left-truncated, right-censored Cox models to show that Black and Hispanic living kidney donors face substantially higher risk of hypertension, diabetes, and chronic kidney disease after donation than White donors.",
    sections: {
      Motivation: "Living donor safety evidence was sparse for nonwhite donors. Transplant registries track donors at donation but rarely follow them longitudinally for post-donation outcomes. The study asks whether postdonation medical diagnoses differ by race and ethnicity.",
      Design: "Retrospective linked-data cohort of 4,650 living kidney donors from OPTN records matched to private insurer claims data from 2000 to 2007.",
      Methods: "OPTN identifiers linked to insurer data using names and birthdates. Cox regression with left truncation (insurance began after nephrectomy) and right censoring (insurance ended before study close) estimates 5-year diagnosis incidence. NHANES provides a general-population benchmark via survey-weighted logistic models.",
      Results: "Black donors: HR = 1.52 for hypertension, 2.31 for drug-treated diabetes, 2.32 for CKD vs. White donors. ESRD rare but more common in Black donors. Even compared to a screened-healthy donor cohort, racial disparities in postdonation outcomes are substantial."
    },
    methods: [
      {
        name: "Registry-to-Claims Linkage",
        definition: "A data integration method that joins two or more administrative datasets using shared identifiers (probabilistic or deterministic matching) to create longitudinal outcome data unavailable in either source alone. OPTN registry tracks donors at donation but not post-donation health; private insurer claims track diagnoses over time but do not identify donors. Linking them creates a novel analytic resource at the cost of potential linkage error (false matches or missed matches).",
        setup: [
          "Source 1: OPTN donor records (donation date, demographics, donor characteristics)",
          "Source 2: Integrated Healthcare Information Services claims (2000–2007 medical and pharmacy claims)",
          "Matching keys: full name + date of birth (deterministic linkage)",
          "Post-linkage de-identification: direct identifiers removed; HIPAA limited dataset retained",
          "Linkage quality: manual chart review of a random sample; false-positive rate reported as a limitation"
        ],
        hypothesisTesting: null,
        usageInPaper: "Links 4,650 of approximately 30,000 OPTN-listed donors to insurer claims — roughly 15% match rate. This selection introduces potential bias: linked donors may be more affluent or healthier than unlinked donors, and the paper discusses this explicitly."
      },
      {
        name: "Cox with Left Truncation",
        definition: "A time-to-event model that correctly handles both right censoring and left truncation. Standard Cox (and Kaplan-Meier) assume subjects are observed from time-zero onward. Left truncation arises when a subject enters the data source after time-zero — here, when insurance enrollment begins months or years after nephrectomy. Ignoring truncation inflates the apparent sample size and biases estimates by over-representing long survivors (length-biased sampling). The corrected risk set at time \\( t \\) is: \\[ \\mathcal{R}(t) = \\{\\,i : l_i < t \\leq t_i\\,\\} \\] where \\( l_i \\) is the left truncation (insurance entry) time and \\( t_i \\) is the observed time.",
        setup: [
          "Time-zero: date of nephrectomy",
          "Left truncation time \\( l_i \\): insurance enrollment date (subject not at risk before this)",
          "Right censoring time: insurance disenrollment OR study end date, whichever is earlier",
          "Event indicator \\( \\delta_i \\in \\{0, 1\\} \\): first post-donation ICD-9–based diagnosis",
          "Partial likelihood uses only \\( \\mathcal{R}(t) \\) — subjects enter the risk set at \\( l_i \\), not at 0",
          "Covariates: donor race/ethnicity, age, sex, BMI, pre-donation hypertension"
        ],
        hypothesisTesting: {
          null: "HR = 1: race/ethnicity is not associated with hazard of postdonation diagnosis after adjusting for clinical covariates",
          test: "Wald test on race coefficients; PH assumption via scaled Schoenfeld residuals (\\( p > 0.05 \\) supports PH)",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Left truncation accounts for donors who entered insurer data late — some had already spent months post-nephrectomy without claims observation. Ignoring this would systematically under-count early events. Black HR = 1.52 for hypertension (CI: 1.28–1.80), HR = 2.31 for drug-treated diabetes (1.73–3.08), and HR = 2.32 for CKD (1.45–3.70) vs. White donors."
      },
      {
        name: "Survey-Weighted Logistic Regression",
        definition: "Logistic regression that incorporates complex survey design features to produce nationally representative estimates. NHANES uses a stratified multistage cluster sample in which each respondent represents thousands of US residents. The weighted log-likelihood is: \\[ \\ell_w(\\boldsymbol{\\beta}) = \\sum_{i=1}^n w_i\\bigl[y_i \\log \\hat{\\pi}_i + (1 - y_i)\\log(1 - \\hat{\\pi}_i)\\bigr] \\] where \\( w_i \\) is the sampling weight and \\( \\hat{\\pi}_i = (1 + e^{-\\boldsymbol{\\beta}^\\top \\mathbf{X}_i})^{-1} \\). Ignoring weights yields biased prevalence estimates because demographic groups are intentionally over- or under-sampled.",
        setup: [
          "Data source: NHANES 2005–2006 (nationally representative US adult sample)",
          "Apply probability weights (WTMEC2YR for morning examination session)",
          "Specify PSU (SDMVPSU) and strata (SDMVSTRA) variables for design-based variance estimation",
          "Variance estimated via Taylor-series linearization (not bootstrap), which accounts for the complex sampling design",
          "Outcome: binary diagnosis of hypertension, diabetes, or CKD; exposure: race/ethnicity"
        ],
        hypothesisTesting: {
          null: "OR = 1 in NHANES: race/ethnicity not associated with diagnosis prevalence in the general US population",
          test: "Design-adjusted Wald \\( F \\)-test on race coefficients; CIs from linearization variance",
          alpha: "\\( \\alpha = 0.05 \\)"
        },
        usageInPaper: "NHANES provides a general-population benchmark since race-specific claims data for non-donor insured beneficiaries were unavailable. Outcome definitions differ between claims (ICD-9 billing codes) and NHANES (self-report or measured labs), so comparisons are qualitative. Key finding: Black living donors have higher adjusted diagnosis rates than similarly race-matched NHANES adults despite the 'healthy donor' screening effect."
      },
      {
        name: "ICD-9 / Pharmacy Claims Ascertainment",
        definition: "An algorithmic case-finding approach using billing diagnosis codes and pharmacy drug categories to identify clinical outcomes from administrative claims. ICD-9-CM codes are assigned by billing providers and reflect documented diagnoses. Pharmacy ATC/NDC codes identify drug-treated conditions. Combined medical + pharmacy algorithms generally have higher sensitivity than either alone, because a patient with hypertension who rarely visits a doctor will still fill prescriptions.",
        setup: [
          "Hypertension: ≥ 2 ICD-9 claims for 401.x OR ≥ 1 antihypertensive drug claim",
          "Diabetes: ≥ 2 ICD-9 claims for 250.x OR ≥ 1 hypoglycemic/antidiabetic drug claim",
          "CKD: ICD-9 585.x (stage-specific codes available only after 2004; stage analysis restricted to post-2004 subgroup)",
          "Define each outcome as the first qualifying claim after nephrectomy (incident condition)",
          "Sensitivity analysis: stricter threshold requiring ≥ 2 claims within 6 months"
        ],
        hypothesisTesting: null,
        usageInPaper: "Defines all primary outcomes for the 4,650-donor cohort. CKD stage analysis is restricted to a post-2004 subgroup where ICD-9 stage-specific codes (585.1–585.5) became available; this reduces power but improves construct validity. The combined medical + pharmacy algorithm for hypertension and diabetes improves sensitivity over diagnosis-code-only ascertainment."
      }
    ],
    signals: [
      ["Black hypertension HR", 1.52],
      ["Black drug-treated diabetes HR", 2.31],
      ["Black CKD HR", 2.32],
      ["5-year donor ESRD prevalence (%)", 0.90]
    ],
    pitfalls: [
      ["Left-truncation if ignored", "Without adjusting for delayed insurance entry, Cox models over-represent long-surviving donors who were insured from early post-donation — inflating apparent event-free survival."],
      ["Insured-donor selection bias", "Donors linked to private insurer claims may be healthier and more affluent than the ~85% of donors not captured — the linked cohort is not nationally representative."],
      ["Claims-vs-survey outcome mismatch", "ICD-9-based claims definitions are not equivalent to NHANES self-report or lab-measured definitions; NHANES comparisons are qualitative benchmarks, not direct statistical tests."]
    ],
    tags: ["OPTN", "claims linkage", "left truncation", "Cox", "NHANES", "survey weights", "ICD-9 ascertainment"]
  }
];

// ─── State ────────────────────────────────────────────────────────────────────

let selectedPaper = papers[0];
let selectedMethod = 0;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const els = {
  paperTabs:     document.getElementById("paperTabs"),
  paperSearch:   document.getElementById("paperSearch"),
  paperKicker:   document.getElementById("paperKicker"),
  paperTitle:    document.getElementById("paperTitle"),
  paperCitation: document.getElementById("paperCitation"),
  paperTakeaway: document.getElementById("paperTakeaway"),
  lensGrid:      document.getElementById("lensGrid"),
  paperLink:     document.getElementById("paperLink"),
  methodNav:     document.getElementById("methodNav"),
  methodDetail:  document.getElementById("methodDetail"),
  signalChart:   document.getElementById("signalChart"),
  pitfallList:   document.getElementById("pitfallList")
};

// ─── KaTeX ────────────────────────────────────────────────────────────────────

function typeset(el) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function filteredPapers() {
  const query = els.paperSearch.value.trim().toLowerCase();
  if (!query) return papers;
  return papers.filter((p) => {
    const haystack = [
      p.title, p.short, p.citation, p.takeaway,
      ...Object.values(p.sections),
      ...p.tags,
      ...p.methods.flatMap((m) => [
        m.name, m.definition, m.usageInPaper,
        ...(m.setup || []),
        m.hypothesisTesting ? Object.values(m.hypothesisTesting).join(" ") : ""
      ]),
      ...p.pitfalls.flat()
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderTabs() {
  const visible = filteredPapers();
  els.paperTabs.innerHTML = "";
  visible.forEach((paper) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `paper-tab${paper.id === selectedPaper.id ? " is-active" : ""}`;
    btn.dataset.id = paper.id;
    btn.innerHTML = `<span>${paper.year} · ${paper.journal}</span><strong>${paper.short}</strong>`;
    btn.addEventListener("click", () => {
      selectedPaper = paper;
      selectedMethod = 0;
      render();
    });
    els.paperTabs.appendChild(btn);
  });

  if (visible.length && !visible.some((p) => p.id === selectedPaper.id)) {
    selectedPaper = visible[0];
    selectedMethod = 0;
  }
}

function renderPaper() {
  els.paperKicker.textContent = `${selectedPaper.journal} · ${selectedPaper.year}`;
  els.paperTitle.textContent = selectedPaper.title;
  els.paperCitation.textContent = selectedPaper.citation;
  els.paperTakeaway.textContent = selectedPaper.takeaway;
  els.paperLink.href = selectedPaper.source;

  els.lensGrid.innerHTML = Object.entries(selectedPaper.sections).map(([name, text]) => `
    <section class="lens-card">
      <h3>${name}</h3>
      <p>${text}</p>
    </section>
  `).join("");

  els.methodNav.innerHTML = selectedPaper.methods.map((m, i) => `
    <button type="button" class="method-button${i === selectedMethod ? " is-active" : ""}" data-method="${i}">
      ${m.name}
    </button>
  `).join("");

  els.methodNav.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMethod = Number(btn.dataset.method);
      renderMethodDetail();
      els.methodNav.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  renderMethodDetail();

  const maxVal = Math.max(...selectedPaper.signals.map((s) => s[1]), 1);
  els.signalChart.innerHTML = selectedPaper.signals.map(([label, value]) => {
    const width = Math.max(7, Math.min(100, (value / maxVal) * 100));
    return `
      <div class="signal-row">
        <div class="signal-label">${label}</div>
        <div class="signal-track"><div class="signal-bar" style="width:${width}%"></div></div>
        <div class="signal-value">${value.toFixed(2)}</div>
      </div>`;
  }).join("");

  els.pitfallList.innerHTML = selectedPaper.pitfalls.map(([title, text]) => `
    <div class="pitfall-card">
      <strong>${title}</strong>
      <span>${text}</span>
    </div>
  `).join("");
}

function renderMethodDetail() {
  const m = selectedPaper.methods[selectedMethod];

  const setupHTML = (m.setup && m.setup.length)
    ? `<ul>${m.setup.map((s) => `<li>${s}</li>`).join("")}</ul>`
    : "";

  const htSectionHTML = m.hypothesisTesting ? `
    <div class="method-subsection">
      <p class="subsection-label">Hypothesis Testing</p>
      <div class="ht-block">
        <div class="ht-row">
          <span class="ht-label">\\( H_0 \\)</span>
          <span>${m.hypothesisTesting.null}</span>
        </div>
        <div class="ht-row">
          <span class="ht-label">Test</span>
          <span>${m.hypothesisTesting.test}</span>
        </div>
        ${m.hypothesisTesting.alpha ? `
        <div class="ht-row">
          <span class="ht-label">Level</span>
          <span>${m.hypothesisTesting.alpha}</span>
        </div>` : ""}
      </div>
    </div>` : "";

  els.methodDetail.innerHTML = `
    <div class="method-detail-inner">
      <div class="method-subsection">
        <p class="subsection-label">Definition</p>
        <p>${m.definition}</p>
      </div>
      <div class="method-subsection">
        <p class="subsection-label">Setup &amp; Mechanics</p>
        ${setupHTML}
      </div>
      ${htSectionHTML}
      <div class="method-subsection usage-block">
        <p class="subsection-label">Usage in This Paper</p>
        <p>${m.usageInPaper}</p>
      </div>
      <div class="tag-row">
        ${selectedPaper.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
  `;

  typeset(els.methodDetail);
}

// ─── Main render ──────────────────────────────────────────────────────────────

function render() {
  renderTabs();
  renderPaper();
}

els.paperSearch.addEventListener("input", () => {
  renderTabs();
  renderPaper();
});

document.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const visible = filteredPapers();
  const idx = visible.findIndex((p) => p.id === selectedPaper.id);
  if (e.key === "ArrowRight" && idx < visible.length - 1) {
    selectedPaper = visible[idx + 1];
    selectedMethod = 0;
    render();
  }
  if (e.key === "ArrowLeft" && idx > 0) {
    selectedPaper = visible[idx - 1];
    selectedMethod = 0;
    render();
  }
});

render();
