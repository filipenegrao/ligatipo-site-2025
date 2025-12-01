/**
 * @typedef {Object} MediaItem
 * @property {('image'|'video')} type
 * @property {string} src
 * @property {string} [alt]
 * @property {number} [order]
 */

/**
 * @typedef {Object} Showcase
 * @property {string} id
 * @property {string} title
 * @property {string} [designer]
 * @property {string} [publishedAt]
 * @property {string} [contactUrl]
 * @property {string} [contactLabel]
 * @property {MediaItem[]} items
 */

// These JSDoc typedefs help keep frontend and API aligned until
// we introduce shared TypeScript types in a monorepo package.
