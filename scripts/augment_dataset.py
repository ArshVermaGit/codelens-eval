import os
import json
import argparse
from openai import OpenAI
from pydantic import BaseModel, Field

# Ensure you have OPENAI_API_KEY set in your environment
client = OpenAI()

SYSTEM_PROMPT = """You are an expert software engineer and data generator. 
Your task is to generate synthetic Pull Request scenarios containing subtle bugs, security flaws, or architectural issues.
Follow the exact JSON schema provided."""

class GeneratedScenario(BaseModel):
    pr_title: str
    pr_description: str
    diff: str
    action_type: str = Field(description="Must be 'flag_issue'")
    body: str = Field(description="Detailed explanation of the issue")
    filename: str
    line_number: int
    severity: str = Field(description="One of: low, medium, high, critical")
    category: str = Field(description="One of: bug, security, architecture, performance, style")

def generate_synthetic_data(count: int, output_file: str):
    dataset = []
    print(f"Generating {count} synthetic scenarios...")
    
    for i in range(count):
        print(f"Generating scenario {i+1}/{count}...")
        try:
            response = client.beta.chat.completions.parse(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": "Generate a unique, realistic Python code review scenario. Include a unified diff."}
                ],
                response_format=GeneratedScenario,
            )
            scenario = response.choices[0].message.parsed
            
            # Convert to CodeLens instruction format
            user_msg = f"PR Title: {scenario.pr_title}\nPR Description: {scenario.pr_description}\nCode diff:\n```\n{scenario.diff}\n```\nOutput a single JSON action object."
            assistant_msg = json.dumps({
                "action_type": scenario.action_type,
                "body": scenario.body,
                "filename": scenario.filename,
                "line_number": scenario.line_number,
                "severity": scenario.severity,
                "category": scenario.category
            }, indent=2)
            
            dataset.append({
                "messages": [
                    {"role": "system", "content": "You are an expert code reviewer..."},
                    {"role": "user", "content": user_msg},
                    {"role": "assistant", "content": assistant_msg}
                ]
            })
            
        except Exception as e:
            print(f"Failed on generation {i}: {e}")

    # Append to existing dataset
    with open(output_file, "a") as f:
        for item in dataset:
            f.write(json.dumps(item) + "\n")
            
    print(f"✅ Generated {len(dataset)} scenarios and appended to {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=10, help="Number of scenarios to generate")
    parser.add_argument("--output", type=str, default="dataset.jsonl", help="Output file")
    args = parser.parse_args()
    
    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY environment variable not set.")
        exit(1)
        
    generate_synthetic_data(args.count, args.output)
