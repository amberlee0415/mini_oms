# AI Prompts Log

This document records significant AI prompts used throughout the development of Mini OMS.

---

## Project Initialization

### Date: 2026-06-01

**Prompt:**
```
Act as a Senior Full-stack Engineer.

I have already created an empty project folder named mini_oms.

Initialize a monorepo project using modern 2026 standards.

Requirements:
- Node.js v24+
- npm workspaces
- React 19 + Vite frontend
- Tailwind CSS
- Express backend
- Concurrent frontend/backend development

Target structure:

mini_oms/
├── apps/
│   ├── frontend/
│   └── backend/
├── data/
│   ├── products.json
│   └── orders.json
├── docs/
│   ├── plan.md
│   ├── design.md
│   └── prompts.md
├── .gitignore
├── package.json
└── README.md

Documentation Requirements:
1. Create docs/plan.md as the implementation roadmap.
2. Create docs/design.md as the architecture and design document.
3. Create docs/prompts.md to record all significant AI prompts used throughout development.
4. Do not generate any additional documentation files unless required.
5. Initialize these files with placeholder content that can be updated during development.

Tasks:
1. Generate all required shell commands.
2. Create root package.json with npm workspaces.
3. Create frontend using React 19 + Vite.
4. Create backend using Express.
5. Configure concurrent development scripts.
6. Configure Tailwind CSS.
7. Create empty JSON storage files.
8. Generate .gitignore.
9. Create docs/plan.md, docs/design.md and docs/prompts.md.
10. Explain every generated file and command.

Do not implement Product or Order features yet.
Only setup the project foundation and required documentation structure.
```

**Result:** Successfully initialized monorepo with all required files and documentation structure.

---

## Prompt 2 - Backend Architecture Setup

### Date: 2026-06-01

**Context:** Set up clean architecture for Express backend with proper separation of concerns to enable maintainable and scalable feature development.

**Prompt:**
```
Act as a Senior Full-stack Engineer.

We are continuing an existing monorepo project.

IMPORTANT CONTEXT:
- docs/plan.md already exists
- docs/design.md already exists
- docs/prompts.md already exists
- You MUST ONLY update these files (never create new markdown/documentation files)

STRICT RULE:
- Do NOT create any new .md files under any circumstances
- Only update the existing 3 files listed above

TASK: Backend Architecture Setup

Create a maintainable Express backend architecture with the following structure:

- routes
- controllers
- services
- middleware
- utils
- database helpers

Requirements:
1. Keep responsibilities strictly separated.
2. Do NOT implement any product or order business logic yet.
3. Add a simple health check endpoint (GET /health).
4. Ensure backend follows clean architecture principles.
5. Ensure code is structured for future feature expansion.

DOCUMENTATION UPDATE REQUIREMENTS:

### docs/plan.md
- Mark backend architecture setup as completed
- Add a new step describing what was implemented
- Update progress clearly (do not rewrite full file unless necessary)

### docs/design.md
- Document backend folder structure
- Explain responsibilities of each layer (routes/controllers/services/etc.)
- Describe request flow from entry → response

### docs/prompts.md
- Append this prompt as:
  "Prompt 2 - Backend Architecture Setup"
- Keep chronological order of prompts

FINAL REQUIREMENT:
- Do NOT create any new documentation files
- Do NOT modify frontend or data layer
- Only implement backend architecture scaffolding and health check endpoint

Finally:
Explain the backend folder structure and request flow clearly.
```

**Result:** Successfully implemented clean backend architecture with:
- 6 layers: routes, controllers, services, middleware, utils, database
- 10 new files organized by responsibility
- Health check endpoint following clean architecture pattern
- Request flow: Client → Middleware → Routes → Controller → Service → Database → Response
- Error handling with custom middleware
- File storage abstraction for JSON data access
- Updated all 3 documentation files (plan.md, design.md, prompts.md)

---

## Future Prompts

Document additional prompts here as development continues. Include:
- Date
- Prompt text
- Context/reason for the prompt
- Result/outcome

### Template for New Entries

**Date:** YYYY-MM-DD

**Context:** Brief description of what you're trying to accomplish

**Prompt:**
```
[Paste the full prompt here]
```

**Result:** Brief description of the outcome

---

## Guidelines for Recording Prompts

### What to Record
- Prompts that generate significant code
- Prompts that solve complex problems
- Prompts that establish patterns or conventions
- Prompts that make architectural decisions

### What NOT to Record
- Simple clarification questions
- Minor bug fixes
- Trivial changes
- Repetitive prompts

### Format
- Use clear section headers
- Include full context
- Note the outcome
- Keep chronological order

---

## Notes
- This document helps maintain consistency across AI-assisted development
- Review past prompts before asking similar questions
- Use successful prompts as templates for future work
- Update this file after each significant AI interaction
