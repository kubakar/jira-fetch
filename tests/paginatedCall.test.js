const assert = require("assert");
const { getFullList } = require("../utils/fetchHandlers");

/** mock server functionality (paginated response) */
const getMockedServerResponse = (page = 0) => {
  const entries = [...Array(64).keys()];

  const limit = 10;
  const offset = page * limit;
  const issues = entries.slice(offset, offset + limit); // prog. pagination with fixed limit and param. offset

  return new Promise((resolve) =>
    setTimeout(() => resolve({ issues, total: entries.length }), 10)
  );
};

describe("Calling mocked server", () => {
  it("will result in proper responses", async () => {
    const firstBatch = await getMockedServerResponse(); // offset = 0, limit = 10
    assert.deepStrictEqual(firstBatch, {
      total: 64,
      issues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    });

    const lastBatch = await getMockedServerResponse(6); // offset = 60, limit = 10
    assert.deepStrictEqual(lastBatch, {
      total: 64,
      issues: [60, 61, 62, 63],
    });
  });
});

describe("Calling 'getFullList'", () => {
  it("will properly fetch all data from paginated API", async () => {
    const expectedLength = 64;
    const expectedEntries = [...Array(expectedLength).keys()];

    const projects = await getFullList(getMockedServerResponse);

    assert.strictEqual(projects.length, expectedLength);
    assert.deepStrictEqual(expectedEntries, projects);
  });

  it("throw error / reject if response is missing needed properties", async () => {
    await assert.rejects(
      async () =>
        await getFullList(() =>
          Promise.resolve("This does not return proper object")
        ),
      { message: "API response is missing expected properties" }
    );
  });
});
