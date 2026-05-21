const papers = [
  {
    id: "adult-heart-policy",
    short: "Adult heart policy",
    title: "Evolving Trends in Adult Heart Transplant With the 2018 Heart Allocation Policy Change",
    citation: "Kilic et al. JAMA Cardiology. 2021;6(2):159-167. doi:10.1001/jamacardio.2020.4909",
    journal: "JAMA Cardiology",
    year: "2021",
    source: "https://doi.org/10.1001/jamacardio.2020.4909",
    filename: "jama_cardiology_allocation_change.pdf",
    takeaway: "A national UNOS registry cohort treats the 2018 adult heart allocation revision as a policy-era exposure, showing improved waitlist outcomes but worse risk-adjusted posttransplant survival.",
    sections: {
      Motivation: "The 2018 adult heart allocation system expanded urgency tiers and shifted priority toward temporary mechanical circulatory support. The study asks whether the new rules changed patient selection, waitlist outcomes, donor selection, and posttransplant survival.",
      Design: "Retrospective national cohort of adult heart transplants in the UNOS registry. Patients were split into prepolicy and postpolicy eras, with follow-up through March 31, 2020 and multiorgan transplants excluded.",
      Methods: "The analytic core separates waitlist outcomes from posttransplant outcomes. Waitlisted prepolicy patients still waiting at the policy date were censored to reduce exposure contamination. Waitlist death/deterioration, transplant, and recovery were analyzed as competing outcomes. Posttransplant survival used Kaplan-Meier curves and multivariable Cox proportional hazards models, with multiple imputation for missing data and exclusion of variables with more than 10 percent missingness.",
      Results: "Postpolicy listing was associated with lower waitlist mortality/deterioration, higher transplant likelihood, and lower recovery removals. Bridging shifted toward temporary mechanical support and away from durable LVADs. One-year posttransplant survival was lower after policy change, even after adjustment."
    },
    methods: [
      {
        name: "Policy-era exposure",
        text: "Defines exposure by listing/transplant date relative to the October 18, 2018 policy change. This makes the paper a before-after policy evaluation rather than a randomized comparison.",
        bullets: ["Exclude multiorgan transplants", "Separate waitlist and transplant cohorts", "Drop transplant-after-change cases listed before change for transplant-outcome analysis"]
      },
      {
        name: "Competing risks",
        text: "Waitlist outcomes are mutually exclusive: death/deterioration, transplant, or recovery. Fine-Gray subhazard models estimate how policy era changes the cumulative incidence of each outcome.",
        bullets: ["Avoids treating transplant as ordinary noninformative censoring", "Reports subhazard ratios", "Uses cumulative incidence curves"]
      },
      {
        name: "Survival modeling",
        text: "Posttransplant survival is estimated with Kaplan-Meier curves, log-rank tests, and multivariable Cox models. Candidate covariates come from biological plausibility and univariate associations.",
        bullets: ["Assesses posttransplant risk separately from waitlist benefit", "Handles missing data with multiple imputation", "Checks collinearity"]
      },
      {
        name: "Sensitivity check",
        text: "The authors repeat analyses including patients listed before the policy but transplanted after it to see whether the excluded crossover group drives the survival result.",
        bullets: ["Guards against transition-period artifacts", "Still finds lower one-year survival in the newer era"]
      }
    ],
    signals: [
      ["Waitlist death/deterioration SHR", 0.60],
      ["Transplant SHR", 1.38],
      ["Recovery removal SHR", 0.54],
      ["Posttransplant mortality HR", 1.29]
    ],
    pitfalls: [
      ["Era confounding", "Secular improvements, center behavior, and donor selection may change at the same time as the policy."],
      ["Transition contamination", "Patients listed before but transplanted after a policy change can blur exposure timing."],
      ["Mechanism ambiguity", "Temporary mechanical support use may be both a mediator of policy and a marker of illness severity."]
    ],
    tags: ["UNOS", "policy change", "Fine-Gray", "Cox", "multiple imputation"]
  },
  {
    id: "pediatric-adult-heart",
    short: "Peds/adult heart",
    title: "Impact of Heart Transplant Allocation Changes on Waitlist Mortality and Clinical Practice in Pediatric and Adult Patients With Congenital Heart Disease and Cardiomyopathy",
    citation: "Wooster et al. Circulation. 2025;151:814-824. doi:10.1161/CIRCULATIONAHA.124.072335",
    journal: "Circulation",
    year: "2025",
    source: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.124.072335",
    filename: "circ_allocation_change.pdf",
    takeaway: "The same allocation-policy logic is applied across pediatric and adult subgroups, revealing heterogeneous effects that broad adult-only averages can miss.",
    sections: {
      Motivation: "Prior work evaluated heart allocation changes overall, but less was known about congenital heart disease and cardiomyopathy subgroups, especially across pediatric and adult systems with different support options.",
      Design: "Retrospective UNOS cohort of pediatric patients younger than 18 and adults aged 18 to 50 listed for heart transplantation with congenital heart disease or cardiomyopathy diagnoses.",
      Methods: "The study classifies diagnosis groups, resolves dual diagnosis codes, excludes multiorgan transplants, and creates separate pre/post eras for pediatric and adult allocation changes. It compares baseline characteristics and waitlist outcomes, then models death or removal for deterioration with Fine-Gray competing risk survival methods while treating transplant as a competing event.",
      Results: "Allocation changes were associated with lower death/removal among infants with congenital heart disease, children with congenital heart disease, and adults with cardiomyopathy. Benefits were not uniform for children with cardiomyopathy or adults with congenital heart disease."
    },
    methods: [
      {
        name: "Subgroup design",
        text: "Cohorts are split by age system and diagnosis group, then modeled separately for infants, children, and adults to avoid averaging away clinically meaningful heterogeneity.",
        bullets: ["Pediatric: before 2016 change versus after", "Adult: before 2018 change versus after", "Adolescents explored across three eras"]
      },
      {
        name: "Diagnosis adjudication",
        text: "Patients with both congenital heart disease and cardiomyopathy codes are classified using rule-based clinical logic; sensitivity analysis drops dual-coded patients.",
        bullets: ["Directly addresses registry misclassification", "Makes the codebook decision auditable"]
      },
      {
        name: "Competing-risk survival",
        text: "Death on waitlist or within 60 days of removal is the focal event; transplant is a competing event and surviving withdrawals are censored after 60 days.",
        bullets: ["Fine-Gray subdistribution models", "Censor pre-era patients still listed at policy date", "Evaluate proportional hazards and add time interactions when needed"]
      },
      {
        name: "Missingness and scale",
        text: "The models use frequent-category imputation and a stepwise reduction strategy for smaller adult congenital and pediatric cardiomyopathy samples.",
        bullets: ["Separate infant models because functional status and eGFR are unavailable", "SAS 9.4 implementation"]
      }
    ],
    signals: [
      ["Infant CHD death/removal HR", 0.75],
      ["Child CHD death/removal HR", 0.61],
      ["Adult cardiomyopathy HR", 0.60],
      ["Adult CHD significant benefit", 1.00]
    ],
    pitfalls: [
      ["Misclassification", "Registry diagnosis codes can blend congenital lesions with secondary valve disease."],
      ["Policy interference", "Adult and pediatric allocation systems may affect adolescent candidates simultaneously."],
      ["Unobserved severity", "Registry data omit granular hemodynamics, device timing, and center practice."]
    ],
    tags: ["UNOS", "subgroups", "competing risk", "classification", "policy heterogeneity"]
  },
  {
    id: "va-liver-distance",
    short: "VA liver distance",
    title: "Association of Distance From a Transplant Center With Access to Waitlist Placement, Receipt of Liver Transplantation, and Survival Among US Veterans",
    citation: "Goldberg et al. JAMA. 2014;311(12):1234-1243. doi:10.1001/jama.2014.2520",
    journal: "JAMA",
    year: "2014",
    source: "https://jamanetwork.com/journals/jama/fullarticle/1849992",
    filename: "jama_liver_transplant_va.pdf",
    takeaway: "This paper turns geographic distance into an access-to-care exposure and links VA electronic records with OPTN waitlist data to study centralization tradeoffs.",
    sections: {
      Motivation: "Centralized specialty care may improve quality and efficiency, but extra travel can reduce access. Liver transplantation in the VA provides a national setting to test whether distance from VA transplant centers affects waitlisting, transplantation, and survival.",
      Design: "Retrospective study of VA patients meeting minimal liver-transplant eligibility criteria from 2003 to 2010, linked to OPTN waitlist data and followed for waitlisting, transplant, and mortality outcomes.",
      Methods: "The cohort is built with validated ICD-9 algorithms for decompensated cirrhosis or hepatocellular carcinoma, exclusions for age and contraindicating malignancies, and an active VA-care requirement. Distance from the patient’s VA hospital to a VA transplant center is modeled continuously on a log2 scale, with categorical post hoc distance bands. Waitlisting uses logistic GEE models with robust standard errors clustered by VA hospital. Transplantation uses competing-risk Cox models, and survival uses Cox regression from first hepatic decompensation.",
      Results: "Greater distance from a VA transplant center was associated with lower odds of waitlisting at a VA center or any transplant center, lower transplantation rates, and higher mortality among waitlisted veterans."
    },
    methods: [
      {
        name: "Eligibility algorithm",
        text: "Starts with VA users who meet transplant-relevant diagnosis criteria, then excludes obvious ineligible groups and requires enough outpatient engagement to make referral possible.",
        bullets: ["Validated ICD-9 coding algorithm", "Incident decompensation or hepatocellular carcinoma", "At least two outpatient visits after eligibility event"]
      },
      {
        name: "Geographic exposure",
        text: "Distance is measured from the routine VA hospital to the closest VA transplant center because patient home addresses were unavailable.",
        bullets: ["Continuous log2 distance captures effect per doubling", "Categorical bands are explicitly post hoc", "Distance measurement validated in one center subgroup"]
      },
      {
        name: "Access models",
        text: "Waitlisting is modeled as a binary outcome using GEE logistic regression, exchangeable correlation, and robust variance for clustering within VA hospitals.",
        bullets: ["Adjusted for age and hospital-level liver-population characteristics", "Secondary model asks whether non-VA transplant access mitigates distance"]
      },
      {
        name: "Outcome models",
        text: "Among waitlisted veterans, transplant is analyzed with death as a competing risk. Survival starts at first hepatic decompensation to account for delays before waitlisting.",
        bullets: ["Adjusted for MELD, albumin, diagnosis, HCC status, insurance, poverty", "Schoenfeld residuals test proportional hazards"]
      }
    ],
    signals: [
      ["VATC waitlisting OR per doubling", 0.91],
      ["Any-center waitlisting OR", 0.94],
      ["Transplant SHR", 0.97],
      ["Mortality HR", 1.03]
    ],
    pitfalls: [
      ["Ecological distance", "Hospital-level distance can mismeasure patient travel burden."],
      ["Unmeasured contraindications", "Claims/code algorithms cannot capture all clinical and psychosocial transplant barriers."],
      ["Post hoc categories", "Distance bands chosen after inspecting data should be treated as exploratory."]
    ],
    tags: ["VA", "OPTN linkage", "GEE", "distance", "competing risk"]
  },
  {
    id: "ldkt-disparities",
    short: "LDKT disparities",
    title: "Association of Race and Ethnicity With Live Donor Kidney Transplantation in the United States From 1995 to 2014",
    citation: "Purnell et al. JAMA. 2018;319(1):49-61. doi:10.1001/jama.2017.19152",
    journal: "JAMA",
    year: "2018",
    source: "https://jamanetwork.com/journals/jama/fullarticle/2667722",
    filename: "jama_race_live_kidney.pdf",
    takeaway: "A large SRTR cohort uses time-stratified Cox and competing-risk models to show that live donor kidney transplantation disparities widened over two decades.",
    sections: {
      Motivation: "National programs and policy efforts sought to reduce racial and ethnic disparities in live donor kidney transplantation. The study asks whether disparities narrowed from 1995 to 2014.",
      Design: "Secondary analysis of a prospectively maintained SRTR cohort of 453,162 adult first-time kidney transplant candidates on the deceased donor waiting list, linked to Census socioeconomic variables at the zip-code level.",
      Methods: "Time to live donor kidney transplantation is modeled within five-year listing periods. Kaplan-Meier estimates describe two-year cumulative incidence, while multivariable Cox models estimate adjusted hazard ratios by race/ethnicity and period. Fine-Gray competing risk models repeat the analysis with death and deceased donor transplantation as competing events. Interaction terms test whether disparities changed over time. Sensitivity analyses use contemporary, expanded, and active-status cohorts, and mediator models incrementally add socioeconomic/access and transplant-center factors.",
      Results: "White candidates saw higher two-year live donor transplant incidence from 1995 to 2014, while Black and Hispanic candidates saw declines and Asian candidates saw a smaller increase. Adjusted subhazard ratios for Black, Hispanic, and Asian candidates compared with White candidates worsened from 1995-1999 to 2010-2014."
    },
    methods: [
      {
        name: "Time-stratified cohort",
        text: "Candidates are grouped into four five-year listing periods to balance interpretability, sample size, and temporal trend detection.",
        bullets: ["Follow-up is capped at two years after listing", "Outcome date comes from transplant-center OPTN forms"]
      },
      {
        name: "Race/ethnicity exposure",
        text: "Race and ethnicity categories are center-recorded OPTN fields. The authors restrict to groups with adequate sample size for temporal inference.",
        bullets: ["White, Black, Hispanic, Asian", "Small groups excluded due to power limits"]
      },
      {
        name: "Cox plus Fine-Gray",
        text: "Cox models estimate time to live donor transplant; Fine-Gray models check whether death and deceased donor transplant create informative censoring.",
        bullets: ["Adjusted for age, sex, BMI, PRA/CPRA, ABO", "Interaction terms formally test changing disparities"]
      },
      {
        name: "Mediation-style probing",
        text: "Additional models incrementally add socioeconomic, access, and transplant-center factors to see how much they attenuate racial/ethnic differences.",
        bullets: ["Missing variables handled with SRTR missing-category approach", "Multiple imputation used as robustness check", "Collinearity and proportional hazards assessed"]
      }
    ],
    signals: [
      ["Black SHR 1995-1999", 0.45],
      ["Black SHR 2010-2014", 0.27],
      ["Hispanic SHR 1995-1999", 0.83],
      ["Hispanic SHR 2010-2014", 0.52],
      ["Asian SHR 2010-2014", 0.42]
    ],
    pitfalls: [
      ["Race variable meaning", "Race/ethnicity fields proxy social processes and access, not biology."],
      ["Mediator overcontrol", "Adding access variables can obscure pathways if interpreted as confounding only."],
      ["Competing events", "Death and deceased donor transplant must not be treated as ordinary censoring without sensitivity checks."]
    ],
    tags: ["SRTR", "equity", "Cox", "Fine-Gray", "interactions"]
  },
  {
    id: "living-donor-outcomes",
    short: "Donor outcomes",
    title: "Racial Variation in Medical Outcomes among Living Kidney Donors",
    citation: "Lentine et al. New England Journal of Medicine. 2010;363:724-732. doi:10.1056/NEJMoa1000950",
    journal: "NEJM",
    year: "2010",
    source: "https://www.nejm.org/doi/full/10.1056/NEJMoa1000950",
    filename: "nejm_race_live_kidney.pdf",
    takeaway: "This paper links OPTN donor records to private insurer claims and uses censored Cox models to estimate postdonation diagnosis prevalence by race and ethnicity.",
    sections: {
      Motivation: "Living donor safety evidence was limited, especially for nonwhite donors. The study investigates whether postdonation diagnoses vary by race and ethnicity.",
      Design: "Retrospective linked-data cohort of 4,650 living kidney donors from OPTN records who had post-nephrectomy medical and pharmacy benefits with a participating private insurer from 2000 to 2007.",
      Methods: "OPTN identifiers were linked to insurer data using names and birthdates, then direct identifiers were removed. Billing and pharmacy claims identified hypertension, diabetes, chronic kidney disease, cardiovascular disease, and drug-treated conditions. Cox regression with left and right censoring accounts for variable windows of insurance eligibility and estimates five-year diagnosis prevalence. NHANES 2005-2006 serves as a general-population comparison with survey-weighted logistic models.",
      Results: "Black and Hispanic donors had higher adjusted risk of hypertension, diabetes requiring drug therapy, and chronic kidney disease than White donors. End-stage renal disease was rare but more common among Black donors than White donors."
    },
    methods: [
      {
        name: "Record linkage",
        text: "The study joins transplant registry donor records to private insurer claims, creating longitudinal outcome visibility that neither source has alone.",
        bullets: ["Names and birthdates used for linkage", "HIPAA limited dataset after de-identification", "Census data linked by ZIP code"]
      },
      {
        name: "Claims outcomes",
        text: "Medical and pharmacy claims define diagnoses and drug-treated conditions. CKD stage coding is restricted to a later subgroup because stage-specific codes became available during the study window.",
        bullets: ["ICD-9-CM diagnosis algorithms", "Pharmacy drug-category codes", "Prespecified CKD stage subgroup"]
      },
      {
        name: "Censored prevalence",
        text: "Insurance coverage begins and ends at different times, so Cox models with left and right censoring estimate prevalence and adjusted hazard ratios after nephrectomy.",
        bullets: ["Estimates five-year diagnosis prevalence", "Models prespecified subgroups", "Secondary predonation hypertension analysis"]
      },
      {
        name: "External benchmark",
        text: "Because insurer race data for non-donor beneficiaries were unavailable, the paper compares donor patterns with NHANES general-population estimates.",
        bullets: ["Survey logistic models correct for selection and response", "Outcome definitions differ between claims and survey self-report"]
      }
    ],
    signals: [
      ["Black hypertension HR", 1.52],
      ["Black treated diabetes HR", 2.31],
      ["Black CKD HR", 2.32],
      ["Donor ESRD prevalence", 0.90]
    ],
    pitfalls: [
      ["Left censoring", "Claims before insurance eligibility are unobserved, so incident versus prevalent diagnoses can blur."],
      ["Selection bias", "Privately insured donors may be healthier or more resourced than uninsured donors."],
      ["Outcome mismatch", "Claims-defined outcomes are not identical to NHANES self-reported measures."]
    ],
    tags: ["OPTN", "claims linkage", "left censoring", "NHANES", "equity"]
  }
];

