export enum BuildType {
  Production = 'prod',
  Development = 'dev',
  Test = 'test'
}

function getBuildType(env: NodeJS.ProcessEnv) {
  switch (env.BUILD_TYPE) {
    case 'prod':
      return BuildType.Production
    case 'dev':
      return BuildType.Development
    case 'test':
    default:
      return BuildType.Test
  }
}

const buildType = getBuildType(process.env)

export const config = {
  buildType,
  logLevel: buildType === BuildType.Production ? 4 : 4,
  port: buildType === BuildType.Production ? 1339 : 1340,
  prettyPrint: buildType === BuildType.Production ? false : true
}
