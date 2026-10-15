/**
 * Custom Xato Sinflari (Custom Error Classes)
 * 
 * Bu fayl barcha custom xato sinflarini saqlaydi.
 * Server Actions va API endpoint'larida ishlatiladi.
 * 
 * XAVFSIZLIK: Xato xabarlari foydalanuvchi uchun tushunarli,
 * lekin tizim ma'lumotlarini oshkor qilmaydi.
 */

// ============================================
// BASE ERROR CLASS
// ============================================

/**
 * Asosiy xato sinfi
 * Barcha custom xatolar shu sinfdan meros oladi
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Stack trace avtomatik saqlanadi
    
    // Prototype'ni to'g'ri sozlash
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ============================================
// AUTHENTICATION ERRORS (401)
// ============================================

/**
 * Autentifikatsiya xatosi
 * Foydalanuvchi tizimga kirmagan yoki sessiya tugagan
 * 
 * HTTP Status: 401 Unauthorized
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Tizimga kirish talab qilinadi') {
    super(message, 401, true);
    this.name = 'AuthenticationError';
  }
}

/**
 * Sessiya tugagan xatosi
 * Foydalanuvchi sessiyasi muddati tugagan
 * 
 * HTTP Status: 401 Unauthorized
 */
export class SessionExpiredError extends AuthenticationError {
  constructor(message: string = 'Sessiya muddati tugagan. Iltimos, qayta kiring.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

/**
 * Noto'g'ri credentials xatosi
 * Email yoki parol noto'g'ri
 * 
 * XAVFSIZLIK: Aniq qaysi maydon noto'g'ri ekanligi ko'rsatilmaydi!
 * Bu hacker'larga ma'lumot bermaslik uchun.
 */
export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Email yoki parol noto\'g\'ri') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

// ============================================
// AUTHORIZATION ERRORS (403)
// ============================================

/**
 * Ruxsat yo'q xatosi
 * Foydalanuvchi kirgan, lekin bu amalni bajarish uchun ruxsati yo'q
 * 
 * HTTP Status: 403 Forbidden
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Bu amalni bajarish uchun ruxsatingiz yo\'q') {
    super(message, 403, true);
    this.name = 'AuthorizationError';
  }
}

/**
 * Rol yetarli emas xatosi
 * Foydalanuvchi roli bu amalni bajarish uchun yetarli emas
 * 
 * HTTP Status: 403 Forbidden
 */
export class InsufficientRoleError extends AuthorizationError {
  public readonly requiredRole: string;
  public readonly currentRole: string;

  constructor(requiredRole: string, currentRole: string) {
    super(`Bu amalni bajarish uchun "${requiredRole}" roli talab qilinadi. Sizning rolingiz: "${currentRole}"`);
    this.name = 'InsufficientRoleError';
    this.requiredRole = requiredRole;
    this.currentRole = currentRole;
  }
}

// ============================================
// VALIDATION ERRORS (400)
// ============================================

/**
 * Validatsiya xatosi
 * Input ma'lumotlari noto'g'ri
 * 
 * HTTP Status: 400 Bad Request
 */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>, message: string = 'Validatsiya xatosi') {
    super(message, 400, true);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Maydon yetishmayapti xatosi
 * Majburiy maydon kiritilmagan
 * 
 * HTTP Status: 400 Bad Request
 */
export class MissingFieldError extends ValidationError {
  constructor(fieldName: string) {
    super({ [fieldName]: [`${fieldName} maydoni majburiy`] });
    this.name = 'MissingFieldError';
  }
}

// ============================================
// NOT FOUND ERRORS (404)
// ============================================

/**
 * Topilmadi xatosi
 * So'ralgan resurs topilmadi
 * 
 * HTTP Status: 404 Not Found
 */
export class NotFoundError extends AppError {
  public readonly resource: string;
  public readonly id?: string;

  constructor(resource: string, id?: string) {
    const message = id ? `${resource} (ID: ${id}) topilmadi` : `${resource} topilmadi`;
    super(message, 404, true);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }
}

// ============================================
// CONFLICT ERRORS (409)
// ============================================

/**
 * Konflikt xatosi
 * Resurs allaqachon mavjud (masalan, email allaqachon ro'yxatdan o'tgan)
 * 
 * HTTP Status: 409 Conflict
 */
export class ConflictError extends AppError {
  public readonly field: string;

  constructor(field: string, message?: string) {
    super(message || `${field} allaqachon mavjud`, 409, true);
    this.name = 'ConflictError';
    this.field = field;
  }
}

/**
 * Email allaqachon mavjud xatosi
 * 
 * HTTP Status: 409 Conflict
 */
export class EmailExistsError extends ConflictError {
  constructor(email: string) {
    super('email', `Bu email (${email}) allaqachon ro'yxatdan o'tgan`);
    this.name = 'EmailExistsError';
  }
}

// ============================================
// SERVER ERRORS (500)
// ============================================

/**
 * Server xatosi
 * Kutilmagan ichki xato
 * 
 * HTTP Status: 500 Internal Server Error
 * 
 * XAVFSIZLIK: Foydalanuvchiga umumiy xabar ko'rsatiladi,
 * lekin log'ga to'liq xato yoziladi.
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Server xatosi yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.') {
    super(message, 500, false); // isOperational = false (tizim xatosi)
    this.name = 'InternalServerError';
  }
}

/**
 * Database xatosi
 * Ma'lumotlar bazasi bilan bog'liq xato
 * 
 * HTTP Status: 500 Internal Server Error
 */
export class DatabaseError extends InternalServerError {
  constructor(message: string = 'Ma\'lumotlar bazasi xatosi') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// ============================================
// ERROR HANDLER HELPER
// ============================================

/**
 * Xatoni HTTP javobga aylantirish
 * Server Actions va API endpoint'larida ishlatiladi
 */
export function handleError(error: unknown): {
  success: false;
  error: string;
  statusCode: number;
  details?: any;
} {
  // Custom AppError
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      details: error instanceof ValidationError ? error.errors : undefined,
    };
  }

  // Zod validation error
  if (error instanceof Error && error.name === 'ZodError') {
    return {
      success: false,
      error: 'Validatsiya xatosi',
      statusCode: 400,
      details: JSON.parse(error.message),
    };
  }

  // Noma'lum xato
  console.error('Kutilmagan xato:', error);
  
  return {
    success: false,
    error: 'Server xatosi yuz berdi',
    statusCode: 500,
  };
}

/**
 * Xatoni log qilish
 * Development va production uchun turli formatda
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const prefix = context ? `[${context}]` : '';
  
  if (error instanceof AppError) {
    if (error.isOperational) {
      // Operatsion xato (foydalanuvchi xatosi)
      console.warn(`${prefix} ${timestamp} - ${error.name}: ${error.message}`);
    } else {
      // Tizim xatosi
      console.error(`${prefix} ${timestamp} - ${error.name}: ${error.message}`);
      console.error(error.stack);
    }
  } else {
    // Noma'lum xato
    console.error(`${prefix} ${timestamp} - Kutilmagan xato:`, error);
  }
}
