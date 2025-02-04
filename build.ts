import { watch } from 'node:fs';

const watcher = watch(
  `${import.meta.dir}/src`,
  { recursive: true },
  (event, filename) => {
    console.log(`File ${filename} changed, rebuilding`);
    const entrypoints = Array.from(
      new Bun.Glob('src/**/index.html').scanSync()
    );
    Bun.build({
      entrypoints,
      outdir: 'out',
    });
  }
);

process.on('SIGINT', () => {
  // close watcher when Ctrl-C is pressed
  console.log('Closing watcher...');
  watcher.close();

  process.exit(0);
});
