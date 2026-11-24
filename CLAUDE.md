# lnky — frontend

Web app rút gọn link. Vue 3 + Vite + TypeScript, Pinia, TanStack Query, Vue Router, UI bằng **Nuxt UI v4** (Reka UI + Tailwind CSS v4).

- Backend: repo `katatrina/url-shortener` (Go). API: `POST /auth/signup`, `POST /auth/login`, `GET /me`, `GET|POST /links`, `GET|PATCH|DELETE /links/:id`, `GET /links/:id/stats`.
- Tài liệu (Notion, trang "URL Shortener"). Đây là nguồn sự thật cho màn hình, flow, state và câu chữ:
  - 03 — UI/UX Design: screen inventory (SC01–SC14), Auth UX, Business states, quy ước dịch thuật
  - 01 — Functional Requirements, Glossary
  Đọc phần liên quan của trang 03 trước khi làm một màn hình. Nếu không đọc được Notion, hỏi người dùng, không đoán.

## Lệnh

- `npm run dev`: port 5173 cố định (backend chỉ cho CORS từ localhost:5173)
- `npm run type-check`, `npm run build`
- `npm run check:ui`: bắt màu cứng, gradient, shadow, emoji, icon lạ, control tự chế

Sau mỗi thay đổi UI: chạy `check:ui` và `type-check`, sửa đến khi sạch.

## Cấu trúc

- `src/api/`, `src/stores/`, `src/router/`, `src/composables/`, `src/utils/`: logic, không phụ thuộc UI. Giữ nguyên, chỉ sửa khi task yêu cầu.
- `src/views/`: một file cho một màn hình (SC..).
- `src/components/links/`, `AppShell.vue`, `AuthForm.vue`, `StatCard.vue`: block riêng của sản phẩm, ghép từ component Nuxt UI.
- `src/assets/css/main.css`: theme (màu, chữ, radius, font). **Chỉ sửa theme ở đây.**
- **Legacy, đang gỡ:** `src/components/cs/`, `src/styles/`, `docs/design-system/` (Cloudscape). Không thêm code mới vào đây, không import vào code mới. Khi một màn hình đã chuyển xong, xóa component `Cs*` không còn ai dùng. Khi hết hẳn, xóa luôn các import legacy trong `main.ts`.

## UI: luật bắt buộc

**Component**
- Dùng component Nuxt UI (`UButton`, `UInput`, `UFormField`, `UForm`, `UModal`, `UCard`, `UTable`, `UDropdownMenu`, `UTabs`, `UAlert`, `UBadge`, `UBreadcrumb`, `UChart`, `useToast`…). Component được auto-import, không cần import tay.
- Trước khi dùng một component, đọc docs của đúng v4: `https://ui.nuxt.com/docs/components/<tên>`. Không viết API theo trí nhớ (v2/v3 khác v4).
- Tùy biến bằng props (`color`, `variant`, `size`) và prop `:ui`. Không bọc lại component Nuxt UI chỉ để đổi style.
- Không tự dựng `<button>`, `<input>`, `<dialog>`, dropdown, modal bằng HTML và Tailwind.

**Màu và chữ**
- Chỉ dùng class semantic: chữ `text-highlighted` (heading, giá trị chính), `text-default` (body), `text-toned` (label), `text-muted` (phụ: ngày, số click, URL đích), `text-dimmed` (chỉ placeholder/disabled). Nền `bg-default`, `bg-muted`, `bg-elevated`. Viền `border-default`, `border-muted`.
- Trạng thái dùng color của component: `color="error|success|warning|info|neutral"`, và luôn có icon hoặc chữ đi kèm, không dùng màu đơn độc.
- Không dùng màu palette (`text-gray-500`, `bg-blue-600`), hex, rgb, oklch trong component.
- `primary` là đen: **mỗi màn hình hoặc modal chỉ một** `UButton` mặc định (solid primary). Các nút khác dùng `color="neutral"` với `variant="outline|ghost|soft"`.

**Bố cục**
- Trang đăng nhập: AppShell (thanh trên cùng) + nội dung một cột, `max-w-[1080px] mx-auto`. Không có sidebar.
- Nhóm nội dung bằng `UCard` hoặc khối `border border-default rounded-lg`. Không dùng shadow cho bề mặt tĩnh.
- Khoảng cách theo thang Tailwind (`gap-2/3/4/6/8`, `p-4/6`). Không dùng giá trị lẻ kiểu `mt-[13px]`.
- Desktop-only, baseline 1280px. Light theme only.

**Icon**: chỉ `i-lucide-*`. Không emoji, không thư viện icon khác.

**Câu chữ** (chi tiết ở mục 7 của trang 03 trên Notion)
- Tiếng Việt. Sentence case, kể cả nút và header cột ("Tạo link mới").
- Giữ tiếng Anh: URL, Link, Email, Click, Copy, Slug, Domain.
- Nút = động từ + đối tượng. Không chấm cuối nút/heading.
- Xác nhận ngắn: "Xóa link này?", không dùng "Bạn có chắc chắn rằng…".
- Ngày `dd/mm/yyyy`, giờ 24h, số có dấu phẩy hàng nghìn (`src/utils/format.ts`).
- Trường bắt buộc: `required` trên `UFormField` (dấu * đỏ). Trường tùy chọn không ghi "(không bắt buộc)".
- Lỗi theo field nằm trong `UFormField` (`error`). Lỗi chung của form: `UAlert color="error"` trên form. Map lỗi từ `src/api/errors.ts`.

**Phản hồi sau hành động**: toast (`useToast`), ví dụ "Đã tạo link" kèm nút Copy, "Đã xóa link". Thay cho Flashbar cũ (`stores/flash.ts`, gỡ khi AppShell chuyển xong).

**State**: mỗi màn hình có dữ liệu phải xử lý đủ loading / empty / error / success theo bảng Business states (trang 03, mục 5). Empty state = một câu + một nút hành động.

## Cấm (AI slop)

- Gradient, glassmorphism/blur, shadow trang trí, glow
- Màu tím/xanh "AI" mặc định, nhiều màu nhấn trên một màn hình
- Hero section, lưới "feature" 3 cột có icon, câu chữ marketing, số liệu giả
- Emoji, Title Case, chữ IN HOA toàn bộ
- Animation trang trí (bounce, pulse, float). Chỉ dùng transition mặc định của Nuxt UI.
- Thêm trường, nút, màn hình, thư viện mà task không yêu cầu
- Dữ liệu giả trong UI: luôn lấy từ API qua `src/api/`

## Cách làm một màn hình

1. Đọc mục của màn hình đó trong trang 03 (screen inventory, business states).
2. Đọc docs Nuxt UI của các component sẽ dùng.
3. Viết view/block, dùng lại logic trong `api/`, `stores/`, `composables/`.
4. Chạy `check:ui` + `type-check`.
5. Mở trình duyệt, kiểm tra từng state (loading, empty, error, success). Chụp màn hình nếu có công cụ.
6. Xóa component `Cs*` không còn được dùng.
