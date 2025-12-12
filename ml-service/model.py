"""
Model handler for Arabic text reformulation
Uses AraT5 or similar Arabic language model with PEFT/LoRA for fine-tuning
"""

import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel, PeftConfig, get_peft_model, LoraConfig, TaskType
from typing import Optional

# إعدادات النموذج
MODEL_NAME = "UBC-NLP/AraT5-base"  # نموذج T5 العربي
ADAPTER_PATH = "./lora_adapter"
MAX_LENGTH = 512

class TextReformulator:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = None
        self.model = None
        self.peft_model = None
        self.is_loaded = False

    def load_model(self):
        """تحميل النموذج الأساسي والـ LoRA adapter"""
        print(f"Loading model on device: {self.device}")

        # تحميل tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

        # تحميل النموذج الأساسي
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float32,
        )

        # التحقق من وجود adapter محفوظ
        if os.path.exists(ADAPTER_PATH):
            print("Loading existing LoRA adapter...")
            self.peft_model = PeftModel.from_pretrained(
                self.model,
                ADAPTER_PATH,
            )
        else:
            print("Creating new LoRA adapter...")
            self._create_lora_adapter()

        self.peft_model = self.peft_model.to(self.device)
        self.is_loaded = True
        print("Model loaded successfully!")

    def _create_lora_adapter(self):
        """إنشاء LoRA adapter جديد"""
        lora_config = LoraConfig(
            task_type=TaskType.SEQ_2_SEQ_LM,
            r=16,  # LoRA rank
            lora_alpha=32,
            lora_dropout=0.1,
            target_modules=["q", "v"],  # target attention modules
            inference_mode=False,
        )

        self.peft_model = get_peft_model(self.model, lora_config)
        print(f"LoRA trainable params: {self.peft_model.print_trainable_parameters()}")

    def reformulate(self, text: str) -> str:
        """إعادة صياغة النص"""
        if not self.is_loaded:
            self.load_model()

        # إعداد المدخلات
        prompt = f"أعد صياغة النص التالي بشكل أفضل: {text}"

        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            max_length=MAX_LENGTH,
            truncation=True,
            padding=True,
        ).to(self.device)

        # التوليد
        self.peft_model.eval()
        with torch.no_grad():
            outputs = self.peft_model.generate(
                **inputs,
                max_length=MAX_LENGTH,
                num_beams=4,
                early_stopping=True,
                no_repeat_ngram_size=3,
            )

        # فك الترميز
        reformulated = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        # في حالة فشل التوليد، نعيد النص الأصلي
        if not reformulated or len(reformulated) < 10:
            return text

        return reformulated

    def train_on_pair(self, original: str, edited: str) -> bool:
        """تدريب النموذج على زوج من النصوص"""
        if not self.is_loaded:
            self.load_model()

        try:
            # إعداد المدخلات
            prompt = f"أعد صياغة النص التالي بشكل أفضل: {original}"

            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                max_length=MAX_LENGTH,
                truncation=True,
                padding=True,
            ).to(self.device)

            # إعداد المخرجات المستهدفة
            targets = self.tokenizer(
                edited,
                return_tensors="pt",
                max_length=MAX_LENGTH,
                truncation=True,
                padding=True,
            ).to(self.device)

            # التدريب
            self.peft_model.train()

            # Forward pass
            outputs = self.peft_model(
                input_ids=inputs.input_ids,
                attention_mask=inputs.attention_mask,
                labels=targets.input_ids,
            )

            loss = outputs.loss

            # Backward pass
            loss.backward()

            # تحديث الأوزان (تدريب خطوة واحدة)
            optimizer = torch.optim.AdamW(self.peft_model.parameters(), lr=1e-4)
            optimizer.step()
            optimizer.zero_grad()

            # حفظ الـ adapter
            self._save_adapter()

            print(f"Training completed. Loss: {loss.item():.4f}")
            return True

        except Exception as e:
            print(f"Training error: {e}")
            return False

    def _save_adapter(self):
        """حفظ LoRA adapter"""
        try:
            self.peft_model.save_pretrained(ADAPTER_PATH)
            print(f"Adapter saved to {ADAPTER_PATH}")
        except Exception as e:
            print(f"Error saving adapter: {e}")


# إنشاء instance عام
reformulator = TextReformulator()
