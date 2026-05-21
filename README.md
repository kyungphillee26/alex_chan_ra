# Health Economics LLM Research Dashboard

Static dashboard for synthesizing transplant policy and equity papers into a reusable LLM extraction schema.

## What It Contains

- Top-level paper tabs for five exemplar studies.
- Motivation, design, methods, and results summaries for each paper.
- Method-focused interactive cards for study design, data linkage, models, censoring, missing data, and sensitivity checks.
- Cross-paper comparison table.
- LLM automation and common-pitfall guardrails.

## Public Paper Access

The original PDFs in the local workspace are copyrighted journal articles. They are not redistributed in this public repository. The dashboard includes citations and official publisher/DOI links instead.

## Local Use

Open `index.html` directly in a browser, or serve the directory with any static file server.

```bash
python3 -m http.server 8000
```

## Deployment

The site is GitHub Pages-ready. A workflow in `.github/workflows/pages.yml` deploys the repository root to Pages after pushes to `main`.
