# Frontend for Innsyn i Aa-reg – arbeidsgiver

Innsyn i Aa-reg – arbeidsgiver gir oversikt over arbeidsforhold rapportert inn til Aa-registeret for valgt underenhet.

## Komme i gang

- Installere avhengigheter: `yarn`
- Kjøre applikasjonen normalt: `yarn start` (NB! Krever at backend kjører på port 8080)
- Kjøre applikasjon med mock: `yarn start:mock` eller `yarn start:mock:win` på windows
- Bygge applikasjonen: `yarn build`
- Kjøre applikasjonen med Node-backend:
  1. `yarn && yarn build`
  2. `cd server`
  3. `npm i && npm start`
- Kjøre applikasjonen med Docker:
  1. `yarn && yarn build`
  2. `yarn docker:build`
  3. `yarn docker:start`
  4. For å stoppe, kjør `docker stop <id>` med id-en fra forrige kommando

NB: Denne appen er avhengig av pakker som er publisert til nav sitt github registry, og krever derfor at du setter opp en
PAT(personal access token). Følg instruksene [her](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-token) og [her](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)

---

## Henvendelser
Spørsmål knyttet til koden eller prosjektet kan opprettes som github issues.
Eller for genereller spørsmål sjekk commit log for personer som aktivt jobber med koden.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #arbeidsgiver-min-side-arbeidsgiver.

### Lenker til applikasjon

dev: https://arbeidsforhold.dev.nav.no/arbeidsforhold/ (i vdi, eller over vpn)
prod: https://arbeidsgiver.nav.no/arbeidsforhold/
labs: https://arbeidsgiver.labs.nais.io/arbeidsforhold/
logs: https://logs.adeo.no/app/dashboards#/view/754c72d0-76d8-11eb-90cb-7315dfb7dea6