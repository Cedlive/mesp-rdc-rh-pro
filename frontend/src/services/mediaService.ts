
import ApiService from './api';

export interface MediaFile {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
}

const MediaService = {
  upload: async (file: File, visibility: 'public' | 'private' = 'private') => {
    // Dans une vraie implémentation, on utiliserait FormData
    // const formData = new FormData();
    // formData.append('file', file);
    // return ApiService.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    // Simulation pour le prototype JSON
    const fakePayload = {
        name: file.name,
        size: file.size,
        type: file.type,
        visibility
    };
    return ApiService.post<MediaFile>('/media/upload', fakePayload);
  },

  getMyFiles: (type?: string) => ApiService.get<MediaFile[]>(`/media/my-files${type ? `?type=${type}` : ''}`),
};

export default MediaService;
