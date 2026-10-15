// Shared by setup, play and the photo finder.
(function () {
  // [name shown to you, Wikipedia article the photo finder uses]
  // Leave the second value out when the article has the same name.
  const LIBRARY = [
    ['Alligator', 'American alligator'], ['Alpaca'], ['Ant'], ['Anteater', 'Giant anteater'],
    ['Armadillo', 'Nine-banded armadillo'], ['Bald Eagle'], ['Bat', 'Fruit bat'], ['Bear', 'Brown bear'],
    ['Beaver', 'North American beaver'], ['Bee', 'Western honey bee'], ['Beetle', 'Stag beetle'],
    ['Bird', 'Eastern bluebird'], ['Bison', 'American bison'], ['Blue Jay'], ['Buffalo', 'African buffalo'],
    ['Bunny', 'European rabbit'], ['Butterfly', 'Monarch butterfly'], ['Camel', 'Dromedary'],
    ['Cardinal', 'Northern cardinal'], ['Cat'], ['Caterpillar'], ['Chameleon', 'Veiled chameleon'],
    ['Cheetah'], ['Chicken'], ['Chimpanzee'], ['Chipmunk', 'Eastern chipmunk'], ['Clam', 'Giant clam'],
    ['Clownfish', 'Ocellaris clownfish'], ['Cow', 'Cattle'], ['Coyote'], ['Crab', 'Atlantic blue crab'],
    ['Cricket', 'Cricket (insect)'], ['Crocodile', 'Nile crocodile'], ['Crow', 'American crow'],
    ['Cuckoo', 'Common cuckoo'], ['Deer', 'White-tailed deer'], ['Dinosaur', 'Triceratops'], ['Dog'],
    ['Dolphin', 'Common bottlenose dolphin'], ['Donkey'], ['Dove', 'Mourning dove'], ['Dragon'],
    ['Dragonfly'], ['Duck', 'Mallard'], ['Eagle', 'Bald eagle'], ['Eel', 'Moray eel'],
    ['Elephant', 'African bush elephant'], ['Emu'], ['Ferret'], ['Fish', 'Goldfish'],
    ['Flamingo', 'American flamingo'], ['Fly', 'Housefly'], ['Fox', 'Red fox'], ['Frog', 'Red-eyed tree frog'],
    ['Gazelle', "Thomson's gazelle"], ['Gecko', 'Leopard gecko'], ['Giraffe'], ['Goat'], ['Goldfish'],
    ['Goose', 'Canada goose'], ['Gorilla', 'Western gorilla'], ['Grasshopper'], ['Guinea Pig'],
    ['Hamster', 'Golden hamster'], ['Hawk', 'Red-tailed hawk'], ['Hedgehog', 'European hedgehog'],
    ['Hen', 'Chicken'], ['Hippo', 'Hippopotamus'], ['Hippopotamus'], ['Horse'], ['Hummingbird', 'Ruby-throated hummingbird'],
    ['Hyena', 'Spotted hyena'], ['Iguana', 'Green iguana'], ['Jaguar'], ['Jellyfish', 'Pacific sea nettle'],
    ['Kangaroo', 'Red kangaroo'], ['Kitten'], ['Koala'], ['Ladybug', 'Coccinella septempunctata'],
    ['Lamb', 'Sheep'], ['Lemur', 'Ring-tailed lemur'], ['Leopard'], ['Lion'], ['Lizard', 'Common lizard'],
    ['Llama'], ['Lobster', 'American lobster'], ['Mammoth', 'Woolly mammoth'], ['Manatee', 'West Indian manatee'],
    ['Meerkat'], ['Mole', 'European mole'], ['Monkey', 'Capuchin monkey'], ['Moose'], ['Mosquito'],
    ['Mouse', 'House mouse'], ['Mule'], ['Narwhal'], ['Octopus', 'Common octopus'], ['Orangutan', 'Bornean orangutan'],
    ['Orca'], ['Ostrich', 'Common ostrich'], ['Otter', 'Sea otter'], ['Owl', 'Great horned owl'],
    ['Panda', 'Giant panda'], ['Panther', 'Black panther'], ['Parrot', 'Scarlet macaw'], ['Peacock', 'Indian peafowl'],
    ['Pelican', 'Brown pelican'], ['Penguin', 'Emperor penguin'], ['Pig', 'Domestic pig'], ['Pigeon', 'Rock dove'],
    ['Platypus'], ['Polar Bear'], ['Pony', 'Shetland pony'], ['Porcupine', 'North American porcupine'],
    ['Pufferfish', 'Tetraodontidae'], ['Puppy'], ['Rabbit', 'European rabbit'], ['Raccoon'],
    ['Rat', 'Brown rat'], ['Reindeer'], ['Rhino', 'White rhinoceros'], ['Robin', 'American robin'],
    ['Rooster', 'Chicken'], ['Scorpion'], ['Seagull', 'American herring gull'], ['Seahorse', 'Hippocampus (genus)'],
    ['Seal', 'Harbor seal'], ['Sea Lion', 'California sea lion'], ['Shark', 'Great white shark'],
    ['Sheep'], ['Shrimp'], ['Skunk', 'Striped skunk'], ['Sloth', 'Brown-throated sloth'], ['Snail', 'Helix pomatia'],
    ['Snake', 'Corn snake'], ['Spider', 'Jumping spider'], ['Squid'], ['Squirrel', 'Eastern gray squirrel'],
    ['Starfish'], ['Stingray', 'Southern stingray'], ['Swan', 'Mute swan'], ['T-Rex', 'Tyrannosaurus'],
    ['Tiger'], ['Toad', 'Common toad'], ['Tortoise', 'Galápagos tortoise'], ['Toucan', 'Toco toucan'],
    ['Turkey', 'Wild turkey'], ['Turtle', 'Green sea turtle'], ['Unicorn'], ['Vulture', 'Turkey vulture'],
    ['Walrus'], ['Whale', 'Humpback whale'], ['Wolf'], ['Woodpecker', 'Pileated woodpecker'],
    ['Worm', 'Earthworm'], ['Yak'], ['Zebra', 'Plains zebra']
  ];

  function slugify(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/&/g, ' and ')
      .replace(/['’]/g, '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function wikiTitleFor(name) {
    const slug = slugify(name);
    const hit = LIBRARY.find(e => slugify(e[0]) === slug);
    return hit ? (hit[1] || hit[0]) : name;
  }

  // Looks for animals/<slug>.jpg, then .png, .webp, .jpeg
  const EXTS = ['jpg', 'png', 'webp', 'jpeg'];
  const imageCache = {};
  function findImage(name) {
    const slug = slugify(name);
    if (!slug) return Promise.resolve(null);
    if (imageCache[slug]) return imageCache[slug];
    imageCache[slug] = new Promise(resolve => {
      let i = 0;
      const tryNext = () => {
        if (i >= EXTS.length) return resolve(null);
        const url = 'animals/' + slug + '.' + EXTS[i++];
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = tryNext;
        img.src = url;
      };
      tryNext();
    });
    return imageCache[slug];
  }

  // Class data rides in the link after the #, compressed and scrambled so
  // the answer can't be read off the address bar.
  const KEY = 'saint-saens-carnival-1886';

  function scramble(bytes) {
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      out[i] = bytes[i] ^ KEY.charCodeAt(i % KEY.length) ^ ((i * 37 + 11) & 255);
    }
    return out;
  }

  function toB64url(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromB64url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const s = atob(str);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  async function pipe(bytes, stream) {
    const res = new Response(new Blob([bytes]).stream().pipeThrough(stream));
    return new Uint8Array(await res.arrayBuffer());
  }

  async function encodeData(obj) {
    let bytes = new TextEncoder().encode(JSON.stringify(obj));
    let flag = 'p';
    if (typeof CompressionStream !== 'undefined') {
      bytes = await pipe(bytes, new CompressionStream('deflate-raw'));
      flag = 'z';
    }
    return flag + toB64url(scramble(bytes));
  }

  async function decodeData(code) {
    code = String(code || '').trim();
    const hash = code.indexOf('#');
    if (hash >= 0) code = code.slice(hash + 1);
    const flag = code[0];
    let bytes = scramble(fromB64url(code.slice(1)));
    if (flag === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
    else if (flag !== 'p') throw new Error('That link is not an Animal Elimination class link.');
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || !Array.isArray(data.g)) throw new Error('That link is missing its class data.');
    return data;
  }

  // Live photo lookup for animals that don't have a photo in the repo yet.
  // Only accepts Wikipedia pages for real living things (pages whose Wikidata
  // entry has a scientific name or taxon rank), so a silly or rude guess
  // never puts a random picture on the projector.
  const BLOCKED = new Set(['human', 'humans', 'person', 'people', 'man', 'woman', 'boy', 'girl',
                           'baby', 'kid', 'kids', 'homo-sapiens', 'teacher']);
  const liveCache = {};
  function findOnline(name) {
    const slug = slugify(name);
    if (!slug || slug.length < 3 || BLOCKED.has(slug)) return Promise.resolve(null);
    if (liveCache[slug]) return liveCache[slug];
    liveCache[slug] = (async () => {
      const title = wikiTitleFor(name.trim());
      const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1' +
        '&prop=pageimages%7Cpageprops&piprop=thumbnail&pithumbsize=960&ppprop=wikibase_item' +
        '&titles=' + encodeURIComponent(title);
      const j = await (await fetch(url)).json();
      const page = Object.values((j.query && j.query.pages) || {})[0];
      if (!page || 'missing' in page || !page.thumbnail) return null;
      const q = page.pageprops && page.pageprops.wikibase_item;
      if (!q) return null;
      const wd = await (await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json' +
        '&origin=*&props=claims&ids=' + q)).json();
      const claims = (wd.entities && wd.entities[q] && wd.entities[q].claims) || {};
      if (!claims.P225 && !claims.P105) return null;
      return page.thumbnail.source;
    })().catch(() => { delete liveCache[slug]; return null; });
    return liveCache[slug];
  }

  window.Carnival = { LIBRARY, slugify, wikiTitleFor, findImage, findOnline, encodeData, decodeData };
})();
