# وصّاف - نظام وصف الصور للمكفوفين

نظام ذكي لوصف الصور للأشخاص المكفوفين وضعاف البصر مع إمكانية تدريب النموذج اللغوي.

## المميزات

- **وصف الصور بالذكاء الاصطناعي**: استخدام Gemini API أو Claude API للحصول على وصف تفصيلي للصور
- **إعادة الصياغة**: نموذج لغوي محلي لإعادة صياغة الوصف ليكون أكثر وضوحاً
- **التدريب المستمر**: تحسين جودة إعادة الصياغة من خلال تدريب النموذج على التعديلات
- **معايير WCAG 2.1**: الوصف يتبع معايير إمكانية الوصول
- **واجهة عربية**: دعم كامل للغة العربية واتجاه RTL

## التقنيات المستخدمة

### أولاً: تقنيات وأُطر العمل الأساسية (Frameworks)

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| Next.js 16 | الواجهة + الباكاند | إطار عمل React للتطبيقات الكاملة، يدعم SSR و API Routes | بناء واجهة المستخدم العربية + API endpoints لوصف الصور والتدريب |
| React 19 | الواجهة الأمامية | مكتبة JavaScript لبناء واجهات المستخدم التفاعلية | بناء المكونات التفاعلية (رفع الصور، حقول الوصف، التعديل) |
| FastAPI | الباكاند (Python) | إطار عمل Python سريع لبناء APIs | خدمة الذكاء الاصطناعي المحلية لإعادة صياغة النصوص العربية |
| Tailwind CSS 4 | الواجهة الأمامية | إطار CSS للتصميم السريع باستخدام classes | تصميم الواجهة مع دعم RTL للغة العربية |

### ثانياً: مكتبات الذكاء الاصطناعي

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| @google/generative-ai | الذكاء الاصطناعي | SDK الرسمي لـ Google Gemini API | وصف الصور باستخدام Gemini Vision (المصدر الأساسي) |
| @anthropic-ai/sdk | الذكاء الاصطناعي | SDK الرسمي لـ Anthropic Claude API | وصف الصور باستخدام Claude Vision (مصدر احتياطي) |
| PyTorch | الذكاء الاصطناعي | إطار التعلم العميق الأشهر من Meta | تشغيل نموذج AraT5 لإعادة صياغة النصوص العربية |
| Transformers | الذكاء الاصطناعي | مكتبة HuggingFace لنماذج NLP | تحميل وتشغيل نموذج AraT5-base للغة العربية |
| PEFT | الذكاء الاصطناعي | Parameter-Efficient Fine-Tuning من HuggingFace | تطبيق LoRA للتدريب التدريجي على تعديلات المستخدم |
| Accelerate | الذكاء الاصطناعي | مكتبة HuggingFace لتسريع التدريب | تحسين أداء التدريب والاستدلال على النموذج |
| SentencePiece | الذكاء الاصطناعي | مكتبة Google لتقسيم النصوص (Tokenization) | تحويل النص العربي إلى tokens لنموذج AraT5 |

### ثالثاً: مكتبات قاعدة البيانات

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| Prisma 7 | الباكاند | ORM حديث لـ TypeScript/JavaScript | إدارة جداول الإعدادات وبيانات التدريب |
| @prisma/client | الباكاند | عميل Prisma للتعامل مع قاعدة البيانات | تنفيذ عمليات CRUD على الجداول |
| @prisma/adapter-pg | الباكاند | محول Prisma لـ PostgreSQL | الاتصال بقاعدة بيانات PostgreSQL |
| pg | الباكاند | عميل PostgreSQL لـ Node.js | الاتصال المباشر بقاعدة البيانات |
| PostgreSQL | قاعدة البيانات | نظام إدارة قواعد بيانات علائقية | تخزين إعدادات API وبيانات التدريب |

### رابعاً: مكتبات واجهة المستخدم (UI)

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| Radix UI | الواجهة الأمامية | مكونات React بدون تصميم (Headless) | أساس مكونات Shadcn/ui |
| @radix-ui/react-dialog | الواجهة الأمامية | مكون النوافذ المنبثقة | نوافذ الإعدادات والتنبيهات |
| @radix-ui/react-label | الواجهة الأمامية | مكون التسميات للنماذج | تسميات حقول الإدخال |
| @radix-ui/react-tabs | الواجهة الأمامية | مكون التبويبات | التبديل بين صفحات الإعدادات |
| @radix-ui/react-slot | الواجهة الأمامية | مكون لدمج المكونات | بناء أزرار مرنة قابلة للتخصيص |
| Lucide React | الواجهة الأمامية | مجموعة أيقونات SVG لـ React | أيقونات الأزرار (حفظ، نسخ، تحميل، إلخ) |
| Sonner | الواجهة الأمامية | مكتبة Toast notifications | إشعارات النجاح والخطأ بالعربية |
| next-themes | الواجهة الأمامية | إدارة السمات (فاتح/داكن) لـ Next.js | دعم الوضع الداكن |

