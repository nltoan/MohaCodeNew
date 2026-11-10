# Vendored third-party assets

Self-hosted copies of the browser libraries that `public/index.html` loads.
Do not edit; replace with a newer pinned release when upgrading.

## public/vendor/adminlte/
| File | Library | Version | Source |
| --- | --- | --- | --- |
| jquery.min.js | jQuery | 3.7.1 | npm `jquery` (dependency of `admin-lte@3.2.0`) `dist/jquery.min.js` |
| bootstrap.bundle.min.js | Bootstrap (bundle with Popper) | 4.6.2 | npm `bootstrap@4.6.2` (dependency of `admin-lte@3.2.0`) `dist/js/bootstrap.bundle.min.js` |
| adminlte.min.js | AdminLTE | 3.2.0 | npm `admin-lte@3.2.0` `dist/js/adminlte.min.js` |
| adminlte.min.css | AdminLTE | 3.2.0 | npm `admin-lte@3.2.0` `dist/css/adminlte.min.css` |

`adminlte.min.css` references no external font or image files (only inline data: URIs).
Source-map comments were stripped from the copies.
