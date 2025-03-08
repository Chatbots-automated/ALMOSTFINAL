import { Cabin } from '../types/booking';

export const cabins: Cabin[] = [
  {
    id: 'lying-1',
    name: '1 kabina gulimas',
    type: 'lying',
    description: 'Modernus gulimas soliariumas su pažangia vėdinimo sistema ir komfortiška temperatūra.',
    image: 'https://i.imgur.com/xGtSKlR.jpeg',
    pricePerMinute: 0.70
  },
  {
    id: 'standing-1',
    name: '2 kabina stovimas',
    type: 'standing',
    description: 'Vertikalus soliariumas su purškimo funkcija ir gaiviu vėdinimu.',
    image: 'https://i.imgur.com/BfJvZrr.jpeg',
    pricePerMinute: 0.70
  },
  {
    id: 'lying-2',
    name: '3 kabina gulimas',
    type: 'lying',
    description: 'Aukščiausios klasės gulima kabina su aromoterapija ir valdoma muzika',
    image: 'https://i.imgur.com/BglgqEp.jpeg',
    pricePerMinute: 0.70
  }
];