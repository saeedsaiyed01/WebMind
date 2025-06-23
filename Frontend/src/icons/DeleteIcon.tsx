  export interface IconProps {
    size: "sm" | "md" | "lg";
    onClick?: () => void; // Optional onClick prop
  }

  export const iconSizeVariant = {
    sm: "size-2",
    md: "size-4",
    lg: "size-6",
  };

  export const defaultDesign = {
    size: "md",
  };

  export function DeleteIcon(props: IconProps) {
    return (
      <svg
        onClick={props.onClick}
        className={iconSizeVariant[props.size]}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        id="delete"
      >
        <g fill="none" fill-rule="evenodd" stroke="#4A4A4A">
          <path d="M5.5 7.5V20A1.5 1.5 0 0 0 7 21.5h11a1.5 1.5 0 0 0 1.5-1.5V7.5h-14z"></path>
          <path
            stroke-linecap="round"
            d="M8.5 10.41v8.18M12.5 10.41v8.18M16.5 10.41v8.18M9 4.333V3.244C9 2.557 9.627 2 10.4 2h4.2c.773 0 1.4.557 1.4 1.244v1.09"
          ></path>
          <rect width="4" height="4" x="3.5" y="4" rx="1.5"></rect>
        </g>
      </svg>
    );
  }
