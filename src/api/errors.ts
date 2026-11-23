// Vietnamese UI text per error code. The backend's English messages are never shown.
import { ApiError } from './client'
import type { FieldErrorCode } from './types'

const GENERIC_MESSAGES: Partial<Record<ApiError['code'], string>> = {
  NETWORK_ERROR: 'Không thể kết nối tới máy chủ. Hãy kiểm tra mạng và thử lại.',
  INTERNAL_SERVER_ERROR: 'Máy chủ gặp lỗi. Hãy thử lại sau.',
  INVALID_RESPONSE: 'Phản hồi từ máy chủ không hợp lệ. Hãy thử lại sau.',
  INCORRECT_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.',
  PAYLOAD_TOO_LARGE: 'Dữ liệu gửi lên quá lớn.',
  INVALID_JSON_FORMAT: 'Dữ liệu gửi lên không hợp lệ.',
  VALIDATION_FAILED: 'Thông tin chưa hợp lệ. Hãy kiểm tra lại các ô bên dưới.',
  SLUG_ALREADY_EXISTS: 'Slug này đã được dùng, chọn slug khác.',
  LINK_QUOTA_EXCEEDED: 'Bạn đã dùng hết 10 link. Xóa bớt link để tạo link mới.',
  LINK_NOT_FOUND: 'Link không tồn tại hoặc đã bị xóa.',
}

const FALLBACK_MESSAGE = 'Đã có lỗi xảy ra. Hãy thử lại.'

/** One-line message for an Alert. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return GENERIC_MESSAGES[error.code] ?? FALLBACK_MESSAGE
  return FALLBACK_MESSAGE
}

/** How a form names each backend field, e.g. `{ email: 'Email', password: 'Mật khẩu' }`. */
export type FieldLabels = Record<string, string>

/** Per-field, per-code copy that replaces the default template. */
export type FieldMessageOverrides = Record<string, Partial<Record<FieldErrorCode, string>>>

export function fieldMessage(code: FieldErrorCode, label: string): string {
  switch (code) {
    case 'REQUIRED':
      return `Nhập ${label.toLowerCase()}.`
    case 'INVALID_FORMAT':
      return `${label} không đúng định dạng.`
    case 'TOO_SHORT':
      return `${label} quá ngắn.`
    case 'TOO_LONG':
      return `${label} quá dài.`
    default:
      return `${label} không hợp lệ.`
  }
}

/** `ApiError.fields` → `{ email: 'Email không đúng định dạng.' }`, only for fields in `labels`. */
export function fieldErrors(
  error: unknown,
  labels: FieldLabels,
  overrides: FieldMessageOverrides = {},
): Record<string, string> {
  if (!(error instanceof ApiError)) return {}
  const result: Record<string, string> = {}
  for (const { field, code } of error.fields) {
    const label = labels[field]
    if (!label || result[field]) continue
    result[field] = overrides[field]?.[code] ?? fieldMessage(code, label)
  }
  return result
}
