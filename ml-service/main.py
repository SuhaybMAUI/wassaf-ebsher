"""
FastAPI backend for Arabic text reformulation model
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from model import reformulator

# إنشاء التطبيق
app = FastAPI(
    title="Wassaf ML Service",
    description="خدمة إعادة صياغة النصوص العربية للمكفوفين",
    version="1.0.0",
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# نماذج البيانات
class ReformulateRequest(BaseModel):
    text: str

class ReformulateResponse(BaseModel):
    success: bool
    reformulated_text: str
    was_reformulated: bool = True
    message: Optional[str] = None

class TrainRequest(BaseModel):
    original: str
    edited: str

class TrainResponse(BaseModel):
    success: bool
    message: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

# تحميل النموذج عند بدء التشغيل
@app.on_event("startup")
async def startup_event():
    """تحميل النموذج عند بدء التشغيل"""
    try:
        reformulator.load_model()
    except Exception as e:
        print(f"Warning: Could not load model on startup: {e}")
        print("Model will be loaded on first request.")

# نقاط النهاية
@app.get("/", response_model=HealthResponse)
async def root():
    """فحص صحة الخدمة"""
    return HealthResponse(
        status="healthy",
        model_loaded=reformulator.is_loaded
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """فحص صحة الخدمة"""
    return HealthResponse(
        status="healthy",
        model_loaded=reformulator.is_loaded
    )

@app.post("/reformulate", response_model=ReformulateResponse)
async def reformulate_text(request: ReformulateRequest):
    """إعادة صياغة النص"""
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="النص مطلوب")

    try:
        reformulated, was_reformulated = reformulator.reformulate(request.text)

        if was_reformulated:
            message = "تمت إعادة الصياغة بنجاح"
        else:
            message = "النموذج يحتاج لمزيد من التدريب. يمكنك تعديل النص يدوياً لتحسين الأداء."

        return ReformulateResponse(
            success=True,
            reformulated_text=reformulated,
            was_reformulated=was_reformulated,
            message=message
        )
    except Exception as e:
        print(f"Reformulation error: {e}")
        # في حالة الفشل، نعيد النص الأصلي
        return ReformulateResponse(
            success=True,
            reformulated_text=request.text,
            was_reformulated=False,
            message="تم إرجاع النص الأصلي بسبب خطأ في المعالجة"
        )

@app.post("/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    """تدريب النموذج على زوج من النصوص"""
    if not request.original or not request.edited:
        raise HTTPException(status_code=400, detail="النص الأصلي والمعدل مطلوبان")

    if request.original == request.edited:
        return TrainResponse(
            success=False,
            message="النص الأصلي والمعدل متطابقان. لا حاجة للتدريب."
        )

    try:
        success = reformulator.train_on_pair(request.original, request.edited)

        if success:
            return TrainResponse(
                success=True,
                message="تم التدريب بنجاح وحفظ التحديثات"
            )
        else:
            return TrainResponse(
                success=False,
                message="فشل التدريب. يرجى المحاولة مرة أخرى."
            )
    except Exception as e:
        print(f"Training error: {e}")
        raise HTTPException(status_code=500, detail=f"خطأ في التدريب: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