const automationCards = [
  {
    title: "Extraction schema",
    text: "Ask the model to fill a narrow JSON schema rather than write prose first.",
    bullets: ["Motivation", "Design", "Data source", "Exposure", "Outcome", "Identification", "Model", "Censoring", "Missing data", "Sensitivity checks", "Limitations"]
  },
  {
    title: "Method classifier",
    text: "Detect whether a paper is using policy-era comparison, access/geography, registry linkage, claims linkage, or equity trend analysis before summarizing results.",
    bullets: ["Map Fine-Gray to competing risks", "Map Cox to time-to-event estimands", "Map GEE/logit to clustered binary access models"]
  },
  {
    title: "Provenance discipline",
    text: "Every extracted field should retain paper, section, page, and sentence span. LLM outputs without provenance are treated as drafts.",
    bullets: ["Store source snippets privately", "Expose public summaries only", "Flag low-confidence fields for human review"]
  },
  {
    title: "Causal humility",
    text: "Most designs here are observational. The automation should distinguish association from causal effects unless the design supports stronger language.",
    bullets: ["Before-after policy studies need secular trend checks", "Race/ethnicity analyses need social interpretation", "Distance studies need unobserved access barriers"]
  },
  {
    title: "Competing-risk guardrail",
    text: "A common LLM failure is to describe transplant or death as simple censoring. The workflow should explicitly identify competing events and estimands.",
    bullets: ["Death can compete with transplant", "Transplant can compete with waitlist mortality", "Recovery removals may be separate outcomes"]
  },
  {
    title: "Publication-rights guardrail",
    text: "Public dashboards can cite and summarize papers, but redistribution of journal PDFs needs permission.",
    bullets: ["Keep PDFs local unless licensed", "Use official DOI links", "Do not upload copyrighted article files by default"]
  }
];

