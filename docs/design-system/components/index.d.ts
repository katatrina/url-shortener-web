// Prop shapes for the Vue 3 SFCs that wrap this system's markup (documentation, not a runtime bundle).
// Each <Comp>Props maps to CsComp.vue; events listed as `on…` are emitted as kebab-case (`@dismiss`).

export type IconName = string; // file name under assets/Icons without .svg, e.g. 'status-positive'

export interface ButtonProps { variant?: 'normal' | 'primary' | 'link' | 'icon'; disabled?: boolean; loading?: boolean; iconName?: IconName; iconAlign?: 'left' | 'right'; href?: string; ariaLabel?: string; formAction?: 'submit' | 'none'; onClick?: (e: MouseEvent) => void }
export interface LinkProps { href: string; variant?: 'primary' | 'secondary' | 'info'; external?: boolean; onFollow?: (e: MouseEvent) => void }
export interface InputProps { modelValue: string; type?: 'text' | 'search' | 'number' | 'email' | 'password' | 'url'; placeholder?: string; disabled?: boolean; readOnly?: boolean; invalid?: boolean; warning?: boolean; iconName?: IconName; ariaLabel?: string; ariaDescribedby?: string }
export interface FormFieldProps { label?: string; description?: string; constraintText?: string; errorText?: string; warningText?: string; stretch?: boolean /* slots: default (control), info */ }
export interface SelectOption { value: string; label?: string; description?: string; disabled?: boolean; iconName?: IconName }
export interface SelectProps { modelValue: SelectOption | null; options: SelectOption[]; placeholder?: string; disabled?: boolean; invalid?: boolean; filteringType?: 'none' | 'auto'; empty?: string; ariaLabel?: string }
export interface CheckboxProps { modelValue: boolean; indeterminate?: boolean; disabled?: boolean; description?: string /* slot: label */ }
export interface ToggleProps { modelValue: boolean; disabled?: boolean; description?: string /* slot: label */ }
export interface HeaderProps { variant?: 'h1' | 'h2' | 'h3'; counter?: string; description?: string /* slots: default (title), actions, info */ }
export interface ContainerProps { variant?: 'default' | 'stacked'; disableContentPaddings?: boolean /* slots: header, default, footer */ }
export interface TableColumn<T = unknown> { id: string; header: string; cell: (item: T) => unknown; sortingField?: string; width?: number; minWidth?: number }
export interface TableProps<T = unknown> { items: T[]; columns: TableColumn<T>[]; trackBy?: string; selectionType?: 'single' | 'multi'; selectedItems?: T[]; loading?: boolean; loadingText?: string; sortingColumn?: string; sortingDescending?: boolean /* slots: header, empty, pagination, filter */ }
export interface BadgeProps { color?: 'grey' | 'blue' | 'green' | 'red' | 'severity-critical' | 'severity-high' | 'severity-medium' | 'severity-low' }
export interface StatusIndicatorProps { type: 'success' | 'error' | 'warning' | 'info' | 'in-progress' | 'pending' | 'stopped' | 'not-started'; coloredText?: boolean }
export interface AlertProps { type?: 'info' | 'success' | 'warning' | 'error'; header?: string; dismissible?: boolean; onDismiss?: () => void /* slots: default, action */ }
export interface FlashbarItem { id: string; type: 'success' | 'error' | 'warning' | 'info'; header?: string; content?: string; dismissible?: boolean; loading?: boolean }
export interface FlashbarProps { items: FlashbarItem[]; onDismiss?: (id: string) => void }
export interface TabsProps { activeTabId: string; tabs: { id: string; label: string; disabled?: boolean }[] }
export interface BreadcrumbGroupProps { items: { text: string; href: string }[]; onFollow?: (href: string, e: MouseEvent) => void }
export interface SideNavigationItem { type: 'link' | 'section' | 'divider'; text?: string; href?: string; external?: boolean; items?: SideNavigationItem[] }
export interface SideNavigationProps { header?: { text: string; href: string }; items: SideNavigationItem[]; activeHref?: string; onFollow?: (href: string, e: MouseEvent) => void }
export interface TopNavigationProps { identity: { title: string; href: string; logo?: { src: string; alt: string } }; utilities?: { type: 'button' | 'menu-dropdown'; text?: string; iconName?: IconName; ariaLabel?: string; items?: { id: string; text: string; href?: string }[] }[] /* slot: search */ }
export interface ModalProps { visible: boolean; header: string; size?: 'small' | 'medium' | 'large'; onDismiss?: () => void /* slots: default, footer */ }
export interface AppLayoutProps { navigationOpen?: boolean; navigationWidth?: number; contentType?: 'default' | 'table' | 'form' | 'dashboard' /* slots: navigation, breadcrumbs, notifications, default */ }
