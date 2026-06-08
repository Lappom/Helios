import { problem } from "@/lib/api/response";

export function assertNotSystemDelete(source: string): void {
  if (source === "system") {
    throw problem({
      type: "forbidden",
      title: "Cannot delete system exercise",
      status: 403,
    });
  }
}