let selectedPaper = papers[0];
let selectedMethod = 0;
let activeView = "paper";

const els = {
  paperTabs: document.getElementById("paperTabs"),
  paperSearch: document.getElementById("paperSearch"),
  viewTabs: [...document.querySelectorAll(".view-tab")],
  paperView: document.getElementById("paperView"),
  compareView: document.getElementById("compareView"),
  automationView: document.getElementById("automationView"),
  paperKicker: document.getElementById("paperKicker"),
  paperTitle: document.getElementById("paperTitle"),
  paperCitation: document.getElementById("paperCitation"),
  paperTakeaway: document.getElementById("paperTakeaway"),
  lensGrid: document.getElementById("lensGrid"),
  paperLink: document.getElementById("paperLink"),
  methodNav: document.getElementById("methodNav"),
  methodDetail: document.getElementById("methodDetail"),
  signalChart: document.getElementById("signalChart"),
  pitfallList: document.getElementById("pitfallList"),
  compareTable: document.querySelector("#compareTable tbody"),
  automationGrid: document.getElementById("automationGrid")
};

function filteredPapers() {
  const query = els.paperSearch.value.trim().toLowerCase();
  if (!query) return papers;
  return papers.filter((paper) => {
    const haystack = [
      paper.title,
      paper.short,
      paper.citation,
      paper.takeaway,
      ...Object.values(paper.sections),
      ...paper.tags,
      ...paper.methods.flatMap((method) => [method.name, method.text, ...method.bullets]),
      ...paper.pitfalls.flat()
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderTabs() {
  const visible = filteredPapers();
  els.paperTabs.innerHTML = "";
  visible.forEach((paper) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `paper-tab ${paper.id === selectedPaper.id ? "is-active" : ""}`;
    button.dataset.id = paper.id;
    button.innerHTML = `<span>${paper.year} · ${paper.journal}</span><strong>${paper.short}</strong>`;
    button.addEventListener("click", () => {
      selectedPaper = paper;
      selectedMethod = 0;
      activeView = "paper";
      render();
    });
    els.paperTabs.appendChild(button);
  });

  if (visible.length && !visible.some((paper) => paper.id === selectedPaper.id)) {
    selectedPaper = visible[0];
    selectedMethod = 0;
  }
}

function renderPaper() {
  els.paperKicker.textContent = `${selectedPaper.journal} · ${selectedPaper.year} · ${selectedPaper.filename}`;
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

  els.methodNav.innerHTML = selectedPaper.methods.map((method, index) => `
    <button type="button" class="method-button ${index === selectedMethod ? "is-active" : ""}" data-method="${index}">
      ${method.name}
    </button>
  `).join("");

  els.methodNav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMethod = Number(button.dataset.method);
      renderPaper();
    });
  });

  const method = selectedPaper.methods[selectedMethod];
  els.methodDetail.innerHTML = `
    <h3>${method.name}</h3>
    <p>${method.text}</p>
    <ul>${method.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
    <div class="tag-row">${selectedPaper.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
  `;

  const maxSignal = Math.max(...selectedPaper.signals.map((signal) => signal[1]), 1);
  els.signalChart.innerHTML = selectedPaper.signals.map(([label, value]) => {
    const width = Math.max(7, Math.min(100, (value / maxSignal) * 100));
    return `
      <div class="signal-row">
        <div class="signal-label">${label}</div>
        <div class="signal-track"><div class="signal-bar" style="width:${width}%"></div></div>
        <div class="signal-value">${value.toFixed(2)}</div>
      </div>
    `;
  }).join("");

  els.pitfallList.innerHTML = selectedPaper.pitfalls.map(([title, text]) => `
    <div class="pitfall-card">
      <strong>${title}</strong>
      <span>${text}</span>
    </div>
  `).join("");
}

