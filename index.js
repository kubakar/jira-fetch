const fs = require("fs").promises;
const path = require("path");
// setup pino logger
const logger = require("pino")({
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  base: false,
});

const {
  getJSON,
  getFullList,
  getPaginatedProjects,
} = require("./utils/fetchHandlers");
const { getIssuesCount, dataToTextMessage } = require("./utils/dataHandlers");
const { inputUrl } = require("./input/inputUrls");

/** string that references direcory where file(s) should be written */
const outputDir = path.join(__dirname, "output", "output.txt");

/** main function fetching data from both endpoints and creating final data struct (which is written to file) */
const fetchAndWrite = async () => {
  logger.info("Function has started");

  try {
    // 1. get components and filter 'lead-less' ones (calling non-paginated endpoint)
    const components = await getJSON(inputUrl.components);
    const vacantComponents = components
      .filter((c) => c.lead == null)
      .map((c) => c.name);
    logger.info({ vacantComponents }, "Components fetched");

    // 2. get all issues and calculate count for each component (calling paginated endpoint)
    const projects = await getFullList(getPaginatedProjects);
    const issueSummary = getIssuesCount(projects);
    logger.info({ issueSummary }, `All issues fetched (${projects.length})`);

    // 3. grab data from 1&2 to build final struct
    const issuesWithoutLead = vacantComponents.reduce(
      (acc, currentCompName) => {
        const countCheck = issueSummary[currentCompName];
        acc[currentCompName] = countCheck ?? 0;
        return acc;
      },
      {}
    );
    logger.info({ issuesWithoutLead }, "Issues without 'lead' generated");

    // 4. write to file
    await fs.writeFile(outputDir, dataToTextMessage(issuesWithoutLead));
    logger.info("File written successfully");
  } catch (err) {
    logger.error(err);
  }
};

fetchAndWrite();
