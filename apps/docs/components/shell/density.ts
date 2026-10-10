export type Density = 'comfortable' | 'compact';

export const DENSITY_STORAGE_KEY = 'macaw-density';

/**
 * Runs before paint (inline in <head>) so a stored compact preference never flashes comfortable.
 * Kept as a string because it executes before React loads.
 */
export const DENSITY_INIT_SCRIPT = `try{var d=localStorage.getItem('${DENSITY_STORAGE_KEY}');document.documentElement.setAttribute('data-density',d==='compact'?'compact':'comfortable')}catch(e){document.documentElement.setAttribute('data-density','comfortable')}`;