function renderCompare() {
  const visible = filteredPapers();
  els.compareTable.innerHTML = visible.map((paper) => `
    <tr>
      <td>${paper.short}<br><span class="paper-citation">${paper.year} · ${paper.journal}</span></td>
      <td>${paper.sections.Design}</td>
      <td>${paper.methods.map((method) => method.name).join(", ")}</td>
      <td>${paper.tags.filter((tag) => /UNOS|OPTN|SRTR|VA|claims|NHANES|linkage/i.test(tag)).join(", ") || "Registry cohort"}</td>
      <td>${paper.pitfalls[0][0]}: ${paper.pitfalls[0][1]}</td>
    </tr>
  `).join("");
}

function renderAutomation() {
  els.automationGrid.innerHTML = automationCards.map((card) => `
    <article class="automation-card">
      <h3>${card.title}</h3>
      <p>${card.text}</p>
      <ul>${card.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderView() {
  const viewMap = {
    paper: els.paperView,
    compare: els.compareView,
    automation: els.automationView
  };
  Object.entries(viewMap).forEach(([view, element]) => {
    element.classList.toggle("is-hidden", view !== activeView);
  });
  els.viewTabs.forEach((button) => {
    const isActive = button.dataset.view === activeView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function render() {
  renderTabs();
  renderPaper();
  renderCompare();
  renderAutomation();
  renderView();
}

els.viewTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    render();
  });
});

els.paperSearch.addEventListener("input", () => {
  renderTabs();
  if (activeView === "compare") renderCompare();
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  const visible = filteredPapers();
  const currentIndex = visible.findIndex((paper) => paper.id === selectedPaper.id);
  if (event.key === "ArrowRight" && currentIndex < visible.length - 1) {
    selectedPaper = visible[currentIndex + 1];
    selectedMethod = 0;
    render();
  }
  if (event.key === "ArrowLeft" && currentIndex > 0) {
    selectedPaper = visible[currentIndex - 1];
    selectedMethod = 0;
    render();
  }
});

render();
