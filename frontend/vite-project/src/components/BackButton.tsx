// src/components/BackButton.tsx
import { useNavigate } from "react-router-dom";

type Props = {
  to: string;
  text?: string;
  color?: string;
};

export default function BackButton({
  to,
  text = "Volver",
  color = "#007c91",
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`absolute top-0 left-0 mt-2 ml-2 flex items-center gap-1 hover:opacity-90 transition-opacity`}
      style={{ color }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="font-medium text-base">{text}</span>
    </button>
  );
}
