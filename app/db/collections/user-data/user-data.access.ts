import type { User } from "payload/generated-types";
import type { Access } from "payload/types";

export function isSiteStaff(roles: User["roles"]) {
  return roles ? roles.includes("staff") : false;
}

export const canReadUserData: Access<User> = async ({ req: { user } }) => {
  return {
    author: { equals: user?.id },
  };
};

export const canCreateUserData: Access<User> = async ({ req: { user } }) => {
  return {
    author: { equals: user?.id },
  };
};

export const canDeleteUserData: Access<User> = async ({ req: { user } }) => {
  if (user) {
    const isStaff = isSiteStaff(user?.roles);
    if (isStaff) return true;
    return {
      author: { equals: user?.id },
    };
  }
  // Reject everyone else
  return false;
};

export const canUpdateUserData: Access<User> = async ({ req: { user } }) => {
  if (user) {
    const isStaff = isSiteStaff(user?.roles);
    if (isStaff) return true;
    return {
      author: { equals: user?.id },
    };
  }
  // Reject everyone else
  return false;
};
