import { Button } from "@/components/ui/Button";
import { logout } from "../actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="ghost" size="sm">
        exit
      </Button>
    </form>
  );
}
