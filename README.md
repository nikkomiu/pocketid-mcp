# pocketid-mcp

MCP (Model Context Protocol) server for managing [Pocket ID](https://pocket-id.org) instances. Provides 57 tools for user management, OIDC client configuration, group management, audit logs, and more — all accessible through any MCP-compatible client.

## Requirements

- [Bun](https://bun.sh) v1.0+
- A running Pocket ID instance with an API key

## Installation

### From Release Binary

Download the latest binary for your platform from the [Releases](https://github.com/nikkomiu/pocketid-mcp/releases) page.

### From Source

```sh
git clone https://github.com/nikkomiu/pocketid-mcp.git
cd pocketid-mcp
bun install
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POCKETID_URL` | Yes | — | Base URL of your Pocket ID instance (e.g. `https://auth.example.com`) |
| `POCKETID_API_KEY` | Yes | — | API key for authentication (create via Pocket ID admin dashboard under Settings > API Keys) |
| `LOG_LEVEL` | No | `info` | Log level (`debug`, `info`, `warn`, `error`) |
| `LOG_FILE` | No | `pocketid-mcp.log` | Log file name or absolute path |
| `LOG_DIR` | No | (auto-resolved) | Directory for log file |
| `LOG_TO_STDERR` | No | `true` | Also write logs to stderr |
| `LOG_TRUNCATE` | No | `true` | Truncate old log entries on startup |
| `LOG_MAX_AGE_HOURS` | No | `24` | Max age in hours for log truncation |

### Claude Code

Add to your Claude Code MCP settings (`~/.claude/settings.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "pocketid": {
      "command": "/path/to/pocketid-mcp",
      "env": {
        "POCKETID_URL": "https://auth.example.com",
        "POCKETID_API_KEY": "your-api-key"
      }
    }
  }
}
```

Or when running from source:

```json
{
  "mcpServers": {
    "pocketid": {
      "command": "bun",
      "args": ["run", "/path/to/pocketid-mcp/src/index.ts"],
      "env": {
        "POCKETID_URL": "https://auth.example.com",
        "POCKETID_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Usage

Once configured, the following tools are available through your MCP client:

### Users

| Tool | Description |
|------|-------------|
| `user_list` | List users with pagination, search, and sorting |
| `user_get` | Get a user by ID |
| `user_create` | Create a new user |
| `user_update` | Update an existing user |
| `user_delete` | Delete a user |
| `user_groups` | List groups for a specific user |
| `user_update_groups` | Update group memberships for a user |
| `user_create_one_time_access_token` | Create a one-time access token for a user |
| `user_send_access_email` | Send a one-time access email to a user |

### User Groups

| Tool | Description |
|------|-------------|
| `user_group_list` | List user groups with pagination and search |
| `user_group_get` | Get a user group by ID |
| `user_group_create` | Create a new user group |
| `user_group_update` | Update a user group |
| `user_group_delete` | Delete a user group |
| `user_group_update_users` | Add or remove users from a group |
| `user_group_update_allowed_clients` | Configure which OIDC clients can access this group |

### OIDC Clients

| Tool | Description |
|------|-------------|
| `oidc_client_list` | List OIDC clients with pagination and search |
| `oidc_client_get` | Get an OIDC client by ID |
| `oidc_client_create` | Create a new OIDC client |
| `oidc_client_update` | Update an OIDC client |
| `oidc_client_delete` | Delete an OIDC client |
| `oidc_client_create_secret` | Generate a new client secret |
| `oidc_client_update_allowed_groups` | Configure allowed user groups for a client |
| `oidc_client_preview_claims` | Preview token claims for a specific user |
| `oidc_client_authorized_list` | List authorized clients for a user |
| `oidc_client_revoke_authorization` | Revoke a client authorization |

### API Keys

| Tool | Description |
|------|-------------|
| `api_key_list` | List API keys |
| `api_key_create` | Create a new API key |
| `api_key_renew` | Renew an API key's expiration |
| `api_key_delete` | Delete an API key |

### Audit Logs

| Tool | Description |
|------|-------------|
| `audit_log_list` | List current user's audit logs |
| `audit_log_list_all` | List all audit logs (admin only) |
| `audit_log_filter_clients` | Get client names for audit log filtering |
| `audit_log_filter_users` | Get usernames for audit log filtering |

### Custom Claims

| Tool | Description |
|------|-------------|
| `custom_claim_suggestions` | Get suggested custom claim names |
| `custom_claim_set_user` | Set custom claims for a user |
| `custom_claim_set_group` | Set custom claims for a user group |

### App Configuration

| Tool | Description |
|------|-------------|
| `app_config_get` | Get public application configuration |
| `app_config_get_all` | Get all configuration (admin only) |
| `app_config_update` | Update application configuration |
| `app_config_test_email` | Send a test email |
| `app_config_sync_ldap` | Trigger LDAP synchronization |

### Signup Tokens

| Tool | Description |
|------|-------------|
| `signup_token_list` | List signup tokens |
| `signup_token_create` | Create a signup token |
| `signup_token_delete` | Delete a signup token |

### SCIM Provisioning

| Tool | Description |
|------|-------------|
| `scim_provider_create` | Create a SCIM service provider |
| `scim_provider_update` | Update a SCIM service provider |
| `scim_provider_delete` | Delete a SCIM service provider |
| `scim_provider_sync` | Trigger a manual SCIM sync |

### OIDC Discovery

| Tool | Description |
|------|-------------|
| `oidc_discovery` | Get OpenID Connect discovery document |
| `oidc_jwks` | Get JSON Web Key Set |

### App Images

| Tool | Description |
|------|-------------|
| `app_image_update_logo` | Upload or update the application logo |
| `app_image_update_favicon` | Upload or update the favicon |
| `app_image_update_background` | Upload or update the background image |
| `app_image_delete_default_profile_picture` | Remove the default profile picture |

### Utility

| Tool | Description |
|------|-------------|
| `health_check` | Check Pocket ID instance health |
| `version_latest` | Get the latest available Pocket ID version |

## Audit Trail

All mutating operations (POST, PUT, DELETE) are automatically logged at `info` level with structured fields:

```json
{
  "level": 30,
  "time": "2026-02-13T10:30:00.000Z",
  "tool": "user_create",
  "httpMethod": "POST",
  "path": "/api/users",
  "resourceId": null,
  "success": true,
  "msg": "audit: user_create POST /api/users OK"
}
```

Request/response bodies, API keys, and PII are never logged.

## Development

### Run from Source

```sh
bun run start
```

### Build Standalone Binary

```sh
bun run build
```

Produces `dist/pocketid-mcp`.

### Type Check

```sh
bun run type-check
```

### Lint

```sh
bun run lint
```

### Format

```sh
bun run format
```

## License

MIT