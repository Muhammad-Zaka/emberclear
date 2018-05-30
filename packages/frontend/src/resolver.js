import Resolver from 'ember-resolver/resolvers/fallback';
// import Resolver from 'ember-resolver/resolvers/glimmer-wrapper';

import { merge } from '@ember/polyfills';

import buildResolverConfig from 'ember-resolver/ember-config';
import config from '../config/environment';

let moduleConfig = buildResolverConfig(config.modulePrefix);
/*
 * If your application has custom types and collections, modify moduleConfig here
 * to add support for them.
 */

console.log(moduleConfig);
merge(moduleConfig.types, {
  config: { definitiveCollection: 'main' },
  util: { definitiveCollection: 'utils' },
  'ember-intl@adapter': { definitiveCollection: 'main' },
  'ember-intl@translation': { definitiveCollection: 'translations' },
  translation: { definitiveCollection: 'translations' },
  'translation:en-us': { definitiveCollection: 'translations' },
  formats: { definitiveCollection: 'main' },
  cldr: { definitiveCollection: 'main' },
  'util:intl': { definitiveCollection: 'utils' }
});

moduleConfig.collections.translations = { types: [ 'translation' ] };

moduleConfig.collections.main.types.push('config');
moduleConfig.collections.main.types.push('translation');

export default Resolver.extend({
  config: moduleConfig,
});
