import { UUID } from "crypto";

export function parseUUID(text: string): UUID | null {
    const stripped = text.replaceAll(/[-\s]/, '').toLowerCase();

    if (!stripped.match(/[0-9a-f]{32}/)) {
        return null;
    }

    return [
        stripped.substring(0, 8),
        stripped.substring(8, 12),
        stripped.substring(12, 16),
        stripped.substring(16, 20),
        stripped.substring(20)
    ].join('-') as UUID;
}