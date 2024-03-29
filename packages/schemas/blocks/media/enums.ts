export enum MediaBlockType {
  
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ACCORDION = 'accordion',
  CHECKLIST = 'checklist',
  FLASHCARD = 'flashcard',
  HOTSPOT = 'hotspot',
  TIMELINE = 'timeline',
  EMBED = 'embed',
  DOCUMENT_UPLOAD = 'upload',
  SLIDESHOW = 'slideshow',
  BEFORE_AFTER = 'beforeafter',
}
export const BLOCK_MEDIA_LIST = Object.values(MediaBlockType);