### خامساً: مكتبات CSS ومساعدة

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| class-variance-authority | الواجهة الأمامية | إنشاء variants للمكونات | تعريف أنماط مختلفة للأزرار والبطاقات |
| clsx | الواجهة الأمامية | دمج CSS classes بشكل شرطي | دمج classes ديناميكياً حسب الحالة |
| tailwind-merge | الواجهة الأمامية | دمج Tailwind classes بذكاء | منع تعارض classes وتحسين الأداء |
| tw-animate-css | الواجهة الأمامية | إضافة animations لـ Tailwind | تحريكات سلسة للمكونات |

### سادساً: مكتبات الخادم (Backend Utilities)

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| Uvicorn | الباكاند (Python) | خادم ASGI سريع لـ Python | تشغيل خدمة FastAPI على المنفذ 8000 |
| Pydantic | الباكاند (Python) | التحقق من البيانات باستخدام Python types | التحقق من طلبات API (النصوص، البيانات) |
| python-multipart | الباكاند (Python) | معالجة بيانات النماذج | استقبال الملفات والبيانات من الواجهة |
| Protobuf | الباكاند (Python) | تنسيق تسلسل البيانات من Google | مطلوب لتشغيل نماذج HuggingFace |
| dotenv | الباكاند | تحميل متغيرات البيئة من ملف .env | إدارة مفاتيح API والإعدادات |

### سابعاً: أدوات التطوير (DevTools)

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| TypeScript 5 | التطوير | لغة JavaScript مع أنواع ثابتة | كتابة كود آمن مع type checking |
| ESLint 9 | التطوير | فحص جودة كود JavaScript/TypeScript | ضمان جودة الكود ومعايير الكتابة |
| eslint-config-next | التطوير | إعدادات ESLint لـ Next.js | قواعد خاصة بمشاريع Next.js |
| @types/node | التطوير | أنواع TypeScript لـ Node.js | دعم TypeScript للكود الخادم |
| @types/react | التطوير | أنواع TypeScript لـ React | دعم TypeScript لمكونات React |
| PostCSS | التطوير | معالج CSS | تحويل وتحسين Tailwind CSS |

### ثامناً: النماذج والـ APIs الخارجية

| النوع | مجال الاستخدام | الوصف العام | الاستخدام في المشروع |
|-------|---------------|-------------|---------------------|
| Google Gemini | الذكاء الاصطناعي | نموذج متعدد الوسائط من Google | وصف الصور للمكفوفين (المصدر الأساسي) |
| Claude (Anthropic) | الذكاء الاصطناعي | نموذج محادثة متقدم | وصف الصور (مصدر احتياطي) |
| AraT5-base | الذكاء الاصطناعي | نموذج T5 مدرب على العربية (UBC-NLP) | إعادة صياغة النصوص العربية محلياً |
| LoRA Adapter | الذكاء الاصطناعي | تقنية Fine-tuning خفيفة | حفظ تعديلات المستخدم وتحسين النموذج تدريجياً |

### ملخص إحصائي

| الفئة | العدد |
|-------|-------|
| أُطر العمل الأساسية | 4 |
| مكتبات الذكاء الاصطناعي | 7 |
| مكتبات قاعدة البيانات | 5 |
| مكتبات الواجهة (UI) | 8 |
| مكتبات CSS | 4 |
| مكتبات الخادم | 5 |
| أدوات التطوير | 6 |
| نماذج وAPIs خارجية | 4 |
| **المجموع** | **43** |

## البدء السريع

### المتطلبات
- Node.js 22+
- Python 3.10+
- PostgreSQL 15+

### التثبيت

1. **استنساخ المشروع:**
```bash
git clone https://github.com/SuhaybMAUI/wassaf-ebsher.git
cd wassaf-ebsher
```

2. **تثبيت dependencies للـ Frontend:**
```bash
npm install
```

3. **إعداد قاعدة البيانات:**
```bash
# إنشاء قاعدة البيانات
createdb wassaf

# تشغيل Prisma
npx prisma generate
npx prisma db push
```

4. **إعداد ملف البيئة:**
```bash
cp .env.example .env
# ثم عدّل الملف بإضافة مفاتيح API الخاصة بك
```

5. **تشغيل جميع الخدمات (الطريقة السريعة):**
```bash
chmod +x start.sh
./start.sh
```

**أو التشغيل اليدوي:**

**Terminal 1 - خدمة ML:**
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
python3 main.py
```

**Terminal 2 - Next.js:**
```bash
npm run dev
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
