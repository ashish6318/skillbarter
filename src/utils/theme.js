// Universal theme utility classes using CSS variables
export const themeClasses = {
  // Backgrounds
  bgPrimary: 'bg-bg-primary',
  bgSecondary: 'bg-bg-secondary', 
  bgTertiary: 'bg-bg-tertiary',
  bgElevated: 'bg-bg-elevated',
  bgHover: 'bg-bg-hover',
  bgActive: 'bg-bg-active',
  
  // Text colors
  textPrimary: 'text-text-primary',
  textSecondary: 'text-text-secondary', 
  textMuted: 'text-text-muted',
  textAccent: 'text-accent-primary',
  textInverse: 'text-text-inverse',
  
  // Borders
  borderPrimary: 'border-border-primary',
  borderSecondary: 'border-border-secondary',
  borderAccent: 'border-border-accent',
  
  // Button styles
  buttonPrimary: 'bg-accent-primary hover:bg-accent-hover text-text-inverse border border-accent-primary',
  buttonSecondary: 'bg-bg-secondary hover:bg-bg-hover text-text-primary border border-border-primary',
  buttonGhost: 'bg-transparent hover:bg-bg-hover text-text-primary border border-transparent',
  buttonOutline: 'bg-transparent border border-border-accent text-accent-primary hover:bg-accent-light',
  
  // Interactive states
  hover: 'hover:bg-bg-hover',
  active: 'active:bg-bg-active',
  focus: 'focus:border-border-accent focus:ring-2 focus:ring-accent-primary/20 focus:outline-none',
  disabled: 'opacity-50 cursor-not-allowed',
  
  // Status colors
  success: 'text-theme-success',
  successBg: 'bg-theme-success',
  successLight: 'bg-[var(--success-light)]',
  warning: 'text-theme-warning',
  warningBg: 'bg-theme-warning', 
  warningLight: 'bg-[var(--warning-light)]',
  error: 'text-theme-error',
  errorBg: 'bg-theme-error',
  errorLight: 'bg-[var(--error-light)]',
  info: 'text-theme-info',
  infoBg: 'bg-theme-info',
  infoLight: 'bg-[var(--info-light)]',
  
  // Gradients and special effects
  gradientAccent: 'bg-gradient-to-r from-accent-primary to-accent-muted',
  gradientHover: 'hover:from-accent-hover hover:to-accent-primary',
  gradientPrimary: 'bg-gradient-to-br from-accent-primary to-accent-muted',
  cardGradient: 'bg-gradient-to-br from-bg-primary to-bg-secondary',
  textGradient: 'bg-gradient-to-r from-accent-primary to-accent-hover bg-clip-text text-transparent',
  
  // Shadows using CSS variables
  shadowSm: 'shadow-[var(--shadow-sm)]',
  shadowMd: 'shadow-[var(--shadow-md)]',
  shadowLg: 'shadow-[var(--shadow-lg)]',
  shadowXl: 'shadow-[var(--shadow-xl)]',
  
  // Transitions
  transition: 'transition-all duration-200 ease-in-out',
  transitionColors: 'transition-colors duration-200 ease-in-out',
  transitionShadow: 'transition-shadow duration-200 ease-in-out',
  transitionTransform: 'transition-transform duration-200 ease-in-out',
};

// Helper function to combine theme classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Status-specific theme classes
export const statusClasses = {
  // Success states
  successPrimary: cn("bg-theme-success text-white"),
  successSecondary: cn("bg-theme-success/20 text-theme-success border border-theme-success/30"),
  successLight: cn("bg-theme-success/10 text-theme-success"),
  
  // Warning states  
  warningPrimary: cn("bg-theme-warning text-white"),
  warningSecondary: cn("bg-theme-warning/20 text-theme-warning border border-theme-warning/30"),
  warningLight: cn("bg-theme-warning/10 text-theme-warning"),
  
  // Error states
  errorPrimary: cn("bg-theme-error text-white"),
  errorSecondary: cn("bg-theme-error/20 text-theme-error border border-theme-error/30"),
  errorLight: cn("bg-theme-error/10 text-theme-error"),
  
  // Info states
  infoPrimary: cn("bg-theme-info text-white"),
  infoSecondary: cn("bg-theme-info/20 text-theme-info border border-theme-info/30"),
  infoLight: cn("bg-theme-info/10 text-theme-info"),
};

// Universal button variants
export const buttonVariants = {
  primary: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
    themeClasses.gradientAccent,
    themeClasses.textInverse,
    themeClasses.shadowMd,
    "hover:shadow-[var(--shadow-lg)] hover:scale-105",
    themeClasses.focus
  ),
  secondary: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 border",
    themeClasses.bgSecondary,
    themeClasses.textPrimary,
    themeClasses.borderPrimary,
    themeClasses.hover,
    themeClasses.focus
  ),
  outline: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 border bg-transparent",
    themeClasses.textAccent,
    "border-accent-primary hover:bg-accent-primary hover:text-text-inverse",
    themeClasses.focus
  ),
  ghost: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-transparent",
    themeClasses.textSecondary,
    themeClasses.hover,
    "hover:text-text-primary",
    themeClasses.focus
  ),
  danger: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
    "bg-theme-error text-white hover:bg-theme-error/80",
    themeClasses.shadowMd,
    themeClasses.focus
  ),  success: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
    "bg-theme-success text-white hover:bg-theme-success/80", 
    themeClasses.shadowMd,
    themeClasses.focus
  ),
  warning: cn(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
    "bg-theme-warning text-white hover:bg-theme-warning/80", 
    themeClasses.shadowMd,
    themeClasses.focus
  )
};

