import type { CustomizationField, Gift, Variation } from './products'

/**
 * Variation / customization defaults keyed by gift type, plus a few
 * name-based overrides. Applied when seeding the catalog (data/products.ts)
 * so every product that plausibly varies actually varies.
 */

const SWATCHES: Record<string, string> = {
  Navy: '#000068',
  Gold: '#e8b44a',
  'Rose Gold': '#d78a7f',
  Silver: '#c0c4cc',
  Black: '#1f2024',
  White: '#f6f6f4',
  Ivory: '#f3ecdd',
  Amber: '#d99a3d',
  Sage: '#a3b18a',
  Tan: '#b98a5a',
  Brown: '#6b4a2f',
  Charcoal: '#3c3f45',
  Oatmeal: '#e6ddca',
  Blue: '#3a6ea5',
  Red: '#b3382f',
  Clear: '#dfe6ea',
  Natural: '#d9c6a5',
  'Dark Walnut': '#5a3b25',
}

const opt = (label: string, priceDelta = 0) => ({
  label,
  priceDelta: priceDelta || undefined,
  swatch: SWATCHES[label],
})

const BY_TYPE: Record<string, Variation[]> = {
  personalized: [
    { id: 'finish', name: 'Finish', options: [opt('Natural'), opt('Dark Walnut'), opt('White')] },
  ],
  flowers: [
    { id: 'size', name: 'Size', options: [opt('Standard'), opt('Deluxe', 15), opt('Premium', 30)] },
  ],
  sweets: [
    { id: 'size', name: 'Box Size', options: [opt('12 pieces'), opt('24 pieces', 10), opt('36 pieces', 20)] },
  ],
  candles: [
    { id: 'colour', name: 'Colour', options: [opt('Ivory'), opt('Amber'), opt('Sage')] },
    { id: 'size', name: 'Size', options: [opt('Small'), opt('Medium', 8), opt('Large', 16)] },
  ],
  jewelry: [
    { id: 'metal', name: 'Metal', options: [opt('Silver'), opt('Gold'), opt('Rose Gold', 10)] },
  ],
  tech: [
    { id: 'colour', name: 'Colour', options: [opt('Black'), opt('White'), opt('Navy', 5)] },
  ],
  toys: [
    { id: 'colour', name: 'Colour', options: [opt('Red'), opt('Blue'), opt('White')] },
  ],
  gourmet: [
    { id: 'serving', name: 'Serving Size', options: [opt('Serves 2'), opt('Serves 4', 12), opt('Family', 24)] },
  ],
  beauty: [
    { id: 'size', name: 'Size', options: [opt('Travel'), opt('Full Size', 10)] },
  ],
  books: [
    { id: 'format', name: 'Format', options: [opt('Paperback'), opt('Hardcover', 6)] },
  ],
  decor: [
    { id: 'colour', name: 'Colour', options: [opt('Ivory'), opt('Navy'), opt('Sage')] },
    { id: 'size', name: 'Size', options: [opt('Small'), opt('Large', 12)] },
  ],
  experiences: [
    { id: 'delivery', name: 'Delivery', options: [opt('Digital'), opt('Printed Card', 3)] },
  ],
  accessories: [
    { id: 'colour', name: 'Colour', options: [opt('Black'), opt('Tan'), opt('Navy')] },
  ],
}

/** Name-based overrides for products whose variation lives outside their type. */
const BY_NAME: Array<{ match: RegExp; variations: Variation[] }> = [
  {
    match: /watch/i,
    variations: [{ id: 'colour', name: 'Colour', options: [opt('Silver'), opt('Gold'), opt('Rose Gold', 15)] }],
  },
  {
    match: /wallet|bag|portfolio|dopp|card holder/i,
    variations: [{ id: 'colour', name: 'Colour', options: [opt('Tan'), opt('Black'), opt('Brown')] }],
  },
  {
    match: /blanket|throw|pillow|swaddle|cushion/i,
    variations: [
      { id: 'colour', name: 'Colour', options: [opt('Oatmeal'), opt('Charcoal'), opt('Sage')] },
      { id: 'size', name: 'Size', options: [opt('Standard'), opt('Large', 10)] },
    ],
  },
  {
    match: /mug|glass|tumbler|flute/i,
    variations: [{ id: 'set', name: 'Set', options: [opt('Pair'), opt('Set of 4', 18)] }],
  },
  {
    match: /speaker|earbuds|headphones/i,
    variations: [{ id: 'colour', name: 'Colour', options: [opt('Black'), opt('White'), opt('Navy', 5)] }],
  },
]

export const variationsFor = (gift: Pick<Gift, 'name' | 'type'>): Variation[] => {
  for (const { match, variations } of BY_NAME) {
    if (match.test(gift.name)) return variations
  }
  return BY_TYPE[gift.type] ?? []
}

const ENGRAVING: CustomizationField[] = [
  {
    id: 'engraving',
    label: 'Engraving / personalization text',
    type: 'text',
    maxLength: 30,
    required: false,
  },
  {
    id: 'monogram',
    label: 'Monogram style',
    type: 'choice',
    options: ['Classic Serif', 'Modern Sans', 'Script'],
  },
]

const GIFT_NOTE: CustomizationField = {
  id: 'giftNote',
  label: 'Gift note (handwritten on the card)',
  type: 'textarea',
  maxLength: 140,
}

/** Products that can be personalized get engraving fields; everything else gets a gift note. */
export const customizationFor = (gift: Pick<Gift, 'name' | 'type'>): CustomizationField[] => {
  const personal = gift.type === 'personalized' || /personaliz|engrav|customi|monogram|initials/i.test(gift.name)
  if (personal) return [...ENGRAVING, GIFT_NOTE]
  return [GIFT_NOTE]
}

/** Gallery: main photo + its type photo + its occasion photo. */
export const imagesFor = (
  gift: Pick<Gift, 'id' | 'type' | 'category'>,
  categoryNameToSlug: (name: string) => string | undefined
): string[] => {
  const slug = categoryNameToSlug(gift.category)
  return [
    `/images/products/${gift.id}.jpg`,
    `/images/types/${gift.type}.jpg`,
    ...(slug ? [`/images/categories/${slug}.jpg`] : []),
  ]
}
