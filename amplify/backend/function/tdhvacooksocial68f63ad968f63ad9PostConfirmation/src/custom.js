const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event, context) => {
  const { userAttributes, userName } = event.request;
  
  const userProfile = {
    userId: userName,
    username: userAttributes.preferred_username || userName,
    email: userAttributes.email || '',
    birthdate: userAttributes.birthdate || '',
    gender: userAttributes.gender || '',
    nationality: userAttributes['custom:nationality'] || '',
    allergies: userAttributes['custom:allergies'] || '',
    phoneNumber: userAttributes.phone_number || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const params = {
    TableName: process.env.STORAGE_USERPROFILES_NAME || 'UserProfiles-dev',
    Item: userProfile
  };

  try {
    await dynamodb.put(params).promise();
    console.log('User profile created successfully:', userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }

  return event;
};
