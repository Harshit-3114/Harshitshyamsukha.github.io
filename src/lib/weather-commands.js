/**
 * THE COMMAND TABLE
 *
 * The console in the corner of the page takes a phrase and dresses the
 * site to match. Some phrases are plain ("rain", "fog", "clear"), some
 * are films ("let it rain", "here comes the rain again"), and a great
 * many are from the universes people actually watch — Marvel, DC,
 * Netflix, Hotstar, Prime Video, Hulu, Peacock, HBO.
 *
 * Each entry resolves to a WEATHER BAND and, optionally, a TIME BAND.
 * The bands are the same ones the live ambience engine uses, so a
 * typed command and a real forecast land in exactly the same place —
 * there is one lighting model, not two.
 *
 * Some phrases are not weather at all. Those are SPECTACLES: set
 * pieces that fire across the screen — dragonfire, spider webs, a
 * Hulk going through the glass, a snap, the Flash.
 *
 * Matching is substring-based and forgiving on purpose. People type
 * "make it rain", "let it rain please", "thunder" — all of them
 * should land.
 */

export const TIME_BANDS = ['dawn', 'morning', 'afternoon', 'evening', 'dusk', 'night'];

/* ------------------------------------------------------------
   SPECTACLES — the set pieces
   ------------------------------------------------------------ */
export const SPECTACLES = [
  {
    id: 'dracarys',
    effect: 'fire',
    from: 'HBO',
    phrases: ['dracarys', 'dragonfire', 'dragon fire', 'drogon', 'rhaegal', 'khaleesi', 'mother of dragons', 'burn them all'],
    name: 'DRAKARYS',
    line: 'Dracarys. The fire takes the whole screen and the air after it.',
  },
  {
    id: 'spidey',
    effect: 'webs',
    from: 'Marvel',
    phrases: ['spidey', 'spider-man', 'spiderman', 'spider man', 'webs', 'web sling', 'with great power'],
    name: 'SPIDEY',
    line: 'Webs. Corner to corner, in about a second and a half.',
  },
  {
    id: 'smash',
    effect: 'smash',
    from: 'Marvel',
    phrases: ['smash', 'hulk', 'hulk smash', 'smash through', 'avengers smash', 'ragnarok'],
    name: 'SMASH',
    line: 'SMASH. The screen goes through it.',
  },
  {
    id: 'snap',
    effect: 'snap',
    from: 'Marvel',
    phrases: ['thanos', 'snap', 'infinity gauntlet', 'infinity gauntlet snap', 'eradicate'],
    name: 'SNAP',
    line: 'A snap. Half the light goes with it.',
  },
  {
    id: 'flash',
    effect: 'speed',
    from: 'DC',
    phrases: ['the flash', 'flash', 'quicksilver', 'speedforce', 'speed force', 'run faster'],
    name: 'THE FLASH',
    line: 'The Flash. Everything in the frame moves at once.',
  },
  {
    id: 'kryptonite',
    effect: 'kryptonite',
    from: 'DC',
    phrases: ['kryptonite', 'kryptos', 'metropolis'],
    name: 'KRYPTONITE',
    line: 'Kryptonite. The green gets into the paper and the edges.',
  },
  {
    id: 'wakanda',
    effect: 'vibranium',
    from: 'Marvel',
    phrases: ['wakanda', 'vibranium', 'black panther'],
    name: 'WAKANDA',
    line: 'Vibranium. The page goes violet and the shadows go soft.',
  },
  {
    id: 'deathstar',
    effect: 'blast',
    from: 'Disney',
    phrases: ['death star', 'deathstar', 'the force', 'lightsaber', 'light saber'],
    name: 'DEATH STAR',
    line: 'A target lock, and then a very large hole in the sky.',
  },
];

/* ------------------------------------------------------------
   WEATHER — everything that changes the light
   ------------------------------------------------------------ */
