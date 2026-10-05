export interface GiftCategory {
  /** Route slug, used as /categories/[id] */
  id: string
  name: string
  /** Short label used in chips and filters */
  short: string
  description: string
}

/**
 * Every shopping occasion the store supports. Item counts are derived from
 * the product catalog (`data/products.ts`) so they always stay in sync.
 * Icons live in `lib/icons.ts` (SVG icons, never emoji).
 */
export const categories: GiftCategory[] = [
  {
    id: 'birthday',
    name: 'Birthday Gifts',
    short: 'Birthday',
    description: 'Cakes, keepsakes and surprises for every age and every budget.',
  },
  {
    id: 'anniversary',
    name: 'Anniversary Gifts',
    short: 'Anniversary',
    description: 'Mark another year together with romantic, thoughtful presents.',
  },
  {
    id: 'wedding',
    name: 'Wedding Gifts',
    short: 'Wedding',
    description: 'Elegant gifts for newlyweds, from glassware to home essentials.',
  },
  {
    id: 'graduation',
    name: 'Graduation Gifts',
    short: 'Graduation',
    description: 'Celebrate the cap, the gown and the next big chapter.',
  },
  {
    id: 'holiday',
    name: 'Holiday Gifts',
    short: 'Holiday',
    description: 'Festive picks that make the season feel extra special.',
  },
  {
    id: 'housewarming',
    name: 'Housewarming Gifts',
    short: 'Housewarming',
    description: 'Warm up any new place with decor, kitchen and cozy comforts.',
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower Gifts',
    short: 'Baby Shower',
    description: 'Adorable and practical gifts for the littlest arrivals.',
  },
  {
    id: 'retirement',
    name: 'Retirement Gifts',
    short: 'Retirement',
    description: 'Honor a career well spent with meaningful keepsakes.',
  },
  {
    id: 'thank-you',
    name: 'Thank You Gifts',
    short: 'Thank You',
    description: 'Small gestures that say a very big thank you.',
  },
  {
    id: 'get-well',
    name: 'Get Well Gifts',
    short: 'Get Well',
    description: 'Comforting gifts that send warm wishes for a speedy recovery.',
  },
  {
    id: 'corporate',
    name: 'Corporate Gifts',
    short: 'Corporate',
    description: 'Premium gifting for clients, teams and company milestones.',
  },
  {
    id: 'self-care',
    name: 'Self-Care Gifts',
    short: 'Self-Care',
    description: 'Relaxation, wellness and slow Sundays in gift form.',
  },
  {
    id: 'valentines',
    name: "Valentine's Day Gifts",
    short: "Valentine's",
    description: 'Romantic surprises for February 14 and every day after.',
  },
  {
    id: 'mothers-day',
    name: "Mother's Day Gifts",
    short: "Mother's Day",
    description: 'Flowers, spa treats and keepsakes for the best mum.',
  },
  {
    id: 'fathers-day',
    name: "Father's Day Gifts",
    short: "Father's Day",
    description: 'Practical, premium picks for dad, grandad and mentors.',
  },
  {
    id: 'christmas',
    name: 'Christmas Gifts',
    short: 'Christmas',
    description: 'Stocking fillers, tree trimmers and big day showstoppers.',
  },
  {
    id: 'engagement',
    name: 'Engagement Gifts',
    short: 'Engagement',
    description: 'Celebrate the yes with sparkling, sentimental gifts.',
  },
  {
    id: 'teacher',
    name: 'Teacher Appreciation',
    short: 'Teacher',
    description: 'Say thanks with gifts educators actually love.',
  },
]

export interface GiftType {
  /** Used as /gifts?type=<id> */
  id: string
  name: string
  description: string
  /** Artwork in /public/images/gifts */
  image: string
}

/**
 * Gift types (what the product *is*), independent of the occasion it is for.
 * Icons live in `lib/icons.ts`; artwork lives in `public/images/gifts`.
 */
export const giftTypes: GiftType[] = [
  { id: 'personalized', name: 'Personalized Keepsakes', description: 'Engraved, monogrammed and made for one person only.', image: '/images/gifts/personalized.svg' },
  { id: 'flowers', name: 'Flowers & Plants', description: 'Fresh bouquets, hardy houseplants and dried stems.', image: '/images/gifts/flowers.svg' },
  { id: 'sweets', name: 'Chocolates & Sweets', description: 'Truffles, brownie boxes and small-batch confectionery.', image: '/images/gifts/sweets.svg' },
  { id: 'candles', name: 'Candles & Home Fragrance', description: 'Soy candles, diffusers and room mists.', image: '/images/gifts/candles.svg' },
  { id: 'jewelry', name: 'Jewelry', description: 'Dainty, everyday pieces and statement sparkle.', image: '/images/gifts/jewelry.svg' },
  { id: 'tech', name: 'Tech Gadgets', description: 'Gadgets they will actually use every day.', image: '/images/gifts/tech.svg' },
  { id: 'toys', name: 'Toys & Games', description: 'Plush, puzzles and screen-free fun for all ages.', image: '/images/gifts/toys.svg' },
  { id: 'gourmet', name: 'Gourmet Food & Drinks', description: 'Hampers, artisan snacks and speciality drinks.', image: '/images/gifts/gourmet.svg' },
  { id: 'beauty', name: 'Beauty & Wellness', description: 'Bath sets, skincare and wellness essentials.', image: '/images/gifts/beauty.svg' },
  { id: 'books', name: 'Books & Stationery', description: 'Bestsellers, journals and beautiful desk goods.', image: '/images/gifts/books.svg' },
  { id: 'decor', name: 'Home Decor', description: 'Art, throws and objects that make a house a home.', image: '/images/gifts/decor.svg' },
  { id: 'experiences', name: 'Gift Cards & Experiences', description: 'When only they know what they really want.', image: '/images/gifts/experiences.svg' },
  { id: 'accessories', name: 'Accessories', description: 'Watches, bags, eyewear and everyday carry.', image: '/images/gifts/accessories.svg' },
]

export const giftTypeById = (id: string) => giftTypes.find((type) => type.id === id)

export const categoryById = (id: string) => categories.find((category) => category.id === id)
