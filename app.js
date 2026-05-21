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
        definition: "A subdistribution hazard regression model designed for time-to-event data with competing events — situations where multiple mutually exclusive terminal outcomes can occur. Unlike standard Kaplan-Meier or Cox, which treat competing events as uninformative censoring (and thereby overestimate cumulative incidence), Fine-Gray directly models the probability of experiencing the focal event by time t in the presence of competing risks.",
        setup: [
          "Classify all terminal events: focal event (waitlist death or deterioration) and competing events (transplant; recovery removal)",
          "Estimate the subdistribution hazard: h*(t) = lim P(t ≤ T < t+dt, ε=focal | T≥t OR (T<t AND ε≠focal)) / dt",
          "Fit a proportional subdistribution hazard model with policy era as primary exposure",
          "Report subdistribution hazard ratios (SHR) with 95% CI",
          "Plot cumulative incidence functions (CIF) — not 1 − Kaplan-Meier"
        ],
        hypothesisTesting: {
          null: "SHR = 1: policy era does not change the subdistribution hazard of the focal event",
          test: "Wald test on the policy-era coefficient; Gray's test for unadjusted CIF comparisons between eras",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Three mutually exclusive waitlist outcomes modeled with separate Fine-Gray models: (1) death or deterioration (focal), (2) transplant (competing), (3) recovery removal (competing). Post-policy era SHR = 0.60 for death/deterioration (40% lower hazard), SHR = 1.38 for transplant (more likely to receive a heart), SHR = 0.54 for recovery. These cannot be summed as simple probabilities — each represents a separate subdistribution hazard."
      },
      {
        name: "Cox Proportional Hazards",
        definition: "A semi-parametric regression model for time-to-event outcomes. The model estimates the hazard ratio (HR) — the multiplicative effect of each covariate on the instantaneous risk of the event. 'Semi-parametric' means the baseline hazard h₀(t) is left unspecified while the covariate effects are modeled parametrically via e^(β·X). The proportional hazards assumption requires that the ratio of hazards between any two covariate patterns is constant over time.",
        setup: [
          "Time-zero: transplant date",
          "Event: all-cause death post-transplant",
          "Candidate covariates selected by biological plausibility plus univariate p < 0.05",
          "Variables with >10% missingness excluded; remaining missing data handled by multiple imputation",
          "PH assumption verified via Schoenfeld residuals; time-varying covariates added if assumption violated",
          "Kaplan-Meier curves plotted; log-rank test used for unadjusted comparison"
        ],
        hypothesisTesting: {
          null: "HR = 1 for policy era: post-policy transplantation does not change the hazard of posttransplant death",
          test: "Wald test on policy-era HR; log-rank test on Kaplan-Meier curves; Schoenfeld residual test for PH assumption",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Post-policy era HR = 1.29 (95% CI: 1.07–1.55) — a 29% higher hazard of death after transplant despite waitlist improvements. This paradox motivates the interpretation that sicker patients are being bridged and transplanted under the new rules, not that transplant care worsened."
      },
      {
        name: "Multiple Imputation",
        definition: "A principled missing-data technique that replaces each missing value with M plausible draws from the posterior predictive distribution of the missing data given the observed data. Each of the M completed datasets is analyzed separately, and results are pooled using Rubin's rules (combining point estimates and variance components). This yields valid inference under the missing-at-random assumption, unlike complete-case analysis which assumes missing-completely-at-random.",
        setup: [
          "Exclude variables with >10% missingness entirely (too sparse for stable imputation)",
          "For remaining covariates with missing data, specify an imputation model (typically predictive mean matching or logistic for binary variables)",
          "Generate M ≥ 5 imputed datasets",
          "Fit the Cox model on each imputed dataset",
          "Pool HR estimates: combined HR = mean of M HRs; pooled SE via Rubin's rules: Var_total = Within-imputation variance + (1 + 1/M) × Between-imputation variance"
        ],
        hypothesisTesting: {
          null: "Same as the host model (Cox HR = 1). Imputation itself does not generate a hypothesis — it ensures the host model's test is valid.",
          test: "Rubin's combining rules yield t-statistics and p-values that account for imputation uncertainty",
          alpha: "Determined by host model"
        },
        usageInPaper: "Applied to the posttransplant Cox model. Missing covariate values (recipient BMI, creatinine, ischemic time) were imputed rather than listwise-deleted, retaining all eligible transplant recipients in the analytic sample and avoiding the selection bias that complete-case analysis would introduce."
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
        definition: "A design strategy that pre-specifies analytical strata based on clinically meaningful characteristics, then fits separate models within each stratum rather than relying on interaction terms alone. This prevents effect heterogeneity from being 'averaged out' in pooled estimates (Simpson's paradox) and is especially important when the mechanism or baseline risk differs across groups.",
        setup: [
          "Pre-specify strata: age system (pediatric vs. adult) × diagnosis (CHD vs. cardiomyopathy) → 4 primary strata",
          "Further subdivide pediatric by age: infants (<1 yr), children (1–17 yr)",
          "Use different policy cutoff dates: 2016 change for pediatric system, 2018 change for adult system",
          "Fit separate Fine-Gray models within each stratum; do not pool across strata",
          "Adolescents explored across three eras because both allocation systems may affect them"
        ],
        hypothesisTesting: {
          null: "Within each stratum: SHR = 1 (policy change has no effect on waitlist death/removal)",
          test: "Stratum-specific Wald tests on policy-era SHR. No formal cross-stratum interaction test — heterogeneity inferred by comparing stratum-specific CIs",
          alpha: "α = 0.05 per stratum"
        },
        usageInPaper: "Six primary subgroup models reveal that the headline finding from adult-only pooled analyses ('allocation change reduces waitlist mortality') does not hold uniformly: adult CHD patients showed no significant benefit (HR ~1.0), a clinically critical distinction that a single pooled model would obscure."
      },
      {
        name: "Diagnosis Adjudication",
        definition: "A rule-based classifier applied to registry data to resolve ambiguous or dual diagnosis codes into a single clinically coherent category. Administrative registries often assign multiple diagnostic codes to a patient, creating misclassification bias if not resolved. The adjudication algorithm encodes clinical domain knowledge (e.g., a patient coded for both CHD and dilated cardiomyopathy is likely a CHD patient with secondary cardiac dysfunction).",
        setup: [
          "Identify patients with both CHD and cardiomyopathy codes in UNOS registry",
          "Apply a clinical hierarchy: CHD code takes precedence unless cardiomyopathy is the primary listing diagnosis",
          "Document the decision rule explicitly so it is reproducible",
          "Sensitivity analysis: exclude all dual-coded patients entirely and re-run primary models"
        ],
        hypothesisTesting: {
          null: "No formal null hypothesis. The sensitivity analysis tests whether dual-code exclusion materially changes the SHR estimates.",
          test: "Qualitative comparison of primary vs. sensitivity-analysis SHRs; overlapping CIs indicate robustness",
          alpha: "N/A — this is a data-quality check, not a hypothesis test"
        },
        usageInPaper: "Patients with overlapping CHD and cardiomyopathy codes in UNOS are assigned using clinical hierarchy. The sensitivity analysis excluding dual-coded patients produces consistent SHRs, validating the adjudication algorithm."
      },
      {
        name: "Fine-Gray Competing Risks",
        definition: "Same subdistribution hazard framework as Paper 1, but here applied within each age/diagnosis stratum separately. The focal event and event definition differ slightly: death on waitlist or within 60 days of removal for deterioration is the composite focal event; surviving withdrawals are censored after 60 days. Transplant remains the primary competing event.",
        setup: [
          "Focal event: waitlist death OR removal for clinical deterioration (if death occurs within 60 days of removal)",
          "Competing event: transplant",
          "Surviving withdrawals censored at 60 days post-removal",
          "Pre-policy patients still listed at the policy change date censored at that date",
          "Check proportional hazards assumption; add time-varying covariate for policy era if violated",
          "Infant models exclude functional status and eGFR (not measured at this age)"
        ],
        hypothesisTesting: {
          null: "SHR = 1: policy era does not change subdistribution hazard of waitlist death/deterioration within stratum",
          test: "Wald test on policy-era SHR in each stratum-specific Fine-Gray model",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Separate Fine-Gray models for infants (CHD only), children (CHD; cardiomyopathy), and adults (CHD; cardiomyopathy). Policy-era SHRs range from 0.60 (adult cardiomyopathy, significant benefit) to ~1.0 (adult CHD, no benefit). Adolescents require a three-era model since both pediatric and adult systems changed sequentially."
      },
      {
        name: "Frequent-Category Imputation & Stepwise Selection",
        definition: "A simplified missing-data strategy for small analytic samples where standard multiple imputation is unstable. Missing values are replaced with the most common observed category (mode imputation for categorical variables). Stepwise covariate selection then trims the model to maintain an adequate events-per-variable (EPV) ratio, preventing overfitting in small strata.",
        setup: [
          "Apply frequent-category imputation to strata with N too small for stable MI (adult CHD; pediatric cardiomyopathy)",
          "Target EPV ≥ 10: if EPV falls below threshold, remove lowest-priority covariates until threshold is met",
          "Priority order for removal: least biologically plausible, highest missingness",
          "Report final covariate set per stratum to make selection transparent",
          "Implemented in SAS 9.4"
        ],
        hypothesisTesting: {
          null: "N/A — missing-data and model-stability technique, not a hypothesis test",
          test: "EPV ratio used as a model-stability diagnostic, not a significance test",
          alpha: "N/A"
        },
        usageInPaper: "Adult CHD and pediatric cardiomyopathy strata are too small for full covariate adjustment. Frequent-category imputation preserves sample size; stepwise reduction keeps the model degrees of freedom within bounds. This is explicitly less rigorous than the MI used in Paper 1 — a transparency note about the analytic trade-off in small-sample strata."
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
        definition: "Generalized Estimating Equations is a marginal (population-averaged) regression framework for correlated outcomes. Unlike mixed-effects models that condition on individual random effects, GEE estimates the average effect in the population using a working correlation structure and sandwich (robust) standard errors. For binary outcomes it is paired with a logit link, yielding odds ratios that are valid even when the working correlation structure is mis-specified.",
        setup: [
          "Outcome: binary waitlisting (yes = listed at a VA transplant center; secondary: listed anywhere)",
          "Exposure: log₂(distance from patient's VA hospital to nearest VA transplant center)",
          "Clustering unit: VA hospital (patients within the same hospital share referral pathways)",
          "Working correlation structure: exchangeable (all pairs within a cluster equally correlated)",
          "Variance estimator: sandwich (robust) SE — valid regardless of true within-cluster correlation",
          "Covariates: patient age, MELD, HCC status, hospital-level liver-population characteristics"
        ],
        hypothesisTesting: {
          null: "OR = 1: log₂-distance is not associated with the odds of waitlisting",
          test: "Wald chi-square test on the log₂-distance coefficient using robust SE. Cluster-robust CI reported.",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Primary model for the waitlisting outcome. OR = 0.91 per doubling of distance to a VA transplant center (p < 0.001). A secondary model tests whether proximity to non-VA transplant centers attenuates the association — it does not, suggesting VA-specific referral pathways drive the access gradient."
      },
      {
        name: "Log₂ Distance Exposure",
        definition: "A continuous geographic exposure measured on a base-2 logarithmic scale so that one unit on the exposure scale corresponds to a doubling of distance. This transformation linearizes a right-skewed distance distribution and produces a coefficient interpretable as 'the effect of doubling the distance to the transplant center.' Post-hoc categorical distance bands are created for display and clinical interpretation but are not used for primary inference.",
        setup: [
          "Measure distance from each patient's routine VA hospital to the nearest VA liver transplant center (patient home addresses unavailable)",
          "Apply log₂ transform: exposure = log₂(distance in miles)",
          "Fit all primary regression models with log₂-distance as a continuous covariate",
          "Post-hoc: bin patients into categorical distance bands for figure display; note explicitly that these bands are exploratory",
          "Validation: a subgroup analysis at one center confirmed that hospital-level distance approximates patient-level distance"
        ],
        hypothesisTesting: {
          null: "No separate test for the transformation. The test of linearity between log₂-distance and the outcome serves as a partial check: a non-significant departure from linearity supports the log-linear model.",
          test: "Regression spline or likelihood ratio test for departure from log-linearity (reported as a check in sensitivity analyses)",
          alpha: "α = 0.05"
        },
        usageInPaper: "Log₂-distance is the primary exposure variable in all three outcome models (waitlisting, transplant, survival). The continuous OR/HR per doubling is reported as the primary estimate; categorical bands accompany figures but should not be used for causal inference because bands were chosen after inspecting the data."
      },
      {
        name: "Competing Risks Cox (Transplant)",
        definition: "A modified survival analysis that treats death as a competing event for the outcome of liver transplantation. Without this adjustment, standard Kaplan-Meier estimators of transplant probability overestimate the cumulative incidence because they treat death as uninformative censoring — incorrectly assuming that patients who die could still have been transplanted. A Fine-Gray subdistribution hazard model or cause-specific Cox with competing risk correction addresses this.",
        setup: [
          "Time-zero: date of waitlisting at a transplant center",
          "Focal event: receipt of liver transplant",
          "Competing event: death before transplant",
          "Covariates: MELD score, albumin, HCC, insurance, area poverty level, log₂-distance",
          "Check PH assumption via Schoenfeld residuals; add time-distance interaction if violated"
        ],
        hypothesisTesting: {
          null: "SHR = 1: distance is not associated with transplant probability after accounting for death as a competing event",
          test: "Wald test on log₂-distance coefficient. Gray's test for unadjusted CIF comparison across distance quartiles.",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Among waitlisted veterans, SHR = 0.97 per doubling of distance (p < 0.01) — modest but consistent with the waitlisting gradient. The competing-risk model is important here because sicker patients (higher MELD) may both be closer to VA centers and die faster, creating a confound that standard Kaplan-Meier would not correct."
      },
      {
        name: "ICD-9 Eligibility Algorithm",
        definition: "A validated rule-based algorithm that uses administrative diagnosis codes from electronic health records to identify patients meeting clinical study inclusion criteria. Translates clinical eligibility rules (decompensated liver disease or HCC without contraindications) into reproducible code-based logic. The algorithm's sensitivity and specificity against chart review determine how much misclassification bias affects downstream estimates.",
        setup: [
          "Inclusion codes: validated ICD-9-CM algorithms for decompensated cirrhosis (ascites, hepatic encephalopathy, variceal hemorrhage, spontaneous bacterial peritonitis) OR hepatocellular carcinoma",
          "Active VA care requirement: ≥2 outpatient visits in the 12 months after the eligibility-defining event",
          "Exclusion codes: prior organ transplant, age <18 or >70, contraindicated malignancies",
          "Algorithm validated against medical chart review in a subset to estimate sensitivity and positive predictive value"
        ],
        hypothesisTesting: {
          null: "N/A — cohort-definition method, not a statistical test",
          test: "Algorithm validation: compare code-identified cases against chart-review gold standard; report sensitivity, specificity, PPV",
          alpha: "N/A"
        },
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
        definition: "Cox proportional hazards models applied separately within pre-defined calendar-time strata (5-year listing periods). Rather than fitting a single pooled model with period-by-race interaction terms, this strategy estimates period-specific HRs directly, allowing the baseline hazard and all covariate effects to vary freely across periods. It is a transparent way to characterize temporal trends in association without assuming a particular functional form for how effects change over time.",
        setup: [
          "Group candidates into four listing periods: 1995–1999, 2000–2004, 2005–2009, 2010–2014",
          "Cap follow-up at 2 years after listing date within each period",
          "Fit separate Cox models per period with race/ethnicity as primary exposure",
          "Covariates: age, sex, BMI, ABO blood type, PRA/CPRA, dialysis status, SES indicators",
          "Report period-specific HRs with 95% CI for each racial/ethnic group vs. White"
        ],
        hypothesisTesting: {
          null: "HR = 1 within each period: race/ethnicity is not associated with time to LDKT in that period",
          test: "Wald test on race coefficients per period; log-rank test on unadjusted Kaplan-Meier curves per period",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Black HR decreases from ~0.50 (1995–99) to ~0.30 (2010–14), and Hispanic HR from ~0.85 to ~0.55. Asian HR also declines. The progressive worsening across four sequential models — each with its own independent cohort — confirms that the widening disparity is not a statistical artifact of a single pooled model."
      },
      {
        name: "Fine-Gray Competing Risks",
        definition: "Used here as a sensitivity analysis to confirm that the Cox-estimated disparities are not an artifact of informative censoring. In the LDKT context, two competing events prevent live-donor transplantation: death (patient can no longer receive LDKT) and deceased-donor transplant (patient receives a different organ). Standard Cox treats both as uninformative censoring, which overestimates the probability of LDKT if racial groups differ in their risk of competing events.",
        setup: [
          "Focal event: live-donor kidney transplant",
          "Competing events: (1) death before transplant; (2) receipt of deceased-donor kidney transplant",
          "Fit Fine-Gray subdistribution hazard models within each 5-year listing period",
          "Compare SHRs to Cox HRs: substantial divergence would indicate competing-event bias",
          "Also report cumulative incidence functions (CIF) by race and period"
        ],
        hypothesisTesting: {
          null: "SHR = 1: race/ethnicity not associated with subdistribution hazard of LDKT",
          test: "Wald test on race coefficients; Gray's test on unadjusted CIFs",
          alpha: "α = 0.05"
        },
        usageInPaper: "SHRs broadly consistent with Cox HRs (Black SHR ~0.27–0.45 across periods). This confirms that the disparity findings from the primary Cox analysis are not an artifact of differential mortality or deceased-donor transplant rates between racial groups — the same widening pattern is observed in the competing-risk framework."
      },
      {
        name: "Interaction Terms (Trend Testing)",
        definition: "A formal statistical test for whether the association between two variables (race/ethnicity and LDKT) changes across levels of a third variable (listing period). Implemented by including product terms (race × period) in a single pooled model. The joint significance test of all race × period interaction terms answers: 'Is the racial disparity in LDKT statistically different across listing periods?' This is more rigorous than visually comparing stratum-specific HRs.",
        setup: [
          "Fit a single pooled Cox model including all four listing periods, all racial/ethnic groups, and their cross-products (race × period indicator)",
          "Joint F-test or χ² test for the block of race × period interaction terms",
          "Additionally report period-specific HRs for interpretability (same as time-stratified models)",
          "Use the interaction test p-value to claim whether temporal trend in disparities is statistically significant"
        ],
        hypothesisTesting: {
          null: "All race × period interaction coefficients = 0: the racial/ethnic disparity in LDKT is constant across all listing periods",
          test: "Joint χ² test (likelihood ratio or Wald) on the race × period interaction block with (groups − 1) × (periods − 1) degrees of freedom",
          alpha: "α = 0.05 for the joint test; individual interaction terms reported but are secondary"
        },
        usageInPaper: "Joint p < 0.001 for the Black × period interaction block, confirming that the observed worsening of Black candidates' adjusted LDKT hazard is not due to chance variation across four independent cohorts. Similarly significant for Hispanic candidates. This is the primary inferential claim supporting the paper's conclusion that national equity programs failed to narrow disparities."
      },
      {
        name: "Incremental Mediation Analysis",
        definition: "A sequential covariate-addition strategy that adds potential mediators or confounders in prespecified blocks to decompose how much of the racial/ethnic disparity in LDKT is 'explained' by each factor. Not a formal causal mediation analysis (which requires explicit counterfactual assumptions), but a practical decomposition approach. Attenuation of the race HR after adding a block suggests that block captures some of the mechanism linking race to LDKT access.",
        setup: [
          "Base model (Model 1): race/ethnicity + clinical characteristics (age, sex, BMI, ABO, PRA)",
          "Model 2: add SES block (zip-code median income, insurance type)",
          "Model 3: add transplant-center characteristics (volume, center LDKT rate, transplant-center fixed effects)",
          "Compute change in racial/ethnic HR across models: Δ HR = (HR_base − HR_full) / HR_base",
          "Missing SES variables: SRTR missing-category approach (indicator variable for missing); multiple imputation used as robustness check"
        ],
        hypothesisTesting: {
          null: "No formal test for mediation. The question is magnitude: does the HR change substantially when a block is added?",
          test: "Compare magnitude and CIs of race HR across models. Substantial attenuation (e.g., >15% change in HR) is interpreted as partial mediation by that block.",
          alpha: "N/A — inferential focus is on magnitude, not significance"
        },
        usageInPaper: "Adding SES indicators attenuates Black and Hispanic HRs modestly (~10–15%). Adding transplant-center factors attenuates further but large residual disparities remain. Interpretation: socioeconomic and center-level factors account for some — but not most — of the racial gap in LDKT, pointing to unmeasured structural barriers or biological differences in living-donor availability."
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
      ["Competing-event differential", "Death and deceased-donor transplant rates differ by race; treating them as uninformative censoring without a Fine-Gray sensitivity analysis would overstate or understate LDKT disparities."]
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
        name: "Registry-to-Claims Record Linkage",
        definition: "A data integration method that joins two or more administrative datasets using shared identifiers (probabilistic or deterministic matching) to create longitudinal outcome data unavailable in either source alone. OPTN registry tracks donors at donation but not post-donation health; private insurer claims track diagnoses over time but do not identify donors. Linking them creates a novel analytic resource at the cost of potential linkage error (false matches or missed matches).",
        setup: [
          "Source 1: OPTN donor records (donation date, demographics, donor characteristics)",
          "Source 2: Integrated Healthcare Information Services claims data (2000–2007 medical and pharmacy claims)",
          "Matching keys: full name + date of birth (deterministic linkage)",
          "Post-linkage de-identification: direct identifiers removed; HIPAA limited dataset retained",
          "Linkage validation: manual chart review of a random sample of matched records to estimate false-positive rate",
          "Additional linkage: Census data joined by ZIP code for area-level SES variables"
        ],
        hypothesisTesting: {
          null: "N/A — data assembly method, not a hypothesis test",
          test: "Linkage quality assessed by false-match rate in validation subsample; reported as a study limitation",
          alpha: "N/A"
        },
        usageInPaper: "Links 4,650 of approximately 30,000 OPTN-listed donors to insurer claims — roughly 15% match rate, reflecting the limitation that most donors are insured through plans outside the participating insurer. This selection introduces potential bias: linked donors may be more affluent or in better health than unlinked donors, and the paper discusses this explicitly."
      },
      {
        name: "Cox Regression with Left Truncation",
        definition: "A time-to-event model that correctly handles two forms of incomplete follow-up: right censoring (the event has not yet occurred when observation ends — standard in survival analysis) and left truncation (the subject is not observed from the beginning of risk because they entered the data source late). Ignoring left truncation inflates the effective sample size and produces length-biased samples that over-represent long survivors (survivors of the early at-risk period who were insured from the start are more likely to be selected, biasing estimates).",
        setup: [
          "Time-zero: date of nephrectomy (donation)",
          "Left truncation time: date insurance enrollment began (subjects not observed from time-zero)",
          "Right censoring time: insurance disenrollment date OR study end date (Dec 31, 2007), whichever is earlier",
          "Focal outcome: first post-donation ICD-9–based diagnosis (hypertension, diabetes, CKD, CVD)",
          "Covariates: donor race/ethnicity, age, sex, BMI, pre-donation hypertension status",
          "PH assumption: Schoenfeld residuals; time-varying covariates added if violated"
        ],
        hypothesisTesting: {
          null: "HR = 1: race/ethnicity is not associated with hazard of postdonation diagnosis after adjusting for clinical covariates",
          test: "Wald test on race coefficients. PH assumption test via scaled Schoenfeld residuals (p > 0.05 supports PH).",
          alpha: "α = 0.05, two-sided"
        },
        usageInPaper: "Left truncation accounts for donors who entered insurer data late — some had already spent months or years post-nephrectomy without claims observation. Ignoring this would systematically under-count early events. Black HR = 1.52 for hypertension (CI: 1.28–1.80), HR = 2.31 for drug-treated diabetes (1.73–3.08), and HR = 2.32 for CKD (1.45–3.70) relative to White donors, after adjustment."
      },
      {
        name: "Survey-Weighted Logistic Regression",
        definition: "Logistic regression that incorporates complex survey design features — probability weights, primary sampling units (PSUs), and strata — to produce prevalence estimates representative of the target population. NHANES uses a stratified multistage cluster sample in which each respondent represents many thousands of US residents. Ignoring survey weights yields biased prevalence estimates because demographic groups are intentionally over- or under-sampled relative to their population frequency.",
        setup: [
          "Data source: NHANES 2005–2006 (nationally representative US adult sample)",
          "Apply sampling probability weights (WTMEC2YR for morning examination)",
          "Specify PSU (SDMVPSU) and strata (SDMVSTRA) variables for variance estimation",
          "Outcome: binary diagnosis of hypertension, diabetes, or CKD (by self-report or exam measure)",
          "Exposure: race/ethnicity (matching categories used in donor cohort)",
          "Use PROC SURVEYMEANS and PROC SURVEYLOGISTIC (SAS) or equivalent"
        ],
        hypothesisTesting: {
          null: "OR = 1 in NHANES: race/ethnicity not associated with diagnosis prevalence in the general US population",
          test: "Design-adjusted Wald F-test on race coefficients. CIs from linearization (Taylor series) variance estimation.",
          alpha: "α = 0.05"
        },
        usageInPaper: "NHANES provides a general-population benchmark because race-specific claims data for non-donor insured beneficiaries were unavailable. Outcome definitions differ between claims (ICD-9 billing codes) and NHANES (self-report or measured labs), so comparisons are qualitative. Key finding: Black living donors have higher adjusted diagnosis rates than similarly race-matched NHANES adults despite the 'superhealthy worker effect' — donors are screened to be healthier than the general population."
      },
      {
        name: "ICD-9 / Pharmacy Claims Outcome Ascertainment",
        definition: "An algorithmic case-finding approach using billing and pharmacy codes to identify clinical diagnoses from administrative claims. ICD-9-CM diagnosis codes are assigned by billing providers and reflect documented diagnoses, not measured lab values. Pharmacy drug-category codes (NDC or ATC classification) identify treated conditions. Combined medical + pharmacy algorithms generally have higher sensitivity than either alone, because a patient with hypertension who never visits a doctor for it will still fill a prescription.",
        setup: [
          "Hypertension: ≥2 ICD-9 claims for 401.x (essential hypertension) in any 12-month window, OR ≥1 antihypertensive drug claim",
          "Diabetes requiring drug therapy: ≥2 ICD-9 claims for 250.x, OR ≥1 hypoglycemic/antidiabetic drug claim",
          "Chronic kidney disease: ICD-9 585.x (stage-specific CKD codes, available only after 2004 — stage analysis restricted to post-2004 subgroup)",
          "Cardiovascular disease: ICD-9 410–414 (ischemic heart disease), 430–438 (stroke/TIA)",
          "Define each outcome as first qualifying claim occurring after nephrectomy (incident condition)"
        ],
        hypothesisTesting: {
          null: "N/A — outcome definition method",
          test: "Algorithm validity assessed qualitatively against chart review in a subsample; sensitivity analysis uses stricter thresholds (requiring ≥2 claims within 6 months)",
          alpha: "N/A"
        },
        usageInPaper: "Defines all primary outcomes for the 4,650-donor cohort. CKD stage analysis is restricted to a post-2004 subgroup where ICD-9 stage-specific codes (585.1–585.5) became available; this reduces power but improves construct validity over using the nonspecific 585.x code alone. The combined medical + pharmacy algorithm for hypertension and diabetes improves sensitivity over diagnosis-code-only ascertainment."
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
      ["Insured-donor selection bias", "Donors linked to private insurer claims may be healthier and more affluent than the ~85% of donors not captured — the linked cohort is not nationally representative of all living donors."],
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
  paperTabs:    document.getElementById("paperTabs"),
  paperSearch:  document.getElementById("paperSearch"),
  paperKicker:  document.getElementById("paperKicker"),
  paperTitle:   document.getElementById("paperTitle"),
  paperCitation:document.getElementById("paperCitation"),
  paperTakeaway:document.getElementById("paperTakeaway"),
  lensGrid:     document.getElementById("lensGrid"),
  paperLink:    document.getElementById("paperLink"),
  methodNav:    document.getElementById("methodNav"),
  methodDetail: document.getElementById("methodDetail"),
  signalChart:  document.getElementById("signalChart"),
  pitfallList:  document.getElementById("pitfallList")
};

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

  // method nav buttons
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

  // signals
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

  // pitfalls
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
    : "<p class='muted-text'>No setup steps recorded.</p>";

  const htHTML = m.hypothesisTesting
    ? `
      <div class="ht-block">
        <div class="ht-row">
          <span class="ht-label">H₀</span>
          <span>${m.hypothesisTesting.null}</span>
        </div>
        <div class="ht-row">
          <span class="ht-label">Test</span>
          <span>${m.hypothesisTesting.test}</span>
        </div>
        ${m.hypothesisTesting.alpha ? `<div class="ht-row"><span class="ht-label">Level</span><span>${m.hypothesisTesting.alpha}</span></div>` : ""}
      </div>`
    : `<p class="muted-text">Not applicable — this is a design or data-quality technique, not a hypothesis-driven statistical test.</p>`;

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
      <div class="method-subsection">
        <p class="subsection-label">Hypothesis Testing</p>
        ${htHTML}
      </div>
      <div class="method-subsection usage-block">
        <p class="subsection-label">Usage in This Paper</p>
        <p>${m.usageInPaper}</p>
      </div>
      <div class="tag-row">
        ${selectedPaper.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
  `;
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