export const WEATHER_COMMANDS = [
  /* --- MARVEL --- */
  { id: 'thor', phrases: ['thor', 'mjolnir', 'storm god'], weather: 'storm', time: 'dusk', name: 'Thunderstrike', from: 'Marvel', line: 'Asgard answers. The sky cracks open over the page.' },
  { id: 'loki', phrases: ['loki', 'asgard', 'bifrost'], weather: 'fog', time: 'night', name: 'The Bifrost', from: 'Marvel', line: 'Mist off the tesseract. The light goes green and uncertain.' },
  { id: 'doctor-strange', phrases: ['doctor strange', 'sanctum', 'multiverse'], weather: 'storm', time: 'night', name: 'The Sanctum', from: 'Marvel', line: 'Two timelines are running. It is raining in both of them.' },
  { id: 'iron-man', phrases: ['iron man', 'stark expo', 'jarvis', 'arc reactor'], weather: 'clear', time: 'morning', name: 'Stark Expo', from: 'Marvel', line: 'Repulsors on. The sky is optional.' },
  { id: 'hulk-weather', phrases: ['hulk weather', 'gamma', 'gamma radiation'], weather: 'clear', time: 'afternoon', name: 'Gamma', from: 'Marvel', line: 'Green sky, hard light, everything a little too bright.' },
  { id: 'spider-man-weather', phrases: ['spider-man weather', 'queens weather'], weather: 'clear', time: 'afternoon', name: 'Queens', from: 'Marvel', line: 'A clear New York afternoon with the odd rooftop.' },
  { id: 'black-panther', phrases: ['black panther', 'wakanda weather'], weather: 'clear', time: 'night', name: 'Wakanda Forever', from: 'Marvel', line: 'A violet night over a city that never sleeps.' },
  { id: 'wanda', phrases: ['wanda', 'scarlet witch', 'multiverse magic'], weather: 'fog', time: 'dusk', name: 'Chaos', from: 'Marvel', line: 'Red fog, and the page stops quite believing in itself.' },
  { id: 'ant-man', phrases: ['ant-man', 'quantum'], weather: 'drizzle', time: 'afternoon', name: 'Quantum', from: 'Marvel', line: 'Everything gets very small and very damp.' },
  { id: 'captain-marvel', phrases: ['captain marvel', 'marvel', 'photon'], weather: 'storm', time: 'night', name: 'Photon', from: 'Marvel', line: 'The sky lights up and there is no cloud in sight.' },
  { id: 'daredevil', phrases: ['daredevil', 'hell kitchen', 'stick'], weather: 'fog', time: 'night', name: 'Hell’s Kitchen', from: 'Marvel', line: 'Fog, a rooftop, and the city making noise underneath.' },
  { id: 'punisher', phrases: ['punisher', 'the punisher'], weather: 'storm', time: 'night', name: 'The Punisher', from: 'Marvel', line: 'Heavy rain over a city that stopped asking questions.' },
  { id: 'blade', phrases: ['blade', 'vampires'], weather: 'clear', time: 'night', name: 'Vampires', from: 'Marvel', line: 'Cold, dry, and quiet. The good kind of night.' },
  { id: 'moon-knight', phrases: ['moon knight', 'moon'], weather: 'cloud', time: 'night', name: 'Moon Knight', from: 'Marvel', line: 'Flat moonlight with no stars getting through.' },
  { id: 'guardians', phrases: ['guardians of the galaxy', 'gotg', 'groot'], weather: 'clear', time: 'night', name: 'Knowhere', from: 'Marvel', line: 'The kind of night where a planet fits in the background.' },
  { id: 'apocalypse', phrases: ['apocalypse', 'end of the world', 'armageddon', 'the rapture'], weather: 'storm', time: 'dusk', name: 'Thunderhead', from: 'Marvel', line: 'Everything ends. The colour grading is the part that hurts.' },

  /* --- DC --- */
  { id: 'batman', phrases: ['batman', 'gotham', 'wayne', 'bat signal'], weather: 'rain', time: 'night', name: 'Gotham', from: 'DC', line: 'It always rains in Gotham. It has always rained in Gotham.' },
  { id: 'superman', phrases: ['superman', 'krypton', 'daily planet'], weather: 'clear', time: 'morning', name: 'Metropolis', from: 'DC', line: 'Clean air, straight shadows, and a very tall man.' },
  { id: 'wonder-woman', phrases: ['wonder woman', 'themyscira', 'diana'], weather: 'clear', time: 'golden', name: 'Themyscira', from: 'DC', line: 'Gold light on a shore. Long shadows, warm air.' },
  { id: 'aquaman', phrases: ['aquaman', 'atlantis'], weather: 'rain', time: 'night', name: 'Atlantis', from: 'DC', line: 'Pressure in the ears. Water on everything.' },
  { id: 'joker', phrases: ['joker', 'gotham joker'], weather: 'fog', time: 'night', name: 'The Joker', from: 'DC', line: 'Green fog, and a city that has stopped laughing.' },
  { id: 'constantine', phrases: ['constantine', 'john constantine', 'hell'], weather: 'fog', time: 'night', name: 'The First Circle', from: 'DC', line: 'Smoke, old concrete, and a door that should not be open.' },
  { id: 'swamp-thing', phrases: ['swamp thing'], weather: 'fog', time: 'night', name: 'Louisiana Swamp', from: 'DC', line: 'Standing water and air you can almost hold.' },
  { id: 'doomsday', phrases: ['doomsday', 'krypton doom'], weather: 'storm', time: 'afternoon', name: 'Krypton', from: 'DC', line: 'Heat lightning over a red sky. Nothing friendly about it.' },
  { id: 'peacemaker', phrases: ['peacemaker'], weather: 'clear', time: 'morning', name: 'Peacekeeping', from: 'DC', line: 'A clean morning for a clean job.' },
  { id: 'harley', phrases: ['harley quinn', 'harley'], weather: 'clear', time: 'night', name: 'Gotham City Hall', from: 'DC', line: 'A carnival somewhere. Nothing says calm like that.' },

  /* --- NETFLIX --- */
  { id: 'stranger-things', phrases: ['stranger things', 'upside down', 'hawkins'], weather: 'fog', time: 'night', name: 'The Upside Down', from: 'Netflix', line: 'Something is coming through the fog. Do not turn around.' },
  { id: 'wednesday', phrases: ['wednesday', 'nevermore', 'raven'], weather: 'rain', time: 'night', name: 'Wednesday', from: 'Netflix', line: 'Dark, wet, and extremely unimpressed with the forecast.' },
  { id: 'money-heist', phrases: ['money heist', 'bellavista', 'the professor'], weather: 'clear', time: 'night', name: 'The Mint', from: 'Netflix', line: 'Red suits under hard white light. Nobody is sleeping.' },
  { id: 'dark', phrases: ['dark netflix', 'winden'], weather: 'fog', time: 'night', name: 'Winden', from: 'Netflix', line: 'Fog in a town where the same three days keep repeating.' },
  { id: 'black-mirror', phrases: ['black mirror'], weather: 'storm', time: 'night', name: 'Black Mirror', from: 'Netflix', line: 'A storm that is not about weather at all.' },
  { id: 'cobra-kai', phrases: ['cobra kai', 'miami'], weather: 'clear', time: 'evening', name: 'Cobra Kai', from: 'Netflix', line: 'Hot, humid, and full of bad decisions.' },
  { id: 'russian-doll', phrases: ['russian doll', 'nyc'], weather: 'snow', time: 'night', name: 'New York', from: 'Netflix', line: 'Snow on the avenue, and the same night again.' },
  { id: 'squid-game', phrases: ['squid game', 'red light green light'], weather: 'clear', time: 'night', name: 'Red Light', from: 'Netflix', line: 'The weather holds its breath. So do you.' },
  { id: 'the-sandman', phrases: ['sandman', 'dream', 'endless'], weather: 'fog', time: 'night', name: 'The Dreaming', from: 'Netflix', line: 'Between sleeping and waking there is a weather of its own.' },
  { id: 'arcane', phrases: ['arcane', 'piltover', 'zaun'], weather: 'storm', time: 'night', name: 'Zaun', from: 'Netflix', line: 'Smog, rain, and steam off the foundries.' },
  { id: 'the-witcher', phrases: ['the witcher', 'geralt', 'temeria'], weather: 'fog', time: 'dusk', name: 'The Continent', from: 'Netflix', line: 'Fog on the road. Something is following at a distance.' },
  { id: 'the-last-of-us', phrases: ['the last of us', 'cordyceps', 'joel'], weather: 'rain', time: 'dusk', name: 'Boston', from: 'Netflix', line: 'Rain on the ruins. The city has been quiet for a long time.' },
  { id: 'house-of-the-dragon', phrases: ['house of the dragon', 'hotd'], weather: 'storm', time: 'night', name: 'Dragonstone', from: 'Netflix', line: 'The weather here has scales.' },
  { id: 'peaky-blinders', phrases: ['peaky blinders', 'birmingham', 'shelby'], weather: 'fog', time: 'night', name: 'Small Heath', from: 'Netflix', line: 'Fog off the canal and smoke off the factories.' },
  { id: 'hill-house', phrases: ['hill house', 'haunting', 'the haunting'], weather: 'fog', time: 'night', name: 'Hill House', from: 'Netflix', line: 'The house has opinions about who stands where.' },
  { id: 'bridgerton', phrases: ['bridgerton'], weather: 'clear', time: 'evening', name: 'Regency', from: 'Netflix', line: 'Golden evening light and absolutely no fog.' },
  { id: 'queens-gambit', phrases: ['queen’s gambit', 'queen\'s gambit', 'beth harmon'], weather: 'clear', time: 'night', name: 'The Gambit', from: 'Netflix', line: 'Quiet, cold, and lit by one lamp.' },
  { id: 'mrs-davis', phrases: ['mrs davis', 'robot'], weather: 'clear', time: 'night', name: 'Mrs. Davis', from: 'Netflix', line: 'A watchfulness in the air.' },
  { id: '1899', phrases: ['1899'], weather: 'storm', time: 'night', name: 'The Ocean', from: 'Netflix', line: 'A ship in weather that has no business being there.' },

  /* --- HOTSTAR --- */
  { id: 'sacred-games', phrases: ['sacred games', 'ganraj'], weather: 'rain', time: 'night', name: 'Ganesh Ghat', from: 'Hotstar', line: 'Mumbai rain on stone. Everything runs.' },
  { id: 'family-man', phrases: ['the family man', 'deodayal'], weather: 'storm', time: 'night', name: 'The Family Man', from: 'Hotstar', line: 'A storm outside and a very different one inside.' },
  { id: 'criminal-justice', phrases: ['criminal justice'], weather: 'rain', time: 'night', name: 'Prison', from: 'Hotstar', line: 'Rain on the yard. Grey everywhere.' },
  { id: 'leila', phrases: ['leila netflix', 'leila hotstar'], weather: 'fog', time: 'dusk', name: 'Old Delhi', from: 'Hotstar', line: 'Fog in the lanes, and someone running.' },
  { id: 'scam', phrases: ['scam hotstar', 'scam'], weather: 'rain', time: 'night', name: 'The Scam', from: 'Hotstar', line: 'Rain, a phone, and money that does not exist.' },
  { id: 'night-manager', phrases: ['night manager', 'le Carré'], weather: 'rain', time: 'night', name: 'The Hotel', from: 'Hotstar', line: 'Rain on the awning of a very expensive hotel.' },
  { id: 'special-ops', phrases: ['special ops hotstar', 'special ops'], weather: 'storm', time: 'night', name: 'Special Ops', from: 'Hotstar', line: 'Storm cover. Nobody is going out in this.' },
  { id: 'aarya', phrases: ['aarya', 'sarya'], weather: 'clear', time: 'night', name: 'Aarya', from: 'Hotstar', line: 'Dry heat and a long night.' },
  { id: 'mumbai-diaries', phrases: ['mumbai diaries'], weather: 'rain', time: 'night', name: 'Mumbai', from: 'Hotstar', line: 'Monsoon over the rooftops.' },
  { id: 'breathe', phrases: ['breathe hotstar', 'breathe'], weather: 'fog', time: 'night', name: 'Breathe', from: 'Hotstar', line: 'Smog, and a city breathing through it.' },
  { id: 'ghoul', phrases: ['ghoul'], weather: 'fog', time: 'night', name: 'The Ghoul', from: 'Hotstar', line: 'Fog off the sea, and something in it.' },
  { id: 'city-of-dreams', phrases: ['city of dreams', 'dhaka dreams'], weather: 'clear', time: 'evening', name: 'City of Dreams', from: 'Hotstar', line: 'Warm evening over a monsoon city.' },
  { id: 'hostages', phrases: ['hostages hotstar', 'hostages'], weather: 'storm', time: 'night', name: 'Hostages', from: 'Hotstar', line: 'A storm over a house with a siege on it.' },

  /* --- PRIME VIDEO --- */
  { id: 'the-boys', phrases: ['the boys', 'homelander', 'seven'], weather: 'storm', time: 'night', name: 'Vought', from: 'Prime Video', line: 'A storm with corporate funding.' },
  { id: 'rings-of-power', phrases: ['rings of power', 'lord of the rings', 'mordor', 'the shire', 'gandalf', 'the hobbit'], weather: 'fog', time: 'dusk', name: 'Mordor', from: 'Prime Video', line: 'One does not simply walk into the weather. Or Mordor.' },
  { id: 'wheel-of-time', phrases: ['wheel of time', 'the wheel'], weather: 'storm', time: 'afternoon', name: 'Tar Valon', from: 'Prime Video', line: 'A storm rolling over the plain.' },
  { id: 'invincible', phrases: ['invincible', 'omni-man'], weather: 'clear', time: 'evening', name: 'Ogilvie Industries', from: 'Prime Video', line: 'Warm sunset over a city that should have moved on.' },
  { id: 'hunger-games', phrases: ['hunger games', 'panem'], weather: 'clear', time: 'morning', name: 'Panem', from: 'Prime Video', line: 'Cold morning light over the arena.' },
  { id: 'high-castle', phrases: ['man in the high castle', 'high castle'], weather: 'fog', time: 'night', name: 'The Other Side', from: 'Prime Video', line: 'Fog on a border that should not exist.' },
  { id: 'jack-ryan', phrases: ['jack ryan'], weather: 'clear', time: 'morning', name: 'The Clock', from: 'Prime Video', line: 'Clean light and a very early alarm.' },
  { id: 'bosch', phrases: ['bosch', 'los angeles'], weather: 'fog', time: 'night', name: 'Los Angeles', from: 'Prime Video', line: 'Marine layer off the coast. Warm, grey, endless.' },
  { id: 'fargo', phrases: ['fargo', 'fargo series'], weather: 'snow', time: 'night', name: 'Fargo', from: 'Prime Video', line: 'Snow that keeps falling after it should have stopped.' },
  { id: 'underground-railroad', phrases: ['underground railroad'], weather: 'clear', time: 'dawn', name: 'Dawn', from: 'Prime Video', line: 'First light over a road nobody is meant to be on.' },
  { id: 'reacher', phrases: ['reacher', 'jack reacher'], weather: 'clear', time: 'afternoon', name: 'Margrave', from: 'Prime Video', line: 'Hard afternoon sun and a very quiet town.' },
  { id: 'summer-i-turned-pretty', phrases: ['summer i turned pretty', 'harbor house'], weather: 'clear', time: 'evening', name: 'Harbor House', from: 'Prime Video', line: 'Salt in the air and a long golden evening.' },
  { id: 'devil-judge', phrases: ['devil judge', 'korea'], weather: 'storm', time: 'night', name: 'Seoul', from: 'Prime Video', line: 'Rain on a city that never slows down.' },
  { id: 'citizen-galileo', phrases: ['citizen galileo'], weather: 'cloud', time: 'night', name: 'Nishi-ku', from: 'Prime Video', line: 'Cloud over the towers. Everything in mono.' },
  { id: 'the-terminal-list', phrases: ['terminal list', 'reacher terminal'], weather: 'fog', time: 'dawn', name: 'The Terminal', from: 'Prime Video', line: 'Dawn fog on the range.' },

  /* --- HULU --- */
  { id: 'handmaids-tale', phrases: ['handmaid', 'handmaid’s tale', 'handmaid\'s tale', 'gilead'], weather: 'fog', time: 'night', name: 'Gilead', from: 'Hulu', line: 'Fog on the wall. Nobody looks up.' },
  { id: 'the-bear', phrases: ['the bear', 'carmy'], weather: 'clear', time: 'night', name: 'The Bear', from: 'Hulu', line: 'Hot kitchen light and a city outside that will not wait.' },
  { id: 'only-murders', phrases: ['only murders in the building', 'only murders'], weather: 'clear', time: 'afternoon', name: 'The Arches', from: 'Hulu', line: 'Manhattan light, and a crime nobody has solved.' },
  { id: 'shogun', phrases: ['shōgun', 'shogun'], weather: 'fog', time: 'dawn', name: 'Edo', from: 'Hulu', line: 'Sea fog over Edo, and the tide deciding things.' },
  { id: 'under-the-bridge', phrases: ['under the bridge', 'cardigan'], weather: 'rain', time: 'night', name: 'Vancouver', from: 'Hulu', line: 'Rain on the alley. Everything is quiet in the wrong way.' },
  { id: 'reservation-dogs', phrases: ['reservation dogs', 'oklahoma'], weather: 'clear', time: 'night', name: 'Oklahoma', from: 'Hulu', line: 'Flat night sky over the rez.' },
  { id: 'killing-eve', phrases: ['killing eve'], weather: 'rain', time: 'night', name: 'Killing Eve', from: 'Hulu', line: 'Wet streets and a very composed walk.' },
  { id: 'little-women', phrases: ['little women'], weather: 'clear', time: 'afternoon', name: 'Concord', from: 'Hulu', line: 'New England afternoon light. Warm, bookish, unhurried.' },
  { id: 'castle-rock', phrases: ['castle rock'], weather: 'fog', time: 'night', name: 'Castle Rock', from: 'Hulu', line: 'Fog in a town that keeps producing bad days.' },
  { id: 'the-sinner', phrases: ['the sinner'], weather: 'rain', time: 'night', name: 'The Sinner', from: 'Hulu', line: 'Rain on a detective who has stopped sleeping.' },
  { id: 'atlanta-show', phrases: ['atlanta hulu', 'atlanta show'], weather: 'clear', time: 'night', name: 'Atlanta', from: 'Hulu', line: 'A warm night that is about to go sideways.' },
  { id: 'the-great', phrases: ['the great hulu', 'the great show'], weather: 'clear', time: 'afternoon', name: 'The Great', from: 'Hulu', line: 'Courtly daylight and a very cold court.' },
  { id: 'this-is-us', phrases: ['this is us'], weather: 'clear', time: 'evening', name: 'This Is Us', from: 'Hulu', line: 'Warm evening light on a family photograph.' },
  { id: 'fleishman', phrases: ['fleishman is in trouble'], weather: 'clear', time: 'night', name: 'Fleishman', from: 'Hulu', line: 'A New York night, colder than it looks.' },

  /* --- PEACOCK --- */
  { id: 'the-office', phrases: ['the office', 'dunder Mifflin', 'dunder mifflin', 'michael scott'], weather: 'clear', time: 'morning', name: 'Dunder Mifflin', from: 'Peacock', line: 'Fluorescent light and the hum of a printer nobody fixed.' },
  { id: 'brooklyn-nine-nine', phrases: ['brooklyn nine nine', 'nine nine'], weather: 'clear', time: 'morning', name: 'Nine Nine', from: 'Peacock', line: 'Bright, loud, and unreasonably good weather.' },
  { id: 'the-rookie', phrases: ['the rookie'], weather: 'clear', time: 'morning', name: 'Mid-Wilshire', from: 'Peacock', line: 'Los Angeles morning. Warm, even under the smog.' },
  { id: 'ted-lasso', phrases: ['ted lasso', 'richmond'], weather: 'clear', time: 'afternoon', name: 'Richmond', from: 'Peacock', line: 'English afternoon light on a very optimistic pitch.' },
  { id: 'bel-air', phrases: ['bel air', 'bel-air'], weather: 'clear', time: 'evening', name: 'Bel-Air', from: 'Peacock', line: 'Gold hour over the hills.' },
  { id: 'poker-face', phrases: ['poker face'], weather: 'clear', time: 'night', name: 'Poker Face', from: 'Peacock', line: 'A bright night. The kind where you catch people.' },
  { id: 'traitors', phrases: ['the traitors', 'traitors'], weather: 'fog', time: 'night', name: 'The Château', from: 'Peacock', line: 'Fog over a castle and a great many lies.' },
  { id: 'parks-and-recreation', phrases: ['parks and recreation', 'parks and rec'], weather: 'clear', time: 'morning', name: 'Pawnee', from: 'Peacock', line: 'Snakehole Lane at nine in the morning.' },
  { id: 'tomorrow-war', phrases: ['the tomorrow war', 'tomorrow war'], weather: 'storm', time: 'night', name: 'The Tomorrow War', from: 'Peacock', line: 'A storm that has an agenda.' },
  { id: 'vampire-academy', phrases: ['vampire academy'], weather: 'fog', time: 'night', name: 'St. Petersburg', from: 'Peacock', line: 'Fog, and something with a heartbeat that should not have one.' },
  { id: 'days-gone', phrases: ['days gone'], weather: 'rain', time: 'dusk', name: 'Days Gone', from: 'Peacock', line: 'Rain on a road with nothing left on it.' },
  { id: 'college-girls', phrases: ['sex lives of college girls'], weather: 'clear', time: 'evening', name: 'NYC', from: 'Peacock', line: 'Warm evening in the city, doing nothing in particular.' },
  { id: 'unsolved-mysteries', phrases: ['unsolved mysteries'], weather: 'fog', time: 'night', name: 'The Files', from: 'Peacock', line: 'Fog over a field where something did not add up.' },

  /* --- HBO --- */
  { id: 'game-of-thrones', phrases: ['game of thrones', 'winterfell', 'jon snow', 'the wall', 'westeros'], weather: 'snow', time: 'dusk', name: 'Winterfell', from: 'HBO', line: 'Hold the door. It is snowing at the Wall, as it always is.' },
  { id: 'sopranos', phrases: ['the sopranos', 'sopranos'], weather: 'rain', time: 'night', name: 'North Jersey', from: 'HBO', line: 'Rain on the turnpike. A driveway and a bad decision.' },
  { id: 'succession', phrases: ['succession', 'waystar royco'], weather: 'clear', time: 'evening', name: 'Waystar Royco', from: 'HBO', line: 'Sunset over a company that is about to lose everything.' },
  { id: 'the-wire', phrases: ['the wire'], weather: 'rain', time: 'night', name: 'The Wire', from: 'HBO', line: 'Rain on Baltimore. Everything is connected and none of it helps.' },
  { id: 'breaking-bad', phrases: ['breaking bad', 'los pollos', 'heisenberg', 'desert noon', 'baking', 'better call saul'], weather: 'clear', time: 'afternoon', name: 'Desert Noon', from: 'HBO', line: 'I am not in the mood to cook. The heat agrees.' },
  { id: 'chernobyl', phrases: ['chernobyl', 'exclusion zone'], weather: 'fog', time: 'night', name: 'Exclusion Zone', from: 'HBO', line: 'The fog is doing its job. Do not go past the fence.' },
  { id: 'true-detective', phrases: ['true detective'], weather: 'fog', time: 'night', name: 'The Marshlands', from: 'HBO', line: 'Fog off the marsh and a case that never closed.' },
  { id: 'westworld', phrases: ['westworld'], weather: 'clear', time: 'night', name: 'Westworld', from: 'HBO', line: 'A perfect night in a park that does not exist.' },
  { id: 'last-of-us-hbo', phrases: ['the last of us hbo'], weather: 'fog', time: 'dusk', name: 'Salt Lake', from: 'HBO', line: 'Dust on the road, and a long way to the next town.' },
  { id: 'white-lotus', phrases: ['the white lotus'], weather: 'clear', time: 'afternoon', name: 'The White Lotus', from: 'HBO', line: 'Tropical light and a hotel full of people not talking to each other.' },
  { id: 'boardwalk-empire', phrases: ['boardwalk empire'], weather: 'clear', time: 'night', name: 'Atlantic City', from: 'HBO', line: 'A boardwalk lit like a promise nobody kept.' },
  { id: 'deadwood', phrases: ['deadwood'], weather: 'fog', time: 'night', name: 'Deadwood', from: 'HBO', line: 'Dirt, smoke, and a fog that does not lift.' },
  { id: 'his-dark-materials', phrases: ['his dark materials'], weather: 'snow', time: 'night', name: 'Oxford', from: 'HBO', line: 'Snow over Oxford, and the wardrobe is not the point.' },
  { id: 'the-sympathizer', phrases: ['the sympathizer'], weather: 'rain', time: 'night', name: 'The Sympathizer', from: 'HBO', line: 'Rain in two cities at once.' },
  { id: 'barry-show', phrases: ['barry hbo', 'barry show'], weather: 'clear', time: 'night', name: 'Baltimore', from: 'HBO', line: 'A dry night in a city that mostly wants to be left alone.' },
  { id: 'deuce', phrases: ['the deuce'], weather: 'fog', time: 'night', name: 'The Deuce', from: 'HBO', line: 'Steam and fog over 42nd Street.' },
  { id: 'perry-mason', phrases: ['perry mason'], weather: 'clear', time: 'afternoon', name: 'Los Angeles 1930', from: 'HBO', line: 'Hard afternoon light on a very long case.' },
  { id: 'scavengers-reign', phrases: ['scavengers reign'], weather: 'fog', time: 'night', name: 'The Vast', from: 'HBO', line: 'Spore-thick air and a planet that does not want you.' },
  { id: 'winning-time', phrases: ['winning time'], weather: 'clear', time: 'morning', name: 'The Forum', from: 'HBO', line: 'Morning light over the parking lot of a very big idea.' },

  /* --- CINEMA --- */
  { id: 'rrr', phrases: ['rrr'], weather: 'clear', time: 'golden', name: 'RRR', from: 'Cinema', line: 'Colours like a firecracker. The sky is in on it.' },
  { id: 'interstellar', phrases: ['interstellar', 'murph'], weather: 'clear', time: 'night', name: 'Interstellar', from: 'Cinema', line: 'No atmosphere. No weather. Just the cold and the light.' },
  { id: 'inception', phrases: ['inception', 'dream layers'], weather: 'fog', time: 'night', name: 'Dream Layers', from: 'Cinema', line: 'You are not awake. The weather is a projection.' },
  { id: 'oppenheimer', phrases: ['oppenheimer', 'los alamos'], weather: 'storm', time: 'afternoon', name: 'Los Alamos', from: 'Cinema', line: 'High desert, and the sky turning the wrong colour.' },
  { id: 'dunkirk', phrases: ['dunkirk'], weather: 'wind', time: 'dusk', name: 'Dunkirk', from: 'Cinema', line: 'Wind off the water and a beach full of engines.' },
  { id: 'blade-runner', phrases: ['blade runner', 'replicant', 'tyrell'], weather: 'rain', time: 'night', name: 'Blade Runner', from: 'Cinema', line: 'Tears in rain. Neon bleeding into wet asphalt.' },
  { id: 'the-matrix', phrases: ['the matrix', 'matrix', 'red pill', 'wake up'], weather: 'rain', time: 'night', name: 'Green Rain', from: 'Cinema', line: 'The rain falls on a world made of someone else’s code.' },
  { id: 'jurassic', phrases: ['jurassic park', 'jurassic', 'raptor'], weather: 'rain', time: 'dusk', name: 'Jurassic', from: 'Cinema', line: 'The gates are open and the rain is doing half the containment work.' },
  { id: 'the-notebook', phrases: ['the notebook', 'noah'], weather: 'rain', time: 'evening', name: 'The Notebook', from: 'Cinema', line: 'A downpour in a small town. It rains on everything that matters.' },
  { id: 'gandalf-hobbit', phrases: ['the hobbit', 'shire'], weather: 'clear', time: 'morning', name: 'The Shire', from: 'Cinema', line: 'Green fields, low sun, and absolutely nothing to worry about.' },
  { id: 'godfather', phrases: ['the godfather', 'corleone', 'sicilia'], weather: 'rain', time: 'night', name: 'Corleone', from: 'Cinema', line: 'Rain on the tarmac. An offer that cannot be refused.' },
  { id: 'pirates', phrases: ['pirates of the caribbean', 'black pearl', 'jack sparrow'], weather: 'storm', time: 'dusk', name: 'The Black Pearl', from: 'Cinema', line: 'Dead men tell no tales. The sky tells all of them.' },
  { id: 'fight-club', phrases: ['fight club', 'project mayhem'], weather: 'fog', time: 'night', name: 'Project Mayhem', from: 'Cinema', line: 'The first rule of the weather: do not talk about the weather.' },
  { id: 'pulp-fiction', phrases: ['pulp fiction', 'royale with cheese'], weather: 'clear', time: 'night', name: 'Royale', from: 'Cinema', line: 'Mild. With a little rain on it.' },
  { id: 'dark-knight', phrases: ['the dark knight', 'batman dark knight'], weather: 'rain', time: 'night', name: 'The Dark Knight', from: 'Cinema', line: 'Rain in a city that has stopped caring what it looks like.' },

  /* --- PLAIN WEATHER --- */
  { id: 'let-it-rain', phrases: ['let it rain', 'here comes the rain again', 'hard rain', 'raining men', 'purple rain', 'singing in the rain', 'walk on water'], weather: 'rain', time: null, name: 'Let It Rain', from: 'Weather', line: 'A chord, a downpour, and the whole page goes grey on cue.' },
  { id: 'drizzy', phrases: ['drizzy', 'drizzle', 'mizzle', 'fine rain'], weather: 'drizzle', time: null, name: 'Drizzy', from: 'Weather', line: 'Drizzle. The most literary kind of precipitation.' },
  { id: 'let-it-snow', phrases: ['let it snow', 'snow', 'blizzard', 'snowing', 'winter is coming', 'frozen'], weather: 'snow', time: null, name: 'First Snow', from: 'Weather', line: 'Everything slows down a little. That is the whole point of snow.' },
  { id: 'fog-plain', phrases: ['fog', 'foggy', 'the fog', 'mist', 'misty', 'low visibility'], weather: 'fog', time: null, name: 'Whiteout', from: 'Weather', line: 'Visibility down to nothing. The edges of things stop arguing.' },
  { id: 'wind-plain', phrases: ['wind', 'windy', 'breeze', 'gale', 'hurricane', 'typhoon', 'cyclone', 'sandstorm', 'dust storm'], weather: 'wind', time: null, name: 'Moving Air', from: 'Weather', line: 'The air is moving. Everything loose is about to have an opinion.' },
  { id: 'cloud-plain', phrases: ['cloud', 'clouds', 'cloudy', 'overcast', 'grey day', 'gray day', 'dull'], weather: 'cloud', time: null, name: 'Flat Light', from: 'Weather', line: 'Flat light. No shadows to speak of.' },
  { id: 'sunshine', phrases: ['sunshine', 'sunny', 'clear skies', 'blue sky', 'the sun is out', 'sunburn', 'heatwave'], weather: 'clear', time: 'afternoon', name: 'Hard Noon', from: 'Weather', line: 'The sun comes out and every shadow gets an edge.' },
  { id: 'golden-hour', phrases: ['golden hour', 'sunset', 'dusk', 'evening', 'magic hour'], weather: 'clear', time: 'evening', name: 'Golden Hour', from: 'Weather', line: 'The light goes long and low and everything looks like a memory.' },
  { id: 'first-light', phrases: ['first light', 'dawn', 'sunrise', 'early morning'], weather: 'clear', time: 'dawn', name: 'First Light', from: 'Weather', line: 'The cold part of the morning, before the day decides what it is.' },
  { id: 'midnight', phrases: ['midnight', 'late night', 'night time', '3am', 'night'], weather: 'clear', time: 'night', name: 'Night Shift', from: 'Weather', line: 'The hour when the work gets honest.' },
];

