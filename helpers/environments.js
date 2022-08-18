/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/20/2020
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "hsjdhsdhsjdhjshdjshd",
  maxChecks: 5,
  twilio: {
    fromPhone: "+15005550006",
    accountSid: "AC00d2fc8859921334868599cee417d93b",
    authToken: "1334f2a43a9d67503f715b25e6d48776",
  },
};

// production environment
environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "djkdjskdjksdjksjdskjd",
  maxChecks: 5,
  twilio: {
    fromPhone: "+16175551212",
    accountSid: "AC00d2fc8859921334868599cee417d93b",
    authToken: "1334f2a43a9d67503f715b25e6d48776",
  },
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
