# Metric version register (bng-metric-service)

Tracks which Statutory Biodiversity Metric workbook versions `packages/bng-metric-service` accepts and processes correctly, and the evidence/tests behind each release. Update this file whenever a new metric release is reviewed and merged.

## How version acceptance actually works here

The code does **not** key off the workbook's human-readable release name (e.g. "1.0.3", "1.1.0 DRAFT"). Acceptance is based on:

- **Structure**: the required sheets exist (`Start`, `Main Menu`, `Results`, `Headline Results`) — see `is-metric-workbook.js`.
- **A numeric version value** read from `Start!D8` — see `is-supported-version.js`. Today this accepts `Start!D8 >= 4.1`.

Row capacity per data-entry tab (how many habitat/hedge/watercourse rows are read) is a **separate concern** from version acceptance, handled by structural row-extent detection — see `row-extent.js`.

## Row capacity by sheet

| Sheet | Detection method | Legacy max (confirmed) | New max (confirmed) | Notes |
|---|---|---|---|---|
| D-1 Off-Site Habitat Baseline | Sequential ref column | 248 | 350+ | Dynamic |
| D-2 Off-Site Habitat Creation | Sequential ref column (hidden) | 246 | 350+ | Dynamic |
| D-3 Off-Site Habitat Enhancment | Totals-row label search | n/a | n/a | Dynamic |
| E-1 Off-Site Hedge Baseline | Sequential ref column | 248 | 350+ | Dynamic |
| E-2 Off-Site Hedge Creation | Sequential ref column | 248 | 350+ | Dynamic |
| E-3 Off-Site Hedge Enhancement | Derived from D-3's detected row, offset -1 | 247 | 350 (may be 1 row short of the true new maximum) | No structural signal of its own; falls back to 247 if D-3 can't be detected |
| F-1 Off-Site WaterC' Baseline | Sequential ref column | 248 | 350+ | Dynamic |
| F-2 Off-Site WaterC' Creation | Sequential ref column (hidden) | 248 | 350+ | Dynamic |
| F-3 Off-Site WaterC Enhancement | Derived from D-3's detected row, offset -1 | 247 | 350 (may be 1 row short of the true new maximum) | Same as E-3 |

E-3/F-3 have no totals label or sequential ref column of their own. Their last row is derived at runtime from D-3's detected totals row (same workbook) minus a fixed offset, confirmed exact for the legacy file from the Phase 1 workbook diff. This is exact for files matching the confirmed legacy/1.1.0 structure; a future release could change the relative offset between D-3 and E-3/F-3 again, in which case this derivation would need re-confirming against the new workbook evidence.

## Release history

| Release label | Numeric `Start!D8` | Row capacity change | Branch | Compatibility assessment | Status |
|---|---|---|---|---|---|
| 1.0.3 (baseline) | 4.1 | ~246–248 rows | – | – | Supported |
| 1.1.0 (DRAFT) | 4.1 (unchanged) | 350 rows | `feature/metric-1.1.0-compat` | `packages/bng-metric-service/COMPATIBILITY_ASSESSMENT.md` | In review |

## Process for a new release

1. Get the previous and new workbooks, and confirm the release name with whoever requested the update.
2. Compare the workbooks (sheet/row/formula/label diffs) — this is normally done in the separate `metric-file-agent` repo, which produces a structural diff report.
3. Write/update `packages/bng-metric-service/COMPATIBILITY_ASSESSMENT.md` covering every file in this package that depends on workbook structure.
4. Branch as `feature/metric-<version>-compat` and commit in small, reviewable steps: config/constants → detection logic → parser refactor → rules → tests. Run lint and the full test suite after every commit.
5. Never remove or narrow support for a version already in this table.
6. Update this register's two tables above, and list any workbook defects to raise with the client separately (do not let code depend on them).

## Related documents

Workbook-level structural comparisons (sheet renames, formula changes, defects found in the client's file) are tracked separately in the `metric-file-agent` repo under `docs/metric-versions/`. This register only tracks what the **code in this repo** accepts and how.
