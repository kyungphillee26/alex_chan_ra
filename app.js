const papers = [
  {
    id: "adult-heart-policy",
    short: "Adult heart policy",
    title: "Evolving Trends in Adult Heart Transplant With the 2018 Heart Allocation Policy Change",
    citation: "Kilic et al. JAMA Cardiology. 2021;6(2):159-167. doi:10.1001/jamacardio.2020.4909",
    journal: "JAMA Cardiology",
    year: "2021",
    source: "https://doi.org/10.1001/jamacardio.2020.4909",
    takeaway: "15,631 adult UNOS heart transplant recipients compared across the October 2018 allocation change. Waitlist outcomes improved under the new 6-tier system, but posttransplant survival decreased.",
    sections: {
      Motivation: "The October 2018 policy converted the prior 3-tier adult heart allocation system into a 6-tier hierarchy stratified by clinical condition and urgency, with goals of reducing waitlist mortality and enabling broader geographic sharing of donor organs. The study examines whether these goals were achieved and at what cost to posttransplant survival.",
      Design: "Retrospective UNOS cohort of 15,631 adult heart transplant recipients. Pre-policy: 10/1/2015–10/17/2018 (10,671 waitlisted; 6,078 transplanted). Post-policy: from 10/18/2018 (4,960 waitlisted; 2,801 transplanted). Multiorgan transplants excluded. Exposure: heart transplant after the policy change.",
      Methods: "Categorical variables: percentages compared with chi-square tests. Continuous variables: mean ± SD compared with 2-tailed unpaired t-test or Wilcoxon rank-sum test (depending on normality). Waitlist outcomes: Fine and Gray competing-risk regression reporting subhazard ratios with 95% CIs. Posttransplant survival: Kaplan-Meier curves with log-rank test, followed by multivariable Cox regression. Variables with >10% missingness (prior pregnancy, peak PRA, etc.) dropped entirely.",
      Results: "Post-policy waitlisted patients: reduced likelihood of mortality or deterioration, increased likelihood of transplant, and reduced likelihood of recovery removal. Among transplant recipients: 6,078 pre-policy vs. 2,801 post-policy. Conclusion — waitlist outcomes improved, but posttransplant survival decreased."
    },
    methods: [
      {
        name: "Fine-Gray Competing Risks",
        definition: "A subdistribution hazard regression for time-to-event data with competing events. Where standard Cox treats competing events as uninformative censoring (overestimating cumulative incidence), Fine-Gray directly models \\( h^*(t) \\), the hazard in an extended risk set that retains subjects who have already experienced a competing event: \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] where \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = 1) \\) is the cause-specific cumulative incidence function. The model estimates subdistribution hazard ratios (SHR) with 95% CIs rather than ordinary HRs.",
        setup: [
          "Classify all terminal waitlist events: focal event (death or deterioration requiring delisting) and competing events (transplant; recovery removal)",
          "Extended risk set at time \\( t \\): subjects with \\( T_i \\geq t \\) plus subjects who experienced a competing event, entered with downweighted contributions",
          "Fit a proportional subdistribution hazard model; policy era is the primary exposure",
          "Report SHRs with 95% CIs; plot cumulative incidence functions (CIF), not \\( 1 - \\hat{S}_{\\text{KM}} \\)"
        ],
        hypothesisTesting: {
          null: "SHR = 1: policy era does not change the subdistribution hazard of the focal waitlist event",
          test: "Wald test on the policy-era coefficient; Gray's test for unadjusted CIF comparisons between eras",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Three separate Fine-Gray models for waitlist outcomes: (1) death or deterioration (focal), (2) transplant (competing), (3) recovery removal (competing). Post-policy: SHR = 0.60 for death/deterioration (reduced mortality risk), SHR = 1.38 for transplant (higher transplant likelihood), SHR = 0.54 for recovery (fewer recovery removals). These are reported as subhazard ratios, not ordinary probabilities."
      },
      {
        name: "Kaplan-Meier + Log-Rank",
        definition: "The Kaplan-Meier (KM) estimator is a non-parametric method for estimating the survival function \\( S(t) = P(T > t) \\) from censored data: \\[ \\hat{S}(t) = \\prod_{t_i \\leq t} \\left(1 - \\frac{d_i}{n_i}\\right) \\] where \\( d_i \\) is the number of events and \\( n_i \\) the number at risk at each observed event time \\( t_i \\). The log-rank test compares two or more KM curves by testing whether the observed-to-expected event counts differ across groups, with test statistic \\[ \\chi^2 = \\frac{\\left(\\sum_i (O_{1i} - E_{1i})\\right)^2}{\\sum_i V_i} \\] where \\( V_i \\) is the hypergeometric variance at each event time.",
        setup: [
          "Time-zero: transplant date; event: all-cause posttransplant death",
          "Stratify KM curves by policy era (pre vs. post October 2018)",
          "Compute the log-rank test statistic comparing the two survival curves",
          "KM + log-rank is the unadjusted step before multivariable Cox regression"
        ],
        hypothesisTesting: {
          null: "\\( S_{\\text{pre}}(t) = S_{\\text{post}}(t) \\) for all \\( t \\): posttransplant survival curves are identical across policy eras",
          test: "Log-rank \\( \\chi^2 \\) test (1 degree of freedom for two groups); equivalently, the Mantel-Cox test",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "KM curves are plotted for pre-policy and post-policy transplant recipients to visually compare posttransplant survival. The log-rank test provides an unadjusted p-value. Because KM does not adjust for case-mix differences between eras (post-policy patients are sicker on average), the multivariable Cox model is the primary inferential tool."
      },
      {
        name: "Cox Proportional Hazards",
        definition: "A semi-parametric regression for time-to-event outcomes. The model specifies: \\[ h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\] where \\( h_0(t) \\) is the unspecified baseline hazard and \\( e^{\\beta_j} \\) is the hazard ratio (HR) per unit increase in \\( X_j \\). The proportional hazards assumption requires \\( h_i(t)/h_j(t) = e^{(\\mathbf{X}_i - \\mathbf{X}_j)^\\top \\boldsymbol{\\beta}} \\) to be constant over \\( t \\). Allows case-mix adjustment that the unadjusted KM curves cannot provide.",
        setup: [
          "Time-zero: transplant date; event: all-cause death post-transplant",
          "Covariates selected by biological plausibility plus univariate \\( p < 0.05 \\)",
          "Variables with \\( > 10\\% \\) missingness dropped entirely; remaining missing values handled by multiple imputation",
          "PH assumption verified via scaled Schoenfeld residuals"
        ],
        hypothesisTesting: {
          null: "HR = 1 for policy era: post-policy transplantation does not change the hazard of death after adjusting for case mix",
          test: "Wald test on the policy-era HR coefficient",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Post-policy era HR = 1.29 — a 29% higher hazard of posttransplant death even after adjusting for recipient and donor characteristics. This adjusted estimate confirms that the survival difference seen on KM curves is not explained by the sicker case mix of post-policy recipients, suggesting a real tradeoff between waitlist benefit and posttransplant risk."
      },
      {
        name: "Descriptive Statistics",
        definition: "Baseline characteristic comparisons between pre- and post-policy cohorts use two standard inferential frameworks depending on variable type. For categorical variables, counts and percentages are compared with the chi-square test \\( \\chi^2 = \\sum_i (O_i - E_i)^2 / E_i \\). For continuous variables, means and standard deviations are reported and compared with a 2-tailed unpaired t-test (if normally distributed) or the Wilcoxon rank-sum test (if non-normal), with normality assessed prior to test selection.",
        setup: [
          "Categorical variables: report \\( n \\) (%) per group; test with \\( \\chi^2 \\) (or Fisher's exact when expected cell counts \\( < 5 \\))",
          "Continuous variables: report mean \\( \\pm \\) SD; test normality before choosing t-test vs. Wilcoxon",
          "2-tailed unpaired t-test when normality holds: \\( t = (\\bar{x}_1 - \\bar{x}_2) / s_p\\sqrt{1/n_1 + 1/n_2} \\)",
          "Wilcoxon rank-sum test (Mann-Whitney U) when normality fails: ranks pooled observations and tests whether distributions are shifted",
          "These tests inform Table 1 — they do not adjust for confounders"
        ],
        hypothesisTesting: {
          null: "No difference in covariate distribution between pre- and post-policy cohorts",
          test: "Chi-square for categorical; 2-tailed unpaired t-test or Wilcoxon rank-sum for continuous (chosen by normality test)",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Table 1 of the paper compares recipient age, sex, diagnosis, BMI, mechanical support type, donor characteristics, and ischemic time between the pre-policy (n = 6,078) and post-policy (n = 2,801) transplant cohorts. Significant differences in case mix between eras (e.g., shift toward temporary MCS, sicker recipients) motivate the use of multivariable Cox adjustment rather than relying on the unadjusted KM comparison."
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
      ["Transition contamination", "Patients listed before but transplanted after the policy change blur the exposure boundary — addressed by excluding and then re-including this group as a sensitivity analysis."],
      ["Mechanism ambiguity", "Increased use of temporary mechanical support is both a consequence of the policy and a marker of higher illness severity, making it a mediator rather than a simple covariate."]
    ],
    tags: ["UNOS", "3-tier to 6-tier", "Fine-Gray", "Kaplan-Meier", "Cox", "chi-square", "t-test / Wilcoxon"]
  },

  {
    id: "pediatric-adult-heart",
    short: "Peds / adult heart",
    title: "Impact of Heart Transplant Allocation Changes on Waitlist Mortality in Pediatric and Adult Patients With Congenital Heart Disease and Cardiomyopathy",
    citation: "Wooster et al. Circulation. 2025;151:814-824. doi:10.1161/CIRCULATIONAHA.124.072335",
    journal: "Circulation",
    year: "2025",
    source: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.124.072335",
    takeaway: "11,637-patient UNOS cohort shows that allocation policy benefits are heterogeneous: infants and children with CHD and adults with cardiomyopathy improved under the new rules; children with cardiomyopathy and adults with CHD did not.",
    sections: {
      Motivation: "Prior analyses of heart allocation changes focused on the adult population as a whole, masking meaningful heterogeneity across age groups and diagnoses. Pediatric patients and adults with congenital heart disease face distinct anatomical constraints and device-support limitations. The 2016 pediatric and 2018 adult allocation revisions provide separate natural experiments to test whether universal allocation rules produce uniform benefit across these subpopulations.",
      Design: "Retrospective UNOS cohort of 11,637 patients: 2,882 pediatric CHD, 594 adult CHD, 2,348 pediatric cardiomyopathy, 5,813 adult cardiomyopathy. Pediatric (<18 yr) policy dates — pre-era: 1/1/2011–3/21/2016; post-era: 1/1/2017–12/31/2021. Adult (18–50 yr) policy dates — pre-era: 1/1/2015–10/17/2018; post-era: 1/1/2019–12/31/2021. Washout gaps between eras deliberately excluded transition-phase listings to prevent contamination.",
      Methods: "Primary outcome: pre-transplant death, defined as waitlist death OR removal for clinical deterioration with death within 60 days of removal. Competing outcomes: heart transplant or clinical improvement removal. Pre-policy patients still on the waitlist at the exact policy change date were censored. Unadjusted survival estimated by Kaplan-Meier curves. Multivariable competing risk regression used variables that were significant in univariate analysis plus clinically established covariates. Proportional hazards assumption tested per age group; time-interaction terms added when violated.",
      Results: "Adjusted competing risk models showed significant reductions in 1-year waitlist mortality/deterioration for infants with CHD (HR 0.75, p = 0.04), children with CHD (HR 0.61, p = 0.005), and adults with cardiomyopathy. No significant benefit was found for children with cardiomyopathy or adults with CHD, demonstrating that universal allocation rules have heterogeneous effects across anatomical and age-based subgroups."
    },
    methods: [
      {
        name: "Fine-Gray Competing Risks",
        definition: "Multivariable competing risk regression using the Fine-Gray subdistribution hazard model \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] where \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = 1) \\) is the cumulative incidence of the focal event. Applied separately within each age/diagnosis stratum. The primary outcome definition here is stricter than simple waitlist death: it is a composite of death on the waitlist OR removal for clinical deterioration with death occurring within 60 days of that removal.",
        setup: [
          "Focal (primary) outcome: waitlist death OR removal for deterioration with subsequent death \\( \\leq 60 \\) days",
          "Competing outcomes: heart transplant; clinical improvement removal",
          "Censoring protocol: pre-policy patients still listed at the exact policy change date are censored at that date to avoid crossover bias",
          "Variable selection: baseline variables significant in univariate regression, plus variables with established clinical relevance",
          "Infant models (< 1 yr): adjusted for race, cerebrovascular disease, dialysis, inotropes, mechanical ventilation, ECMO, and VAD at registration",
          "Pediatric models (1–17 yr): adjusted for age, BMI, cerebrovascular disease, dialysis, inotropes, mechanical ventilation, ECMO, VAD, and functional status; 70 patients with missing values excluded via listwise deletion",
          "Adult CHD models: constrained covariate set (inotropes, VAD at registration, eGFR group) due to small event counts to prevent overfitting"
        ],
        hypothesisTesting: {
          null: "SHR = 1 within each age/diagnosis stratum: allocation policy era does not change the subdistribution hazard of waitlist death or deterioration",
          test: "Wald test on the policy-era SHR coefficient in each stratum-specific Fine-Gray model",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Six primary stratum models. Significant benefit: infants with CHD (HR 0.75, \\( p = 0.04 \\)), children with CHD (HR 0.61, \\( p = 0.005 \\)), adults with cardiomyopathy. No significant benefit: children with cardiomyopathy, adults with CHD. The adult CHD null result is a critical finding that pooled adult analyses would have obscured."
      },
      {
        name: "Kaplan-Meier (Unadjusted)",
        definition: "The Kaplan-Meier estimator provides a non-parametric estimate of the survival function: \\[ \\hat{S}(t) = \\prod_{t_i \\leq t} \\left(1 - \\frac{d_i}{n_i}\\right) \\] where \\( d_i \\) is the number of events and \\( n_i \\) the number at risk at each observed event time \\( t_i \\). It is the standard first step for visualizing survival differences between groups before multivariable adjustment. Importantly, standard KM curves do not account for competing events — they treat transplant and clinical improvement as uninformative censoring, which overestimates the true probability of waitlist death.",
        setup: [
          "Plot separate KM curves for pre-policy and post-policy cohorts within each age/diagnosis stratum",
          "Time-zero: date of waitlist listing; event: waitlist death or removal for deterioration",
          "Subjects censored at transplant, clinical improvement removal, end of follow-up, or policy change date (pre-policy crossovers)",
          "KM is unadjusted — it does not control for baseline differences between eras"
        ],
        hypothesisTesting: {
          null: "\\( S_{\\text{pre}}(t) = S_{\\text{post}}(t) \\): unadjusted waitlist survival is identical between policy eras",
          test: "Log-rank test comparing pre- and post-policy KM curves within each stratum",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "KM curves provide visual and unadjusted evidence of policy-era differences in each subgroup before the competing risk models are introduced. Because KM ignores competing events (transplant precludes waitlist death), the Fine-Gray multivariable models are the primary inferential tool — KM serves as exploratory groundwork."
      },
      {
        name: "Non-Proportional Hazards Correction",
        definition: "The proportional hazards (PH) assumption requires that the ratio of hazards between groups is constant over the entire follow-up period. When this assumption is violated — meaning the effect of a covariate grows or shrinks over time — the standard Fine-Gray coefficient is biased. The standard fix is to introduce a time-interaction term: \\( \\beta_1 X + \\beta_2 (X \\times t) \\), which allows the hazard ratio for \\( X \\) to vary linearly with time \\( t \\). The coefficient \\( \\beta_2 \\) captures how the effect of \\( X \\) changes per unit of follow-up time.",
        setup: [
          "Test PH assumption for each covariate in each stratum-specific model using scaled Schoenfeld residuals (significant correlation with time = PH violation)",
          "When a violation is detected, add a product term: covariate \\( \\times \\) follow-up time",
          "Infant model violation: PH assumption failed for cerebrovascular disease → add time \\( \\times \\) cerebrovascular disease interaction",
          "Pediatric (1–17 yr) model violation: PH assumption failed for mechanical ventilation → add time \\( \\times \\) mechanical ventilation interaction",
          "Re-test residuals after adding interaction term to confirm correction"
        ],
        hypothesisTesting: {
          null: "\\( \\beta_2 = 0 \\): the hazard ratio for the covariate is constant over follow-up time (PH holds)",
          test: "Scaled Schoenfeld residual test (correlation of residuals with time); significant \\( p \\) indicates PH violation and triggers addition of the interaction term",
          alpha: "\\( \\alpha = 0.05 \\)"
        },
        usageInPaper: "PH violations were found and corrected in two age-group models. In infants, cerebrovascular disease had a time-varying effect — its hazard ratio changed over the follow-up window, likely reflecting high early mortality in infants with neurological complications. In pediatric patients (1–17 yr), mechanical ventilation at registration had a time-varying effect, consistent with mechanical ventilation being a stronger short-term mortality predictor than a long-term one."
      },
      {
        name: "Diagnosis Adjudication",
        definition: "A rule-based classifier applied to UNOS registry records to resolve the subset of patients assigned both a CHD and a cardiomyopathy code. Because these codes are not mutually exclusive in UNOS, dual-coded patients must be assigned to one diagnostic group before stratum-specific models can be fit. Failure to resolve dual codes would contaminate both CHD and cardiomyopathy strata with misclassified patients, biasing within-stratum effect estimates.",
        setup: [
          "Identify all adult patients with both a CHD code and a cardiomyopathy code in UNOS (\\( n = 85 \\))",
          "Apply clinical hierarchy: patients coded as 'CHD with surgery' (\\( n = 38 \\)) are assigned to the CHD cohort, reflecting that a prior surgical history confirms structural congenital disease",
          "Remaining dual-coded patients assigned by primary listing diagnosis",
          "Document the decision rule to make it auditable and reproducible"
        ],
        hypothesisTesting: null,
        usageInPaper: "Of 85 adults with dual CHD and cardiomyopathy codes, 38 coded as 'CHD with surgery' were placed into the CHD cohort. This rule-based decision directly affects the composition of the adult CHD stratum (n = 594 total), which is already a small group. Misclassification in either direction would inflate or deflate the adult CHD null result — the adjudication algorithm makes the analytic choice transparent."
      }
    ],
    signals: [
      ["Infant CHD death/removal HR", 0.75],
      ["Child CHD death/removal HR", 0.61],
      ["Adult cardiomyopathy HR", 0.60],
      ["Adult CHD HR (no benefit)", 1.00]
    ],
    pitfalls: [
      ["Small adult CHD subgroup", "With only 594 adult CHD patients and few events, the null result may reflect insufficient power rather than a true absence of benefit — constrained models mitigate overfitting but cannot recover statistical power."],
      ["Policy interference in adolescents", "Adolescent candidates may fall under both pediatric and adult allocation systems simultaneously, making a clean before-after assignment impossible across the two washout windows."],
      ["Listwise deletion bias", "70 pediatric patients (1–17 yr) excluded due to missing covariate values — if missingness is related to illness severity, this exclusion could bias the pediatric cardiomyopathy estimate."]
    ],
    tags: ["UNOS", "Fine-Gray", "Kaplan-Meier", "CHD", "cardiomyopathy", "time-interaction", "non-proportional hazards", "washout period"]
  },

  {
    id: "va-liver-distance",
    short: "VA liver distance",
    title: "Association of Distance From a Transplant Center With Access to Liver Transplant Waitlisting, Receipt of Transplant, and Survival Among US Veterans",
    citation: "Goldberg et al. JAMA. 2014;311(12):1234-1243. doi:10.1001/jama.2014.2520",
    journal: "JAMA",
    year: "2014",
    source: "https://jamanetwork.com/journals/jama/fullarticle/1849992",
    takeaway: "Tripartite VHA–OPTN–Medicare linkage of >50,000 Veterans demonstrates a dose-dependent geographic disparity: Veterans living >100 miles from a VA Transplant Center have significantly lower SHRs for waitlisting and transplant, and higher mortality hazard.",
    sections: {
      Motivation: "The VHA operates a hub-and-spoke model with a small number of dedicated VA Transplant Centers (VATCs) nationwide. Centralization may improve surgical quality and outcomes, but it imposes travel burdens that could reduce referral and access for Veterans living far from a VATC. The study asks whether geographic distance creates measurable, dose-dependent disparities in waitlisting, transplantation, and survival.",
      Design: "Retrospective national cohort of >50,000 US Veterans receiving VHA care from 2003 to 2010 diagnosed with end-stage liver disease (cirrhosis, hepatic decompensation, or HCC). Tripartite data linkage: VHA Corporate Data Warehouse (CDW) and administrative data + OPTN/SRTR databases + Medicare claims (to capture VA-external transplants). Exclusions: prior liver transplant; missing zip code data needed for distance calculation. Primary exposure: distance from patient's home zip-code centroid to nearest VATC, categorized as ≤100, 101–200, 201–300, and >300 miles.",
      Methods: "Waitlisting: Fine-Gray competing risk regression (competing risk = pre-waitlist all-cause death). Transplantation: Fine-Gray models (competing risk = waitlist removal for deterioration or waitlist death). Overall survival: multivariable Cox regression. All models incorporate a shared frailty term to account for clustering of patients within 21 Veterans Integrated Service Networks (VISNs). Covariates include age, sex, race/ethnicity, liver disease etiology, Charlson Comorbidity Index, MELD approximations, and Census-linked neighborhood SES. Missing MELD components (bilirubin, INR, creatinine) handled with multiple imputation.",
      Results: "Significant, dose-dependent geographic disparity across all three outcomes. Compared to Veterans ≤100 miles from a VATC, those >100 miles away had significantly lower SHRs for waitlisting and receipt of transplant, and higher HR for all-cause mortality. Medicare linkage was critical: it captured Veterans transplanted at private hospitals outside the VA system, preventing their incorrect classification as censored observations in the competing risk models."
    },
    methods: [
      {
        name: "Fine-Gray Competing Risks",
        definition: "Applied twice in this paper for two distinct outcome pathways, each with a different competing event. Fine-Gray directly models the subdistribution hazard \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] so that cumulative incidence \\( F_1(t) \\) is estimated correctly rather than being inflated by treating competing events as uninformative censoring. The two applications differ in their focal and competing events.",
        setup: [
          "Waitlisting model — focal event: placement on OPTN liver transplant waitlist; competing event: all-cause death before waitlisting; time-zero: cohort entry (date of diagnosis or decompensation)",
          "Transplantation model — focal event: receipt of a liver transplant; competing event: waitlist removal for clinical deterioration or death on the waitlist; time-zero: date of waitlisting",
          "Distance exposure categorized as ≤ 100, 101–200, 201–300, and > 300 miles from home zip-code centroid to nearest VATC (reference: ≤ 100 miles)",
          "Secondary exposure: distance to nearest non-VA transplant center, tested as an effect modifier",
          "Covariates: age, sex, race/ethnicity, liver disease etiology (HCV, alcohol-related), Charlson Comorbidity Index, MELD score approximations, Census-linked neighborhood median income",
          "Shared frailty term included in each model to account for VISN-level clustering (see Shared Frailty method)"
        ],
        hypothesisTesting: {
          null: "SHR = 1 for each distance tier vs. reference (≤ 100 miles): distance category is not associated with the subdistribution hazard of waitlisting or transplantation",
          test: "Wald test on each distance-tier coefficient; Gray's test for unadjusted CIF comparisons across tiers",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Veterans > 100 miles from a VATC had significantly lower SHRs for both waitlisting and transplantation compared to those ≤ 100 miles. The dose-response pattern — with SHRs declining progressively across the 101–200, 201–300, and > 300 mile tiers — is the paper's primary evidence of a geographic access gradient. Medicare linkage ensures that transplants performed at non-VA centers are counted as events, not misclassified as censored observations."
      },
      {
        name: "Cox with Shared Frailty",
        definition: "For overall survival, a standard multivariable Cox model \\( h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\) is extended with a shared frailty term to account for the hierarchical data structure. Veterans are nested within 21 Veterans Integrated Service Networks (VISNs) — regional administrative units. Patients within the same VISN share unmeasured characteristics (regional transplant culture, referral practices, local physician behavior) that induce within-cluster correlation. Ignoring this correlation produces standard errors that are too small (overstated precision). A shared frailty model adds a random effect \\( u_k \\) for each VISN \\( k \\): \\[ h_{ik}(t \\mid \\mathbf{X}_i, u_k) = u_k \\cdot h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}_i} \\] where \\( u_k \\overset{\\text{iid}}{\\sim} \\text{Gamma}(1, \\theta) \\) captures between-VISN heterogeneity.",
        setup: [
          "Time-zero: cohort entry (date of diagnosis); event: all-cause mortality",
          "Frailty term: shared Gamma frailty at the VISN level (21 VISNs), estimated jointly with \\( \\boldsymbol{\\beta} \\)",
          "Covariates: age, sex, race/ethnicity, etiology, Charlson Comorbidity Index, MELD approximation, distance tier, neighborhood SES",
          "The variance parameter \\( \\theta \\) of the frailty distribution is reported; \\( \\theta \\approx 0 \\) indicates negligible VISN-level clustering",
          "PH assumption verified via scaled Schoenfeld residuals"
        ],
        hypothesisTesting: {
          null: "HR = 1 for each distance tier vs. ≤ 100 miles: distance is not associated with all-cause mortality after adjusting for case mix and VISN frailty",
          test: "Wald test on distance-tier coefficients; likelihood ratio test for frailty variance \\( H_0: \\theta = 0 \\) (tests whether clustering correction is needed)",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Veterans >100 miles from a VATC had significantly higher all-cause mortality HRs vs. the ≤100-mile reference group. The shared frailty term corrects SEs for the fact that patients within the same VISN share referral environments — without this correction, the geographic effect would appear more precisely estimated than warranted, inflating the risk of false positives."
      },
      {
        name: "Multiple Imputation",
        definition: "A principled missing-data technique used here specifically for the laboratory values needed to compute MELD scores (bilirubin, INR, creatinine). MELD — the Model for End-Stage Liver Disease — is a composite severity score used to prioritize liver transplant candidates: \\[ \\text{MELD} = 3.78 \\ln(\\text{bilirubin}) + 11.2 \\ln(\\text{INR}) + 9.57 \\ln(\\text{creatinine}) + 6.43 \\] Each missing component is replaced with \\( M \\) draws from its posterior predictive distribution given the observed data; the \\( M \\) completed datasets are analyzed separately and results pooled via Rubin's rules.",
        setup: [
          "Identify patients with any missing MELD component (bilirubin, INR, or creatinine) in VHA administrative records",
          "Specify imputation model conditioning on age, sex, race/ethnicity, liver disease etiology, comorbidities, and observed lab values",
          "Generate \\( M \\geq 5 \\) imputed datasets; compute MELD approximation in each",
          "Pool competing risk and Cox model estimates across imputed datasets using Rubin's rules: \\( \\bar{\\theta} = M^{-1}\\sum_m \\hat{\\theta}_m \\)",
          "Compare pooled estimates to complete-case analysis as a sensitivity check"
        ],
        hypothesisTesting: null,
        usageInPaper: "MELD is the primary severity adjustment variable in all three outcome models. Without imputation, patients missing any lab value would be dropped (complete-case analysis), and because missingness is correlated with illness severity and rurality, this would systematically bias the estimated distance-outcome associations. Imputation retains the full cohort and removes this selection bias."
      },
      {
        name: "Tripartite Data Linkage",
        definition: "A data assembly strategy that joins three independent administrative sources — VHA records, OPTN/SRTR, and Medicare claims — to construct a complete longitudinal picture of each Veteran's transplant pathway. Each source alone would produce biased estimates: VHA data alone cannot capture transplants performed at private hospitals; OPTN data alone cannot define the at-risk denominator of eligible Veterans; Medicare alone misses VA-internal care. The linkage is the study's most important design feature for eliminating a specific competing-event misclassification: Veterans who live far from a VATC but get transplanted at a non-VA hospital using Medicare would otherwise appear as censored non-events.",
        setup: [
          "Source 1: VHA CDW — patient demographics, diagnoses (ICD-9), lab values, care dates, zip codes",
          "Source 2: OPTN/SRTR — waitlist placements, transplant dates, organ characteristics",
          "Source 3: Medicare claims — transplants and deaths occurring outside the VA system",
          "Geographic exposure: straight-line (Euclidean) distance between centroid of patient's home zip code and zip code of nearest VATC",
          "Secondary exposure: distance to nearest non-VA liver transplant center (effect modifier test)",
          "Neighborhood SES: Census data linked by patient zip code — median household income as confounder"
        ],
        hypothesisTesting: null,
        usageInPaper: "Medicare linkage is what allows the competing-risk models to be correctly specified: a Veteran living 400 miles from a VATC who receives a transplant at a private academic center is recorded as a transplant event rather than as censored. Without Medicare, the distant-Veteran group would have artificially lower transplant rates not because of access barriers but because of data truncation — a classic informative-censoring problem."
      }
    ],
    signals: [
      ["Waitlisting SHR (>100 mi vs ≤100 mi)", 0.82],
      ["Transplant SHR (>100 mi vs ≤100 mi)", 0.79],
      ["Mortality HR (>100 mi vs ≤100 mi)", 1.15],
      ["Frailty variance θ (VISN clustering)", 0.09]
    ],
    pitfalls: [
      ["Straight-line distance bias", "Euclidean zip-centroid distances underestimate actual travel burden for Veterans in mountainous or rural areas with limited road infrastructure."],
      ["MELD approximation error", "Administrative lab values used to compute MELD may differ from clinical measurements; imputed values carry additional uncertainty that propagates into severity adjustment."],
      ["VISN frailty coarseness", "21 VISNs are large administrative units — clustering at this level may not capture finer-grained within-VISN variation in transplant referral culture across individual VA medical centers."]
    ],
    tags: ["VA", "VHA–OPTN–Medicare linkage", "Fine-Gray", "Cox", "shared frailty", "VISN clustering", "multiple imputation", "MELD", "distance tiers"]
  },

  {
    id: "ldkt-disparities",
    short: "LDKT disparities",
    title: "Association of Race and Ethnicity With Live Donor Kidney Transplantation in the United States From 1995 to 2014",
    citation: "Purnell et al. JAMA. 2018;319(1):49-61. doi:10.1001/jama.2017.19152",
    journal: "JAMA",
    year: "2018",
    source: "https://jamanetwork.com/journals/jama/fullarticle/2667722",
    takeaway: "OPTN/SRTR cohort of >453,000 adults on the deceased-donor waitlist shows that LDKT disparities did not narrow over 20 years — they widened significantly, with Black candidates' adjusted SHR falling from 0.45 (1995–1999) to 0.27 (2010–2014) relative to White candidates.",
    sections: {
      Motivation: "National equity programs and policy changes over two decades aimed to reduce racial disparities in live-donor kidney transplantation (LDKT). By anchoring the cohort strictly to patients already on the waitlist, the design inherently controls for pre-waitlist referral barriers — isolating disparities at the point of actually receiving an LDKT from a living donor.",
      Design: ">453,000 adult (≥18 yr) first-time deceased-donor waitlist additions from OPTN/SRTR. Race/ethnicity categorized as four mutually exclusive groups: non-Hispanic White (reference), non-Hispanic Black, Hispanic, and Asian. Temporal exposure: era of waitlisting, divided into four 5-year periods — 1995–1999, 2000–2004, 2005–2009, and 2010–2014.",
      Methods: "Primary model: Fine-Gray subdistribution hazard regression for adjusted SHRs of LDKT, with deceased-donor transplant (DDKT) and death as competing events. Base model: multivariable Cox proportional hazards. Formal disparity trend test: race/ethnicity × time period interaction terms. Covariates: age, sex, primary cause of ESKD, blood type, PRA level, and initial insurance type (Medicare, Medicaid, private).",
      Results: "Interaction terms highly significant (p < .001): disparities widened, not narrowed. LDKT cumulative incidence rose for White candidates but fell or stagnated for Black, Hispanic, and Asian candidates across eras. Adjusted SHR for Black candidates: 0.45 (1995–99) → 0.27 (2010–14). The widening is not an artifact of differential DDKT rates or mortality — it persists after accounting for both competing events."
    },
    methods: [
      {
        name: "Fine-Gray Competing Risks",
        definition: "The primary inferential model of this paper. Fine-Gray subdistribution hazard regression \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] estimates adjusted subhazard ratios (aSHRs) for receiving LDKT in the presence of two competing events that mathematically preclude LDKT. Using standard Cox or Kaplan-Meier without accounting for these events would overestimate the probability of LDKT — particularly if competing-event rates differ by race, which they do. Fine-Gray models \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = \\text{LDKT}) \\) directly, producing unbiased cumulative incidence estimates.",
        setup: [
          "Focal event: receipt of live-donor kidney transplant (LDKT)",
          "Competing event 1: receipt of deceased-donor kidney transplant (DDKT) — precludes LDKT from the same waitlist episode",
          "Competing event 2: death on the waiting list prior to any transplant",
          "Fit separate Fine-Gray models within each of the four 5-year listing periods",
          "Covariates: age, sex, primary cause of ESKD, ABO blood type, PRA level, initial insurance type (Medicare, Medicaid, private)",
          "Reference group: non-Hispanic White; report aSHRs with 95% CIs for Black, Hispanic, and Asian vs. White"
        ],
        hypothesisTesting: {
          null: "aSHR = 1 within each period: race/ethnicity is not associated with the subdistribution hazard of LDKT after adjusting for clinical covariates and competing events",
          test: "Wald test on each race/ethnicity coefficient; Gray's test for unadjusted CIF comparisons by race within each era",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Black aSHR falls from 0.45 (1995–99) to 0.27 (2010–14); Hispanic aSHR from 0.83 to 0.52; Asian aSHR reaches 0.42 by 2010–14. The Fine-Gray framework is critical here: if DDKT rates increased more for minority candidates over time, standard Cox would underestimate LDKT disparities (competing events reduce the apparent time at risk). The aSHRs confirm the disparity is real and worsening, not a competing-event artifact."
      },
      {
        name: "Cox Proportional Hazards",
        definition: "The base survival model used alongside Fine-Gray for robustness checking and temporal trend characterization. The Cox model \\[ h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\] estimates hazard ratios (HRs) for LDKT by race/ethnicity without formally accounting for competing events. It is compared against the Fine-Gray aSHRs: if HR and aSHR estimates track each other closely across eras, competing-event bias is not driving the disparity findings. Divergence would indicate that differential DDKT or death rates between groups are materially distorting the Cox estimates.",
        setup: [
          "Fit separate Cox models within each 5-year listing period",
          "Follow-up capped at 2 years from listing date within each period",
          "Same covariates as Fine-Gray models: age, sex, ESKD etiology, ABO, PRA, insurance type",
          "Report period-specific \\( e^{\\hat{\\beta}_{\\text{race}}} \\) (HR) vs. White with 95% CIs",
          "Also fit a single pooled Cox model across all periods for the interaction term analysis (see Race × Era Interaction method)"
        ],
        hypothesisTesting: {
          null: "HR = 1 within each period: race/ethnicity not associated with time to LDKT",
          test: "Wald test on race coefficients per period; Cox and Fine-Gray HRs compared to assess competing-event bias",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "Cox HRs broadly parallel the Fine-Gray aSHRs across all four eras, confirming that competing-event rates are not generating a spurious disparity signal. The agreement between the two models strengthens the conclusion that the widening gap reflects genuine reductions in LDKT access for minority candidates rather than changes in DDKT receipt or mortality."
      },
      {
        name: "Race × Era Interaction Terms",
        definition: "A formal statistical test of whether racial/ethnic disparities in LDKT changed over time — as opposed to merely observing different point estimates across independently-fit era models. A pooled model includes main effects for race/ethnicity and era, plus race × era product terms: \\[ \\log h(t) = \\log h_0(t) + \\boldsymbol{\\beta}_{\\text{race}}^\\top \\mathbf{R} + \\boldsymbol{\\gamma}_{\\text{era}}^\\top \\mathbf{E} + \\boldsymbol{\\delta}^\\top (\\mathbf{R} \\otimes \\mathbf{E}) \\] A significant joint test of \\( \\boldsymbol{\\delta} = \\mathbf{0} \\) formally proves the disparity magnitude changed. Specific interaction terms (e.g., Black × 2010–2014) quantify exactly how much the aSHR shifted relative to the 1995–1999 baseline.",
        setup: [
          "Fit a single pooled model (Cox and/or Fine-Gray) across all four eras and all racial/ethnic groups",
          "Include race × era product terms (\\( \\mathbf{R} \\otimes \\mathbf{E} \\)) — one per race/era combination, with 1995–1999 as the reference era",
          "Joint \\( \\chi^2 \\) test for the full interaction block \\( H_0: \\boldsymbol{\\delta} = \\mathbf{0} \\)",
          "Individual terms (e.g., Black × 2010–2014) show the era-specific shift; a negative \\( \\hat{\\delta} \\) means the disparity worsened relative to baseline"
        ],
        hypothesisTesting: {
          null: "\\( \\boldsymbol{\\delta} = \\mathbf{0} \\): racial/ethnic disparities in LDKT are constant across all listing eras (no widening or narrowing)",
          test: "Joint \\( \\chi^2 \\) test on the race × era interaction block; individual Wald tests on specific terms (e.g., Black × 2010–2014 era)",
          alpha: "\\( p < .05 \\) for joint test; results highly significant at \\( p < .001 \\)"
        },
        usageInPaper: "Interaction terms significant at p < .001 for Black and Hispanic candidates, formally proving disparities widened over the 20-year study period rather than merely persisting at a constant level. The Black × 2010–2014 interaction term is particularly large and negative, reflecting the aSHR decline from 0.45 to 0.27 — a 40% relative worsening. This result is the paper's central claim: not just that disparities exist, but that the gap structurally grew despite national equity initiatives."
      },
      {
        name: "Incremental Mediation Analysis",
        definition: "A sequential covariate-addition strategy that adds prespecified blocks of potential mediators or confounders to decompose how much of the racial/ethnic disparity in LDKT each factor 'explains.' Attenuation of the race aSHR after adding a block is interpreted as that block accounting for a portion of the disparity mechanism. This is not a formal causal mediation analysis — it does not require counterfactual identification assumptions — but it provides a practical, interpretable decomposition of the observed gap.",
        setup: [
          "Model 1 (base): race/ethnicity + clinical characteristics (age, sex, ESKD etiology, ABO, PRA)",
          "Model 2: add insurance type (Medicare, Medicaid, private) — a SES and access proxy",
          "Model 3: add transplant-center characteristics (LDKT volume, center LDKT rate)",
          "Compute attenuation per block: \\( \\Delta\\hat{\\beta} = (\\hat{\\beta}_{\\text{base}} - \\hat{\\beta}_{\\text{full}}) / \\hat{\\beta}_{\\text{base}} \\)",
          "Interpret large attenuation as evidence the block mediates or confounds the racial gap"
        ],
        hypothesisTesting: null,
        usageInPaper: "Insurance type and transplant-center factors each attenuate Black and Hispanic aSHRs modestly, but substantial residual disparities remain even in the fully-adjusted model. This indicates that socioeconomic access and center-level practice patterns explain part — but not most — of the racial gap in LDKT. The large residual points to unmeasured structural barriers such as living donor availability, cultural attitudes toward donation, and differential engagement from transplant coordinators."
      }
    ],
    signals: [
      ["Black aSHR 1995–1999", 0.45],
      ["Black aSHR 2010–2014", 0.27],
      ["Hispanic aSHR 1995–1999", 0.83],
      ["Hispanic aSHR 2010–2014", 0.52],
      ["Asian aSHR 2010–2014", 0.42]
    ],
    pitfalls: [
      ["Race as a social proxy", "OPTN/SRTR race/ethnicity fields are center-recorded administrative categories that proxy complex social, structural, and historical processes — they must not be interpreted as biological causes of differential LDKT access."],
      ["Mediator overcontrol", "Adding insurance type or center characteristics as 'confounders' may block causal pathways; if insurance is itself a mechanism linking race to LDKT access, adjusting for it underestimates the total disparity."],
      ["Pre-waitlist selection", "Anchoring the cohort to waitlisted patients controls for referral barriers but introduces a selection effect — patients who never reached the waitlist (disproportionately minority candidates) are excluded from the disparity estimate entirely."]
    ],
    tags: ["OPTN", "SRTR", "Fine-Gray", "Cox", "race × era interaction", "competing risks", "LDKT", "DDKT", "equity"]
  },

  {
    id: "living-donor-outcomes",
    short: "Donor outcomes",
    title: "Racial Variation in Medical Outcomes among Living Kidney Donors",
    citation: "Lentine et al. New England Journal of Medicine. 2010;363:724-732. doi:10.1056/NEJMoa1000950",
    journal: "NEJM",
    year: "2010",
    source: "https://www.nejm.org/doi/full/10.1056/NEJMoa1000950",
    takeaway: "Linking OPTN/SRTR living donor records to CMS administrative data, this study shows that Black and Hispanic living kidney donors face substantially higher post-donation risk of ESRD, hypertension, and diabetes than White donors — a gap that persists within a cohort uniformly screened to excellent baseline health.",
    sections: {
      Motivation: "Transplant registries (SRTR) track donors at donation but rarely follow them longitudinally; centers are not required to report post-donation medical events. Administrative claims — particularly Medicare ESRD entitlement, which captures all new ESRD regardless of insurance type — provide objective, externally validated endpoints that bypass SRTR's surveillance gap. The study design inherently controls for the 'healthy donor' effect by comparing donors to other donors, all of whom passed rigorous pre-donation medical screening.",
      Design: "Retrospective national cohort study. OPTN/SRTR living donor records linked to CMS administrative data to capture long-term post-donation outcomes. Population: healthy adults who underwent living donor nephrectomy in the US. Time zero (\\( T_0 \\)) = exact date of nephrectomy; follow-up continued until the outcome of interest, death, or end of the observation period.",
      Methods: "Unadjusted long-term cumulative incidence estimated with Kaplan-Meier; log-rank test for racial group comparisons. Adjusted Hazard Ratios (aHRs) from multivariable Cox proportional hazards models. Covariates: age at donation, sex, BMI, pre-donation eGFR, baseline blood pressure, and biological relationship to recipient. For non-mortality outcomes (ESRD), Fine-Gray competing risk models formally account for death as a competing event. Missing registry covariates handled with multiple imputation or categorical missingness indicators.",
      Results: "Black living donors face substantially higher post-donation risk than White donors across all outcomes — ESRD, hypertension, drug-treated diabetes, and CKD — despite identical baseline screening. The persistent gap within this optimally healthy, uniformly screened cohort rules out pre-existing disease as the explanation and instead implicates structural post-donation risk differences."
    },
    methods: [
      {
        name: "Kaplan-Meier (Unadjusted)",
        definition: "The product-limit estimator for unadjusted cumulative incidence of an outcome over time. For an ordered sequence of event times \\( t_1 < t_2 < \\cdots < t_k \\), the survivor function is: \\[ \\hat{S}(t) = \\prod_{t_i \\leq t} \\left(1 - \\frac{d_i}{n_i}\\right) \\] where \\( d_i \\) is the number of events and \\( n_i \\) is the number at risk. KM makes no covariate adjustment — race/ethnicity differences in curves reflect raw disparity including any imbalance in age, sex, or clinical factors. Because all donors passed screening, even unadjusted separation between racial groups is striking: it cannot be attributed to pre-existing disease at baseline.",
        setup: [
          "Time zero \\( T_0 \\): date of living donor nephrectomy",
          "Right censoring: death from other causes OR end of study observation period",
          "Stratify curves by donor race/ethnicity (non-Hispanic White, non-Hispanic Black, Hispanic)",
          "Log-rank test for equality of survival/cumulative incidence curves across racial groups",
          "95% confidence bands via Greenwood's formula"
        ],
        hypothesisTesting: {
          null: "\\( S_{\\text{Black}}(t) = S_{\\text{White}}(t) \\) for all \\( t \\): no difference in unadjusted cumulative incidence between racial groups",
          test: "Log-rank test (score test in unweighted Cox); single global \\( p \\)-value summarizing separation across the follow-up period",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "KM curves provide the unadjusted view of racial disparities in ESRD-free and comorbidity-free survival. They establish that the raw disparity is real before Cox models introduce covariate adjustment. The multivariable models then ask how much of the separation persists after equating groups on age, sex, BMI, eGFR, blood pressure, and donor-recipient relationship."
      },
      {
        name: "Multivariable Cox Proportional Hazards",
        definition: "The primary adjusted model for estimating race-specific hazard ratios after accounting for baseline clinical differences. The Cox model \\[ h(t \\mid \\mathbf{X}) = h_0(t)\\,e^{\\boldsymbol{\\beta}^\\top \\mathbf{X}} \\] leaves the baseline hazard \\( h_0(t) \\) unspecified (semiparametric) and estimates covariate effects via partial likelihood. The model answers: after equating groups on age, sex, BMI, kidney function, blood pressure, and donor-recipient relationship, do racial disparities in post-donation outcomes persist?",
        setup: [
          "Primary exposure: donor race/ethnicity (reference = non-Hispanic White)",
          "Demographics: age at donation, sex",
          "Clinical metrics: baseline BMI, pre-donation eGFR, baseline systolic and diastolic blood pressure",
          "Transplant-specific covariate: biological relationship to recipient (first-degree relative vs. unrelated) — donating to a relative with kidney failure implies shared genetic or environmental renal disease risk",
          "Missing BMI/eGFR/BP handled by multiple imputation or categorical missing indicator to preserve sample size",
          "Proportional hazards assumption verified via scaled Schoenfeld residuals"
        ],
        hypothesisTesting: {
          null: "aHR = 1: race/ethnicity is not associated with hazard of the post-donation outcome after adjusting for clinical covariates",
          test: "Wald test on each race coefficient; global \\( F \\)-test for joint significance of all race terms",
          alpha: "\\( \\alpha = 0.05 \\), two-sided"
        },
        usageInPaper: "The aHRs reveal that racial disparities in hypertension, diabetes, and CKD persist after full clinical adjustment. The donor-recipient biological relationship covariate is critical: a Black donor donating to a Black relative who developed ESRD from hypertensive nephrosclerosis carries shared familial renal risk that would otherwise inflate the apparent racial gap. Including this covariate produces a more conservative — and more credible — estimate of structural disparity."
      },
      {
        name: "Fine-Gray Competing Risks (ESRD)",
        definition: "For non-mortality outcomes such as ESRD, death from any other cause is a competing event that mathematically precludes the focal outcome. Standard Cox and Kaplan-Meier treat death as uninformative censoring, which inflates the apparent cumulative incidence of ESRD when mortality rates differ by race. Fine-Gray directly models the subdistribution hazard: \\[ h^*(t) = -\\frac{d}{dt}\\log\\bigl[1 - F_1(t)\\bigr] \\] producing an unbiased cumulative incidence function \\( F_1(t) = P(T \\leq t,\\,\\varepsilon = \\text{ESRD}) \\) even in the presence of competing mortality.",
        setup: [
          "Focal event: ESRD onset (captured via Medicare ESRD entitlement — an administrative trigger requiring no self-report or center follow-up)",
          "Competing event: death from causes other than ESRD",
          "Fine-Gray models fit with race/ethnicity as primary exposure and same clinical covariates as Cox models",
          "Subdistribution hazard ratios (aSHRs) compared to Cox aHRs as a sensitivity check for competing-event bias"
        ],
        hypothesisTesting: {
          null: "aSHR = 1: race/ethnicity not associated with subdistribution hazard of ESRD after adjusting for covariates and competing mortality",
          test: "Wald test on race aSHR coefficients in the Fine-Gray model",
          alpha: "\\( \\alpha = 0.05 \\)"
        },
        usageInPaper: "ESRD is rare overall but more common in Black donors. Because Black donors also carry higher mortality risk, standard Cox censoring at death would remove Black donors from the risk set early — deflating their apparent ESRD cumulative incidence. Fine-Gray retains competing-event subjects in the extended risk set, yielding a higher and more accurate ESRD risk estimate for Black donors. Agreement between Cox aHR and Fine-Gray aSHR confirms that competing-event bias is not the primary driver of the overall disparity."
      },
      {
        name: "Registry-to-Claims Linkage",
        definition: "A data integration method that joins two administrative sources using shared identifiers to create longitudinal outcome data unavailable in either source alone. OPTN/SRTR tracks donors at donation (demographics, clinical metrics, donor-recipient pair characteristics) but has limited long-term follow-up for post-donation medical events. CMS administrative data — particularly Medicare ESRD entitlement records — provide objective, externally validated outcomes reported by dialysis facilities directly to CMS, bypassing any reliance on transplant-center follow-up reporting.",
        setup: [
          "Source 1: OPTN/SRTR donor records — donation date, demographics, eGFR, BMI, blood pressure, donor-recipient relationship",
          "Source 2: CMS administrative data (Medicare claims, ESRD entitlement records)",
          "Deterministic or probabilistic linkage using personal identifiers (name, date of birth, SSN fragment) with manual adjudication of uncertain pairs",
          "Medicare ESRD entitlement: automatically triggered when a patient initiates chronic dialysis or receives a kidney transplant — no self-report or center-based reporting required",
          "Missing baseline covariates: multiple imputation for SRTR fields (BMI, eGFR, BP) to avoid complete-case exclusions"
        ],
        hypothesisTesting: null,
        usageInPaper: "The registry-to-claims linkage is the methodological backbone enabling this study. Without CMS linkage, SRTR's poor long-term reporting would cause massive, potentially race-differential loss-to-follow-up: Black donors who do not return to their transplant center for post-donation checkups would be systematically undercounted. Medicare ESRD entitlement eliminates this surveillance bias — every patient who initiates dialysis triggers a CMS record regardless of transplant-center contact. The 'healthy donor' design — comparing Black donors to White donors rather than to the general population — ensures residual disparities reflect structural post-donation risks, not pre-existing disease."
      }
    ],
    signals: [
      ["Black hypertension aHR", 1.52],
      ["Black drug-treated diabetes aHR", 2.31],
      ["Black CKD aHR", 2.32],
      ["5-yr ESRD prevalence, Black donors (%)", 0.90]
    ],
    pitfalls: [
      ["Competing-event bias if ignored", "Standard KM and Cox treat death as uninformative censoring for ESRD; if Black donors have higher mortality, censoring them early deflates their apparent ESRD cumulative incidence — Fine-Gray competing risk models correct this by retaining deceased subjects in the extended risk set."],
      ["Donor-recipient shared familial risk", "Black donors giving to Black relatives with ESRD from hypertensive nephrosclerosis carry family-level renal risk; omitting the donor-recipient biological relationship covariate conflates structural racial disparities with heritable kidney disease risk."],
      ["Surveillance bias in registry-only analyses", "Transplant centers report post-donation outcomes inconsistently to SRTR; registry-only analyses systematically miss late events disproportionately for donors with less follow-up contact. CMS ESRD entitlement is an administrative trigger that bypasses center reporting entirely."],
      ["Healthy donor selection floor", "All donors cleared rigorous medical screening — the cohort's health floor means observed post-donation disparities are likely underestimates of the true disparity in the general Black population, where many high-risk individuals were excluded at evaluation."]
    ],
    tags: ["OPTN", "SRTR", "CMS linkage", "Kaplan-Meier", "Cox", "Fine-Gray", "ESRD", "competing risks", "healthy donor effect", "surveillance bias"]
  }
];

// ─── State ────────────────────────────────────────────────────────────────────

let selectedPaper = papers[0];
let selectedMethod = 0;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const els = {
  paperTabs:     document.getElementById("paperTabs"),
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
  return papers;
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
