const { inputUrl } = require("../input/inputUrls");

/** universal handler for fetching JSON data */
const getJSON = async function (url, errorMsg = "data fetch failed") {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`ERROR: ${errorMsg} (${response.status})`);
  return response.json();
};

/** wrapper for 'getJSON()' method bundled with specific paginated projects API
 * @param {number} pageIndex - index of the data page being fetched
 * @return {Promise} pre-configured API call
 */
const getPaginatedProjects = (pageIndex) => {
  const maxResults = 100; // seems to be max. possible value supported by API schema

  const getUrlProjects = (offsetIndex = 0) =>
    `${inputUrl.issues}&maxResults=${maxResults}&startAt=${
      offsetIndex * maxResults
    }`;

  return getJSON(getUrlProjects(pageIndex));
};

/** method that will call paginated API until all results all fetched
 * @param {function} apiWrapper - executable API wrapper function
 * @param {number} [pageIndex=0] - index of the data page being fetched
 * @return {Promise<array>} promise that will resolve to full list of 'issues'
 */
const getFullList = async function (apiWrapper, pageIndex = 0) {
  const firstCall = await apiWrapper(pageIndex);
  const { issues, total } = firstCall;

  if (!(issues && total))
    throw new Error("API response is missing expected properties");

  let nextPageIndex = pageIndex;

  while (issues.length < total) {
    nextPageIndex++;
    const nextCall = await apiWrapper(nextPageIndex);
    if (!nextCall?.issues?.length) break;
    issues.push(...nextCall.issues);
  }
  return issues;
};

module.exports = {
  getJSON,
  getFullList,
  getPaginatedProjects,
};
