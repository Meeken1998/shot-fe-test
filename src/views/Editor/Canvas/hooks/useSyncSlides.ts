import { updateDocs } from '@/apis/docs'
import { Slide } from '@/types/slides'

export default (docsId: string, slides: Slide[], previewImageUrl: string) => {
  void updateDocs(docsId, previewImageUrl, 'ppt', JSON.stringify(slides), )
}
