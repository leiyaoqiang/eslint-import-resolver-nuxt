const resolve = require('resolve');
const path = require('path');
const log = require('debug')('eslint-plugin-import:resolver:nuxt')

exports.interfaceVersion = 2;
exports.resolve = function (source, file, config) {
  const trimmedSource = trimResourceQuery(source)
  log('Resolving: ', trimmedSource, 'from:', file);
  const realSource = parseSource(trimmedSource, config && config.nuxtSrcDir, config && config.rootDir);

  if (resolve.isCore(realSource)) {
    log('resolved to core');
    return { found: true, path: null };
  }

  try {
    const resolvedPath = resolve.sync(realSource, opts(file, config));
    log('resolved to: ', resolvedPath);
    return { found: true, path: resolvedPath };
  } catch (err) {
    log('resolve threw error: ', err);
    return { found: false };
  }
}

function trimResourceQuery(source) {
  const questionMarkIndex = source.indexOf('?')
  if (questionMarkIndex !== -1) {
    return source.substring(questionMarkIndex)
  }
  return source
}

function parseSource(source, srcDir, rootDir) {
  const nuxtSrcDir = path.join(rootDir || process.cwd(), srcDir || '');
  const nuxtAliasRe = /^~|@(assets|components|pages|plugins|static|store)?\/.+/;
  const nuxtFileAlias = ['~store', '~router', '@store', '@router'];

  if (nuxtAliasRe.test(source)) {
    return path.join(nuxtSrcDir, source.slice(1));
  } else if (nuxtFileAlias.indexOf(source) !== -1) {
    return source.slice(1);
  } else {
    return source;
  }
}

function opts(file, config) {
  return Object.assign(
    {
      extensions: ['.mjs', '.js', '.json', '.vue']
    },
    config || {},
    {
      // path.resolve will handle paths relative to CWD
      basedir: path.dirname(path.resolve(file)),
      packageFilter: packageFilter,
    }
  );
}

function packageFilter(pkg) {
  if (pkg['jsnext: main']) {
    pkg['main'] = pkg['jsnext-main'];
  }
  return pkg;
}
