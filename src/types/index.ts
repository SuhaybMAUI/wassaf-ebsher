// Types for wassaf-ebsher project

export type ApiProvider = 'gemini' | 'claude' | 'local';

// طلب وصف الصورة
export interface DescribeRequest {
  image: string; // Base64 encoded image
  mimeType: string;
}

// استجابة وصف الصورة
export interface DescribeResponse {
  success: boolean;
  description?: string;
  apiUsed?: ApiProvider;
  error?: string;
}

// طلب إعادة الصياغة
export interface ReformulateRequest {
  text: string;
}

// استجابة إعادة الصياغة
export interface ReformulateResponse {
  success: boolean;
  reformulatedText?: string;
  error?: string;
}

// طلب التدريب
export interface TrainRequest {
  original: string;
  edited: string;
  descriptionId?: string;
}

// استجابة التدريب
export interface TrainResponse {
  success: boolean;
  message?: string;
  newTrainingCount?: number;
  error?: string;
}

// إحصائيات التدريب
export interface TrainingStatsResponse {
  totalTrainings: number;
  lastTrainedAt: string | null;
}

// إعدادات API
export interface ApiSettingsData {
  geminiKey: string;
  claudeKey: string;
  primaryApi: ApiProvider;
}

// حالة الوصف في الواجهة
export interface DescriptionState {
  id?: string;
  imageUrl: string;
  originalDesc: string;
  reformulatedDesc: string;
  editedDesc: string;
  isEdited: boolean;
  apiUsed: ApiProvider;
}

// حالة التحميل
export interface LoadingState {
  isUploading: boolean;
  isDescribing: boolean;
  isReformulating: boolean;
  isSaving: boolean;
  isTraining: boolean;
}

// رسالة Toast
export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
