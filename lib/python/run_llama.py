import os
from llama_cpp import Llama

# Look for model files
model_path = r"C:\Users\Ahmed Shoaib\Downloads\llama-2-7b-chat.Q2_K.gguf"


# Initialize Llama
llm = Llama(model_path=model_path)

# Prompt creation using Llama 2 Chat template
system_message = "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information."
user_message = "Name the planets in the solar system?"

# Format using Llama 2 Chat template
prompt = f"[INST] <<SYS>>\n{system_message}\n<</SYS>>\n{user_message}[/INST]"

# Run the model
output = llm(
  prompt, # Prompt
  max_tokens=256, # Generate more tokens for complete answer
  stop=["[INST]", "</s>"], # Stop at next instruction or end token
  echo=True # Echo the prompt back in the output
)

# Print the complete response
print("\n\n--- MODEL OUTPUT ---")
print(output['choices'][0]['text'])