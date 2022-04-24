import ConfigurationProperties from '../../config/ConfigurationProperties';

let eProps : ConfigurationProperties = ConfigurationProperties.getInstance();

export const redisConfig = {
  'host' : eProps.getRedisHost(),
  'port' : eProps.getRedisPort(),
  'password' : eProps.getRedisPassword() ,
  'auth' : eProps.getRedisAuthKey() ,
  'username' : eProps.getRedisUsername()
};