/* plain words, for when the user is not being cinematic */
const GENERIC = [
  { words: ['rain', 'rainy', 'downpour', 'wet'], weather: 'rain', time: null, name: 'Rain', line: 'Rain. The honest kind.' },
  { words: ['snow', 'snowy'], weather: 'snow', time: null, name: 'Snow', line: 'Snow. Everything goes quiet.' },
  { words: ['storm', 'stormy', 'thunder', 'thunderstorm'], weather: 'storm', time: null, name: 'Storm', line: 'Storm. The sky has opinions.' },
  { words: ['cloud', 'clouds', 'cloudy', 'overcast', 'grey', 'gray'], weather: 'cloud', time: null, name: 'Overcast', line: 'Flat light. No shadows to speak of.' },
  { words: ['clear', 'sun', 'sunny', 'bright'], weather: 'clear', time: 'afternoon', name: 'Clear', line: 'Clear. Hard light, sharp shadows.' },
  { words: ['fog', 'foggy', 'mist'], weather: 'fog', time: null, name: 'Fog', line: 'Fog. Shapes lose their edges.' },
  { words: ['wind', 'windy', 'breeze'], weather: 'wind', time: null, name: 'Wind', line: 'Wind. Something is moving outside.' },
  { words: ['drizzle', 'drizzly'], weather: 'drizzle', time: null, name: 'Drizzle', line: 'Drizzle. Barely worth an umbrella.' },
];

