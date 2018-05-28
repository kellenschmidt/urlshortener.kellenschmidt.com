// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng serve --env=local` then `environment.local.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  siteUrl: "http://localhost:4200",
  apiUrl: "http://kellenschmidt.com/api/v1",
  phpLinkShortenerUrl: "http://kellenschmidt.com/urlshortenerphp",
  projectsUrl: "http://kellenschmidt.com/projects",
  analyticsUrl: "http://kellenschmidt.com/analytics",
};
