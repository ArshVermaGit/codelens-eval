# Model Summary

**CodeLens-Reviewer** is an AI agent fine-tuned to act as a Senior Code Reviewer. Built upon the `Qwen2.5-Coder (7B)` architecture, this model has been instruction-tuned by Arsh Verma to autonomously detect bugs, identify security vulnerabilities, and critique architectural flaws in Python Pull Requests. It interacts directly with the CodeLens Evaluation Environment, outputting perfectly structured JSON actions to simulate an automated code review loop.

## Usage

This model is intended to be used either standalone for code inference or plugged into the live CodeLens Evaluation Environment.

### Inference with Unsloth
```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "ArshVerma/CodeLens-Reviewer", 
    max_seq_length = 2048,
    load_in_4bit = True,
)
FastLanguageModel.for_inference(model)

prompt = """You are an expert code reviewer. Review the following code and output a JSON action indicating any bugs or issues you find.

Code:
def process(data):
    for i in data:
        if i == "remove": data.remove(i)
    return data
"""

messages = [
    {"role": "system", "content": "You are an expert code reviewer. Output only valid JSON."},
    {"role": "user", "content": prompt}
]

inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to("cuda")
outputs = model.generate(input_ids=inputs, max_new_tokens=256)
print(tokenizer.batch_decode(outputs)[0])
```

**Shape of Inputs/Outputs:**
- **Input:** Natural language instructions and a python code snippet.
- **Output:** A strict JSON object containing `action`, `issue_description`, `filename`, `line_number`, `severity`, and `category`.

**Known Failures:** The model may hallucinate specific line numbers if the provided code diff is extremely long or poorly formatted.

## System

This model serves as the core "Agent" in the **CodeLens Evaluation System**. It receives system prompts, noise budgets, and task definitions from the CodeLens Python backend. Its downstream dependency is the CodeLens WebSocket dashboard (hosted on Hugging Face Spaces), which parses the JSON outputs to assign rewards (positive/negative) and update the live leaderboard.

## Implementation requirements

- **Hardware:** Trained on a single NVIDIA Tesla T4 x2 GPU via Kaggle.
- **Software:** Unsloth, PyTorch, Hugging Face Transformers, TRL.
- **Compute:** Fine-tuning took less than 15 minutes due to Unsloth's highly optimized 4-bit LoRA training pipeline. Inference requires < 6GB of VRAM, making it incredibly lightweight and accessible.

---

# Model Characteristics

## Model initialization

The model was fine-tuned from the pre-trained `unsloth/Qwen2.5-Coder-7B-Instruct` base model. 

## Model stats

- **Size:** 7 Billion Parameters.
- **Weights:** LoRA adapters applied to Q, K, V, O, gate, up, and down projections.
- **Latency:** Highly optimized for real-time inference (2x faster than native Hugging Face using Unsloth).

## Other details

- **Quantization:** The model was trained and quantized in 4-bit (bitsandbytes) to severely reduce VRAM requirements.
- **Gradient Checkpointing:** Unsloth's exact gradient checkpointing was used to save memory.

---

# Data Overview

The model was trained on a highly specific, synthetically generated instructional dataset targeting code review tasks.

## Training data

The training data (`ArshVerma/CodeLens-Dataset`) contains custom prompt-completion pairs. Each row simulates a CodeLens environment state containing:
- A `pr_title` and `pr_description`.
- A code `diff` containing planted bugs, security flaws, or architectural issues.
- A golden `JSON` completion representing the ideal code review action.

## Demographic groups

N/A. This model processes programming logic and code structure. 

## Evaluation data

The model was evaluated iteratively against the live CodeLens engine by observing its capability to identify 3 distinct tasks: `bug_detection`, `security_audit`, and `architectural_review`. 

---

# Evaluation Results

## Summary

The model successfully learned the JSON formatting constraints and correctly identifies logic bugs (e.g., modifying arrays during iteration) without hallucinating markdown wrappers.

## Subgroup evaluation results

- **Bug Detection:** High accuracy. Successfully identifies off-by-one and logical loop errors.
- **Security Audit:** Capable of identifying basic input sanitization failures.
- **Architecture:** Demonstrates baseline capability in flagging Single Responsibility Principle (SRP) violations.

## Fairness 

N/A. Evaluation was strictly based on binary reward functions (detecting the objective bug = +1 reward).

## Usage limitations

This model is intended strictly for evaluating code within isolated sandboxes or assisting developers. It should **not** be used to automatically reject or approve production Pull Requests without human oversight, as false positives are possible.

## Ethics

No sensitive or PII data was used during the training of this model. Risks of adversarial exploitation exist if malicious code is embedded to trigger arbitrary outputs, but the model outputs strictly to JSON, minimizing execution risks.
