// Selected operational photos supplied by the company.
// Full images are used in the viewer; smaller thumbnails keep the grid lightweight.
const photographs = [
  { file: 'equipment-delivery', title: 'Heavy equipment handling', category: 'operations' },
  { file: 'container-loading', title: 'Container loading', category: 'operations' },
  { file: 'covered-cargo-transport', title: 'Cargo transportation', category: 'transport' },
  { file: 'warehouse-equipment', title: 'Warehouse operations', category: 'operations' },
  { file: 'crane-operation', title: 'Heavy equipment handling', category: 'operations' },
  { file: 'forklift-handling', title: 'Forklift operations', category: 'operations' },
  { file: 'warehouse-loading', title: 'Container loading', category: 'operations' },
  { file: 'container-team', title: 'On-site teamwork', category: 'operations' },
  { file: 'secured-cargo', title: 'Cargo transportation', category: 'transport' },
  { file: 'cargo-securing', title: 'Cargo securing', category: 'operations' },
  { file: 'forklift-yard', title: 'Forklift operations', category: 'operations' },
  { file: 'container-trucking', title: 'Container transportation', category: 'transport' },
]

export function createWorkGallery(t) {
  return photographs.map((photo) => ({
    src: `/images/work/${photo.file}.webp`,
    thumbnail: `/images/work/${photo.file}-thumb.webp`,
    title: t(photo.title),
    category: photo.category,
    label: photo.category === 'transport' ? 'TRANSPORTATION' : 'CARGO OPERATIONS',
  }))
}
