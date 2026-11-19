import { expect, it } from 'vitest';
import { parseArgs, parseFeet, parsePrice, search } from './punenest.mjs';

it('reads feet and prices', () => {
  expect(parseFeet("11'3")).toBe(11.25);
  expect(parseFeet('11.25')).toBe(11.25);
  expect(parsePrice('3cr')).toBe(3e7);
  expect(parsePrice('90L')).toBe(9e6);
});

it('filters a city by BHK and amenity', () => {
  const unit = (bhk, sqft) => ({ label: `${bhk} BHK`, bhk, super_sqft: sqft, bedrooms: [] });
  const city = { societies: [
    { id: 'a', name: 'Pool Towers', kind: 'apartment', amenities: ['Swimming Pool'], unit_types: [unit(3, 1500)], prices: {} },
    { id: 'b', name: 'Dry Heights', kind: 'apartment', amenities: ['Gymnasium'], unit_types: [unit(3, 1500)], prices: {} },
  ] };
  const names = search(city, parseArgs(['--bhk', '3', '--amenity', 'pool'])).map((r) => r.s.name);
  expect(names).toEqual(['Pool Towers']);
});
