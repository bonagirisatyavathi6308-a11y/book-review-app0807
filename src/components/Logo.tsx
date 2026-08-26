import mascot from "@/assets/book-review-mascot.png.asset.json";
import { cn } from "@/lib/utils";

export function Mascot({ className }: { className?: string }) {
  return (
    <img
      src={mascot.url}
      alt="Book Review mascot: a smiling purple book holding pencils"
      className={cn("select-none object-contain", className)}
    />
  );
}

export default Mascot;
