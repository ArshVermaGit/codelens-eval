import os
import json
import argparse
from codelens_env.scenarios import ALL_SCENARIOS

SYSTEM_PROMPT = """You are an expert code reviewer specializing in bugs, security vulnerabilities, and architectural issues.

You will be given a code diff (PR) to review. Your job is to identify issues and output a single JSON action.

Available action types:
  - "flag_issue": Flag a specific issue in the code
  - "approve": Approve the PR (no issues found / all issues flagged)
  - "request_changes": Request changes (issues found that must be fixed)
  - "ask_question": Ask a clarifying question
  - "comment": Leave a general comment

For "flag_issue", you MUST provide:
  - action_type: "flag_issue"
  - body: description of the issue (be specific, mention the root cause)
  - filename: the file containing the issue
  - line_number: approximate line number
  - severity: one of "low", "medium", "high", "critical"
  - category: one of "bug", "security", "architecture", "performance", "style", "design"

For "approve" or "request_changes", you MUST provide:
  - action_type: "approve" or "request_changes"
  - body: your overall assessment
  - verdict: "LGTM" (for approve) or "REQUEST_CHANGES" (for request_changes)

IMPORTANT: Output ONLY a valid JSON object — no markdown, no explanation.
"""

def generate_diff(files_changed):
    diff = []
    for f in files_changed:
        diff.append(f"--- a/{f.filename}\n+++ b/{f.filename}\n{f.patch}")
    return "\n".join(diff)

def build_user_message(scenario):
    task_hints = {
        "bug_detection": "Focus on: off-by-one errors, None dereferences, type mismatches, mutable defaults, race conditions, exception handling.",
        "security_audit": "Focus on: SQL injection, XSS, hardcoded secrets, JWT issues, insecure deserialization, CORS, timing attacks, path traversal.",
        "architectural_review": "Focus on: SRP violations, direct DB access from wrong layers, N+1 queries, missing retry/circuit-breaker, god objects, blocking I/O."
    }

    diff = generate_diff(scenario.files_changed)
    
    return f"""PR Title: {scenario.pr_title}
PR Description: {scenario.pr_description}
Task: {scenario.task_id.value} (step 1/10)
Noise budget remaining: 5 (false positives consume this)
Review focus: {task_hints.get(scenario.task_id.value, 'General code review')}

Code diff:
```
{diff}
```

Output a single JSON action object. If you've already flagged the main issues, submit approve or request_changes."""

def build_assistant_message(scenario):
    # In CodeLens, we only have the ground truth issues. 
    # For a few-shot dataset, we train the model to output the first critical issue it finds.
    if not scenario.ground_truth_issues:
        return json.dumps({
            "action_type": "approve",
            "body": "Code looks good, no issues found.",
            "verdict": "LGTM"
        }, indent=2)
    
    issue = scenario.ground_truth_issues[0]
    return json.dumps({
        "action_type": "flag_issue",
        "body": issue.description,
        "filename": issue.filename,
        "line_number": issue.line_number,
        "severity": issue.severity.value,
        "category": issue.category.value
    }, indent=2)

def main():
    parser = argparse.ArgumentParser(description="Export CodeLens scenarios to a JSONL dataset for fine-tuning")
    parser.add_argument("--output", default="dataset.jsonl", help="Output file path")
    args = parser.parse_args()

    dataset = []
    for scenario in ALL_SCENARIOS:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_message(scenario)},
            {"role": "assistant", "content": build_assistant_message(scenario)}
        ]
        # Format for OpenAI / ChatML fine-tuning
        dataset.append({"messages": messages})

    with open(args.output, "w") as f:
        for item in dataset:
            f.write(json.dumps(item) + "\n")
            
    print(f"✅ Successfully exported {len(dataset)} examples to {args.output}")
    print("This dataset is ready to be uploaded to Kaggle for Supervised Fine-Tuning!")

if __name__ == "__main__":
    main()
