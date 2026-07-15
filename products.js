const PRODUCTS = [
  {
    id: "dress-1",
    name: "Stardust Velvet Evening Gown",
    price: 320.00,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Velvet", "Maxi", "Premium"],
    rating: 4.8,
    inStock: true
  },
  {
    id: "dress-2",
    name: "Nebula Silk Slip Dress",
    price: 145.00,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Silk", "Midi", "Slip"],
    rating: 4.6,
    inStock: true
  },
  {
    id: "dress-3",
    name: "Aurora Sequin Cocktail Dress",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
    category: "Supernova Party",
    tags: ["Sequin", "Mini", "Party"],
    rating: 4.7,
    inStock: true
  },
  {
    id: "dress-4",
    name: "Solaris Lace Bridal Gown",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
    category: "Astral Bridal",
    tags: ["Lace", "Maxi", "Wedding"],
    rating: 4.9,
    inStock: true
  },
  {
    id: "dress-5",
    name: "Galaxy Tiered Summer Sundress",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&auto=format&fit=crop&q=80",
    category: "Nebula Casuals",
    tags: ["Cotton", "Summer", "Casual"],
    rating: 4.3,
    inStock: true
  },
  {
    id: "dress-6",
    name: "Cosmic Crepe Wrap Dress",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Crepe", "Midi", "Wrap"],
    rating: 4.5,
    inStock: true
  },
  {
    id: "dress-7",
    name: "Nova Satin Evening Dress",
    price: 260.00,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Satin", "Maxi", "Elegant"],
    rating: 4.4,
    inStock: true
  },
  {
    id: "dress-8",
    name: "Astral Pleated Maxi Dress",
    price: 165.00,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80",
    category: "Nebula Casuals",
    tags: ["Pleated", "Maxi", "Flowy"],
    rating: 4.6,
    inStock: true
  },
  {
    id: "dress-9",
    name: "Supernova Tulle Ballgown",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Tulle", "Maxi", "Premium"],
    rating: 4.8,
    inStock: true
  },
  {
    id: "dress-10",
    name: "Milky Way Off-Shoulder Dress",
    price: 210.00,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&auto=format&fit=crop&q=80",
    category: "Supernova Party",
    tags: ["Satin", "Midi", "Off-Shoulder"],
    rating: 4.7,
    inStock: true
  },
  {
    id: "dress-11",
    name: "Orion Embellished Mini Dress",
    price: 175.00,
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=80",
    category: "Supernova Party",
    tags: ["Sequin", "Mini", "Glitter"],
    rating: 4.5,
    inStock: true
  },
  {
    id: "dress-12",
    name: "Halley Georgette Floral Gown",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=80",
    category: "Nebula Casuals",
    tags: ["Georgette", "Floral", "Flowy"],
    rating: 4.6,
    inStock: true
  },
  {
    id: "dress-13",
    name: "Zenith Linen Sundress",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80",
    category: "Nebula Casuals",
    tags: ["Linen", "Summer", "Eco-friendly"],
    rating: 4.2,
    inStock: false
  },
  {
    id: "dress-14",
    name: "Andromeda Organza Midi Dress",
    price: 230.00,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Organza", "Midi", "Puff-Sleeve"],
    rating: 4.8,
    inStock: true
  },
  {
    id: "dress-15",
    name: "Comet Chiffon Pleated Dress",
    price: 115.00,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
    category: "Nebula Casuals",
    tags: ["Chiffon", "Midi", "Pleated"],
    rating: 4.4,
    inStock: true
  },
  {
    id: "dress-16",
    name: "Eclipse Backless Silk Gown",
    price: 340.00,
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Silk", "Maxi", "Backless"],
    rating: 4.9,
    inStock: true
  },
  {
    id: "dress-17",
    name: "Constellation Jacquard Gown",
    price: 295.00,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Jacquard", "Maxi", "Structured"],
    rating: 4.7,
    inStock: true
  },
  {
    id: "dress-18",
    name: "Solar Flare Ruffled Dress",
    price: 130.00,
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Chiffon", "Midi", "Ruffles"],
    rating: 4.5,
    inStock: true
  },
  {
    id: "dress-19",
    name: "Meteorite Leather Slip Dress",
    price: 195.00,
    image: "https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Leather", "Mini", "Edgy"],
    rating: 4.3,
    inStock: true
  },
  {
    id: "dress-20",
    name: "Vortex Knit Midi Dress",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1611085583191-a3b1a30a5a4a?w=500&auto=format&fit=crop&q=80",
    category: "Orbit Silhouette",
    tags: ["Knit", "Midi", "Warm"],
    rating: 4.4,
    inStock: true
  },
  {
    id: "dress-21",
    name: "Polaris A-Line Cocktail Dress",
    price: 155.00,
    image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=500&auto=format&fit=crop&q=80",
    category: "Supernova Party",
    tags: ["Satin", "A-Line", "Party"],
    rating: 4.6,
    inStock: true
  },
  {
    id: "dress-22",
    name: "Quasar Velvet Party Dress",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500&auto=format&fit=crop&q=80",
    category: "Supernova Party",
    tags: ["Velvet", "Mini", "Party"],
    rating: 4.5,
    inStock: false
  },
  {
    id: "dress-23",
    name: "Pegasus Classic Bridal Gown",
    price: 499.00,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80",
    category: "Astral Bridal",
    tags: ["Tulle", "Maxi", "Wedding"],
    rating: 4.9,
    inStock: true
  },
  {
    id: "dress-24",
    name: "Cassiopeia Star-Dust Gown",
    price: 360.00,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80",
    category: "Celestial Gowns",
    tags: ["Sequin", "Maxi", "Premium"],
    rating: 4.8,
    inStock: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
