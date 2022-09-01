import * as request from './useRequestInWorker.js'

const defaultJpg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAACmCAYAAADpnHI/AAACDElEQVR4nO3TMQqEUBAFwZ29/41/oLmIGChCUxW+SSbpWWttM/M7Otuu9rt34H3/rx8AnidsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUE7J6YFSL2yVpMAAAAASUVORK5CYII='

self.addEventListener('message', async (e) => {
  const { json, docsId, jpg, type, token, isDev } = e.data
  const { post } = request.default(token, isDev)
  if (type === 'sync') {
    const { json: newSlidesJson } = await post(`/api/docs/${docsId}/update`, {
      json,
      previewImageUrl: jpg || defaultJpg,
    })
    self.postMessage({
      type: 'resp',
      json: newSlidesJson
    })
  }
})
