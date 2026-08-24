// Server-only: mirrors uploaded meal photos into the foundation's Google Drive
// folder: "om foundation meals served" (ID: 1jIbOz5tqnmTCdAOHDg_Ozu_O3MoMSEZO)

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive";

// "om foundation meals served" folder in Google Drive.
const ROOT_FOLDER_ID =
  process.env["GOOGLE_DRIVE_MEAL_FOLDER_ID"] ?? "1jIbOz5tqnmTCdAOHDg_Ozu_O3MoMSEZO";

function headers() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_DRIVE_API_KEY"];
  if (!lovableKey || !connectionKey) return null;
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
  };
}

async function findOrCreateDateFolder(servedOn: string, auth: Record<string, string>) {
  const q = encodeURIComponent(
    `name='${servedOn}' and mimeType='application/vnd.google-apps.folder' and '${ROOT_FOLDER_ID}' in parents and trashed=false`,
  );
  const listRes = await fetch(`${GATEWAY}/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: auth,
  });
  if (listRes.ok) {
    const body = (await listRes.json()) as { files?: { id: string }[] };
    const existing = body.files?.[0];
    if (existing) return existing.id;
  } else {
    console.error(`Drive folder lookup failed [${listRes.status}]: ${await listRes.text()}`);
  }

  const createRes = await fetch(`${GATEWAY}/drive/v3/files?fields=id`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: servedOn,
      mimeType: "application/vnd.google-apps.folder",
      parents: [ROOT_FOLDER_ID],
    }),
  });
  if (!createRes.ok) {
    console.error(`Drive folder create failed [${createRes.status}]: ${await createRes.text()}`);
    return null;
  }
  const created = (await createRes.json()) as { id: string };
  return created.id;
}

export type DriveUploadResult = { fileId: string; link: string } | null;

/**
 * Uploads one photo to Drive with name format: "om foundation meals served - [servedOn] - [fileName]"
 */
export async function mirrorPhotoToDrive(args: {
  servedOn: string;
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
}): Promise<DriveUploadResult> {
  const auth = headers();
  if (!auth) return null;

  try {
    const folderId = (await findOrCreateDateFolder(args.servedOn, auth)) ?? ROOT_FOLDER_ID;

    const boundary = `omfoundation${crypto.randomUUID().replace(/-/g, "")}`;
    const metadata = JSON.stringify({
      name: `om foundation meals served - ${args.servedOn} - ${args.fileName}`,
      parents: [folderId],
    });
    const encoder = new TextEncoder();
    const head = encoder.encode(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
        `--${boundary}\r\nContent-Type: ${args.contentType}\r\n\r\n`,
    );
    const tail = encoder.encode(`\r\n--${boundary}--\r\n`);
    const body = new Uint8Array(head.length + args.bytes.length + tail.length);
    body.set(head, 0);
    body.set(args.bytes, head.length);
    body.set(tail, head.length + args.bytes.length);

    const res = await fetch(
      `${GATEWAY}/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink`,
      {
        method: "POST",
        headers: { ...auth, "Content-Type": `multipart/related; boundary=${boundary}` },
        body,
      },
    );
    if (!res.ok) {
      console.error(`Drive upload failed [${res.status}]: ${await res.text()}`);
      return null;
    }
    const file = (await res.json()) as { id: string; webViewLink?: string };
    return {
      fileId: file.id,
      link: file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`,
    };
  } catch (err) {
    console.error("Drive mirror error", err);
    return null;
  }
}

export async function deleteDriveFile(fileId: string) {
  const auth = headers();
  if (!auth) return;
  try {
    const res = await fetch(`${GATEWAY}/drive/v3/files/${fileId}`, {
      method: "DELETE",
      headers: auth,
    });
    if (!res.ok) {
      console.error(`Drive delete failed [${res.status}]: ${await res.text()}`);
    }
  } catch (err) {
    console.error("Drive delete error", err);
  }
}
