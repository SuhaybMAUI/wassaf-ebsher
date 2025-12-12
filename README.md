# وصّاف - نظام وصف الصور للمكفوفين

نظام ذكي لوصف الصور للأشخاص المكفوفين وضعاف البصر مع إمكانية تدريب النموذج اللغوي.

## المميزات

- **وصف الصور بالذكاء الاصطناعي**: استخدام Gemini API أو Claude API للحصول على وصف تفصيلي للصور
- **إعادة الصياغة**: نموذج لغوي محلي لإعادة صياغة الوصف ليكون أكثر وضوحاً
- **التدريب المستمر**: تحسين جودة إعادة الصياغة من خلال تدريب النموذج على التعديلات
- **معايير WCAG 2.1**: الوصف يتبع معايير إمكانية الوصول
- **واجهة عربية**: دعم كامل للغة العربية واتجاه RTL

## التقنيات المستخدمة

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/ui

### Backend
- Next.js API Routes
- FastAPI (للنموذج اللغوي)
- PostgreSQL + Prisma

### ML
- PyTorch
- Transformers (AraT5)
- PEFT/LoRA

### APIs
- Google Gemini API
- Anthropic Claude API

## البدء السريع

### المتطلبات
- Node.js 22+
- Python 3.10+
- PostgreSQL 15+

### التثبيت

1. **استنساخ المشروع:**
```bash
git clone <repository-url>
cd wassaf-ebsher
```

2. **تثبيت dependencies للـ Frontend:**
```bash
npm install
```

3. **إعداد قاعدة البيانات:**
```bash
# إنشاء قاعدة البيانات
createdb wassaf_ebsher

# تحديث ملف .env بعنوان قاعدة البيانات
# DATABASE_URL="postgresql://user:password@localhost:5432/wassaf_ebsher"

# تشغيل migrations
npx prisma migrate dev
npx prisma generate
```

4. **تشغيل التطبيق:**
```bash
npm run dev
```

5. **إعداد خدمة ML (اختياري):**
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

### متغيرات البيئة

قم بإنشاء ملف `.env` بالمحتوى التالي:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wassaf_ebsher"

# Gemini API (Primary)
GEMINI_API_KEY="your-gemini-api-key"

# Claude API (Fallback)
ANTHROPIC_API_KEY="your-claude-api-key"

# ML Service URL
ML_SERVICE_URL="http://localhost:8000"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## هيكل المشروع

```
wassaf-ebsher/
├── src/
│   ├── app/
│   │   ├── page.tsx              # الصفحة الرئيسية (وصف الصور)
│   │   ├── training/page.tsx     # صفحة التدريب
│   │   ├── settings/page.tsx     # صفحة الإعدادات
│   │   ├── layout.tsx            # Layout الرئيسي
│   │   ├── globals.css           # الأنماط العامة
│   │   └── api/
│   │       ├── describe/route.ts   # API وصف الصور
│   │       ├── reformulate/route.ts # API إعادة الصياغة
│   │       ├── train/route.ts      # API التدريب
│   │       ├── stats/route.ts      # API الإحصائيات
│   │       └── settings/route.ts   # API الإعدادات
│   ├── components/
│   │   ├── ImageUploader.tsx     # مكون رفع الصور
│   │   ├── DescriptionField.tsx  # حقل الوصف
│   │   ├── EditableField.tsx     # حقل التعديل
│   │   ├── TrainingCounter.tsx   # عداد التدريبات
│   │   ├── APIStatusIndicator.tsx # مؤشر حالة API
│   │   └── NavBar.tsx            # شريط التنقل
│   ├── lib/
│   │   ├── db.ts                 # اتصال Prisma
│   │   ├── ai-client.ts          # عميل AI APIs
│   │   └── wcag-prompt.ts        # Prompt معيار WCAG
│   └── types/
│       └── index.ts              # تعريفات TypeScript
├── ml-service/
│   ├── main.py                   # FastAPI server
│   ├── model.py                  # النموذج اللغوي
│   └── requirements.txt          # Python dependencies
├── prisma/
│   └── schema.prisma             # نموذج قاعدة البيانات
├── .env.example                  # مثال متغيرات البيئة
└── package.json
```

## كيفية الاستخدام

### صفحة وصف الصور
1. ارفع صورة بالسحب والإفلات أو بالضغط
2. انتظر الوصف من AI
3. اضغط "إعادة الصياغة" للحصول على وصف محسّن
4. عدّل الوصف إذا لزم الأمر
5. اضغط "حفظ" لحفظ التعديلات وتدريب النموذج

### صفحة التدريب
1. ارفع صورة
2. عدّل الوصف في الحقل الثاني
3. اضغط "تدريب النموذج"

### صفحة الإعدادات
- إدخال مفاتيح API
- تحديد أولوية APIs

## الأوامر المتاحة

```bash
# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل في وضع الإنتاج
npm start

# فحص الكود
npm run lint

# إنشاء Prisma client
npx prisma generate

# تشغيل migrations
npx prisma migrate dev

# تشغيل خدمة ML
cd ml-service && python main.py
```

## المساهمة

نرحب بمساهماتكم! يرجى:
1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. عمل commit للتغييرات
4. فتح Pull Request

## الترخيص

MIT License
