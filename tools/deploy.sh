#! /bin/bash

# e.g. "BA4763CA10DAC7E"
CLOUDFRONT_ID=$1

# e.g. "production"
ENVIRONMENT_NAME=$2

# Setup bucket name
AWS_BUCKET_NAME="examples.omnigage.io"

# Directory for project to reside in
PREFIX_ASSETS="voice-example-emberjs"

# Ember Deploy configuration
CONFIG="/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: '$ENVIRONMENT_NAME'
    },

    pipeline: {
      activateOnDeploy: true
    },

    s3: {
      filePattern: '**/*.{js,css,png,gif,jpg,pdf,eot,svg,ttf,woff,woff2,ico,csv}',
      accessKeyId: '$AWS_ACCESS_ID',
      secretAccessKey: '$AWS_SECRET_KEY',
      bucket: '$AWS_BUCKET_NAME',
      region: '$AWS_REGION',
      prefix: '$PREFIX_ASSETS'
    },

    's3-index': {
      allowOverwrite: true,
      accessKeyId: '$AWS_ACCESS_ID',
      secretAccessKey: '$AWS_SECRET_KEY',
      bucket: '$AWS_BUCKET_NAME',
      region: '$AWS_REGION',
      prefix: '$PREFIX_INDEX'
    },

    cloudfront: {
      accessKeyId: '$AWS_ACCESS_ID',
      secretAccessKey: '$AWS_SECRET_KEY',
      region: '$AWS_REGION',
      distribution: '$CLOUDFRONT_ID'
    }
  };

  return ENV;
};"

# Write configuration to file
echo "$CONFIG" > config/deploy.js

# Write deployment version to production settings
sed -i.bak "s/<DEPLOY-SHA1>/$CIRCLE_SHA1/g
  s/<DEPLOY-BRANCH>/$CIRCLE_BRANCH/g" config/environment.js

# Run pipeline
ember deploy $ENVIRONMENT_NAME --verbose
