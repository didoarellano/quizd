import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

export function BackButton() {
  const [, navigate] = useLocation();

  function goBack() {
    history.length > 1 ? history.go(-1) : navigate("/");
  }

  return (
    <button onClick={goBack} className="[&_svg]:size-10 hover:text-teal-600">
      <ChevronLeft />
    </button>
  );
}
