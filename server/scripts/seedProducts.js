import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import Review from '../src/models/Review.js';
import NewsletterSubscriber from '../src/models/NewsletterSubscriber.js';
import ContactMessage from '../src/models/ContactMessage.js';

export const productsData = [
  // 1. Serums & Glazing
  {
    name: 'Dew Veil Hydrating Serum',
    slug: 'dew-veil-hydrating-serum',
    tagline: 'Weightless moisture with a glass-skin finish',
    shortDescription: 'A silky, moisture-quenching serum formulated with multi-weight hyaluronic acid and soothing Damask rose distillate.',
    description: 'Dew Veil is designed to replenish thirsty skin with a featherlight layer of long-lasting comfort. Formulated with five molecular weights of hyaluronic acid, vegan squalane, and delicate Damask rose distillate, it melts seamlessly into the skin to leave a radiant, plump, dewy glow without any residue.',
    price: 1850,
    originalPrice: 2200,
    category: 'Serums',
    volume: '30 ml / 1.0 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608248597359-2e698888b506?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Rosa Damascena Flower Water, Aqua, Sodium Hyaluronate (Multi-Molecular Complex), Glycerin, Niacinamide, Squalane, Panthenol, Camellia Sinensis Leaf Extract, Ethylhexylglycerin.',
    keyBenefits: [
      'Delivers instant dewy bounce and deep hydration',
      'Plumps fine dehydration lines',
      'Preps skin for smooth, effortless makeup application'
    ],
    directions: 'Apply 3 to 4 drops onto freshly cleansed, slightly damp face and neck. Press gently with warm palms until absorbed.',
    skinType: 'Ideal for normal, dry, dehydrated, and sensitive skin types.',
    stockQuantity: 42,
    isFeatured: true,
    rating: 4.9,
    numReviews: 32
  },
  {
    name: 'Nectar Glow Peptide Glazing Fluid',
    slug: 'nectar-glow-peptide-glazing-fluid',
    tagline: 'Luminous skin-priming glaze for dewy radiance',
    shortDescription: 'A featherlight glazing fluid packed with copper tripeptide-1, niacinamide, and vegan squalane.',
    description: 'The ultimate shortcut to that coveted glazed skincare finish. Nectar Glow primes, plumps, and enriches your skin with biomimetic copper peptides, brightening niacinamide, and ultra-lightweight sugarcane squalane. Wear it alone on bare skin, mixed with your moisturizer, or tapped over cheekbones as a natural highlight.',
    price: 2250,
    originalPrice: 2600,
    category: 'Serums',
    volume: '50 ml / 1.7 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-2e698888b506?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Glycerin, Niacinamide, Squalane, Copper Tripeptide-1, Sodium Acetylated Hyaluronate, Tocopherol, Camellia Japonica Seed Oil, Allantoin.',
    keyBenefits: [
      'Creates an instant lit-from-within glazed finish',
      'Supports collagen synthesis and skin elasticity',
      'Multi-functional serum, primer, and liquid highlighter'
    ],
    directions: 'Dispense 1-2 pumps onto fingertips and smooth evenly across face and neck after cleansing or as the penultimate step before sunscreen.',
    skinType: 'All skin types seeking a radiant, glassy complexion.',
    stockQuantity: 28,
    isFeatured: true,
    rating: 4.9,
    numReviews: 24
  },

  // 2. Toners & Mists
  {
    name: 'Milky Dew Essence Toner',
    slug: 'milky-dew-essence-toner',
    tagline: 'Silky comforting milky essence that cushions and preps',
    shortDescription: 'A rich, barrier-nourishing milky essence infused with tremella snow mushroom, fermented rice milk, and centella asiatica.',
    description: 'An embrace of pure comfort for your skin. This cushioning milky essence combines the lightness of a toner with the deep nourishment of an emulsion. Tremella mushroom holds 500x its weight in water, while fermented rice milk softens texture and fortifies compromised moisture barriers.',
    price: 1650,
    originalPrice: 1950,
    category: 'Toners & Mists',
    volume: '120 ml / 4.0 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Oryza Sativa (Rice) Bran Water, Tremella Fuciformis Extract, Centella Asiatica Extract, Glycerin, Butylene Glycol, Panthenol, Ceramide NP, Hydrogenated Lecithin.',
    keyBenefits: [
      'Floods skin with calming hydration upon contact',
      'Softens rough texture and smooths dry flakiness',
      'Boosts absorption of subsequent serums and treatments'
    ],
    directions: 'Pour a coin-sized amount into palms and press gently into cleansed face, neck, and chest. Layer 2-3 times for enhanced cushion.',
    skinType: 'Dehydrated, dry, dull, and reactive skin.',
    stockQuantity: 35,
    isFeatured: true,
    rating: 5.0,
    numReviews: 19
  },
  {
    name: 'Rose Quartz Hydro-Calming Mist',
    slug: 'rose-quartz-hydro-calming-mist',
    tagline: 'Micro-fine hydration veil with rose hydrosol & electrolytes',
    shortDescription: 'A sensorial botanical face mist that instantly quenches dehydration, soothes visible redness, and resets makeup.',
    description: 'Crafted through gentle steam distillation of organic Damask rose petals, this micro-fine face mist delivers an instant splash of mineral electrolytes and calming floral water. Keep it on your desk, vanity, or travel tote for an immediate refresh wherever you are.',
    price: 1350,
    originalPrice: 1600,
    category: 'Toners & Mists',
    volume: '100 ml / 3.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Rosa Damascena Distillate, Aloe Barbadensis Leaf Juice, Cucumis Sativus (Cucumber) Fruit Extract, Magnesium PCA, Zinc PCA, Sodium Hyaluronate.',
    keyBenefits: [
      'Ultra-fine, cloud-like continuous spray',
      'Cooling relief from outdoor heat or indoor dry air',
      'Sets makeup with a natural petal-fresh finish'
    ],
    directions: 'Hold bottle 8-10 inches from face with eyes closed. Mist 3-4 times whenever your skin craves refreshment.',
    skinType: 'All skin types, especially sensitive or easily irritated skin.',
    stockQuantity: 26,
    isFeatured: false,
    rating: 4.8,
    numReviews: 15
  },

  // 3. Moisturizers & Barrier Creams
  {
    name: 'Cloud Cream Barrier Moisturizer',
    slug: 'cloud-cream-barrier-moisturizer',
    tagline: 'Cushiony restorative cream for stressed skin barriers',
    shortDescription: 'A whipped, velvety daily face cream formulated with 3 essential skin-identical ceramides, colloidal oat, and botanical lipids.',
    description: 'Like a gentle cocoon for your skin, Cloud Cream restores comfort to dry, tired, and over-sensitized barriers. Its whipped texture cushions the skin, locking in hydration while soothing visible redness and reinforcing natural defense barriers against daily environmental stressors.',
    price: 2150,
    originalPrice: 2500,
    category: 'Moisturizers',
    volume: '50 ml / 1.7 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Caprylic/Capric Triglyceride, Butyrospermum Parkii (Shea) Butter, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Avena Sativa (Oat) Kernel Flour, Palmitoyl Tripeptide-1, Allantoin.',
    keyBenefits: [
      'Deep barrier reinforcement and long-wearing comfort',
      'Calms feeling of tightness and irritation',
      'Silky, non-greasy cushion finish'
    ],
    directions: 'Warm a dime-sized amount between fingertips and smooth over face, neck, and décolletage after your serum routine.',
    skinType: 'Dry, normal, combination, and compromised skin.',
    stockQuantity: 38,
    isFeatured: true,
    rating: 5.0,
    numReviews: 41
  },
  {
    name: 'Silk Cushion Water-Gel Moisturizer',
    slug: 'silk-cushion-water-gel-moisturizer',
    tagline: 'Weightless cooling hydration for a poreless velvet finish',
    shortDescription: 'An ultra-fresh oil-free water-gel packed with marine algae complex, provitamin B5, and soothing bamboo water.',
    description: 'Engineered for those who want deep moisture without any weight. Silk Cushion bursts upon application into a cooling splash of hydration, sinking in within seconds to leave skin bouncy, balanced, and velvet-smooth. Never greasy, never heavy.',
    price: 1950,
    originalPrice: 2300,
    category: 'Moisturizers',
    volume: '50 ml / 1.7 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Bambusa Vulgaris Water, Sodium Hyaluronate, Panthenol, Chlorella Vulgaris Extract, Allantoin, Betaine, Carbomer, Ethylhexylglycerin.',
    keyBenefits: [
      'Instant cooling sensation upon application',
      'Zero oiliness or shine throughout the day',
      'Perfect lightweight primer under makeup or sunscreen'
    ],
    directions: 'Smooth a generous dollop over clean face and neck morning and night. Can be kept in the refrigerator for an extra cooling wake-up ritual.',
    skinType: 'Combination, oily, normal, and humid-climate skin.',
    stockQuantity: 22,
    isFeatured: false,
    rating: 4.7,
    numReviews: 14
  },
  {
    name: 'Cashmere Silk Night Repair Cream',
    slug: 'cashmere-silk-night-repair-cream',
    tagline: 'Intensive overnight lipid recovery melt for rested morning skin',
    shortDescription: 'A rich regenerative night cream infused with bakuchiol bio-retinol, shea butter, and restorative botanical lipids.',
    description: 'Awaken to skin that feels transformed. This decadent night cream envelops your face in an intensive barrier recovery veil while you sleep. Formulated with gentle plant-derived bakuchiol to refine texture without irritation, paired with rich botanical squalane and centella to restore elasticity by dawn.',
    price: 2650,
    originalPrice: 3100,
    category: 'Moisturizers',
    volume: '50 ml / 1.7 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Butyrospermum Parkii Butter, Squalane, Bakuchiol, Centella Asiatica Extract, Ceramide EOP, Tocopherol, Rosa Canina (Rosehip) Seed Oil.',
    keyBenefits: [
      'Deep overnight moisture replenishment',
      'Smoothes fine dehydration lines and uneven tone',
      'Shields sensitive skin from indoor AC or heating dryness'
    ],
    directions: 'Warm a pea-sized amount between fingertips. Gently press over face and neck as the final nourishing step before bed.',
    skinType: 'Dry, mature, sensitized, or recovering skin.',
    stockQuantity: 8, // Low stock alert demonstration for Admin dashboard
    isFeatured: true,
    rating: 4.9,
    numReviews: 27
  },

  // 4. Cleansers
  {
    name: 'Velvet Foam Gentle Cleanser',
    slug: 'velvet-foam-gentle-cleanser',
    tagline: 'Cloud-soft botanical lather that never strips or tightens',
    shortDescription: 'A pH-balanced foaming gel cleanser that dissolves impurities, excess sebum, and light makeup with delicate amino acid surfactants.',
    description: 'Cleanse without compromise. Velvet Foam creates a rich, micro-cushion lather that gently sweeps away daily city grime and impurities while preserving the vital acid mantle. Infused with soothing green tea, panthenol, and chamomile for skin that feels clean, calm, and supple.',
    price: 1450,
    originalPrice: 1700,
    category: 'Cleansers',
    volume: '150 ml / 5.1 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Sodium Cocoyl Glycinate, Cocamidopropyl Betaine, Glycerin, Camellia Sinensis (Green Tea) Leaf Water, Chamomilla Recutita Flower Extract, Panthenol, Citric Acid.',
    keyBenefits: [
      'pH 5.5 skin-neutral balance',
      '100% sulfate-free amino acid cleanser',
      'Leaves skin soft and hydrated, never squeaky'
    ],
    directions: 'Lather a pump between wet hands to create cloud foam. Massage across damp skin in circular motions for 60 seconds, then rinse with lukewarm water.',
    skinType: 'All skin types, even the most reactive.',
    stockQuantity: 32,
    isFeatured: true,
    rating: 4.8,
    numReviews: 22
  },
  {
    name: 'Melt-to-Milk Purifying Cleansing Balm',
    slug: 'melt-to-milk-purifying-cleansing-balm',
    tagline: 'Sensorial sherbet balm that melts away waterproof sunscreen & makeup',
    shortDescription: 'A decadent botanical cleansing balm that transforms from a silky balm to an oil, rinsing clean as a nourishing milk.',
    description: 'The golden hour of your evening ritual. This lush cleansing balm effortlessly breaks down stubborn SPF, waterproof mascara, and long-wear pigments without any tugging. Cold-pressed jojoba oil and calming chamomile butter purify pores while leaving skin cushioned with hydration.',
    price: 1750,
    originalPrice: 2050,
    category: 'Cleansers',
    volume: '90 ml / 3.0 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil, Cetyl Ethylhexanoate, PEG-20 Glyceryl Triisostearate, Anthemis Nobilis (Chamomile) Flower Oil, Tocopheryl Acetate.',
    keyBenefits: [
      'Effortless first-step double cleanse',
      'Dissolves heavy SPF and waterproof eye makeup cleanly',
      'Zero residue, cloudiness, or pore clogging'
    ],
    directions: 'Scoop a dime-sized amount onto dry hands. Massage onto dry face to melt makeup. Add warm water to emulsify into a light milk, then rinse thoroughly.',
    skinType: 'Ideal for all skin types as Step 01 in the double cleanse.',
    stockQuantity: 20,
    isFeatured: false,
    rating: 4.9,
    numReviews: 18
  },

  // 5. Lip Care
  {
    name: 'Petal Melt Peptide Lip Treatment (Vanilla Blossom)',
    slug: 'petal-melt-peptide-lip-treatment',
    tagline: 'Glaze-like nourishment with a soft sheer blush glow',
    shortDescription: 'A cult-favorite restorative lip balm enriched with cupuaçu butter, shea, and palmitoyl tripeptides for naturally cushiony lips.',
    description: 'Petal Melt transforms dry, chapped lips into pillowy, glossy perfection. Formulated with a blend of botanical butters, vegan peptides, and cold-pressed seed oils, it cushions lips in comforting moisture while delivering an understated, high-shine petal sheen and subtle Madagascar vanilla aroma.',
    price: 950,
    originalPrice: 1100,
    category: 'Lip Care',
    volume: '12 ml / 0.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Theobroma Grandiflorum (Cupuaçu) Seed Butter, Butyrospermum Parkii Butter, Palmitoyl Tripeptide-1, Ricinus Communis Seed Oil, Tocopherol, Vanilla Planifolia Fruit Extract.',
    keyBenefits: [
      'High-gloss sheen with zero sticky residue',
      'Visibly plumps fine lip lines over time',
      'Restores dry, compromised lips overnight'
    ],
    directions: 'Glide directly onto bare lips whenever you desire comfort and shine. Apply a generous layer before bedtime for an overnight lip mask.',
    skinType: 'Dry, chapped, or volume-seeking lips.',
    stockQuantity: 48,
    isFeatured: true,
    rating: 5.0,
    numReviews: 56
  },
  {
    name: 'Berry Glaze Tinted Peptide Lip Oil (Boysenberry)',
    slug: 'berry-glaze-tinted-peptide-lip-oil',
    tagline: 'High-shine nourishing lip oil with a juicy sheer berry tint',
    shortDescription: 'A non-sticky gloss treatment enriched with cold-pressed blackberry seed oil, vitamin E, and plumping botanical peptides.',
    description: 'The sensory thrill of freshly crushed berries in a glossy, cushiony lip oil. Formulated with antioxidant-dense blackberry seed oil and hydrating plant sterols, Berry Glaze adds a hint of transparent, universally flattering berry tint while drenching lips in restorative moisture.',
    price: 1050,
    originalPrice: 1250,
    category: 'Lip Care',
    volume: '10 ml / 0.35 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608248597359-2e698888b506?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Rubus Fruticosus (Blackberry) Seed Oil, Hydrogenated Polyisobutene, Phytosteryl/Isostearyl/Cetyl/Stearyl/Behenyl Dimer Dilinoleate, Palmitoyl Tripeptide-38, Tocopherol, CI 77491.',
    keyBenefits: [
      'Glassy, non-tacky finish with a sheer wash of color',
      'Enriched with cold-pressed fruit seed oils',
      'Softens and smooths chapped texture throughout the day'
    ],
    directions: 'Swipe applicator across lips for an instant glazed berry tint. Layer over lip pencil or Petal Melt for dimensional depth.',
    skinType: 'All lips seeking sheer color and plush hydration.',
    stockQuantity: 36,
    isFeatured: true,
    rating: 4.9,
    numReviews: 38
  },
  {
    name: 'Salted Caramel Peptide Lip Treatment',
    slug: 'salted-caramel-peptide-lip-treatment',
    tagline: 'Warm, gourmand comfort with deep overnight repair',
    shortDescription: 'A decadent, delicious peptide glaze scented with warm salted vanilla caramel that softens dry chapped lips instantly.',
    description: 'A comforting treat for your senses and your lips. Infused with warm gourmand notes of salted brown sugar and buttery vanilla, this ultra-nourishing peptide glaze seals in moisture for hours. Ideal as a midday comfort ritual or soothing sleep treatment.',
    price: 980,
    originalPrice: 1150,
    category: 'Lip Care',
    volume: '12 ml / 0.4 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Theobroma Cacao Seed Butter, Butyrospermum Parkii Butter, Palmitoyl Tripeptide-1, Squalane, Flavor (Caramel), Sea Salt, Tocopherol.',
    keyBenefits: [
      'Irresistible warm salted caramel aroma',
      'Long-wearing cushion that shields against chapping',
      'Instantly smooths lip texture with a radiant glow'
    ],
    directions: 'Apply liberally onto lips as needed throughout the day, or layer thickly at night as an intensive recovery mask.',
    skinType: 'Dry, peeling, or weather-exposed lips.',
    stockQuantity: 40,
    isFeatured: false,
    rating: 4.9,
    numReviews: 29
  },

  // 6. Eye & Targeted Care
  {
    name: 'Lumière Peptide Awakening Eye Cream',
    slug: 'lumiere-peptide-awakening-eye-cream',
    tagline: 'Depuffing & brightening peptide cushion for delicate eyes',
    shortDescription: 'A velvety, featherlight eye treatment featuring green coffee caffeine, niacinamide, and tetrapeptides to illuminate tired undereyes.',
    description: 'Banish the look of fatigue with our silk-cushion eye formulation. Lumière combines stimulating green coffee caffeine to visibly reduce morning puffiness with gentle niacinamide and biomimetic tetrapeptides that target undereye darkness. Absorbs quickly without creasing under makeup.',
    price: 1850,
    originalPrice: 2200,
    category: 'Eye & Targeted',
    volume: '15 ml / 0.5 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Glycerin, Coffea Arabica (Coffee) Seed Extract, Niacinamide, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Squalane, Chrysin, Carbomer.',
    keyBenefits: [
      'Visibly reduces morning undereye puffiness',
      'Brightens the look of dark shadows and fatigue',
      'Silky, non-migrating base that never stings eyes'
    ],
    directions: 'Using ring finger, gently pat a half-pump along the orbital bone and brow bone until fully absorbed. Use morning and night.',
    skinType: 'All skin types concerned with dark circles, puffiness, or fine lines.',
    stockQuantity: 19,
    isFeatured: false,
    rating: 4.8,
    numReviews: 16
  },

  // 7. Masks & Treatments
  {
    name: 'Overnight Glaze Barrier Recovery Mask',
    slug: 'overnight-glaze-barrier-recovery-mask',
    tagline: 'Intensive sleep cocoon that locks in maximum moisture',
    shortDescription: 'A leave-on gel-cream mask with polyglutamic acid, beta-glucan, and fermented probiotics to rescue dry, overworked barriers by morning.',
    description: 'When your skin has had a demanding week, treat it to an overnight reset. This leave-on sleeping mask creates a breathable, flexible moisture seal over skin. Powerful polyglutamic acid delivers 4x more moisture retention than hyaluronic acid, leaving skin bouncy, plump, and deeply renewed when the sun rises.',
    price: 2350,
    originalPrice: 2750,
    category: 'Masks & Treatments',
    volume: '60 ml / 2.0 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Aqua, Polyglutamic Acid, Beta-Glucan, Lactobacillus Ferment Lysate, Squalane, Ceramide NP, Centella Asiatica Leaf Extract, Glycerin, Hydroxyethylcellulose.',
    keyBenefits: [
      'Locks in active serums and prevents overnight moisture evaporation',
      'Calms redness, sensitivity, and stress-induced dullness',
      'Rinses away to reveal ultra-soft, glazed morning skin'
    ],
    directions: 'Smooth a generous layer over face and neck as the final step of your nighttime routine. Allow to absorb for 5 minutes before sleep. Rinse with water in the morning.',
    skinType: 'Dry, dehydrated, stressed, or jet-lagged skin.',
    stockQuantity: 15,
    isFeatured: true,
    rating: 5.0,
    numReviews: 21
  },

  // 8. Sun Care
  {
    name: 'Solar Veil Invisible Daily Mineral Sunscreen SPF 50+ PA++++',
    slug: 'solar-veil-invisible-daily-mineral-sunscreen-spf-50',
    tagline: 'Weightless daily mineral veil with zero white cast and glazed finish',
    shortDescription: 'A sheer, broad-spectrum SPF 50+ sunscreen powered by non-nano zinc oxide and ectoin that shields against UVA/UVB and blue light.',
    description: 'The daily sunscreen you will genuinely look forward to applying. Solar Veil is formulated with advanced transparent non-nano zinc oxide that glides seamlessly onto all skin tones with zero white cast, pilling, or greasiness. Enriched with extremolyte ectoin and hyaluronic acid, it doubles as an antioxidant shield and luminous daily primer.',
    price: 1950,
    originalPrice: 2300,
    category: 'Sun Care',
    volume: '50 ml / 1.7 fl. oz.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
    ],
    ingredients: 'Zinc Oxide (Non-Nano 14.5%), Aqua, Caprylic/Capric Triglyceride, Ectoin, Sodium Hyaluronate, Niacinamide, Camellia Sinensis Extract, Bisabolol, Silica.',
    keyBenefits: [
      'Broad-spectrum SPF 50+ PA++++ protection against UVA, UVB, and HEV blue light',
      '100% mineral non-nano formula, reef-safe and sensitive-skin approved',
      'Leaves a weightless, natural glazed radiance with zero chalkiness'
    ],
    directions: 'Shake gently. Apply two finger-lengths generously to face, ears, and neck 15 minutes before sun exposure. Reapply every 2 hours or after swimming.',
    skinType: 'All skin types and tones, safe for post-procedure or reactive skin.',
    stockQuantity: 34,
    isFeatured: true,
    rating: 5.0,
    numReviews: 33
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rossele_skin';
    console.log(`[Seed] Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections to ensure clean demonstration data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await NewsletterSubscriber.deleteMany({});
    await ContactMessage.deleteMany({});

    console.log('[Seed] Creating demo accounts...');
    // Create Admin Account
    const adminUser = await User.create({
      name: 'Rossele Admin',
      email: 'admin@rosseleskin.com',
      password: 'Admin@Rossele2026',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    console.log(`  ✓ Admin user created: admin@rosseleskin.com (Password: Admin@Rossele2026)`);

    // Create Customer Account
    const customerUser = await User.create({
      name: 'Elena Vance',
      email: 'elena@rosseleskin.com',
      password: 'Customer@2026',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    });
    console.log(`  ✓ Customer user created: elena@rosseleskin.com (Password: Customer@2026)`);

    console.log('[Seed] Inserting luxury skincare products...');
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`  ✓ Seeded ${insertedProducts.length} luxury formulations`);

    console.log('[Seed] Creating demonstration customer reviews...');
    const reviewsData = [
      {
        product: insertedProducts[0]._id, // Dew Veil
        user: customerUser._id,
        customerName: 'Elena Vance (Verified Purchaser)',
        rating: 5,
        title: 'The dewiest hydration without any tackiness',
        comment: 'Dew Veil completely transformed my morning routine. Two drops give that fresh, glazed-donut glow without feeling heavy under makeup. Highly recommend!'
      },
      {
        product: insertedProducts[0]._id, // Dew Veil
        customerName: 'Ananya S. (Verified Purchaser)',
        rating: 5,
        title: 'Unbelievably soft and soothing',
        comment: 'My skin gets red very easily in dry weather. This serum immediately calms irritation and keeps my cheeks bouncy all day.'
      },
      {
        product: insertedProducts[1]._id, // Nectar Glow
        user: customerUser._id,
        customerName: 'Elena Vance (Verified Purchaser)',
        rating: 5,
        title: 'Instant editorial glass skin',
        comment: 'I mix one pump with my moisturizer every morning. My skin looks so reflective and healthy, people constantly ask what I am wearing.'
      },
      {
        product: insertedProducts[4]._id, // Cloud Cream
        customerName: 'Mira K. (Verified Purchaser)',
        rating: 5,
        title: 'Like a weighted blanket for dry skin',
        comment: 'The whipped texture is so unique. It locks in moisture all day without clogging my pores. Truly feels like a luxury spa experience.'
      },
      {
        product: insertedProducts[9]._id, // Petal Melt
        customerName: 'Priya D. (Verified Purchaser)',
        rating: 5,
        title: 'My forever lip treatment',
        comment: 'Better than any luxury balm I have ever used. Gives the prettiest subtle flush and cushions my lips overnight.'
      },
      {
        product: insertedProducts[14]._id, // Solar Veil
        customerName: 'Kavita M. (Verified Purchaser)',
        rating: 5,
        title: 'Finally a 100% mineral sunscreen with zero cast!',
        comment: 'I have medium golden skin and mineral sunscreens always leave a purple cast. Solar Veil disappears completely and gives the most radiant glow.'
      }
    ];
    await Review.insertMany(reviewsData);
    console.log(`  ✓ Seeded ${reviewsData.length} demonstration reviews`);

    console.log('[Seed] Creating initial demonstration order for Elena Vance...');
    const demoOrder = await Order.create({
      orderNumber: 'RSL-2026-8812',
      user: customerUser._id,
      customerInfo: {
        name: 'Elena Vance',
        email: 'elena@rosseleskin.com',
        phone: '+91 98765 43210'
      },
      shippingAddress: {
        address: '42 Lotus Promenade, Apt 5B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      },
      orderItems: [
        {
          product: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          image: insertedProducts[0].images[0],
          price: insertedProducts[0].price,
          quantity: 1
        },
        {
          product: insertedProducts[4]._id,
          name: insertedProducts[4].name,
          image: insertedProducts[4].images[0],
          price: insertedProducts[4].price,
          quantity: 1
        }
      ],
      subtotal: 4000,
      shippingCharge: 0,
      total: 4000,
      orderStatus: 'Confirmed',
      paymentMethod: 'demo_card',
      paymentStatus: 'Completed (Demo)',
      trackingNumber: 'TRK-98214301',
      notes: 'Please leave the luxury gift box with concierge.'
    });
    console.log(`  ✓ Created demonstration order: ${demoOrder.orderNumber}`);

    console.log('[Seed] Seeding sample newsletter subscribers & contact message...');
    await NewsletterSubscriber.create({
      email: 'elena@rosseleskin.com'
    });
    await NewsletterSubscriber.create({
      email: 'ritual@rosseleskin.com'
    });

    await ContactMessage.create({
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      subject: 'Inquiry regarding wholesale availability for luxury boutique',
      message: 'Hello Rossele Skin team, I run a luxury wellness boutique in Bangalore and would love to discuss carrying your daily essentials line.'
    });

    console.log('\n✨ Database seeding completed successfully with 15 formulations!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:    admin@rosseleskin.com | Admin@Rossele2026');
    console.log('Customer Account: elena@rosseleskin.com | Customer@2026');
    console.log('----------------------------------------------------\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