// Common component patterns using theme variables
export const componentPatterns = {
  // Cards and containers
  card: cn(
    themeClasses.bgSecondary, 
    themeClasses.borderPrimary, 
    'border rounded-xl p-6', 
    themeClasses.shadowMd, 
    themeClasses.transition
  ),
  cardHover: cn(
    themeClasses.bgSecondary, 
    themeClasses.borderPrimary, 
    'border rounded-xl p-6', 
    themeClasses.shadowMd, 
    themeClasses.transition,
    'hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer',
    'hover:border-border-accent'
  ),
  
  // Buttons
  button: cn(
    'px-4 py-2 rounded-lg font-medium', 
    themeClasses.transition, 
    themeClasses.focus
  ),
  buttonPrimary: cn(
    'px-4 py-2 rounded-lg font-medium',
    themeClasses.buttonPrimary,
    themeClasses.transition,
    themeClasses.focus,
    'hover:shadow-[var(--shadow-md)]'
  ),
  buttonSecondary: cn(
    'px-4 py-2 rounded-lg font-medium',
    themeClasses.buttonSecondary,
    themeClasses.transition,
    themeClasses.focus
  ),
  
  // CTA Section patterns
  ctaSection: cn(
    'py-20 bg-accent-primary',
    themeClasses.borderSecondary,
    'border-t'
  ),
  ctaButton: cn(
    'px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center',
    'bg-bg-primary text-accent-primary hover:bg-bg-secondary',
    themeClasses.transition,
    themeClasses.shadowMd,
    'hover:shadow-[var(--shadow-lg)]'
  ),
  ctaButtonOutline: cn(
    'px-8 py-3 rounded-lg font-semibold border-2',
    'border-bg-primary text-text-inverse hover:bg-bg-primary hover:text-accent-primary',
    themeClasses.transition
  ),
  
  // Form elements
  input: cn(
    themeClasses.bgSecondary, 
    themeClasses.borderSecondary, 
    'border rounded-lg px-3 py-2', 
    themeClasses.textPrimary, 
    themeClasses.transition, 
    themeClasses.focus
  ),
  textarea: cn(
    themeClasses.bgSecondary, 
    themeClasses.borderSecondary, 
    'border rounded-lg px-3 py-2 resize-none', 
    themeClasses.textPrimary, 
    themeClasses.transition, 
    themeClasses.focus
  ),
  
  // Navigation and layout
  modal: cn(
    themeClasses.bgPrimary, 
    'rounded-2xl', 
    themeClasses.shadowXl, 
    themeClasses.borderPrimary, 
    'border'
  ),
  navbar: cn(
    themeClasses.bgPrimary, 
    themeClasses.borderPrimary, 
    'border-b backdrop-blur-sm bg-opacity-95', 
    themeClasses.shadowSm
  ),
  navbarEnhanced: cn(
    themeClasses.bgPrimary, 
    themeClasses.borderPrimary, 
    'border-b backdrop-blur-lg bg-opacity-95', 
    themeClasses.shadowMd,
    'supports-[backdrop-filter]:bg-bg-primary/80'
  ),
  footer: cn(
    themeClasses.bgSecondary,
    themeClasses.borderPrimary,
    'border-t'
  ),
  footerSection: cn(
    'py-12 relative'
  ),
  dropdown: cn(
    themeClasses.bgPrimary, 
    themeClasses.borderPrimary, 
    'border rounded-lg', 
    themeClasses.shadowLg
  ),
  dropdownEnhanced: cn(
    themeClasses.bgPrimary, 
    themeClasses.borderPrimary, 
    'border rounded-2xl backdrop-blur-lg', 
    themeClasses.shadowXl,
    'bg-opacity-95'
  ),
  
  // Content elements
  badge: cn(
    'px-2 py-1 rounded-full text-xs font-medium', 
    themeClasses.bgTertiary, 
    themeClasses.textSecondary
  ),
  badgeAccent: cn(
    'px-2 py-1 rounded-full text-xs font-medium', 
    'bg-accent-light', 
    themeClasses.textAccent,
    'border border-border-accent'
  ),
  divider: cn(themeClasses.borderSecondary, 'border-t'),
  
  // Special elements
  avatar: cn(
    'rounded-full overflow-hidden flex items-center justify-center',
    themeClasses.bgTertiary,
    themeClasses.borderPrimary,
    'border'
  ),
  pill: cn(
    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
    themeClasses.bgTertiary,
    themeClasses.textSecondary,
    themeClasses.transition,
    themeClasses.hover
  ),
};
