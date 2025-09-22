import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
};

export function AdminToggle({ isAdmin, setIsAdmin }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="admin-mode"
        checked={isAdmin}
        onCheckedChange={(checked) => setIsAdmin(!!checked)}
      />
      <Label
        htmlFor="admin-mode"
        className="text-sm cursor-pointer select-none"
      >
        Admin Mode
      </Label>
    </div>
  );
}
