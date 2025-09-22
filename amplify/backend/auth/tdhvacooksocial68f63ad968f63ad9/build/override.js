"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
function override(resources, _amplifyProjectInfo) {
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
exports.override = override;
