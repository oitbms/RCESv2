import * as esbuild from 'esbuild';
import { existsSync } from 'fs';
import { join } from 'path';

const JS_DIR = 'src/main/resources/static/js';
const OUT_DIR = join(JS_DIR, 'dist');

const REGISTRY_ENTRIES = ['team', 'spe', 'sgi', 'ntd', 'inspection', 'pditem'];

const LEGACY_ENTRIES = [
    'shared/toast', 'menu', 'list', 'notifications', 'report', 'admin', 'workCalendar', 'script',
].map(name => join(JS_DIR, `${name}.js`)).filter(existsSync);

const common = {
    bundle: true,
    platform: 'browser',
    target: ['es2017'],
    minify: process.env.NODE_ENV === 'production',
    sourcemap: true,
    logLevel: 'info',
};

const registryBuild = {
    ...common,
    entryPoints: REGISTRY_ENTRIES.map(name => join(JS_DIR, `${name}.ts`)),
    outdir: OUT_DIR,
    format: 'iife',
    entryNames: '[name]',
};

const legacyBuild = LEGACY_ENTRIES.length > 0 ? {
    ...common,
    entryPoints: LEGACY_ENTRIES,
    outdir: OUT_DIR,
    format: 'iife',
    entryNames: '[name]',
} : null;

if (process.argv.includes('--watch')) {
    const ctx = await esbuild.context(registryBuild);
    await ctx.watch();
    if (legacyBuild) {
        const ctxLegacy = await esbuild.context(legacyBuild);
        await ctxLegacy.watch();
    }
    console.log('Watching frontend...');
} else {
    await esbuild.build(registryBuild);
    if (legacyBuild) await esbuild.build(legacyBuild);
    console.log('Frontend build complete.');
}
