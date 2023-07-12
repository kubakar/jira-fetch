const assert = require("assert");
const { getIssuesCount } = require("../utils/dataHandlers");

/** create an array of nested objects (that mimics JIRA API response) */
const generateTestData = () => {
  const names = [
    ["Templates"],
    ["Frontend"],
    ["Synchronization"],
    ["Frontend", "Templates"],
    ["Frontend", "Synchronization"],
  ];

  const testData = names.reduce((acc, currentCompList) => {
    acc.push({
      fields: { components: currentCompList.map((name) => ({ name })) },
    });
    return acc;
  }, []);

  return testData;
};

describe("Calling 'getIssuesCount'", function () {
  it("will properly find all issues", function () {
    const testData = generateTestData();
    const reducer = getIssuesCount(testData);
    assert.deepStrictEqual(reducer, {
      Frontend: 3,
      Synchronization: 2,
      Templates: 2,
    });
  });
});
