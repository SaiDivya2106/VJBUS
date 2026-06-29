const isExperimental = process.env.EXPERIMENTAL_MODE === 'true';

module.exports = isExperimental;
