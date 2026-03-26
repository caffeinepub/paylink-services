import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useFileUpload() {
  const { actor } = useActor();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  const uploadFile = async (
    file: File,
    key: string,
  ): Promise<ExternalBlob | null> => {
    if (!file) return null;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setUploadProgress((prev) => ({ ...prev, [key]: pct }));
    });
    return blob;
  };

  return { uploadFile, uploadProgress, actor };
}
