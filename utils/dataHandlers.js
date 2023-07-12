/** get all issues count for each tag/component
 * @param {array} projects - list of objects containing 'components' data
 * @return {object} - object containing occurence count for each 'component'
 */
module.exports.getIssuesCount = (projects) => {
  const coolReducer = projects.reduce((acc, curr) => {
    const {
      fields: { components },
    } = curr;

    if (!components?.length) return acc;

    components.forEach((comp) => {
      const { name } = comp;
      acc[name] ??= 0;
      acc[name]++;
    });

    return acc;
  }, {});

  return coolReducer;
};

/** create final txt message based on given data
 * @param {object} data - object containing occurence count for specific 'component'
 * @return {string} final text message containing initial caption and the summary
 */
module.exports.dataToTextMessage = (data) => {
  const textMessage =
    "'Lead-less' components with number of occurrences: \n" +
    JSON.stringify(data).replaceAll(/,|{|}/gi, "\n").replaceAll(":", "\t");

  return textMessage;
};
