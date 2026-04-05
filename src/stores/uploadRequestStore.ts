// ===== UPLOAD REQUEST STORE =====
// Module-level singleton to pass pre-fill data from TodoManagement -> KlassenarbeitenScreen
// without prop drilling through multiple layers (App -> Profil -> Klassenarbeiten)

export interface UploadRequest {
  linkedTaskId: string;
  subject: string;
  grade: string; // e.g. "2+", "1-", "3"
}

let pendingUploadRequest: UploadRequest | null = null;

export function setPendingUploadRequest(req: UploadRequest | null) {
  pendingUploadRequest = req;
}

export function consumePendingUploadRequest(): UploadRequest | null {
  const req = pendingUploadRequest;
  pendingUploadRequest = null;
  return req;
}
