const MINERU_BASE = "https://mineru.net/api/v1";

function getApiKey(): string {
  const key = process.env["mineru-api-key"];
  if (!key) throw new Error("mineru-api-key not found in .env");
  return key;
}

interface MinerUInitResponse {
  code: number;
  msg: string;
  data: { task_id: string; file_url: string };
}

interface MinerUPollResponse {
  data: { state: string; markdown_url?: string; err_msg?: string };
}

export async function extractTextWithMinerU(
  fileBuffer: Buffer,
  fileName: string,
  language = "ch"
): Promise<string> {
  // Step 1: Init — get task_id and OSS upload URL
  const initRes = await fetch(`${MINERU_BASE}/agent/parse/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ file_name: fileName, language }),
  });
  const initData: MinerUInitResponse = await initRes.json();
  if (initData.code !== 0) throw new Error(`MinerU init error: ${initData.msg}`);

  const { task_id, file_url } = initData.data;

  // Step 2: Upload file to OSS
  await fetch(file_url, { method: "PUT", body: new Uint8Array(fileBuffer) });

  // Step 3: Poll for result
  for (let i = 0; i < 60; i++) {
    const pollRes = await fetch(`${MINERU_BASE}/agent/parse/${task_id}`, {
      headers: { Authorization: `Bearer ${getApiKey()}` },
    });
    const pollData: MinerUPollResponse = await pollRes.json();
    if (pollData.data.state === "done") {
      const mdRes = await fetch(pollData.data.markdown_url!);
      return await mdRes.text();
    }
    if (pollData.data.state === "failed") {
      throw new Error(`MinerU parse failed: ${pollData.data.err_msg}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("MinerU timeout after 2 minutes");
}

/** Read text file directly, skip MinerU */
export function readTextFile(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/** Check if file needs MinerU processing */
export function needsMinerU(mimeType: string): boolean {
  const mineruTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/bmp",
  ];
  return mineruTypes.includes(mimeType);
}

/** Supported file types (including those that don't need MinerU) */
export const SUPPORTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
];
