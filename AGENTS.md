<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all 
differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` 
before writing any code. Heed deprecation notices. For pathing to files, this project allows
path aliases. Please use @ instead of dots. Please write production-grade code. 
Do not include conversational, tutorial-style, or instructional comments 
(e.g., 'Step 1', 'Replace this later'). Only comment on complex business logic.
Please before suggesting changes to your code, give your reasoning behind your plan.
Be quick and to the point with each reply and omit all conversational phrases. Don't give unnecessary details or explanations.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:strict-safety-protocol -->
# Strict Safety & Execution Protocol

You are strictly prohibited from using bulk automated scripts (like regex-based node scripts, sed, or bulk bash replacements) across the codebase. 
You must ONLY use precise, line-by-line file modification tools (e.g., `replace_file_content` or `multi_replace_file_content`).
Before you execute any code modification, you must be 100% mathematically certain it will not introduce syntax errors, break URLs, or alter existing logic unprompted. If there is ANY ambiguity, stop and ask the user for permission. Do no harm to the logic.
<!-- END:strict-safety-protocol -->
