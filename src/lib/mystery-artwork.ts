import type { ImageMetadata } from 'astro';

export interface MysteryArtworkMeta {
  title: string;
  artist: string;
  year: string;
  alt: string;
}

export interface MysteryArtwork extends MysteryArtworkMeta {
  src: string;
  width: number;
  height: number;
}

const artworkFiles = import.meta.glob('../assets/artwork/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

export const mysteryArtworkMeta: Record<string, MysteryArtworkMeta> = {
  annunciation: {
    title: 'The Annunciation',
    artist: 'Fra Angelico',
    year: 'c. 1438–1445',
    alt: 'Fresco by Fra Angelico showing the angel Gabriel bowing with crossed arms before the Virgin Mary under a Renaissance loggia',
  },
  visitation: {
    title: 'The Visitation',
    artist: 'Mariotto Albertinelli',
    year: '1503',
    alt: 'Painting by Mariotto Albertinelli showing Mary and her cousin Elizabeth embracing beneath a stone arch',
  },
  nativity: {
    title: 'Adoration of the Shepherds',
    artist: 'Gerard van Honthorst',
    year: '1622',
    alt: 'Painting by Gerard van Honthorst showing Mary, Joseph, and shepherds gathered in wonder around the infant Jesus, whose glow illuminates their faces',
  },
  presentation: {
    title: 'The Presentation in the Temple',
    artist: 'Fra Bartolomeo',
    year: '1516',
    alt: 'Painting by Fra Bartolomeo showing Simeon holding the infant Jesus at the temple altar with Mary, Joseph, and Anna looking on',
  },
  finding_in_the_temple: {
    title: 'Christ in the Temple',
    artist: 'Heinrich Hofmann',
    year: '1881',
    alt: 'Painting by Heinrich Hofmann showing the twelve-year-old Jesus standing in white robes speaking with the elders and teachers of the temple',
  },
  agony_in_the_garden: {
    title: 'The Agony in the Garden',
    artist: 'Giovanni Bellini',
    year: 'c. 1465',
    alt: 'Painting by Giovanni Bellini showing Jesus kneeling in prayer on a rocky hillside at dawn while an angel appears with a chalice and three disciples sleep below',
  },
  scourging_at_the_pillar: {
    title: 'The Flagellation of Christ',
    artist: 'Caravaggio',
    year: '1607',
    alt: 'Painting by Caravaggio showing Christ bound to a stone column in dramatic chiaroscuro light surrounded by his tormentors',
  },
  crowning_with_thorns: {
    title: 'The Crowning with Thorns',
    artist: 'Titian',
    year: 'c. 1542',
    alt: 'Painting by Titian showing Roman soldiers pressing a crown of thorns onto the head of Christ seated on stone steps',
  },
  carrying_of_the_cross: {
    title: 'Christ Carrying the Cross',
    artist: 'El Greco',
    year: 'c. 1580',
    alt: 'Painting by El Greco showing a close-up of Christ crowned with thorns, embracing the wooden cross with tearful eyes lifted toward heaven',
  },
  crucifixion_and_death: {
    title: 'Christ Crucified',
    artist: 'Diego Velázquez',
    year: '1632',
    alt: 'Painting by Diego Velázquez showing Christ crucified against a quiet dark background, head bowed in peace',
  },
  resurrection: {
    title: 'The Resurrection of Christ',
    artist: 'Piero della Francesca',
    year: 'c. 1463',
    alt: 'Fresco by Piero della Francesca showing the risen Christ stepping from the tomb holding a victory banner while four guards sleep below',
  },
  ascension: {
    title: 'The Ascension of Christ',
    artist: 'Pietro Perugino',
    year: '1496–1500',
    alt: 'Painting by Pietro Perugino showing Christ ascending in a golden aureole surrounded by angels above Mary and the apostles',
  },
  descent_of_the_holy_spirit: {
    title: 'Pentecost',
    artist: 'El Greco',
    year: 'c. 1600',
    alt: 'Painting by El Greco showing the dove of the Holy Spirit descending in radiant light with tongues of flame above Mary and the apostles',
  },
  assumption_of_mary: {
    title: 'Assumption of the Virgin',
    artist: 'Titian',
    year: '1516–1518',
    alt: 'Painting by Titian showing the Virgin Mary borne aloft on clouds by angels toward God the Father in golden light as the apostles gaze upward',
  },
  coronation_of_mary: {
    title: 'Coronation of the Virgin',
    artist: 'Diego Velázquez',
    year: 'c. 1644',
    alt: 'Painting by Diego Velázquez showing God the Father, Christ, and the dove of the Holy Spirit placing a crown of roses upon the Virgin Mary',
  },
  baptism_in_the_jordan: {
    title: 'The Baptism of Christ',
    artist: 'Verrocchio & Leonardo da Vinci',
    year: 'c. 1475',
    alt: 'Painting by Verrocchio and Leonardo da Vinci showing John the Baptist pouring water over Jesus in the Jordan River as the dove descends and two angels kneel nearby',
  },
  wedding_at_cana: {
    title: 'The Marriage at Cana',
    artist: 'Gerard David',
    year: 'c. 1500',
    alt: 'Painting by Gerard David showing Jesus blessing the stone water jars at the wedding banquet while Mary and the guests look on',
  },
  proclamation_of_the_kingdom: {
    title: 'The Sermon on the Mount',
    artist: 'Carl Bloch',
    year: '1877',
    alt: 'Painting by Carl Bloch showing Jesus seated on a hillside teaching a gathered crowd with his hand raised toward heaven',
  },
  transfiguration: {
    title: 'The Transfiguration',
    artist: 'Raphael',
    year: '1516–1520',
    alt: 'Painting by Raphael showing Christ radiant in white robes hovering above Mount Tabor flanked by Moses and Elijah as Peter, James, and John shield their eyes',
  },
  institution_of_the_eucharist: {
    title: 'The Last Supper',
    artist: 'Juan de Juanes',
    year: 'c. 1562',
    alt: 'Painting by Juan de Juanes showing Jesus seated at the center of the table with the apostles, holding up the consecrated Host above the chalice',
  },
};

export function getMysteryArtwork(slug: string): MysteryArtwork {
  const meta = mysteryArtworkMeta[slug];
  if (!meta) {
    throw new Error(`Missing artwork metadata for mystery "${slug}"`);
  }

  const asset = artworkFiles[`../assets/artwork/${slug}.webp`];
  if (!asset) {
    throw new Error(`Missing artwork image for mystery "${slug}"`);
  }

  return {
    ...meta,
    src: asset.src,
    width: asset.width,
    height: asset.height,
  };
}
