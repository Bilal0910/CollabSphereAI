export interface MoodBoardImage {
  id: string;
  file?: File;
  preview: string;
  storageId: string;
  url?: string;
  error?: string;
  uploaded: boolean;
  uploading: boolean;
  isFromServer?: boolean;
}