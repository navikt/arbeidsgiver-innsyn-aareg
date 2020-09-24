export const nullStillSorteringIUrlParametere = () => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('side', '1');
  currentUrl.searchParams.set('filter', 'Alle');
  currentUrl.searchParams.set('varsler', 'false');
  currentUrl.searchParams.set('sok', '');
  currentUrl.searchParams.set('sorter', '0');
  currentUrl.searchParams.set('revers', 'false');
  const { search } = currentUrl;
  return search
};