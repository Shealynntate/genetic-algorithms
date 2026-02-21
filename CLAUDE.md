# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on localhost:3000
npm run build      # Production build
npm test           # Run Jest tests (interactive watch mode)
npm test -- --watchAll=false   # Run all tests once
npm test -- --testPathPattern="organism"  # Run a single test file by name
```

First-time setup on Mac may require installing `cairo` for the `canvas` package — see README for details.

## Architecture

This is a Create React App project (React 18, TypeScript strict mode) that uses genetic algorithms to evolve populations of semi-transparent polygons to approximate a target image.

### State Management

Redux Toolkit store with three slices + RTK Query:
- `parameters` — GA hyperparameters (population size, mutation rates, selection method, etc.)
- `simulation` — current run state (global best organism, generation stats, thresholds)
- `navigation` — app-level state (running/paused, simulation queue)
- `firestoreApi` — RTK Query for Firebase gallery data

**Redux-Saga** orchestrates the simulation lifecycle. `PopulationService` is injected into sagas via saga context (not React context). Sagas handle the generation loop: selection → reproduction → fitness evaluation → state update → persistence.

### GA Model Layer (`src/population/`)

Platform-agnostic genetic algorithm code, isolated from React/Redux:
- `PopulationModel` — orchestrates selection, reproduction, and statistics tracking
- `OrganismModel` — individual solution (genome + fitness score)
- `GenomeModel` — list of chromosomes; handles crossover and genome-level mutation
- `ChromosomeModel` — single polygon (points + RGBA color); handles point/color mutation
- `SelectionModel` — tournament, roulette wheel, and SUS selection
- `CrossoverModel` / `MutationModel` — configuration objects for crossover and mutation operators
- `PopulationService` (`population-context.ts`) — bridges GA models with web workers for parallelized fitness evaluation

### Fitness Evaluation

Fitness is computed in **Web Workers** (`src/web-workers/`). Each organism's polygons are rendered to an offscreen canvas and compared pixel-by-pixel against the target image. Workers are batched by `workerBatchSize` from `src/parameters/config.ts`.

### Persistence

- **IndexedDB** via Dexie (`src/database/`) — stores simulation results and pending runs; persists across page reloads
- **Firebase/Firestore** (`src/firebase/`) — shared gallery of example runs

### Routes

`/` — Gallery (shared examples), `/experiment` — run simulations, `/your-art` — local results, `/admin` — admin panel

### Key Libraries

- MUI 5 + Emotion for UI/styling
- Visx + D3 for fitness charts
- React Hook Form for simulation parameter forms
- gifshot for generating timelapse GIFs
- @dnd-kit for drag-and-drop in simulation queue

## Code Style

- ESLint with `standard-with-typescript` + `plugin:react/recommended`
- Prettier for formatting
- Import ordering enforced: react first, then external, then internal, alphabetized
- `import/no-unresolved` set to error