const RESET_WORDS = ['auto', 'reset', 'stop', 'nevermind', 'never mind', 'default', 'real weather', 'actual weather', 'live weather'];

function normalise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[.!?,;:"'`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const contains = (raw, phrases) => phrases.some((p) => raw.includes(p));

/**
 * Find what a phrase means.
 *
 * Spectacles win over weather — if someone says "dragonfire" they want
 * the fire, not a drizzle.
 */
export function parseCommand(text) {
  const raw = normalise(text);
  if (!raw) return null;

  for (const word of RESET_WORDS) {
    if (raw === word || raw.startsWith(word + ' ')) {
      return { kind: 'reset', id: 'auto', name: 'Auto', line: 'Back to the real sky. It is reading your clock and your weather again.' };
    }
  }

  for (const s of SPECTACLES) {
    if (contains(raw, s.phrases)) {
      return { kind: 'spectacle', id: s.id, effect: s.effect, name: s.name, from: s.from, line: s.line };
    }
  }

  for (const cmd of WEATHER_COMMANDS) {
    if (contains(raw, cmd.phrases)) {
      return {
        kind: 'weather',
        id: cmd.id,
        weather: cmd.weather,
        time: cmd.time || null,
        name: cmd.name,
        from: cmd.from,
        line: cmd.line,
      };
    }
  }

  for (const g of GENERIC) {
    if (contains(raw, g.words)) {
      return { kind: 'weather', id: `generic-${g.weather}`, weather: g.weather, time: g.time, name: g.name, from: 'Weather', line: g.line };
    }
  }

  return null;
}

/* kept for compatibility with the older single-purpose parser */
export function parseWeatherCommand(text) {
  const cmd = parseCommand(text);
  return cmd && cmd.kind === 'weather' ? cmd : null;
}

/** The short list printed in the console footer. */
export const COMMAND_HINTS = [
  'thor',
  'let it rain',
  'shazam',
  'blade runner',
  'wednesday',
  'let it snow',
  'mordor',
  'breaking bad',
  'dracarys',
  'spidey',
  'smash',
  'auto',
];
