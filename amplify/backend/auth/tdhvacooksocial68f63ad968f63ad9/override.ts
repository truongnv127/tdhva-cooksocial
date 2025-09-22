import { AmplifyAuthCognitoStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate, _amplifyProjectInfo: AmplifyProjectInfo) {
  resources.userPool.addPropertyOverride("Schema", [
    {
      Name: "email",
      AttributeDataType: "String",
      Mutable: true,
      Required: false
    },
    {
      Name: "preferred_username",
      AttributeDataType: "String",
      Mutable: true,
      Required: true
    },
    {
      Name: "phone_number",
      AttributeDataType: "String",
      Mutable: true,
      Required: false
    },
    {
      Name: "custom:nationality",
      AttributeDataType: "String",
      Mutable: true,
      Required: false
    },
    {
      Name: "custom:allergies",
      AttributeDataType: "String",
      Mutable: true,
      Required: false
    }
  ]);
}