import { del, get, getList, post, put, putFile, type PaginationParams } from "./client.js";
import type {
	ApiKey,
	ApiKeyCreateRequest,
	ApiKeyResponse,
	AppConfigUpdateRequest,
	AppConfigVariable,
	AuditLogEntry,
	AuthorizedOidcClient,
	CustomClaim,
	OidcClient,
	OidcClientCreateRequest,
	OidcClientPreview,
	OidcClientSummary,
	OidcClientUpdateRequest,
	OneTimeAccessTokenResponse,
	PaginatedResponse,
	ScimServiceProvider,
	ScimServiceProviderCreateRequest,
	ScimServiceProviderUpdateRequest,
	SignupToken,
	SignupTokenCreateRequest,
	UpdateOidcAllowedGroupsRequest,
	User,
	UserCreateRequest,
	UserGroup,
	UserGroupCreateRequest,
	UserGroupUpdateAllowedClientsRequest,
	UserGroupUpdateRequest,
	UserGroupUpdateUsersRequest,
	UserUpdateGroupsRequest,
	UserUpdateRequest,
	VersionInfo,
} from "./types.js";

export type ListParams = PaginationParams;

export const pocketIdApi = {
	apiKeys: {
		list: (params?: ListParams) => getList<PaginatedResponse<ApiKey>>("/api/api-keys", params),
		create: (body: ApiKeyCreateRequest) => post<ApiKeyResponse>("/api/api-keys", body),
		renew: (id: string) => post<ApiKeyResponse>(`/api/api-keys/${id}/renew`),
		delete: (id: string) => del<void>(`/api/api-keys/${id}`),
	},
	appConfig: {
		getPublic: () => get<AppConfigVariable[]>("/api/application-configuration"),
		getAll: () => get<AppConfigVariable[]>("/api/application-configuration/all"),
		update: (body: Partial<AppConfigUpdateRequest>) => put<AppConfigVariable[]>("/api/application-configuration", body),
		testEmail: (email?: string) =>
			email
				? post<void>("/api/application-configuration/test-email", { email })
				: post<void>("/api/application-configuration/test-email"),
		syncLdap: () => post<void>("/api/application-configuration/sync-ldap"),
	},
	appImages: {
		updateLogo: (base64Data: string, mimeType?: string) => putFile<void>("/api/application-images/logo", base64Data, mimeType),
		updateFavicon: (base64Data: string, mimeType?: string) => putFile<void>("/api/application-images/favicon", base64Data, mimeType),
		updateBackground: (base64Data: string, mimeType?: string) => putFile<void>("/api/application-images/background", base64Data, mimeType),
		deleteDefaultProfilePicture: () => del<void>("/api/application-images/default-profile-picture"),
	},
	auditLogs: {
		listMine: (params?: ListParams) => getList<PaginatedResponse<AuditLogEntry>>("/api/audit-logs", params),
		listAll: (params?: ListParams) => getList<PaginatedResponse<AuditLogEntry>>("/api/audit-logs/all", params),
		filterClients: () => get<string[]>("/api/audit-logs/filters/client-names"),
		filterUsers: () => get<Record<string, string>>("/api/audit-logs/filters/users"),
	},
	customClaims: {
		suggestions: () => get<string[]>("/api/custom-claims/suggestions"),
		setForUser: (userId: string, claims: CustomClaim[]) =>
			put<CustomClaim[]>(`/api/custom-claims/user/${userId}`, claims),
		setForGroup: (groupId: string, claims: CustomClaim[]) =>
			put<CustomClaim[]>(`/api/custom-claims/user-group/${groupId}`, claims),
	},
	oidcClients: {
		list: (params?: ListParams) => getList<PaginatedResponse<OidcClientSummary>>("/api/oidc/clients", params),
		get: (id: string) => get<OidcClient>(`/api/oidc/clients/${id}`),
		create: (body: OidcClientCreateRequest) => post<OidcClient>("/api/oidc/clients", body),
		update: (id: string, body: OidcClientUpdateRequest) => put<OidcClient>(`/api/oidc/clients/${id}`, body),
		delete: (id: string) => del<void>(`/api/oidc/clients/${id}`),
		createSecret: (id: string) => post<{ secret: string }>(`/api/oidc/clients/${id}/secret`),
		updateAllowedGroups: (id: string, userGroupIds: UpdateOidcAllowedGroupsRequest) =>
			put<void>(`/api/oidc/clients/${id}/allowed-user-groups`, { userGroupIds }),
		previewForUser: (id: string, userId: string) => get<OidcClientPreview>(`/api/oidc/clients/${id}/preview/${userId}`),
		listAuthorizedForUser: (userId: string) => get<AuthorizedOidcClient[]>(`/api/oidc/users/${userId}/authorized-clients`),
		revokeAuthorizationForCurrentUser: (clientId: string) =>
			del<void>(`/api/oidc/users/me/authorized-clients/${clientId}`),
	},
	scim: {
		createProvider: (body: ScimServiceProviderCreateRequest) => post<ScimServiceProvider>("/api/scim/service-provider", body),
		updateProvider: (id: string, body: ScimServiceProviderUpdateRequest) =>
			put<ScimServiceProvider>(`/api/scim/service-provider/${id}`, body),
		deleteProvider: (id: string) => del<void>(`/api/scim/service-provider/${id}`),
		syncProvider: (id: string) => post<void>(`/api/scim/service-provider/${id}/sync`),
	},
	signupTokens: {
		list: (params?: ListParams) => getList<PaginatedResponse<SignupToken>>("/api/signup-tokens", params),
		create: (body: SignupTokenCreateRequest) => post<SignupToken>("/api/signup-tokens", body),
		delete: (id: string) => del<void>(`/api/signup-tokens/${id}`),
	},
	userGroups: {
		list: (params?: ListParams) => getList<PaginatedResponse<UserGroup>>("/api/user-groups", params),
		get: (id: string) => get<UserGroup>(`/api/user-groups/${id}`),
		create: (body: UserGroupCreateRequest) => post<UserGroup>("/api/user-groups", body),
		update: (id: string, body: UserGroupUpdateRequest) => put<UserGroup>(`/api/user-groups/${id}`, body),
		delete: (id: string) => del<void>(`/api/user-groups/${id}`),
		updateUsers: (id: string, userIds: UserGroupUpdateUsersRequest) =>
			put<UserGroup>(`/api/user-groups/${id}/users`, { userIds }),
		updateAllowedClients: (id: string, oidcClientIds: UserGroupUpdateAllowedClientsRequest) =>
			put<UserGroup>(`/api/user-groups/${id}/allowed-oidc-clients`, { oidcClientIds }),
	},
	users: {
		list: (params?: ListParams) => getList<PaginatedResponse<User>>("/api/users", params),
		get: (id: string) => get<User>(`/api/users/${id}`),
		create: (body: UserCreateRequest) => post<User>("/api/users", body),
		update: (id: string, body: UserUpdateRequest) => put<User>(`/api/users/${id}`, body),
		delete: (id: string) => del<void>(`/api/users/${id}`),
		getGroups: (id: string) => get<UserGroup[]>(`/api/users/${id}/groups`),
		updateGroups: (id: string, userGroupIds: UserUpdateGroupsRequest) =>
			put<User>(`/api/users/${id}/user-groups`, { userGroupIds }),
		createOneTimeToken: (id: string) => post<OneTimeAccessTokenResponse>(`/api/users/${id}/one-time-access-token`),
		sendOneTimeEmail: (id: string) => post<void>(`/api/users/${id}/one-time-access-email`),
	},
	utility: {
		healthCheck: () => get<string | Record<string, unknown>>("/healthz"),
		latestVersion: () => get<VersionInfo | string>("/api/version/latest"),
	},
	oidcDiscovery: {
		configuration: () => get<Record<string, unknown>>("/.well-known/openid-configuration"),
		jwks: () => get<Record<string, unknown>>("/.well-known/jwks.json"),
	},
};

export type PocketIdApi = typeof pocketIdApi;
