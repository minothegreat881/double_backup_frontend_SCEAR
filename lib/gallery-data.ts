export type GalleryImage = {
  id: number
  src: string
  alt: string
  location: string
  activity: string
  category: string
  featured?: boolean
  width?: number
  height?: number
}

export const galleryCategories = ["All", "Reenactments", "Training", "Equipment", "Festivals", "Camps"]

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/gallery/roman-legionaries.jpeg",
    alt: "Roman Legion Battle Formation",
    location: "Carnuntum, Austria",
    activity: "Historical reenactment of Roman battle tactics",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 2,
    src: "/images/gallery/roman-shield-spears.jpeg",
    alt: "Roman Auxiliary Armor",
    location: "Bratislava Museum",
    activity: "Exhibition of authentic Roman auxiliary equipment",
    category: "Equipment",
  },
  {
    id: 3,
    src: "/images/gallery/roman-training.png",
    alt: "Combat Training Session",
    location: "Devín Castle",
    activity: "Weekly combat training with shields and swords",
    category: "Training",
    featured: true,
  },
  {
    id: 4,
    src: "/images/gallery/roman-festival.png",
    alt: "Roman Festival Performance",
    location: "Xanten Archaeological Park, Germany",
    activity: "Annual Roman festival demonstration",
    category: "Festivals",
  },
  {
    id: 5,
    src: "/images/gallery/roman-marching.png",
    alt: "Legion Marching Formation",
    location: "Via Appia, Italy",
    activity: "Demonstration of Roman marching techniques",
    category: "Reenactments",
  },
  {
    id: 6,
    src: "/images/gallery/roman-camp.png",
    alt: "Roman Military Camp",
    location: "Aquincum, Hungary",
    activity: "Living history camp with authentic tents and equipment",
    category: "Camps",
    featured: true,
  },
  {
    id: 7,
    src: "/images/gallery/roman-weapons.png",
    alt: "Roman Weapons Collection",
    location: "S.C.E.A.R. Headquarters",
    activity: "Display of replica Roman weapons",
    category: "Equipment",
  },
  {
    id: 8,
    src: "/images/gallery/roman-cavalry.png",
    alt: "Roman Cavalry Demonstration",
    location: "Carnuntum Festival",
    activity: "Cavalry tactics and horsemanship display",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 9,
    src: "/images/gallery/roman-archery.png",
    alt: "Roman Archery Practice",
    location: "Training Grounds, Bratislava",
    activity: "Weekly archery training session",
    category: "Training",
  },
  {
    id: 10,
    src: "/images/gallery/roman-feast.png",
    alt: "Roman Feast Celebration",
    location: "Annual Gathering, Vienna",
    activity: "Authentic Roman feast with traditional food",
    category: "Festivals",
  },
  {
    id: 11,
    src: "/images/gallery/roman-crafts.png",
    alt: "Roman Craftsmanship Workshop",
    location: "S.C.E.A.R. Workshop",
    activity: "Creating authentic Roman equipment and clothing",
    category: "Equipment",
  },
  {
    id: 12,
    src: "/images/gallery/roman-night-camp.png",
    alt: "Night Camp",
    location: "Summer Festival, Prague",
    activity: "Evening camp life demonstration",
    category: "Camps",
  },
  {
    id: 13,
    src: "/images/gallery/roman-formation.png",
    alt: "Shield Formation",
    location: "Historical Festival, Budapest",
    activity: "Testudo formation demonstration",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 14,
    src: "/images/gallery/roman-standards.png",
    alt: "Legion Standards",
    location: "Museum Exhibition",
    activity: "Display of replica Roman military standards",
    category: "Equipment",
  },
  {
    id: 15,
    src: "/images/gallery/roman-children.png",
    alt: "Children's Workshop",
    location: "Educational Center, Bratislava",
    activity: "Teaching children about Roman history",
    category: "Training",
  },
  {
    id: 16,
    src: "/images/gallery/roman-armor-display.png",
    alt: "Roman Shield with Eagle Design",
    location: "Historical Museum, Rome",
    activity: "Display of authentic Roman scutum and pilum weapons",
    category: "Equipment",
    featured: true,
  },
  {
    id: 17,
    src: "/images/gallery/colosseum-rome.jpeg",
    alt: "The Colosseum",
    location: "Rome, Italy",
    activity: "Historical site where gladiatorial contests and public spectacles were held",
    category: "Reenactments",
  },
  {
    id: 18,
    src: "/images/gallery/roman-legionaries.jpeg",
    alt: "Roman Legionaries in Formation",
    location: "Historical Festival, Germany",
    activity: "Reenactors demonstrating Roman military formations and equipment",
    category: "Reenactments",
    featured: true,
  },
]
