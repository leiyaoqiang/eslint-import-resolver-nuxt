const resolve = require('resolve');
const path = require('path');
const log = require('debug')('eslint-plugin-import:resolver:nuxt')

exports.interfaceVersion = 2;
exports.resolve = function (source, file, config) {
  const trimmedSource = trimSource(source)
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

function trimSource(source) {
  // taken from eslint-import-resolver-webpack
  var finalBang = source.lastIndexOf('!')
  if (finalBang >= 0) {
    source = source.slice(finalBang + 1)
  }
  const questionMarkIndex = source.indexOf('?')
  if (questionMarkIndex !== -1) {
    return source.substring(questionMarkIndex)
  }
  return source
}

function parseSource(source, srcDir, rootDir) {
  // directories
  const nuxtRootDir = path.join(rootDir || process.cwd());
  const nuxtSrcDir = path.join(nuxtRootDir, srcDir || '');

  // patterns
  const nuxtRootAliasRe = /^~~|@@\/.+/;
  const nuxtSourceAliasRe = /^~|@\/.+/;
  const nuxtFileAlias = ['~store', '~router', '@store', '@router'];

  // switch
  if (nuxtRootAliasRe.test(source)) {
    return path.join(nuxtRootDir, source.slice(2))
  } else if (nuxtSourceAliasRe.test(source)) {
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
