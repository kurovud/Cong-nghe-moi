/**
 * File API service — calls backend file-service via API gateway
 */
const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fileApi = {
  upload: async (file: File): Promise<{ success: boolean; data: { url: string; filename: string } }> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_GATEWAY}/api/files/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  uploadMultiple: async (files: File[]): Promise<{ success: boolean; data: { urls: string[] } }> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const res = await fetch(`${API_GATEWAY}/api/files/upload-multiple`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  getUrl: (filename: string) => `${API_GATEWAY}/uploads/${filename}`,
};
