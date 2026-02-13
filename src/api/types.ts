export type ISODateString = string;

export interface Pagination {
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: Pagination;
}

export interface ApiKey {
	id: string;
	name: string;
	description?: string | null;
	expiresAt: ISODateString;
	lastUsedAt?: ISODateString | null;
	createdAt: ISODateString;
}

export interface ApiKeyResponse {
	apiKey: ApiKey;
	token: string;
}

export interface ApiKeyCreateRequest {
	name: string;
	expiresAt: ISODateString;
	description?: string;
}

export interface AppConfigVariable {
	key: string;
	value: string | number | boolean | null;
	isPublic?: boolean;
}

export interface AppConfigUpdateRequest {
	appName: string;
	homePageUrl: string;
	sessionDuration: number;
	allowOwnAccountEdit: boolean;
	allowUserSignups: boolean;
	disableAnimations: boolean;
	emailApiKeyExpirationEnabled: boolean;
	emailLoginNotificationEnabled: boolean;
	emailOneTimeAccessAsAdminEnabled: boolean;
	emailOneTimeAccessAsUnauthenticatedEnabled: boolean;
	emailVerificationEnabled: boolean;
	emailsVerified: boolean;
	ldapEnabled: boolean;
	requireUserEmail: boolean;
	smtpTls: boolean;
	emailVerificationTemplate?: string;
	smtpHost?: string;
	smtpPort?: number;
	smtpFrom?: string;
	smtpUser?: string;
	smtpPassword?: string;
	ldapUrl?: string;
	ldapBindDn?: string;
	ldapBindPassword?: string;
	ldapBaseDn?: string;
	ldapAdminGroup?: string;
	ldapSkipCertVerify?: boolean;
}

export interface AuditLogEntry {
	id: string;
	userId?: string;
	username?: string;
	clientName?: string;
	action?: string;
	ipAddress?: string;
	createdAt: ISODateString;
	metadata?: Record<string, unknown>;
}

export interface CustomClaim {
	key: string;
	value: string;
}

export interface OidcClient {
	id: string;
	name: string;
	callbackURLs: string[];
	logoutURLs: string[];
	isPublic: boolean;
	pkceEnabled: boolean;
	hasLogo: boolean;
	allowedUserGroupIds?: string[];
	createdAt?: ISODateString;
	updatedAt?: ISODateString;
}

export interface OidcClientSummary extends OidcClient {
	allowedUserGroupCount?: number;
}

export interface OidcClientCreateRequest {
	name: string;
	callbackURLs?: string[];
	logoutURLs?: string[];
	isPublic?: boolean;
	pkceEnabled?: boolean;
	hasLogo?: boolean;
}

export type OidcClientUpdateRequest = Partial<OidcClientCreateRequest> & {
	name?: string;
};

export type UpdateOidcAllowedGroupsRequest = string[];

export interface OidcClientPreview {
	user: User;
	claims: Record<string, unknown>;
}

export interface AuthorizedOidcClient {
	clientId: string;
	name: string;
	scope?: string;
	authorizedAt: ISODateString;
}

export interface SignupToken {
	id: string;
	createdAt: ISODateString;
	expiresAt: ISODateString;
	usageLimit: number;
	usageCount: number;
	userGroupIds?: string[];
}

export interface SignupTokenCreateRequest {
	ttl: string;
	usageLimit: number;
	userGroupIds?: string[];
}

export interface ScimServiceProvider {
	id: string;
	endpoint: string;
	oidcClientId: string;
	token: string;
	createdAt: ISODateString;
}

export interface ScimServiceProviderCreateRequest {
	endpoint: string;
	oidcClientId: string;
	token: string;
}

export interface ScimServiceProviderUpdateRequest extends Partial<ScimServiceProviderCreateRequest> {}

export interface User {
	id: string;
	username: string;
	displayName: string;
	firstName: string;
	lastName?: string;
	email?: string;
	emailVerified?: boolean;
	isAdmin?: boolean;
	disabled?: boolean;
	userGroupIds?: string[];
	createdAt?: ISODateString;
	updatedAt?: ISODateString;
}

export interface UserCreateRequest {
	displayName: string;
	firstName: string;
	username: string;
	lastName?: string;
	email?: string;
	emailVerified?: boolean;
	isAdmin?: boolean;
	disabled?: boolean;
	userGroupIds?: string[];
}

export type UserUpdateRequest = Partial<UserCreateRequest> & {
	id?: string;
};

export type UserUpdateGroupsRequest = string[];

export interface UserGroup {
	id: string;
	name: string;
	friendlyName: string;
	description?: string;
	memberCount?: number;
	allowedOidcClientIds?: string[];
}

export interface UserGroupCreateRequest {
	friendlyName: string;
	name: string;
}

export type UserGroupUpdateRequest = Partial<UserGroupCreateRequest>;

export type UserGroupUpdateUsersRequest = string[];

export type UserGroupUpdateAllowedClientsRequest = string[];

export interface OneTimeAccessEmailRequest {
	email: string;
	redirectPath?: string;
}

export interface OneTimeAccessEmailAdminRequest {
	ttlHours?: number;
}

export interface OneTimeAccessTokenResponse {
	token: string;
}

export interface VersionInfo {
	version: string;
	releaseDate?: ISODateString;
}
