import type { User } from "payload/generated-types";
import type { Access, CollectionConfig } from "payload/types";

export function isSiteStaff(roles: User["roles"]) {
  return roles ? roles.includes("staff") : false;
}

// @ts-expect-error donno why type is wrong here
export const canReadSite: Access = async ({ req: { user } }) => {
  if (user) {
    const isStaff = isSiteStaff(user?.roles);
    if (isStaff) return true;
    return {
      or: [
        {
          isPublic: {
            equals: true,
          },
        },
        {
          owner: {
            equals: user.id,
          },
        },
        {
          admins: {
            contains: user.id,
          },
        },
        {
          contributors: {
            contains: user.id,
          },
        },
      ],
    };
  }
  return {
    isPublic: {
      equals: true,
    },
  };
};

export const sitesSlug = "sites";
export const Sites: CollectionConfig = {
  slug: sitesSlug,
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: () => false,
    read: canReadSite,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "about",
      type: "text",
    },
    {
      name: "isPublic",
      type: "checkbox",
      label: "Public",
      defaultValue: false,
    },
    {
      name: "id",
      type: "text",
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      maxDepth: 2,
      hasMany: false,
    },
    {
      name: "admins",
      type: "relationship",
      relationTo: "users",
      maxDepth: 2,
      hasMany: true,
    },
    {
      name: "contributors",
      type: "relationship",
      relationTo: "users",
      maxDepth: 2,
      hasMany: true,
    },
  ],
};
