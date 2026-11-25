import type { SVGProps } from "react";

interface LogoAProps extends SVGProps<SVGSVGElement> {
  size?: number;
  variant?: "badge" | "mark";
}

/**
 * Custom geometric "A" monogram for Rizky Aditya.
 * Architectural outer apex + stealth cyber delta crossbar.
 */
export function LogoA({
  size = 24,
  variant = "badge",
  className = "",
  ...props
}: LogoAProps) {
  if (variant === "mark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M14.3 6.5H17.7L25.5 25.5H21.7L16 11.2L10.3 25.5H6.5L14.3 6.5Z"
          fill="currentColor"
        />
        <path
          d="M16 17.8L19.2 22.8L16 21.1L12.8 22.8L16 17.8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" rx="7" fill="var(--logo-bg)" />
      <path
        d="M14.3 6.5H17.7L25.5 25.5H21.7L16 11.2L10.3 25.5H6.5L14.3 6.5Z"
        fill="var(--logo-fg)"
      />
      <path
        d="M16 17.8L19.2 22.8L16 21.1L12.8 22.8L16 17.8Z"
        fill="var(--logo-fg)"
      />
    </svg>
  );
}
