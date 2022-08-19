import { updateSlide } from '@/apis/docs'
import { Slide } from '@/types/slides'

export default (docsId: string, slides: Slide[], previewImageUrl: string) => {
  void updateSlide(docsId, JSON.stringify(slides), previewImageUrl)
}
