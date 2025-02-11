import { watch } from 'node:fs';
import { $ } from 'bun';

const watcher = watch(
  `${import.meta.dir}/src`,
  { recursive: true },
  async (event, filename) => {
    console.log(`File ${filename} changed, rebuilding`);
    const entrypoints = Array.from(
      new Bun.Glob('src/**/index.html').scanSync()
    );
    await $`rm -rf out`;
    try {
      await Bun.build({
        entrypoints,
        outdir: 'out',
      });
    } catch (error) {
      console.error(error);
    }
  }
);

process.on('SIGINT', () => {
  // close watcher when Ctrl-C is pressed
  console.log('Closing watcher...');
  watcher.close();

  process.exit(0);
});
