/**
 * UserGroups are common lists for storing users, companies and teams ids together.
 */
export interface PayloadUserGroups {
  companyIds?: number[];
  teamIds?: number[];
  userIds?: number[];
} 