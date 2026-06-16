# =================================================================================
# 🚀 FOOLPROOF KAGGLE TRAINING SCRIPT FOR CODELENS
# 
# Step 1: Factory Reset your Kaggle environment to clear any broken libraries.
# Step 2: Create a code cell and run EXACTLY this (do not restart session after):
#    !pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
#    !pip install --no-deps trl peft accelerate bitsandbytes
# Step 3: Run this entire script in the next cell!
# =================================================================================

import os
import torch
from datasets import load_dataset
from trl import SFTTrainer, SFTConfig
from transformers import TrainingArguments
from unsloth import FastLanguageModel
from unsloth.chat_templates import get_chat_template

# 1. Load the Model (Qwen-2.5-Coder-7B)
max_seq_length = 2048 # Reduced to 2048 to prevent CUDA Out Of Memory on Kaggle T4
dtype = None # Auto detects float16/bfloat16
load_in_4bit = True # 4bit quantization to fit on Kaggle T4 GPUs

print("Loading model...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen2.5-Coder-7B-Instruct",
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
)

# Apply LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r = 16, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",],
    lora_alpha = 16,
    lora_dropout = 0, 
    bias = "none",
    use_gradient_checkpointing = "unsloth",
    random_state = 3407,
    use_rslora = False,
    loftq_config = None,
)

# 2. Format the Dataset
tokenizer = get_chat_template(
    tokenizer,
    chat_template = "chatml", # ChatML format
)

def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(convo, tokenize = False, add_generation_prompt = False) for convo in convos]
    return { "text" : texts, }

import glob
print("Finding dataset...")
dataset_files = glob.glob("/kaggle/input/**/dataset.jsonl", recursive=True)
if not dataset_files:
    dataset_files = glob.glob("/kaggle/working/**/dataset.jsonl", recursive=True)
if not dataset_files:
    raise FileNotFoundError("Could not find dataset.jsonl! Make sure you clicked 'Add Input' and uploaded it.")

data_file_path = dataset_files[0]
print(f"Loading dataset from: {data_file_path}")
dataset = load_dataset("json", data_files=data_file_path, split="train")
dataset = dataset.map(formatting_prompts_func, batched = True,)

# 3. Setup Trainer
trainer = SFTTrainer(
    model = model,
    processing_class = tokenizer,
    train_dataset = dataset,
    args = SFTConfig(
        dataset_text_field = "text",
        max_seq_length = max_seq_length,
        dataset_num_proc = 2,
        packing = False, # Can make training 5x faster for short sequences.
        per_device_train_batch_size = 1, # Reduced to 1 to prevent OOM
        gradient_accumulation_steps = 8, # Increased to keep effective batch size the same
        warmup_steps = 5,
        max_steps = 60, # Increase this to ~300 for a real run
        learning_rate = 2e-4,
        fp16 = not torch.cuda.is_bf16_supported(),
        bf16 = torch.cuda.is_bf16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "linear",
        seed = 3407,
        output_dir = "outputs",
    ),
)

# 4. Train!
print("Starting training...")
trainer_stats = trainer.train()

# 5. Save the fine-tuned model
print("Saving model to LoRA adapters...")
model.save_pretrained("codelens_reviewer_lora")
tokenizer.save_pretrained("codelens_reviewer_lora")

print("✅ Training complete! Model saved to codelens_reviewer_lora")
print("To push to Hugging Face, run: model.push_to_hub('your_username/codelens_reviewer_lora', token='...')")
