export interface VariationOption {
  label: string
  /** Added to the base price when this option is chosen */
  priceDelta?: number
  /** Hex colour used to render a swatch chip */
  swatch?: string
}

export interface Variation {
  id: string
  /** e.g. "Colour", "Size", "Metal" */
  name: string
  options: VariationOption[]
}

export interface CustomizationField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'choice'
  required?: boolean
  maxLength?: number
  options?: string[]
  priceDelta?: number
}

export interface Gift {
  id: string
  name: string
  price: number
  image: string
  /** Image gallery (main photo first) */
  images?: string[]
  /** Occasion, must match a `GiftCategory.name` from data/categories.ts */
  category: string
  /** Gift type id, must match a `GiftType.id` from data/categories.ts */
  type: string
  tag?: 'Bestseller' | 'New' | 'Premium' | 'Eco' | 'Limited'
  description: string
  /** Colour / size / … variations offered for this product */
  variations?: Variation[]
  /** Personalization fields (engraving, gift note, …) */
  customization?: CustomizationField[]
  stock?: number
}

type RawGift = Omit<
  Gift,
  'image' | 'images' | 'variations' | 'customization' | 'stock'
>

const rawGifts: RawGift[] = [
  // Birthday Gifts
  { id: 'g1', name: 'Personalized Photo Album', price: 29.99, category: 'Birthday Gifts', type: 'personalized', tag: 'Bestseller', description: 'A hardbound album with space for 60 photos, foil-stamped with their name.' },
  { id: 'g2', name: 'Gourmet Chocolate Box', price: 39.99, category: 'Birthday Gifts', type: 'sweets', description: 'Twenty-four single-origin truffles in a keepsake box.' },
  { id: 'g11', name: 'Portable Bluetooth Speaker', price: 54.99, category: 'Birthday Gifts', type: 'tech', description: 'Pocket-sized speaker with 12 hours of playtime and a splash-proof shell.' },
  { id: 'g13', name: 'Craft Beer Brewing Kit', price: 79.99, category: 'Birthday Gifts', type: 'gourmet', description: 'Everything needed to brew twelve bottles of pale ale at home.' },
  { id: 'g48', name: 'Birthday Balloon Gift Box', price: 42.99, category: 'Birthday Gifts', type: 'sweets', tag: 'New', description: 'Balloons, cake pops and a card, packed into one bright box.' },

  // Anniversary Gifts
  { id: 'g3', name: 'Smart Home Assistant', price: 99.99, category: 'Anniversary Gifts', type: 'tech', tag: 'Premium', description: 'Voice-controlled speaker with rich sound and smart home control.' },
  { id: 'g4', name: 'Handcrafted Leather Wallet', price: 49.99, category: 'Anniversary Gifts', type: 'personalized', description: 'Full-grain leather wallet, hand-tooled with their initials.' },
  { id: 'g7', name: 'Customized Star Map', price: 59.99, category: 'Anniversary Gifts', type: 'decor', tag: 'Bestseller', description: 'The night sky exactly as it looked on your special date.' },
  { id: 'g49', name: 'Memory Jar Kit', price: 26.99, category: 'Anniversary Gifts', type: 'personalized', description: '365 folded notes in a glass jar they fill all year long.' },

  // Wedding Gifts
  { id: 'g5', name: 'Luxury Scented Candle Set', price: 34.99, category: 'Wedding Gifts', type: 'candles', description: 'Three soy candles — fig, amber and sea salt — in gift-ready tins.' },
  { id: 'g6', name: 'Wireless Bluetooth Earbuds', price: 79.99, category: 'Wedding Gifts', type: 'tech', description: 'Noise-cancelling earbuds with a 30-hour charging case.' },
  { id: 'g15', name: 'Gourmet Spice Collection', price: 39.99, category: 'Wedding Gifts', type: 'gourmet', description: 'Twelve small-batch spices with matching recipe cards.' },
  { id: 'g50', name: 'Enameled Cast Iron Dutch Oven', price: 129.99, category: 'Wedding Gifts', type: 'gourmet', tag: 'Premium', description: 'A 4.5L pot made for slow Sundays and Sunday roasts.' },
  { id: 'g60', name: 'Copper Moscow Mule Mugs', price: 49.99, category: 'Wedding Gifts', type: 'gourmet', description: 'A hammered pair of mugs with a cocktail recipe booklet.' },

  // Graduation Gifts
  { id: 'g8', name: 'Gourmet Coffee Sampler', price: 44.99, category: 'Graduation Gifts', type: 'gourmet', description: 'Six single-origin roasts from small-batch farms.' },
  { id: 'g9', name: 'Fitness Tracker Watch', price: 89.99, category: 'Graduation Gifts', type: 'tech', tag: 'New', description: 'Heart-rate, sleep and workout tracking with a seven-day battery.' },
  { id: 'g14', name: 'Designer Sunglasses', price: 129.99, category: 'Graduation Gifts', type: 'accessories', tag: 'Premium', description: 'Polarized lenses in a slim, timeless frame.' },
  { id: 'g51', name: 'Starlight Projector', price: 49.99, category: 'Graduation Gifts', type: 'tech', tag: 'New', description: 'Room-filling galaxy projector with app and voice control.' },

  // Holiday Gifts
  { id: 'g10', name: 'Artisanal Cheese Board Set', price: 69.99, category: 'Holiday Gifts', type: 'gourmet', description: 'Bamboo board with stainless tools and a cheese pairing guide.' },
  { id: 'g12', name: 'Luxury Bath and Body Set', price: 49.99, category: 'Holiday Gifts', type: 'beauty', description: 'Bath salts, body butter and a loofah in a reusable box.' },
  { id: 'g52', name: 'Mulled Wine & Mistletoe Set', price: 39.99, category: 'Holiday Gifts', type: 'gourmet', tag: 'Limited', description: 'Spiced wine kit with dried orange and a mistletoe sprig.' },

  // Housewarming Gifts
  { id: 'g16', name: 'Welcome Mat', price: 24.99, category: 'Housewarming Gifts', type: 'decor', description: 'Coir mat with cheerful hand-lettering that survives muddy boots.' },
  { id: 'g23', name: 'Decorative Throw Pillows', price: 34.99, category: 'Housewarming Gifts', type: 'decor', description: 'Pair of woven cushions in warm, easy-to-match neutral tones.' },
  { id: 'g53', name: 'Ceramic Vase Trio', price: 44.99, category: 'Housewarming Gifts', type: 'decor', description: 'Three hand-glazed vases in graduating heights.' },

  // Baby Shower Gifts
  { id: 'g17', name: 'Personalized Baby Blanket', price: 39.99, category: 'Baby Shower Gifts', type: 'personalized', tag: 'Bestseller', description: 'Organic cotton blanket embroidered with the baby’s name.' },
  { id: 'g24', name: 'Baby Care Essentials Kit', price: 69.99, category: 'Baby Shower Gifts', type: 'beauty', description: 'Fragrance-free lotion, wash and cream made for new skin.' },
  { id: 'g54', name: 'Soft Muslin Swaddle Set', price: 32.99, category: 'Baby Shower Gifts', type: 'accessories', tag: 'Eco', description: 'Four breathable cotton swaddles in gentle unisex prints.' },

  // Retirement Gifts
  { id: 'g18', name: 'Engraved Watch', price: 149.99, category: 'Retirement Gifts', type: 'accessories', tag: 'Premium', description: 'Classic chronograph engraved with a message on the caseback.' },
  { id: 'g25', name: 'Golf Club Set', price: 299.99, category: 'Retirement Gifts', type: 'experiences', tag: 'Premium', description: 'Starter set with stand bag, woods and irons.' },
  { id: 'g55', name: 'Whiskey Glass Set', price: 54.99, category: 'Retirement Gifts', type: 'gourmet', description: 'Two weighty tumblers with chilling stones and a tray.' },

  // Thank You Gifts
  { id: 'g19', name: 'Thank You Gift Basket', price: 59.99, category: 'Thank You Gifts', type: 'gourmet', description: 'Sweet and savoury snacks, tea and a handwritten-style card.' },
  { id: 'g26', name: 'Handwritten Thank You Cards', price: 19.99, category: 'Thank You Gifts', type: 'books', description: 'Box of twelve letterpress cards with matching envelopes.' },
  { id: 'g56', name: 'Desktop Gratitude Journal', price: 22.99, category: 'Thank You Gifts', type: 'books', description: 'Guided 90-day journal with a linen cover and lay-flat binding.' },

  // Get Well Gifts
  { id: 'g20', name: 'Aromatherapy Diffuser', price: 44.99, category: 'Get Well Gifts', type: 'candles', description: 'Ultrasonic diffuser bundled with lavender and eucalyptus oils.' },
  { id: 'g27', name: 'Cozy Blanket and Tea Set', price: 54.99, category: 'Get Well Gifts', type: 'decor', description: 'Soft fleece throw paired with a wellness tea collection.' },
  { id: 'g57', name: 'Recovery Comfort Hamper', price: 49.99, category: 'Get Well Gifts', type: 'gourmet', description: 'Herbal teas, raw honey and warming socks for slow recoveries.' },

  // Corporate Gifts
  { id: 'g21', name: 'Executive Pen Set', price: 79.99, category: 'Corporate Gifts', type: 'personalized', description: 'Weighted metal pen and rollerball in a lacquer presentation case.' },
  { id: 'g28', name: 'Leather Portfolio', price: 89.99, category: 'Corporate Gifts', type: 'accessories', description: 'Slim A4 portfolio with a notepad, pen loop and card slots.' },
  { id: 'g58', name: 'Leather Card Holder', price: 39.99, category: 'Corporate Gifts', type: 'accessories', description: 'Slim metal-and-leather card holder, boxed in pairs.' },

  // Self-Care Gifts
  { id: 'g22', name: 'Spa Day Kit', price: 89.99, category: 'Self-Care Gifts', type: 'beauty', description: 'Face masks, bath bombs, oils and a plush headband.' },
  { id: 'g29', name: 'Meditation Cushion Set', price: 49.99, category: 'Self-Care Gifts', type: 'decor', description: 'Buckwheat zafu with a carry handle and washable cover.' },
  { id: 'g59', name: 'Bath Bomb Gift Set', price: 27.99, category: 'Self-Care Gifts', type: 'beauty', tag: 'Bestseller', description: 'Nine plant-based bath bombs in nine different scents.' },

  // Valentine's Day Gifts
  { id: 'g30', name: 'Engraved Heart Locket', price: 79.99, category: "Valentine's Day Gifts", type: 'jewelry', tag: 'Bestseller', description: 'Sterling silver locket with room for a tiny photo inside.' },
  { id: 'g31', name: 'Rose & Chocolate Duet', price: 49.99, category: "Valentine's Day Gifts", type: 'sweets', description: 'Twelve long-stem roses delivered with a box of truffles.' },
  { id: 'g32', name: 'Love Letter Keepsake Kit', price: 29.99, category: "Valentine's Day Gifts", type: 'personalized', description: 'Five prompted love letters and a linen keepsake box.' },

  // Mother's Day Gifts
  { id: 'g33', name: 'Spa Gift Basket for Her', price: 74.99, category: "Mother's Day Gifts", type: 'beauty', tag: 'Bestseller', description: 'Bath oil, body scrub, candle and fluffy slippers in one basket.' },
  { id: 'g34', name: 'Personalized Recipe Book', price: 44.99, category: "Mother's Day Gifts", type: 'personalized', description: 'Linen-bound book printed with the family recipes she handed down.' },
  { id: 'g35', name: 'Fresh Tulip Bouquet', price: 39.99, category: "Mother's Day Gifts", type: 'flowers', tag: 'New', description: 'Twenty hand-tied tulips in seasonal colours, delivered in water.' },

  // Father's Day Gifts
  { id: 'g36', name: 'Leather Dopp Kit', price: 59.99, category: "Father's Day Gifts", type: 'accessories', description: 'Water-resistant leather toiletry bag with a wipe-clean lining.' },
  { id: 'g37', name: 'BBQ Tool Set', price: 69.99, category: "Father's Day Gifts", type: 'gourmet', description: 'Six-piece stainless set with a roll-up canvas case.' },
  { id: 'g38', name: 'Insulated Travel Mug', price: 34.99, category: "Father's Day Gifts", type: 'personalized', description: 'Keeps coffee hot for twelve hours, engraved on demand.' },

  // Christmas Gifts
  { id: 'g39', name: 'Personalized Ornament Set', price: 34.99, category: 'Christmas Gifts', type: 'personalized', tag: 'Limited', description: 'Three glass ornaments engraved with family names and the year.' },
  { id: 'g40', name: 'Holiday Cookie Tin', price: 44.99, category: 'Christmas Gifts', type: 'sweets', description: 'Three dozen butter and gingerbread cookies in a reusable tin.' },
  { id: 'g41', name: 'Cozy Winter Throw', price: 64.99, category: 'Christmas Gifts', type: 'decor', description: 'Chunky knit blanket in deep winter tones, big enough for two.' },

  // Engagement Gifts
  { id: 'g42', name: 'Crystal Champagne Flutes', price: 59.99, category: 'Engagement Gifts', type: 'decor', description: 'Pair of lead-free crystal flutes in a presentation box.' },
  { id: 'g43', name: 'Custom Engagement Star Map', price: 54.99, category: 'Engagement Gifts', type: 'decor', description: 'The night sky over their engagement, printed on archival paper.' },
  { id: 'g44', name: 'Cheese & Wine Hamper', price: 99.99, category: 'Engagement Gifts', type: 'gourmet', tag: 'Premium', description: 'Prosecco with artisan cheese, crackers and fig chutney.' },

  // Teacher Appreciation
  { id: 'g45', name: 'Engraved Pen & Journal Set', price: 34.99, category: 'Teacher Appreciation', type: 'personalized', description: 'Notebook and pen engraved with their initials.' },
  { id: 'g46', name: 'Desk Plant Buddy', price: 24.99, category: 'Teacher Appreciation', type: 'flowers', description: 'Low-maintenance succulent in a hand-painted ceramic pot.' },
  { id: 'g47', name: 'Bookstore Gift Card', price: 25.0, category: 'Teacher Appreciation', type: 'experiences', description: 'Digital gift card redeemable against any title or journal.' },
]

import { categories } from './categories'
import { customizationFor, imagesFor, variationsFor } from './variations'

export const products: Gift[] = rawGifts.map((gift) => ({
  ...gift,
  image: `/images/products/${gift.id}.jpg`,
  images: imagesFor(gift, (name) =>
    categories.find((category) => category.name === name)?.id
  ),
  variations: variationsFor(gift),
  customization: customizationFor(gift),
  stock: 100,
}))

/** Item count per occasion name, used by category cards. */
export const categoryCounts: Record<string, number> = products.reduce(
  (counts, product) => ({
    ...counts,
    [product.category]: (counts[product.category] ?? 0) + 1,
  }),
  {} as Record<string, number>
)

export const productsByType = (typeId: string) =>
  products.filter((product) => product.type === typeId)

export const featuredProducts = products.filter((product) => product.tag === 'Bestseller')

export default products
